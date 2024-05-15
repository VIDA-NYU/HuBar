import * as d3 from 'd3';
import lasso from './../lasso.js'; // Adjust the path if necessary
import {
    updateMatrix,
    updateFnirsSessions } from '../app.js'
import {updateFnirsAgg } from './FnirsAggregations.js'
import {updateTimeDistribution } from './TimeDistribution.js'
import {cleanUpdateHl2Details } from './Hl2Details.js'
import { updateEventTimeline } from './EventTimeline.js'


export function updateScatterplot(selectedGroupby, selectedFilter, selectedScatterSource,  margins, dataFiles,
    scatterGroup, scatterSvg, fnirsGroup, fnirsSvg, timeDistGroup, timeDistSvg, hl2Group, videoPlayer, eventTimelineGroup, eventTimelineSvg, selectedFnirs,
    maxTimestamp, scatterScaleEncoding, selectedItems){
    if (selectedGroupby=="trial" && selectedFilter=="all")
        margins.scatterplot.right=30;
    else
        margins.scatterplot.right=110;

    scatterGroup.attr("width", scatterSvg.attr("width")-margins.scatterplot.left - margins.scatterplot.right)

    function generateScaleScatter(data, accessor) {
        let symbolArray = d3.symbolsFill;
        symbolArray.push(d3.symbolDiamond2, d3.symbolX, d3.symbolPlus)
        const uniqueValues = Array.from(new Set(data.map(d => d[accessor])));
        if (selectedGroupby=="trial" && selectedFilter=="all")
            return d3.scaleOrdinal()
                .domain(uniqueValues)
                .range(d3.schemeAccent);
        else
            return d3.scaleOrdinal()
                .domain(uniqueValues)
                .range(symbolArray); 
    }
    

    scatterGroup.selectAll("*").remove()
    scatterSvg.selectAll(".legendgroup").remove();
    scatterSvg.selectAll(".legendrect").remove();
    scatterGroup.append("rect")
        .attr("x",0)
        .attr("y",0)
        .attr("height", scatterGroup.attr("height"))
        .attr("width", scatterGroup.attr("width"))
        .attr("fill-opacity",0)
    console.log("Updating Scatterplot")
    let filteredData = dataFiles[0].filter(d => d.source === selectedScatterSource);
    scatterSvg.selectAll('.lasso').remove();
    scatterGroup.selectAll('.unselectedscatter').attr("class","scatterpoints");

    //Filter out for top 10/5 if selected
    if (selectedFilter!='all'){
        let trialFrequency = {};
        filteredData.forEach(obj => {
            trialFrequency[obj.trial] = (trialFrequency[obj.trial] || 0) + 1;
        });
        // Step 2: Sort the values based on their frequencies
        let topTrialValues = Object.keys(trialFrequency).sort((a, b) => trialFrequency[b] - trialFrequency[a]).slice(0,selectedFilter=="t10"? 10 : 5);
        filteredData = filteredData.filter(obj => topTrialValues.includes(obj.trial));
    }
    scatterScaleEncoding = generateScaleScatter(filteredData, selectedGroupby);

    let scatterplotDiv = d3.select("#scatterplot-container") 
    const xScaleScatter = d3.scaleLinear()
        .domain(d3.extent(filteredData, d => +d.x))
        .range([0, scatterplotDiv.node().clientWidth - margins.scatterplot.left - margins.scatterplot.right]);

    // Append tooltip
    let scatterTooltip =scatterplotDiv.append("div")
        .attr("class", "tooltip")
        .style("opacity",0.9)
        .style("visibility","hidden")
        .style("position", "absolute")
        //.style("width","150px")
        .style("background-color", "white")
        .style("padding", "8px")
        .style("border-radius", "5px")
        .style("box-shadow", "0 2px 4px rgba(0,0,0,0.2)")
        .style("text-align", "left"); // Add text-align: left to align text left
        ;

    const yScaleScatter = d3.scaleLinear()
        .domain(d3.extent(filteredData, d => +d.y))
        .range([scatterplotDiv.node().clientHeight - margins.scatterplot.bottom - margins.scatterplot.top, 0]);
    
    if (selectedGroupby=="trial" && selectedFilter=="all"){
        scatterGroup.selectAll("circle")
            .data(filteredData)
            .enter()
            .append("circle")
            .attr("cx", d => xScaleScatter(+d.x))
            .attr("cy", d => yScaleScatter(+d.y))
            .attr("r", 5)
            .attr("fill", d => {return scatterScaleEncoding(d.trial);})
            .attr("class", "scatterpoints")
            .on("mouseover", function(d) {
                scatterTooltip.transition()
                    .duration(200)
                    .style("visibility", "visible");
                    scatterTooltip.html(`<strong>Trial:</strong> ${d.target.__data__.trial}<br><strong>Subject:</strong> ${d.target.__data__.subject}`)
                    .style("left", (d.layerX + 10) + "px")
                    .style("top", (d.layerY - 28) + "px");
            })
            .on("mouseout", function(d) {
                scatterTooltip.transition()
                    .duration(500)
                    .style("visibility", "hidden");
            });
    }

    else{   
        scatterGroup.selectAll("path")
            .data(filteredData)
            .enter()
            .append("path")
            .attr("d", d3.symbol().type((d) => {
                if (selectedGroupby=="trial")
                    return scatterScaleEncoding(d.trial)
                else 
                    return scatterScaleEncoding(d.subject) 
            }).size(55))
            .attr("stroke","#737373")
            .style("fill","#737373")
            .attr("transform", (d)=>{return `translate(${xScaleScatter(+d.x)},${yScaleScatter(+d.y)})`})
            .attr("class", (d)=>{
                if (selectedGroupby=="trial")
                    return "scatterpoints scatter-"+(d.trial)
                else 
                    return "scatterpoints scatter-"+(d.subject)
            })
            .on("mouseover", function(d) {
                scatterTooltip.transition()
                    .duration(200)
                    .style("visibility", "visible");
                    scatterTooltip.html(`<strong>Trial:</strong> ${d.target.__data__.trial}<br><strong>Subject:</strong> ${d.target.__data__.subject}`)
                    .style("left", (d.layerX + 10) + "px")
                    .style("top", (d.layerY - 28) + "px");
            })
            .on("mouseout", function(d) {
                scatterTooltip.transition()
                    .duration(500)
                    .style("visibility","hidden");
            });
        
    }
    //add brush
    let lassoBrush=lasso()
        .items(scatterGroup.selectAll('.scatterpoints'))
        .targetArea(scatterGroup)
        .on("end",lasso_end)
        .on("start",()=>{lassoBrush.items().classed("unselectedscatter",false);});

    scatterGroup.call(lassoBrush);

    //on drawing of lasso
    function lasso_end(){
        selectedItems = []
        let itemsBrushed=lassoBrush.selectedItems()["_groups"][0];
        if (itemsBrushed.length>0){
            
            lassoBrush.notSelectedItems().classed("unselectedscatter",true);
            lassoBrush.selectedItems().classed("unselectedscatter",false);         
            itemsBrushed.forEach((item)=>{
                selectedItems.push({trial:item.__data__.trial ,subject:item.__data__.subject})
            })
        }
        //case where no nodes are selected - reset filters and inform parent
        else{
            lassoBrush.items().classed("unselectedscatter",false);
        }
        updateFnirsAgg(selectedItems, selectedGroupby, selectedFilter, fnirsGroup, scatterGroup, fnirsSvg, timeDistGroup, timeDistSvg, hl2Group, videoPlayer, eventTimelineGroup, eventTimelineSvg, selectedFnirs, maxTimestamp, margins, dataFiles);
        updateTimeDistribution(selectedItems, selectedFilter, selectedGroupby, timeDistGroup, timeDistSvg, maxTimestamp, margins, dataFiles);
        updateEventTimeline(selectedItems, selectedGroupby, eventTimelineGroup, eventTimelineSvg, videoPlayer, hl2Group, selectedFnirs, margins, dataFiles );
        updateMatrix();
        updateFnirsSessions();
        // updateHl2Details();
        cleanUpdateHl2Details( null, videoPlayer, hl2Group);
        
    }
    if (selectedGroupby =="subject" || selectedFilter !="all")
    {
        let currentY = 4;
        scatterSvg.append("rect")
            .attr("x", xScaleScatter.range()[1]+ margins.scatterplot.left + 25)
            .attr("y", margins.scatterplot.top-5)
            .attr("width", margins.scatterplot.right - 30)
            .attr("height", yScaleScatter.range()[0]+5+ margins.scatterplot.bottom/2)
            .attr("rx",5)
            .attr("ry",5)
            .style("fill", "none")
            .attr("class","legendrect")
        let domain = scatterScaleEncoding.domain()

        domain.forEach((element)=>{
            scatterScaleEncoding(element)
            let legendGroup = scatterSvg.append("g")
                .attr("transform", `translate(${scatterSvg.attr("width") - margins.scatterplot.right}, ${margins.scatterplot.top})`)
                .attr("width", margins.scatterplot.right )
                .attr("class","legendgroup")
                .attr("height", scatterSvg.attr("height") - margins.scatterplot.top - margins.scatterplot.bottom)
                .on("click", (event)=>{
                    let id = d3.select(event.target).attr("data-id")

                    scatterGroup.selectAll(".lasso>path")
                        .attr("d","")

                    selectedItems = []
                    scatterGroup.selectAll('.scatterpoints').classed("unselectedscatter", true);

                    scatterGroup.selectAll('.scatter-'+id).classed("unselectedscatter", false);
                    let chosenSamples;
                    if (selectedGroupby=="trial")
                        chosenSamples = filteredData.filter(d => d.trial == id)
                    else
                        chosenSamples = filteredData.filter(d => d.subject == id)
                    chosenSamples.forEach((sample)=>{
                        selectedItems.push({trial:sample.trial ,subject:sample.subject})
                    })
                    updateFnirsAgg(selectedItems, selectedGroupby, selectedFilter, fnirsGroup, scatterGroup, fnirsSvg, timeDistGroup, timeDistSvg, hl2Group, videoPlayer, eventTimelineGroup, eventTimelineSvg, selectedFnirs, maxTimestamp, margins, dataFiles);
                    updateTimeDistribution(selectedItems, selectedFilter, selectedGroupby, timeDistGroup, timeDistSvg, maxTimestamp, margins, dataFiles);
                    updateEventTimeline(selectedItems, selectedGroupby, eventTimelineGroup, eventTimelineSvg, videoPlayer, hl2Group, selectedFnirs, margins, dataFiles );
                    updateMatrix();
                    updateFnirsSessions();
                    // updateHl2Details();
                    cleanUpdateHl2Details( null, videoPlayer, hl2Group);
                })

            legendGroup.append("path")
                .attr("d", d3.symbol().type(scatterScaleEncoding(element)).size(36))
                .attr("stroke","#737373")
                .style("fill", "#737373")
                .attr("data-id",element)
                .attr("transform", ()=>{return `translate(${33},${currentY})`})
            
            legendGroup.append("text")
                .attr("x",44)
                .attr("y", currentY +4)
                .attr("data-id",element)
                .text(() =>{
                    if (selectedGroupby=="subject")
                        return "sub. " + element
                    else 
                        return "trial " + element
                })
                .attr("text-anchor", "start")
                .style("font-size","11px")

            currentY+=18.2
        })
    }
 return selectedItems;
}