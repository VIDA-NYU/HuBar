import * as d3 from 'd3';
import {calculateProportions} from './utils.js';
import {updateTimeDistribution } from './TimeDistribution.js'
import {cleanUpdateHl2Details } from './Hl2Details.js'
import { updateEventTimeline } from './EventTimeline.js'
import { updateMatrix } from './MatrixView.js';
import { updateFnirsSessions } from './FnirsErrorSessions.js';
import { updateFnirsAgg } from './FnirsAggregations.js';
import { get_allTimestamps, get_margins, get_unique_subjects, c, get_selectedItems, set_selectedItems, get_selectedFilter ,get_selectedGroupby, get_selectedBrainVariable, get_brainAggController,set_brainAggController, get_unique_trials} from './config.js'
import { get_brainAggGroup, get_brainAggSvg, get_scatterGroup } from './containersSVG.js';

export function updateBrainAgg(dataFiles){

    let controller = get_brainAggController();
    controller.abort();
    set_brainAggController();
    controller=get_brainAggController();
    const margins = get_margins();
    
    // get selected value from dropdown menus
    let selectedGroupby = get_selectedGroupby(); 
    let selectedFilter = get_selectedFilter();

    //get svgs
    let brainGroup = get_brainAggGroup();
    let brainSvg = get_brainAggSvg();
    let selectedItems = get_selectedItems();
    let uniqueTrials = get_unique_trials();
    let uniqueSubjects = get_unique_subjects();
    let scatterGroup = get_scatterGroup();

    brainGroup.selectAll('*').remove();

    console.log(uniqueTrials)
    console.log(uniqueSubjects)
    console.log(selectedItems)
    
    //console.log(dataFiles)

    const uniquePairs = new Set();

    dataFiles[0].forEach(item => {
      const pair = `${item.trial}-${item.subject}`;
      uniquePairs.add(pair);
    });
    
    // Convert the set to an array of objects with trial and subject keys
    let uniquePairsArray = Array.from(uniquePairs).map(pair => {
      const [trial, subject] = pair.split('-');
      return { trial, subject };
    });
    
    console.log(uniquePairsArray);
    let filteredObjectArray
    if (selectedFilter!='all'){
        let trialFrequency = {};
        uniquePairsArray.forEach(obj => {
            trialFrequency[obj.trial] = (trialFrequency[obj.trial] || 0) + 1;
        });
        // Step 2: Sort the values based on their frequencies
        let topTrialValues = Object.keys(trialFrequency).sort((a, b) => trialFrequency[b] - trialFrequency[a]).slice(0,selectedFilter=="t10"? 10 : 5);
        topTrialValues = topTrialValues.map(str => parseInt(str))
        filteredObjectArray = uniquePairsArray.filter((obj) => {return topTrialValues.includes(parseInt(obj.trial))});
    }
    if (selectedItems.length != 0)
        filteredObjectArray = selectedItems

    console.log(filteredObjectArray)
    
    let groupArrayOrdered
    if (selectedGroupby=="trial"){
        let uniqueTrialsFiltered = [...new Set(filteredObjectArray.map(item => item.trial))];
        groupArrayOrdered = uniqueTrials.filter(trial => uniqueTrialsFiltered.includes(trial));
    }
    else {
        let uniqueSubjectsFiltered = [...new Set(filteredObjectArray.map(item => item.subject))];
        groupArrayOrdered = uniqueSubjects.filter(subject => uniqueSubjectsFiltered.includes(subject));
    }

    const totalHeight = groupArrayOrdered.length * 110;
    const newHeight = totalHeight + margins.fnirs.top + margins.fnirs.bottom;

    brainSvg.attr('height', newHeight+50);
    brainGroup.attr('height', newHeight+40);

    let yScaleBrainAgg

    if(selectedGroupby=="trial"){
        yScaleBrainAgg = d3.scaleBand()
            .domain(groupArrayOrdered.map(d => `Trial ${d}`))
            .range([0, totalHeight])
            .paddingInner(0.1)
            .paddingOuter(0.1);
    }
    else{
        yScaleBrainAgg = d3.scaleBand()
            .domain(groupArrayOrdered.map(d => `Sub ${d}`))
            .range([0, totalHeight])
            .paddingInner(0.1)
            .paddingOuter(0.1);
    }

    const yAxis = d3.axisLeft(yScaleBrainAgg);

    brainGroup.append('g')
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
                chosenSamples = filteredObjectArray.filter(d => d.trial == id)
            else
                chosenSamples = filteredObjectArray.filter(d => d.subject == id)
            chosenSamples.forEach((sample)=>{
                selectedItems.push({trial:sample.trial ,subject:sample.subject})
            })
            set_selectedItems(selectedItems);
            updateFnirsAgg( dataFiles)
            //updateTimeDistribution( dataFiles );
            updateEventTimeline( dataFiles )
            updateMatrix( dataFiles )
            updateFnirsSessions( dataFiles)
            // updateHl2Details();
            cleanUpdateHl2Details( null );

        })
        .selectAll("text")
        .style("font-size", "9px")
        .style("font-family","Open Sans, Roboto, sans-serif");


    groupArrayOrdered.forEach(groupId=>{
        let currentObj;
        if (selectedGroupby=="trial")
           currentObj = filteredObjectArray.filter(d => d.trial == groupId)
        else
            currentObj =  filteredObjectArray.filter(d => d.subject == groupId)

        let requestArray = [] 
        currentObj.forEach((obj)=>{
            if (obj.subject == "293")
                requestArray.push(["0293",String(obj.trial)])
            else
                requestArray.push([ String(obj.subject), String(obj.trial)]);

            let requestData = {
                "subjects_trials": requestArray,
                "plot_sensors": false,
                "plot_annotation": false,
                "picks": get_selectedBrainVariable(),
                "selected_events": ['a','b','c','d','e','f'],
                "initial_time": 0,
                "end_time": null
            }
            console.log(controller)
            plot_brainAggs(requestData, controller, yScaleBrainAgg, groupId, selectedGroupby)

            function plot_brainAggs(requestData, controller, yScaleBrainAgg, groupId, selectedGroupby){

                async function fetchProcessedData(data, controller) {
                    const response = await fetch('https://localhost:8001/process-brain-data', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                        signal: controller.signal
                    });
                
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                
                    return response.json();
                }

                (async () => {
                    try {
                        const result = await fetchProcessedData(requestData, controller);
                        if (controller.signal.aborted) {
                            console.log('Fetch request was aborted.');
                            return; // Exit function if fetch was aborted
                        }
        
                        const imageData = result[1];  // Assuming the RGB pixel data is in result[1]
                        
                        // Assuming imageData is structured as a 2D array of RGB values
                        const height = imageData.length;  // Width of the image
                        const width = imageData[0].length;  // Height of the image
                        
                        // Calculate cropping dimensions
                        /*
                        const excludedTop = Math.floor(height * 0.16); // 15% of height to exclude from the top
                        const excludedBottom = Math.floor(height * 0.13); // 10% of height to exclude from the bottom
                        const excludedSides = Math.floor(width * 0.13); // 10% of width to exclude from each side
                        */
                        const excludedTop = 0; // 15% of height to exclude from the top
                        const excludedBottom = 0;
                        const excludedSides = 0;
                        const croppedWidth = width - 2 * excludedSides;
                        const croppedHeight = height - excludedTop - excludedBottom;
                        
                        // Create a canvas element and context
                        const canvas = document.createElement('canvas');
                        canvas.width = croppedWidth;  // Use the cropped width
                        canvas.height = croppedHeight;  // Use the cropped height
                        const context = canvas.getContext('2d');
                        
                        // Create ImageData object for the cropped image
                        const imgData = context.createImageData(croppedWidth, croppedHeight);
                        
                        // Set RGBA values from imageData to ImageData object, excluding top, bottom, and side percentages
                        for (let y = excludedTop; y < height - excludedBottom; y++) {
                            for (let x = excludedSides; x < width - excludedSides; x++) {
                                const sourceX = x;
                                const sourceY = y;
                                const targetX = x - excludedSides;
                                const targetY = y - excludedTop;
                                const targetIndex = (targetY * croppedWidth + targetX) * 4;
                        
                                imgData.data[targetIndex] = imageData[sourceY][sourceX][0];  // Red
                                imgData.data[targetIndex + 1] = imageData[sourceY][sourceX][1];  // Green
                                imgData.data[targetIndex + 2] = imageData[sourceY][sourceX][2];  // Blue
                                imgData.data[targetIndex + 3] = 255;  // Alpha (fully opaque)
                            }
                        }
                        
                        
                        // Put the ImageData onto the canvas
                        context.putImageData(imgData, 0, 0);
                        
                        // Convert canvas to data URL
                        const imageUrl = canvas.toDataURL();  // This will give you a data URL (base64 encoded)
                        
                        // Append the image to the SVG or HTML
                        brainGroup.append("image")
                            .attr("xlink:href", imageUrl)
                            .attr("class", "brainagg")
                            .attr("id", "brainagg-" + selectedGroupby +"-"+ groupId)
                            .attr("x", margins.brainAgg.left)  // X coordinate of the image
                            .attr("y", ()=>{
                                if (selectedGroupby == "trial")
                                    return yScaleBrainAgg("Trial "+groupId)
                                else
                                    return yScaleBrainAgg("Sub "+groupId)
                            })  // Y coordinate of the image
                            .attr("width", brainSvg.attr('width') -margins.brainAgg.left - margins.brainAgg.right)  // Width of the image (same as SVG width)
                            .attr("height", yScaleBrainAgg.bandwidth())  // Height of the image (same as SVG height)
                            .attr("preserveAspectRatio", "xMidYMid meet");
                        
                
                    } catch (error) {
                        console.log(error);
                    }
                })();
            }  
        })
    })
}