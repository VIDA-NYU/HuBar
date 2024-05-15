import * as d3 from 'd3';
import {
    updateFnirsSessions } from '../app.js';

import {calculateProportions} from './utils.js';
import {updateTimeDistribution } from './TimeDistribution.js'
import {cleanUpdateHl2Details } from './Hl2Details.js'
import { updateEventTimeline } from './EventTimeline.js'
import { updateMatrix } from './MatrixView.js';
import { get_allTimestamps, get_maxTimestamp, get_stepColorScale, get_margins, get_unique_subjects, get_unique_trials} from './config.js'

export function updateFnirsAgg(selectedItems, selectedGroupby, selectedFilter,
    fnirsGroup, scatterGroup, fnirsSvg, timeDistGroup, timeDistSvg, hl2Group, videoPlayer, eventTimelineGroup, eventTimelineSvg, matrixGroup, matrixSvg, matrixTooltip,
    maxTimestamp, dataFiles){

    const margins = get_margins();

    console.log("updateFnirs")

    // Extract unique sources from the data
    let uniqueTrials = get_unique_trials();
    let uniqueSubjects = get_unique_subjects();

    fnirsGroup.selectAll('*').remove();
    let fnirsFilteredData = dataFiles[4]

    if (selectedFilter!='all'){
        let trialFrequency = {};
        fnirsFilteredData.forEach(obj => {
            trialFrequency[obj.trial] = (trialFrequency[obj.trial] || 0) + 1;
        });
        // Step 2: Sort the values based on their frequencies
        let topTrialValues = Object.keys(trialFrequency).sort((a, b) => trialFrequency[b] - trialFrequency[a]).slice(0,selectedFilter=="t10"? 10 : 5);
        topTrialValues = topTrialValues.map(str => parseInt(str))
        fnirsFilteredData = fnirsFilteredData.filter((obj) => {return topTrialValues.includes(obj.trial)});
    }

    let fnirsFinalData = []

    if (selectedItems.length != 0)
    { 
        selectedItems.forEach((item)=>{
            //filter Mission File
            let tempObject = fnirsFilteredData.filter(obj => obj.subject == item.subject && obj.trial == item.trial);
            if (tempObject.length==0)
                return 
            fnirsFinalData.push(tempObject[0])
        })
    }
    else
        fnirsFinalData = fnirsFilteredData

    const proportions = calculateProportions(fnirsFinalData, uniqueTrials, selectedGroupby, uniqueSubjects);
    const totalHeight = proportions.workload.length * 50;
    const newHeight = totalHeight + margins.fnirs.top + margins.fnirs.bottom;

    fnirsSvg.attr('height', newHeight+50);
    fnirsGroup.attr('height', newHeight+40);
    

    const categoryXScaleFnirs = d3.scaleBand()
        .domain(["workload", "attention", "perception"])
        .range([0, fnirsGroup.attr("width")])
        .paddingInner(0.20)
    
    const xScaleFnirs = d3.scaleLinear()
        .domain([0, 1]) // proportion scale
        .range([0, categoryXScaleFnirs.bandwidth()*0.45]);
    
    const xScaleCorrelations=d3.scaleLinear()
        .domain([-1,1])
        .range([categoryXScaleFnirs.bandwidth()*0.51, categoryXScaleFnirs.bandwidth()])

    let yScaleFnirs

    if(selectedGroupby=="trial"){
        yScaleFnirs = d3.scaleBand()
            .domain(proportions.attention.map(d => `Trial ${d.trial}`))
            .range([0, totalHeight])
            .paddingInner(0.4)
            .paddingOuter(0.1);
    }
    else{
        yScaleFnirs = d3.scaleBand()
            .domain(proportions.attention.map(d => `Sub ${d.subject}`))
            .range([0, totalHeight])
            .paddingInner(0.4)
            .paddingOuter(0.1);
    }
    
    // Create axes
    const xAxis = d3.axisTop(categoryXScaleFnirs)
        .tickFormat(function(d) {
            if (d === "workload") 
                return "Memory %"; // Change "workload" to "Memory"
             else 
                return d.charAt(0).toUpperCase() + d.slice(1)+" %"; // Capitalize other labels    
        });

    const yAxis = d3.axisLeft(yScaleFnirs);
    
    // Append axes to SVG
    fnirsGroup.append('g')
        .attr('class', 'x-axis axisHide')
        .attr('transform', `translate(${-categoryXScaleFnirs.bandwidth()*0.25}, -15)`)
        .call(xAxis)
        .selectAll(".tick")
        .attr("class", (d)=> "tick "+d)
        .on("click", (event, d)=>{
            d3.select("#fnirs-dropdown").property("value",d);
            selectedFnirs=d;
            set_selectedFnirs(d)
            updateFnirsAgg(selectedItems, selectedGroupby, selectedFilter, fnirsGroup, scatterGroup, fnirsSvg, timeDistGroup, timeDistSvg, hl2Group, videoPlayer, eventTimelineGroup, eventTimelineSvg, matrixGroup, matrixSvg, matrixTooltip, maxTimestamp, dataFiles);
            updateTimeDistribution(selectedItems, selectedFilter, selectedGroupby, timeDistGroup, timeDistSvg, maxTimestamp, dataFiles);
            updateEventTimeline(selectedItems, selectedGroupby, eventTimelineGroup, eventTimelineSvg, videoPlayer, hl2Group, matrixGroup, matrixSvg,matrixTooltip, dataFiles );
            updateMatrix(selectedItems, selectedGroupby, matrixGroup, matrixSvg, matrixTooltip, dataFiles);
            updateFnirsSessions();
            // updateHl2Details();
            cleanUpdateHl2Details( null, videoPlayer, hl2Group);
        })
        .selectAll("text")
        .style("font-family","Open Sans, Roboto, sans-serif")
        .style("font-size",  "12px")

    
    categoryXScaleFnirs.domain().forEach((domain)=>{
        fnirsGroup.append('text')
            .attr('x', categoryXScaleFnirs(domain) + 0.70 * categoryXScaleFnirs.bandwidth())
            .attr('y',-30)
            .style("font-family","Open Sans, Roboto, sans-serif")
            .style("font-size",  "12px")
            .style("font-weight","bold")
            .attr("class",domain)
            .text("Error")
            .append("tspan")
            .attr("dy","1.2em")
            .attr("x", categoryXScaleFnirs(domain) + 0.60 * categoryXScaleFnirs.bandwidth())
            .text(" Contribution")
    
        fnirsGroup.append('g')
            .attr('class', 'x-axis '+domain)
            .attr('transform', `translate(${categoryXScaleFnirs(domain)}, -3)`)
            .call(d3.axisTop(xScaleFnirs)
            .tickValues([0, 0.5, 1])
            .tickFormat(d=>Math.round(d*100)));
    })

    


    fnirsGroup.append('g')
        .attr('class', 'y-axis axisHide')
        .attr('transform', `translate(5, 0)`)
        .call(yAxis)
        .selectAll(".tick")
        .on("click",(event, d)=>{
            let id = d.split(" ")[1];

            scatterGroup.selectAll(".lasso>path")
            .attr("d","")

            selectedItems = []
            scatterGroup.selectAll('.scatterpoints').classed("unselectedscatter", true);

            scatterGroup.selectAll('.scatter-'+id).classed("unselectedscatter", false);
            let chosenSamples;
            if (selectedGroupby=="trial")
                chosenSamples = fnirsFilteredData.filter(d => d.trial == id)
            else
                chosenSamples = fnirsFilteredData.filter(d => d.subject == id)
            chosenSamples.forEach((sample)=>{
                selectedItems.push({trial:sample.trial ,subject:sample.subject})
            })
            updateFnirsAgg(selectedItems, selectedGroupby, selectedFilter, fnirsGroup, scatterGroup, fnirsSvg, timeDistGroup, timeDistSvg, hl2Group, videoPlayer, eventTimelineGroup, eventTimelineSvg, matrixGroup, matrixSvg, matrixTooltip, maxTimestamp, dataFiles);
            updateTimeDistribution(selectedItems, selectedFilter, selectedGroupby, timeDistGroup, timeDistSvg, maxTimestamp, dataFiles);
            updateEventTimeline(selectedItems, selectedGroupby, eventTimelineGroup, eventTimelineSvg, videoPlayer, hl2Group, matrixGroup, matrixSvg, matrixTooltip, dataFiles );
            updateMatrix(selectedItems, selectedGroupby, matrixGroup, matrixSvg, matrixTooltip, dataFiles);
            updateFnirsSessions();
            // updateHl2Details();
            cleanUpdateHl2Details( null, videoPlayer, hl2Group);

        })
        .selectAll("text")
        .style("font-size", "9px")
        .style("font-family","Open Sans, Roboto, sans-serif");
    
    
    // Create bars workload

    fnirsGroup.selectAll('.workload.overload')
        .data(proportions.workload)
        .enter()
        .append('rect')
        .attr('class', 'workload overload')
        .attr('x', categoryXScaleFnirs("workload"))
        .attr('y', (d) => {
            if (selectedGroupby=="trial")
                return yScaleFnirs(`Trial ${d.trial}`) 
            else
                return yScaleFnirs(`Sub ${d.subject}`)
        })
        .attr('width', d => xScaleFnirs(d.overload))
        .attr('height', yScaleFnirs.bandwidth()/3)
        .attr('fill', '#99070d');

    fnirsGroup.selectAll('.workload.optimal')
        .data(proportions.workload)
        .enter()
        .append('rect')
        .attr('class', 'workload optimal')
        .attr('x', categoryXScaleFnirs("workload"))
        .attr('y', (d) => {
            if (selectedGroupby=="trial")
                return yScaleFnirs(`Trial ${d.trial}`) + yScaleFnirs.bandwidth()/3
            else
                return yScaleFnirs(`Sub ${d.subject}`) + yScaleFnirs.bandwidth()/3
        })
        .attr('width', d => xScaleFnirs(d.optimal))
        .attr('height', yScaleFnirs.bandwidth()/3)
        .attr('fill', '#eb5a4d'); //#ef3b2c

    fnirsGroup.selectAll('.workload.underload')
        .data(proportions.workload)
        .enter()
        .append('rect')
        .attr('class', 'workload underload')
        .attr('x',categoryXScaleFnirs("workload"))
        .attr('y', (d) => {
            if (selectedGroupby=="trial")
                return yScaleFnirs(`Trial ${d.trial}`) + (2 * yScaleFnirs.bandwidth()/3)
            else
                return yScaleFnirs(`Sub ${d.subject}`) + (2 * yScaleFnirs.bandwidth()/3)
        })
        .attr('width', d => xScaleFnirs(d.underload))
        .attr('height', yScaleFnirs.bandwidth()/3)
        .attr('fill', "#ffb0b0");
        
        let groupArray = uniqueSubjects
        let correlations = dataFiles[8].subject_correlations
        if(selectedGroupby=="trial"){
            correlations = dataFiles[8].trial_correlations
            groupArray = uniqueTrials
            if (selectedFilter!="all"){
                let trialFrequency = {};
                dataFiles[4].forEach(obj => {
                    trialFrequency[obj.trial] = (trialFrequency[obj.trial] || 0) + 1;
                });
                //Sort trials based on their frequencies
                let topTrialValues = Object.keys(trialFrequency).sort((a, b) => trialFrequency[b] - trialFrequency[a]).slice(0,selectedFilter=="t10"? 10 : 5);
                groupArray = topTrialValues.map(str => parseInt(str))
            }

        }
        let selectedItemsArray =  selectedGroupby=="trial" ? selectedItems.map(obj => parseInt(obj.trial)) : selectedItems.map(obj => parseInt(obj.subject)) 
        groupArray.forEach((groupId)=>{
            if (selectedItems.length>0 && !selectedItemsArray.includes(parseInt(groupId)))
                return   
            
            let currentY = selectedGroupby=="trial" ? yScaleFnirs("Trial "+groupId) : yScaleFnirs("Sub "+groupId) 
            currentY += yScaleFnirs.bandwidth()/2

            categoryXScaleFnirs.domain().forEach((fnirsVariable)=>{
                let currentX = categoryXScaleFnirs(fnirsVariable)

                fnirsGroup.append('g')
                    .attr('class', "x-axis "+fnirsVariable)
                    .attr('transform', `translate(${currentX}, ${currentY})`)
                    .call(d3.axisBottom(xScaleCorrelations)
                    .tickValues([-1, -0.5, 0, 0.5, 1]));

                if(correlations[groupId]){
                    let optimalCorr = correlations[groupId][fnirsVariable+"_Optimal"]
                    let overloadCorr = correlations[groupId][fnirsVariable+"_Overload"]
                    let underloadCorr = correlations[groupId][fnirsVariable+"_Underload"]
                    if(optimalCorr != null)
                        fnirsGroup.append("rect")
                            .attr("x", currentX + xScaleCorrelations(optimalCorr))
                            .attr("y", currentY - 9)
                            .attr("fill", "#eb5a4d")
                            .attr("width", 9)
                            .attr("height", 9)
                            .attr("class",fnirsVariable);
        
                    if(overloadCorr != null)
                        fnirsGroup.append("rect")
                            .attr("x", currentX + xScaleCorrelations(overloadCorr))
                            .attr("y", currentY - 9)
                            .attr("fill", "#99070d")
                            .attr("width", 9)
                            .attr("height", 9)
                            .attr("class",fnirsVariable);
                    if(underloadCorr != null)
                        fnirsGroup.append("rect")
                            .attr("x",currentX + xScaleCorrelations(underloadCorr))
                            .attr("y", currentY - 9)
                            .attr("fill", "#ffb0b0")
                            .attr("width", 9)
                            .attr("height", 9)
                            .attr("class",fnirsVariable);         
                }
            })
        })

    // Create bars attention
    fnirsGroup.selectAll('.attention.overload')
        .data(proportions.attention)
        .enter()
        .append('rect')
        .attr('class', 'attention overload')
        .attr('x', categoryXScaleFnirs("attention"))
        .attr('y', (d) => {
            if (selectedGroupby=="trial")
                return yScaleFnirs(`Trial ${d.trial}`) 
            else
                return yScaleFnirs(`Sub ${d.subject}`) 
        })
        .attr('width', d => xScaleFnirs(d.overload))
        .attr('height', yScaleFnirs.bandwidth()/3)
        .attr('fill', '#99070d'); //#a50f15

    fnirsGroup.selectAll('.attention.optimal')
        .data(proportions.attention)
        .enter()
        .append('rect')
        .attr('class', 'attention optimal')
        .attr('x', categoryXScaleFnirs("attention"))
        .attr('y', (d) => {
            if (selectedGroupby=="trial")
                return yScaleFnirs(`Trial ${d.trial}`) + yScaleFnirs.bandwidth()/3
            else
                return yScaleFnirs(`Sub ${d.subject}`) + yScaleFnirs.bandwidth()/3
        })
        .attr('width', d => xScaleFnirs(d.optimal))
        .attr('height', yScaleFnirs.bandwidth()/3)
        .attr('fill', '#eb5a4d');

    fnirsGroup.selectAll('.attention.underload')
        .data(proportions.attention)
        .enter()
        .append('rect')
        .attr('class', 'attention underload')
        .attr('x',categoryXScaleFnirs("attention"))
        .attr('y', (d) => {
            if (selectedGroupby=="trial")
                return yScaleFnirs(`Trial ${d.trial}`) + (2 * yScaleFnirs.bandwidth()/3)
            else
                return yScaleFnirs(`Sub ${d.subject}`) + (2 * yScaleFnirs.bandwidth()/3)
        })
        .attr('width', d => xScaleFnirs(d.underload))
        .attr('height', yScaleFnirs.bandwidth()/3)
        .attr('fill', "#ffb0b0");

    // Create bars perception

    fnirsGroup.selectAll('.perception.overload')
        .data(proportions.perception)
        .enter()
        .append('rect')
        .attr('class', 'perception overload')
        .attr('x', categoryXScaleFnirs("perception"))
        .attr('y', (d) => {
            if (selectedGroupby=="trial")
                return yScaleFnirs(`Trial ${d.trial}`)
            else
                return yScaleFnirs(`Sub ${d.subject}`)  
        })
        .attr('width', d => xScaleFnirs(d.overload))
        .attr('height', yScaleFnirs.bandwidth()/3)
        .attr('fill', '#99070d');

    fnirsGroup.selectAll('.perception.optimal')
        .data(proportions.perception)
        .enter()
        .append('rect')
        .attr('class', 'perception optimal')
        .attr('x', categoryXScaleFnirs("perception"))
        .attr('y', (d) => {
            if (selectedGroupby=="trial")
                return yScaleFnirs(`Trial ${d.trial}`) + yScaleFnirs.bandwidth()/3
            else
                return yScaleFnirs(`Sub ${d.subject}`)  + yScaleFnirs.bandwidth()/3
        })
        .attr('width', d => xScaleFnirs(d.optimal))
        .attr('height', yScaleFnirs.bandwidth()/3)
        .attr('fill', '#eb5a4d');

    fnirsGroup.selectAll('.perception.underload')
        .data(proportions.perception)
        .enter()
        .append('rect')
        .attr('class', 'perception underload')
        .attr('x',categoryXScaleFnirs("perception"))
        .attr('y', (d) => {
            if (selectedGroupby=="trial")
                return yScaleFnirs(`Trial ${d.trial}`) + (2 * yScaleFnirs.bandwidth()/3)
            else
                return yScaleFnirs(`Sub ${d.subject}`) + (2 * yScaleFnirs.bandwidth()/3)
        })
        .attr('width', d => xScaleFnirs(d.underload))
        .attr('height', yScaleFnirs.bandwidth()/3)
        .attr('fill', "#ffb0b0");

    return null;
}