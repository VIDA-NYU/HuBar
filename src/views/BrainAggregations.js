import * as d3 from 'd3';
import {calculateProportions} from './utils.js';
import {updateTimeDistribution } from './TimeDistribution.js'
import {cleanUpdateHl2Details } from './Hl2Details.js'
import { updateEventTimeline } from './EventTimeline.js'
import { updateMatrix } from './MatrixView.js';
import { updateFnirsSessions } from './FnirsErrorSessions.js';
import { updateFnirsAgg } from './FnirsAggregations.js';
import { get_allTimestamps, get_margins, get_unique_subjects, c, get_selectedItems, set_selectedItems, get_selectedFilter ,get_selectedGroupby, get_unique_trials} from './config.js'
import { get_brainAggGroup, get_brainAggSvg, get_scatterGroup } from './containersSVG.js';

export function updateBrainAgg(dataFiles){


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


    /*groupArrayOrdered.forEach(groupId=>{
        //let currentObj;
        //if (selectedGroupby=="trial")
           //currentObj = filteredObjectArray.filter()

    })*/
}