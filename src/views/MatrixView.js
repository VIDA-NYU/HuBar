import * as d3 from 'd3';
import { get_allTimestamps, get_maxTimestamp, get_stepColorScale, get_margins, get_unique_subjects, get_unique_trials, get_selectedFnirs, get_selectedItems} from './config.js'

export function updateMatrix(selectedGroupby, matrixGroup, matrixSvg, matrixTooltip, dataFiles ){
    // Extract unique sources from the data
    let uniqueTrials = get_unique_trials();
    let uniqueSubjects = get_unique_subjects();
    let selectedFnirs = get_selectedFnirs();
    let selectedItems  = get_selectedItems();
    const margins = get_margins();
    
    matrixGroup.selectAll('*').remove();

    let stepColorScale = get_stepColorScale();

    let filteredObjects = []
    selectedItems.forEach((item)=>{
        let tempObject = dataFiles[2].filter(obj => obj.subject == item.subject && obj.trial == item.trial);
        if (tempObject.length==0){
            console.log("ERROR: NO MATCH FOUND FOR SUBJECT AND TRIAL ID")
            tempObject= [{subject: item.subject, trial: item.trial, missing:true}]
        }
        
        else
            tempObject[0]["missing"]=false
        filteredObjects.push(tempObject[0]) 
    })
    
    let stepsToKeep = ["a","b","c","d","e","f"]
    const valuesByStep = stepsToKeep.map(step =>
        filteredObjects.map(obj => obj[step]).filter(value => value !== undefined)
    );

    const minValuesByStep = valuesByStep.map(values => d3.min(values));
    
    const maxValuesByStep = valuesByStep.map(values => d3.max(values));

    let nullIndices = [];
    minValuesByStep.forEach((element, index) => {
        if (element == null) {
            nullIndices.push(index);
        }
    });
    
    const stepsPresent = stepsToKeep.filter((value, index) => !nullIndices.includes(index));
        
    const xScaleMatrix = d3.scaleBand()
        .domain(stepsPresent)
        .range([0,  d3.select("#matrix-container").node().clientWidth -margins.matrix.left - margins.matrix.right ])
        .padding(0.1);


    const xAxis = d3.axisTop(xScaleMatrix);

    // Append axes to SVG
    matrixGroup.append('g')
        .attr('class', 'x-axis axisHide')
        .attr('transform', `translate(0, 10)`)
        .call(xAxis);
    
    stepsPresent.forEach((step)=>{
        
        matrixGroup.append('rect')
            .attr("x",xScaleMatrix(step)+ xScaleMatrix.bandwidth()*0.24)
            .attr("y",-7)
            .attr("fill",stepColorScale(step))
            .attr("width",10)
            .attr("height",10)
    })

    const maxRadius = xScaleMatrix.bandwidth()/2;
    
    // Calculate min and max total values across all steps and objects
    const minTotal = d3.min(minValuesByStep);
    const maxTotal = d3.max(maxValuesByStep);
    
    const radiusScale = d3.scaleLinear()
        .domain([minTotal, maxTotal])
        .range([8,maxRadius]); 

    let currentY = margins.matrix.top; 
    
    let groupArray = uniqueSubjects
    if(selectedGroupby=="trial")
        groupArray = uniqueTrials

    groupArray.forEach((id)=>{
        let groupedObj = filteredObjects.filter(obj => obj.subject == id)
        if (selectedGroupby=="trial")
            groupedObj = filteredObjects.filter(obj => obj.trial == id)
        if (groupedObj.length==0)
            return
        currentY +=20;
        groupedObj.forEach((session)=>{
            if (session.missing){
                let displayMissing= `Missing info for Subject:${session.subject} Trial:${session.trial}`
                let missingText = matrixGroup.append("text").attr("x", xScaleMatrix.range()[1]/2).attr("y", currentY+28).text(displayMissing).style("font-size", "11px").attr("text-anchor","middle").style("fill","black").style("fill-opacity", 0.5)
                let bbox = missingText.node().getBBox();
                
                matrixGroup.append("rect")
                    .attr("x", bbox.x - 2)
                    .attr("y", bbox.y - 2)
                    .attr("width", bbox.width + 4)
                    .attr("rx",5)
                    .attr("ry",5)
                    .attr("height", bbox.height + 4)
                    .style("fill", "none")
                    .style("stroke-opacity", 0.5)
                    .attr("stroke", "black");

                if(matrixSvg.attr("height")<=currentY+200){
                    matrixGroup.attr("height",currentY+200)
                    matrixSvg.attr("height",currentY+250+margins.matrix.top+margins.matrix.bottom)     
                }
                currentY+=90;
                return
            }
                        
            stepsPresent.forEach(step => createPie( session, step));

            currentY+=90;
        })
        currentY+=50
        if(matrixSvg.attr("height")<=currentY+200){
            matrixGroup.attr("height",currentY+200)
            matrixSvg.attr("height",currentY+250+margins.matrix.top+margins.matrix.bottom)     
        } 
    })    

    function createPie(row, step) {
        let overloadCorr, optimalCorr, underloadCorr;
        if (dataFiles[8].procedure_correlations[row.subject][row.trial] && dataFiles[8].procedure_correlations[row.subject][row.trial][step]){
            overloadCorr =  dataFiles[8].procedure_correlations[row.subject][row.trial][step][selectedFnirs+"_Overload"]
            optimalCorr  = dataFiles[8].procedure_correlations[row.subject][row.trial][step][selectedFnirs+"_Optimal"]
            underloadCorr = dataFiles[8].procedure_correlations[row.subject][row.trial][step][selectedFnirs+"_Underload"] 
        }
        const total = row[step] ?? 0;
        const none = row[step + "_None"] ?? 0;
        const error = row[step + "_error"] ?? 0;
        if (total==0)
            return
        else if (error==0 || none==0){
            matrixGroup.append('circle')
                .attr('cx', xScaleMatrix(step)+maxRadius)
                .attr("class", "circle circle-" + step + "-"+row.subject +"-"+row.trial)
                .attr('cy', currentY + 30)
                .attr('r', radiusScale(total))
                .attr('fill', ()=> error==0? "#AEAEAE" : "black")
                .on("mouseover", function(d) {
                    console.log(d)
                    matrixTooltip.transition()
                        .duration(200)
                        .style("visibility", "visible")
                        matrixTooltip.html(`<strong>${ selectedFnirs.charAt(0).toUpperCase() + selectedFnirs.slice(1)} Error Contribution </strong><br> Overload: ${overloadCorr} <br> Optimal: ${optimalCorr} <br> Underload: ${underloadCorr}`)
                        .style("left", (d.clientX + 10) + "px")
                        .style("top", (d.clientY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    matrixTooltip.transition()
                        .duration(500)
                        .style("visibility", "hidden");
                });

            return
        }
        const radius = radiusScale(total); // Scale the radius according to the total
    
        const color = d3.scaleOrdinal()
            .domain(["None", "error"])
            .range(["#AEAEAE", "black"]);
    
        const pie = d3.pie()([none, error]);
    
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);
    
        const arcs = matrixGroup.selectAll(".arc-" + step + "-"+row.subject +"-"+row.trial)
            .data(pie)
            .enter()
            .append("g")
            .attr("class", "arc arc-" + step + "-"+row.subject +"-"+row.trial)
            .attr("transform", "translate(" + (xScaleMatrix(step)+maxRadius) + "," + (currentY + 30) + ")");
    
        arcs.append("path")
            .attr("fill", (d, i) => color(i === 0 ? "None" : "error"))
            .attr("d", arc)
            .on("mouseover", function(d) {
                console.log(d)
                matrixTooltip.transition()
                    .duration(200)
                    .style("visibility", "visible");
                    matrixTooltip.html(`<strong>${ selectedFnirs.charAt(0).toUpperCase() + selectedFnirs.slice(1)} Error Contribution </strong><br> Overload: ${overloadCorr} <br> Optimal: ${optimalCorr} <br> Underload: ${underloadCorr}`)
                    .style("left", (d.clientX + 10) + "px")
                    .style("top", (d.clientY - 28) + "px");
            })
            .on("mouseout", function(d) {
                matrixTooltip.transition()
                    .duration(500)
                    .style("visibility", "hidden");
            });
    
        //arcs.append("text")
          //  .attr("transform", d => "translate(" + arc.centroid(d) + ")")
            //.attr("text-anchor", "middle")
            //.attr("fill", "white")
            //.text(d => d.value);
    }
}