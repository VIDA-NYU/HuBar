// Import D3
import * as d3 from 'd3';
import { updateScatterplot } from './views/ScatterPlot.js';
import { updateFnirsAgg } from './views/FnirsAggregations.js';
import {updateTimeDistribution } from './views/TimeDistribution.js'
// import {maxTimestamp} from './views/config.js'
import { cleanUpdateHl2Details } from './views/Hl2Details.js'
import { updateEventTimeline } from './views/EventTimeline.js'
import { get_allTimestamps, get_maxTimestamp, process_timestamps, get_stepColorScale, get_margins, get_unique_subjects, get_unique_trials, compute_unique_data, get_unique_sources, set_selectedFnirs, get_selectedFnirs } from './views/config.js'
import { updateMatrix } from './views/MatrixView.js';

const videoFolder = "data/video/"
const videoPlayer = document.getElementById('video-player');
let dataFiles, 
    // videoPath, 
    selectedItems,uniqueTrials, uniqueSubjects,
    selectedScatterSource, selectedGroupby, selectedFilter, 
    //selectedFnirs,
    scatterSvg, scatterGroup, scatterScaleEncoding, 
    fnirsSvg, fnirsGroup,
    eventTimelineSvg , 
    eventTimelineGroup, 
    // xEventTimelineScale, 
    // reverseTimelineScale,
    matrixSvg, matrixGroup, matrixTooltip,
    hl2Svg, hl2Group,
    fnirsSessionsSvg, fnirsSessionsGroup,
    timeDistSvg, timeDistGroup,
    selectedGaze, selectedImu;

// let allTimestamps = {}
// let brushedTrial = null;
// let brushedSubject = null;
// let vidStart = 0;
// let vidEnd = 5;
let maxTimestamp=0.0;

// let brushesAdded=[]
// let brushIndices=[]
// const allSteps = ["a", "b", "c", "d", "e", "f", "?", "*", "1", "2", "v"]

// let modifiedSchemePaired = d3.schemePaired
// modifiedSchemePaired.splice(4,2);
// modifiedSchemePaired.push("white")

// const stepColorScale = d3.scaleOrdinal()
//   .domain(allSteps)
//   .range(modifiedSchemePaired);


// const margins={ 
//     scatterplot:{ top:40, left:30, right:110, bottom:15},
//     fnirs:{top:50, left:47, right:10, bottom:10},
//     timeDist:{top:30, left:30, right:30, bottom: 10},
//     eventTimeline:{top:25, left:55, right:16, bottom:20},
//     matrix:{top:25, left:5, right:5, bottom:20},
//     fnirsSessions:{top:25, left:10, right:10, bottom:20},   
//     hl2:{top:55, left:45, right:23, bottom:10},
//     video:{ top:0, left:0, right:0, bottom:0},
// }
const margins = get_margins();

Promise.all([
        d3.csv("data/scatterplot_imu_gaze_complete.csv"),
        d3.json("data/formatted_mission_log_seconds.json"),
        d3.json("data/steps_error_distribution.json"),
        d3.json("data/FNIRS_sampled.json"),
        d3.json("data/fnirs_distribution.json"),
        d3.json("data/step_switch_error.json"),
        d3.csv("data/gaze_sampled.csv"),
        d3.csv("data/imu_sampled.csv"),
        d3.json("data/all_correlations.json"),
        d3.json("data/sessions_metadata.json"),
    ])
    
    .then(function(files) {
        dataFiles = files;
        initializeContainers();
        updateScatterplot(selectedGroupby, selectedFilter, selectedScatterSource,  dataFiles, scatterGroup, scatterSvg,
            fnirsGroup, fnirsSvg, timeDistGroup, timeDistSvg, hl2Group, videoPlayer, eventTimelineGroup, eventTimelineSvg, matrixGroup, matrixSvg, matrixTooltip, maxTimestamp, scatterScaleEncoding, selectedItems);
        updateFnirsAgg(selectedItems, selectedGroupby, selectedFilter, fnirsGroup, scatterGroup, fnirsSvg, timeDistGroup, timeDistSvg, hl2Group, videoPlayer, eventTimelineGroup, eventTimelineSvg, matrixGroup, matrixSvg, matrixTooltip, maxTimestamp, dataFiles);
        updateTimeDistribution(selectedItems, selectedFilter, selectedGroupby, timeDistGroup, timeDistSvg, maxTimestamp, dataFiles);
    })
    .catch(function(err) {
    console.log(err)
    console.log("Data Files not loaded!")
})

function initializeContainers(){
    console.log("initializing")
    
    // Extract unique sources from the data
    compute_unique_data(dataFiles);
    const sources = get_unique_sources();
    uniqueTrials = get_unique_trials();
    uniqueSubjects = get_unique_subjects();

    // Populate dropdown with options
    const sourceDropdown = d3.select("#source-dropdown");
    sourceDropdown.selectAll("option")
        .data(sources)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d)
        .attr("selected", (d, i) => i === 0 ? "selected" : null);
    
    // Add onchange event to get dropdown source and update scatterplot
    sourceDropdown.on("change", function() {
        selectedScatterSource = sourceDropdown.property("value");
        updateScatterplot(selectedGroupby, selectedFilter, selectedScatterSource,  dataFiles, scatterGroup, scatterSvg, fnirsGroup, fnirsSvg,
            timeDistGroup, timeDistSvg, hl2Group, videoPlayer, eventTimelineGroup, eventTimelineSvg, matrixGroup, matrixSvg, matrixTooltip, maxTimestamp, scatterScaleEncoding, selectedItems);
        // selectedItems = [];
        updateFnirsAgg(selectedItems, selectedGroupby, selectedFilter, fnirsGroup, scatterGroup, fnirsSvg, timeDistGroup, timeDistSvg, hl2Group, videoPlayer, eventTimelineGroup, eventTimelineSvg, matrixGroup, matrixSvg, matrixTooltip, maxTimestamp, dataFiles);
        updateTimeDistribution(selectedItems, selectedFilter, selectedGroupby, timeDistGroup, timeDistSvg, maxTimestamp, dataFiles);
        updateEventTimeline(selectedItems, selectedGroupby, eventTimelineGroup, eventTimelineSvg, videoPlayer, hl2Group, matrixTooltip, dataFiles );
        updateMatrix(selectedItems, selectedGroupby, matrixGroup, matrixSvg, matrixTooltip, dataFiles);
        updateFnirsSessions();
        // updateHl2Details();
        cleanUpdateHl2Details( null, videoPlayer, hl2Group);
    });

    const groupbyDropdown = d3.select("#groupby-dropdown");
        
    // Add onchange event to get groupBy and update scatterplot
    groupbyDropdown.on("change", function() {
        selectedGroupby = groupbyDropdown.property("value");
        updateScatterplot(selectedGroupby, selectedFilter, selectedScatterSource,  dataFiles, scatterGroup, scatterSvg, fnirsGroup, fnirsSvg,
            timeDistGroup, timeDistSvg,hl2Group, videoPlayer, eventTimelineGroup, eventTimelineSvg, matrixGroup, matrixSvg, matrixTooltip, maxTimestamp, scatterScaleEncoding, selectedItems);
        // selectedItems = [];
        updateFnirsAgg(selectedItems, selectedGroupby, selectedFilter, fnirsGroup, scatterGroup, fnirsSvg, timeDistGroup, timeDistSvg, hl2Group, videoPlayer, eventTimelineGroup, eventTimelineSvg, matrixGroup, matrixSvg, matrixTooltip, maxTimestamp, dataFiles);
        updateTimeDistribution(selectedItems, selectedFilter, selectedGroupby, timeDistGroup, timeDistSvg, maxTimestamp, dataFiles);
        updateEventTimeline(selectedItems, selectedGroupby, eventTimelineGroup, eventTimelineSvg, videoPlayer, hl2Group, matrixGroup, matrixSvg, matrixTooltip, dataFiles );
        updateMatrix(selectedItems, selectedGroupby, matrixGroup, matrixSvg, matrixTooltip, dataFiles);
        updateFnirsSessions();
        // updateHl2Details();
        cleanUpdateHl2Details( null, videoPlayer, hl2Group);
    });
    
    const filterDropdown = d3.select("#filter-dropdown");
    
    // Add onchange event to get groupBy and update scatterplot
    filterDropdown.on("change", function() {
        selectedFilter = filterDropdown.property("value");
        updateScatterplot(selectedGroupby, selectedFilter, selectedScatterSource,  dataFiles, scatterGroup, scatterSvg, fnirsGroup, fnirsSvg,
            timeDistGroup, timeDistSvg, hl2Group, videoPlayer, eventTimelineGroup, eventTimelineSvg, matrixGroup, matrixSvg, matrixTooltip, maxTimestamp, scatterScaleEncoding, selectedItems);
        // selectedItems = [];
        updateFnirsAgg(selectedItems, selectedGroupby, selectedFilter, fnirsGroup, scatterGroup, fnirsSvg, timeDistGroup, timeDistSvg, hl2Group, videoPlayer, eventTimelineGroup, eventTimelineSvg, matrixGroup, matrixSvg, matrixTooltip, maxTimestamp, dataFiles);
        updateTimeDistribution(selectedItems, selectedFilter, selectedGroupby, timeDistGroup, timeDistSvg, maxTimestamp, dataFiles);
        updateEventTimeline(selectedItems, selectedGroupby, eventTimelineGroup, eventTimelineSvg, videoPlayer, hl2Group, matrixGroup, matrixSvg, matrixTooltip, dataFiles );
        updateMatrix(selectedItems, selectedGroupby, matrixGroup, matrixSvg, matrixTooltip, dataFiles);
        updateFnirsSessions();
        // updateHl2Details();
        cleanUpdateHl2Details( null, videoPlayer, hl2Group);
    });

    const fnirsDropdown = d3.select("#fnirs-dropdown");
    
    // Add onchange event to get groupBy and update scatterplot
    fnirsDropdown.on("change", function() {
        set_selectedFnirs(fnirsDropdown.property("value"))
        // selectedFnirs = fnirsDropdown.property("value");
        updateEventTimeline(selectedItems, selectedGroupby, eventTimelineGroup, eventTimelineSvg, videoPlayer, hl2Group, matrixGroup, matrixSvg, matrixTooltip, dataFiles );
        updateMatrix(selectedItems, selectedGroupby, matrixGroup, matrixSvg, matrixTooltip, dataFiles);
        updateFnirsSessions();
        // updateHl2Details();
        cleanUpdateHl2Details( null, videoPlayer, hl2Group);
    });

    d3.select("#corr-checkbox").on("change", function() {
        updateFnirsSessions();
    });

    const gazeDropdown = d3.select("#gaze-dropdown");

    gazeDropdown.on("change", function() {
        selectedGaze = gazeDropdown.property("value");
        // updateHl2Details();
        cleanUpdateHl2Details( null, videoPlayer, hl2Group);

    });

    const imuDropdown = d3.select("#imu-dropdown");

    imuDropdown.on("change", function() {
        selectedImu = imuDropdown.property("value");
        // updateHl2Details();
        cleanUpdateHl2Details( null, videoPlayer, hl2Group);
    });;

    //initialise select variables
    selectedScatterSource = sourceDropdown.property("value");
    selectedGroupby=groupbyDropdown.property("value");
    selectedFilter = filterDropdown.property("value");
    // selectedFnirs = fnirsDropdown.property("value");
    set_selectedFnirs(fnirsDropdown.property("value"));
    selectedItems = [];
    selectedGaze = gazeDropdown.property("value");
    selectedImu = imuDropdown.property("value")
    //initialise svgs

    //scatterplot
    let scatterplotDiv = d3.select("#scatterplot-container") 
    scatterSvg = scatterplotDiv
        .append("svg")
        .attr("width", scatterplotDiv.node().clientWidth)
        .attr("height", scatterplotDiv.node().clientHeight)
        
    scatterGroup= scatterSvg.append("g")
        .attr("transform", `translate(${margins.scatterplot.left}, ${margins.scatterplot.top})`)
        .attr("width", scatterplotDiv.node().clientWidth -margins.scatterplot.left - margins.scatterplot.right )
        .attr("height", scatterplotDiv.node().clientHeight - margins.scatterplot.top - margins.scatterplot.bottom);

    
    //fnirs agg legend

    let legendSvg = d3.select("#legend-svg")
    
    legendSvg.append("text")
    .attr("x",5)
    .attr("y", 13)
    .attr("text-anchor","start")
    .style("font-size","11px" )
    .text("Mental")
    .append("tspan")
    .attr("x", 7)
    .attr("dy","1.2em")
    .text("State"); 

    legendSvg.append("rect")
        .attr("x",45)
        .attr("y", 10)
        .attr("height", 9)
        .attr("width", 9)
        .attr("fill", "#99070d");
    
    legendSvg.append("text")
        .attr("x",55)
        .attr("y", 18)
        .attr("text-anchor","start")
        .style("font-size","10px" )
        .text("Overload");

    legendSvg.append("rect")
        .attr("x",105)
        .attr("y",10)
        .attr("height", 9)
        .attr("width", 9)
        .attr("fill", "#eb5a4d");

    legendSvg.append("text")     
        .attr("x", 115)
        .attr("y",18)
        .attr("text-anchor","start")
        .style("font-size","10px" )
        .text("Optimal");

    legendSvg.append("rect")
        .attr("x",160)
        .attr("y", 10)
        .attr("height", 8)
        .attr("width", 8)
        .attr("fill", "#ffb0b0");
    
    legendSvg.append("text")
        .attr("x",170)
        .attr("y", 18)
        .attr("text-anchor","start")
        .style("font-size","10px" )
        .text("Underload");

    //fnirs agg 
    let fnirsDiv= d3.select("#fnirs-agg-container")  
    fnirsSvg = fnirsDiv.append("svg")
        .attr("width", fnirsDiv.node().clientWidth)
        .attr("height", 500)

    fnirsGroup = fnirsSvg.append("g")
        .attr("transform", `translate(${margins.fnirs.left}, ${margins.fnirs.top})`)
        .attr("width", fnirsDiv.node().clientWidth -margins.fnirs.left - margins.fnirs.right )
        .attr("height", 400);    

    //add font
    let fontImportURL = 'https://fonts.googleapis.com/css?family=Lato|Open+Sans|Oswald|Raleway|Roboto|Indie+Flower|Gamja+Flower';

    let defs = fnirsSvg.append("defs");

    // Append the style element within the defs element to import fonts
    defs.append("style")
        .attr("type", "text/css")
        .text('@import url("' + fontImportURL + '");');
    
    let timeDistDiv= d3.select("#time-distribution-container") 
    timeDistSvg = timeDistDiv.append("svg")
        .attr("width", timeDistDiv.node().clientWidth)
        .attr("height", 500)

    timeDistGroup = timeDistSvg.append("g")
        .attr("transform", `translate(${margins.timeDist.left}, ${margins.timeDist.top})`)
        .attr("width", timeDistSvg.attr("width") - margins.timeDist.left - margins.timeDist.right )
        .attr("height", 400);    

    //eventtimeline
    let eventTimelineDiv= d3.select("#event-timeline-container")  
    eventTimelineSvg = eventTimelineDiv
        .append("svg")
        .attr("width", eventTimelineDiv.node().clientWidth)
        .attr("height", 200)
        
    eventTimelineGroup= eventTimelineSvg.append("g")
        .attr("transform", `translate(${margins.eventTimeline.left}, ${margins.eventTimeline.top})`)
        .attr("width", eventTimelineDiv.node().clientWidth -margins.eventTimeline.left - margins.eventTimeline.right )
        .attr("height", eventTimelineDiv.node().clientHeight - margins.eventTimeline.top - margins.eventTimeline.bottom);    

    //matrix
    let matrixDiv= d3.select("#matrix-container")  
    matrixSvg = matrixDiv
        .append("svg")
        .attr("width", matrixDiv.node().clientWidth)
        .attr("height", 200)
        
    matrixGroup = matrixSvg.append("g")
        .attr("transform", `translate(${margins.matrix.left}, ${margins.matrix.top})`)
        .attr("width", matrixDiv.node().clientWidth -margins.matrix.left - margins.matrix.right )
        .attr("height", matrixDiv.node().clientHeight - margins.matrix.top - margins.matrix.bottom);
    
    matrixTooltip =matrixDiv.append("div")
        .attr("class", "tooltip")
        .style("opacity",0.9)
        .style("visibility","hidden")
        .style("position", "absolute")
        .style("font-size","0.75em")
        //.style("width","150px")
        .style("z-index",1000)
        .style("background-color", "white")
        .style("padding", "8px")
        .style("border-radius", "5px")
        .style("box-shadow", "0 2px 4px rgba(0,0,0,0.2)")
        .style("text-align", "left"); // Add text-align: left to align text left;
    //fnirssessions
    let fnirsSessionsDiv= d3.select("#fnirs-sessions-container")  
    
    fnirsSessionsSvg = fnirsSessionsDiv
        .append("svg")
        .attr("width", fnirsSessionsDiv.node().clientWidth)
        .attr("height", 200)
        
    fnirsSessionsGroup = fnirsSessionsSvg.append("g")
        .attr("transform", `translate(${margins.fnirsSessions.left}, ${margins.fnirsSessions.top})`)
        .attr("width", fnirsSessionsDiv.node().clientWidth -margins.fnirsSessions.left - margins.fnirsSessions.right )
        .attr("height", fnirsSessionsDiv.node().clientHeight - margins.fnirsSessions.top - margins.fnirsSessions.bottom); 

    //hl2 details
    let hl2DetailsDiv= d3.select("#hl2-container")  

    hl2Svg = hl2DetailsDiv
        .append("svg")
        .attr("width", hl2DetailsDiv.node().clientWidth)
        .attr("height", 500)
        
    hl2Group = hl2Svg.append("g")
        .attr("transform", `translate(${margins.hl2.left}, ${margins.hl2.top})`)
        .attr("width", hl2DetailsDiv.node().clientWidth -margins.hl2.left - margins.hl2.right )
        .attr("height", hl2DetailsDiv.node().clientHeight - margins.hl2.top - margins.hl2.bottom); 
    

    
    // //TIMESTAMP
    // Object.keys(dataFiles[9]).forEach((subjectVal)=>{
    //     Object.keys(dataFiles[9][subjectVal]).forEach((trialVal)=>{
    //         if (trialVal == "4" && subjectVal=="8708") 
    //             dataFiles[9][subjectVal][trialVal].duration_seconds = dataFiles[9][subjectVal][trialVal].duration_seconds - 84004.747   
        
    //         allTimestamps['t'+trialVal+"-s"+subjectVal]=dataFiles[9][subjectVal][trialVal].duration_seconds
    //         maxTimestamp = Math.max(maxTimestamp,  dataFiles[9][subjectVal][trialVal].duration_seconds)
    //     })
    // })
    process_timestamps(dataFiles);
    let allTimestamps = get_allTimestamps();
    // let maxTimestamp = get_maxTimestamp();

    dataFiles[1].forEach((trial)=>{
        //consolidate step data:
        let consolidatedStepData = {
            step: [],
            flightPhase: [],
            error: []
        };  
        let currentStep = null;
        let currentFlightPhase = null;
        let currentError = null;

        trial['data'].forEach(record => {

            if (record.seconds<0){
                return
            }

            // Consolidate 'Step' data
            if (record.Step !== currentStep) {
                if (consolidatedStepData.step.length > 0) {
                consolidatedStepData.step[consolidatedStepData.step.length - 1].endTimestamp = record.seconds;
                }
                consolidatedStepData.step.push({
                startTimestamp: record.seconds,
                endTimestamp: record.seconds,
                value: record.Step
                });
                currentStep = record.Step;
            } else {
                consolidatedStepData.step[consolidatedStepData.step.length - 1].endTimestamp = record.seconds;
            }

            // Consolidate 'FlightPhase' data
            if (record.FlightPhase !== currentFlightPhase) {
                if (consolidatedStepData.flightPhase.length > 0) {
                consolidatedStepData.flightPhase[consolidatedStepData.flightPhase.length - 1].endTimestamp = record.seconds;
                }
                consolidatedStepData.flightPhase.push({
                startTimestamp: record.seconds,
                endTimestamp: record.seconds,
                value: record.FlightPhase
                });
                currentFlightPhase = record.FlightPhase;
            } else {
                consolidatedStepData.flightPhase[consolidatedStepData.flightPhase.length - 1].endTimestamp = record.seconds;
            }

            // Consolidate 'Error' data
            if (record.Error !== currentError) {
                if (consolidatedStepData.error.length > 0) {
                consolidatedStepData.error[consolidatedStepData.error.length - 1].endTimestamp = record.seconds;
                }
                consolidatedStepData.error.push({
                startTimestamp: record.seconds,
                endTimestamp: record.seconds,
                value: record.Error
                });
                currentError = record.Error;
            } else {
                consolidatedStepData.error[consolidatedStepData.error.length - 1].endTimestamp = record.seconds;
            }
        });
        trial['consolidatedStepData'] = consolidatedStepData;
    })

    //consolidate FNIRS Data
    dataFiles[3].forEach((trial)=>{
        let consolidatedFNIRS = {
            workload: [],
            attention: [],
            perception: [],
        };

        //handle special case where the values are too high (timestamps out of sync)
        if (trial.trial_id == 4 && trial.subject_id==8708){
            trial.data = trial.data.map(item => {
                return {
                    ...item,
                    seconds: item.seconds - 84004.747
                };
            });
        }

        let currentWorkload = null;
        let currentAttention = null;
        let currentPerception = null;
        
        trial['data'].forEach(record=> {

            if (record.seconds<0 || record.seconds> allTimestamps['t'+trial.trial_id+"-s"+trial.subject_id]){
                return
            }
            // Consolidate 'Workload' data
            if (record.workload_classification !== currentWorkload) {
                if (consolidatedFNIRS.workload.length > 0) {
                consolidatedFNIRS.workload[consolidatedFNIRS.workload.length - 1].endTimestamp = record.seconds;
                }
                consolidatedFNIRS.workload.push({
                startTimestamp: record.seconds,
                endTimestamp: record.seconds,
                value: record.workload_classification
                });
                currentWorkload = record.workload_classification;
            } else {
                consolidatedFNIRS.workload[consolidatedFNIRS.workload.length - 1].endTimestamp = record.seconds;
            }
            
            //consolidate 'Attention' data
            if (record.attention_classification !== currentAttention) {
                if (consolidatedFNIRS.attention.length > 0) {
                consolidatedFNIRS.attention[consolidatedFNIRS.attention.length - 1].endTimestamp = record.seconds;
                }
                consolidatedFNIRS.attention.push({
                startTimestamp: record.seconds,
                endTimestamp: record.seconds,
                value: record.attention_classification
                });
                currentAttention = record.attention_classification;
            } else {
                consolidatedFNIRS.attention[consolidatedFNIRS.attention.length - 1].endTimestamp = record.seconds;
            }

            //consolidate 'Perception Data'
            if (record.perception_classification !== currentPerception) {
                if (consolidatedFNIRS.perception.length > 0) {
                consolidatedFNIRS.perception[consolidatedFNIRS.perception.length - 1].endTimestamp = record.seconds;
                }
                consolidatedFNIRS.perception.push({
                startTimestamp: record.seconds,
                endTimestamp: record.seconds,
                value: record.perception_classification
                });
                currentPerception = record.perception_classification;
            } else {
                consolidatedFNIRS.perception[consolidatedFNIRS.perception.length - 1].endTimestamp = record.seconds;
            }
        });
        trial['consolidatedFNIRS'] = consolidatedFNIRS; 
    })
}

export function updateFnirsSessions(){
    console.log("Updatefnirssessions")
    fnirsSessionsGroup.selectAll('*').remove();
    
    let selectedFnirs = get_selectedFnirs();
    if (selectedItems.length<1)
        return
    let filteredObjects = []
    let xScaleFnirsSessions=  d3.scaleLinear()
                                .domain([0.0,1.0])
                                .range([0, fnirsSessionsGroup.attr("width")/2 - 10 ])
    
    fnirsGroup.selectAll(".workload").classed("hide-workload",true)
    fnirsGroup.selectAll(".attention").classed("hide-workload", true)
    fnirsGroup.selectAll(".perception").classed("hide-workload",true)

    fnirsGroup.selectAll("."+selectedFnirs).classed("hide-workload",false)
    
    selectedItems.forEach((item)=>{
        let tempObject = dataFiles[4].filter(obj => obj.subject == item.subject && obj.trial == item.trial);
        if (tempObject.length==0){
            console.log("ERROR: NO FNIRS SESSIONS DATA FOUND FOR SUBJECT AND TRIAL ID")
            tempObject= [{subject: item.subject, trial: item.trial, missing:true}]
        }
        
        else
            tempObject[0]["missing"]=false
        filteredObjects.push(tempObject[0]) 
    })

    let currentY = margins.fnirsSessions.top; 
    let groupArray = uniqueSubjects
    if(selectedGroupby=="trial"){
        groupArray = uniqueTrials
    }
    groupArray.forEach((id)=>{
        let groupedObj = filteredObjects.filter(obj => obj.subject == id)
        if (selectedGroupby=="trial")
            groupedObj = filteredObjects.filter(obj => obj.trial == id)
        if (groupedObj.length==0)
            return
            
    currentY+=10
    
    fnirsSessionsGroup.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${currentY})`)
        .call(d3.axisTop(xScaleFnirsSessions)
            .tickValues([0, 0.5, 1])
            .tickFormat(d => Math.round(d*100)));
    
    fnirsSessionsGroup.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(${xScaleFnirsSessions.range()[1]+15}, ${currentY})`)
        .call(d3.axisTop(xScaleFnirsSessions)
            .tickValues([0, 0.5, 1])
            .tickFormat(d => (d*100)));

    currentY+=10

        groupedObj.forEach((session)=>{
            let sessionObject = {
                subject: 0,
                trial: 0,
                workload_classification_Optimal: 0,
                workload_classification_Overload: 0,
                workload_classification_Underload: 0,
                attention_classification_Optimal: 0,
                attention_classification_Overload: 0,
                attention_classification_Underload: 0,
                perception_classification_Optimal: 0,
                perception_classification_Underload: 0,
                perception_classification_Overload: 0
            }

            Object.entries(session).forEach(([key, value]) => {sessionObject[key] = value});
            
            sessionObject['perception_classification_Total'] =  sessionObject.perception_classification_Optimal + sessionObject.perception_classification_Underload + sessionObject.perception_classification_Overload
            sessionObject['attention_classification_Total'] =  sessionObject.attention_classification_Optimal +  sessionObject.attention_classification_Underload +  sessionObject.attention_classification_Overload
            sessionObject['workload_classification_Total'] =   sessionObject.workload_classification_Optimal +  sessionObject.workload_classification_Underload +  sessionObject.workload_classification_Overload

            let variableName = selectedFnirs + "_classification_";
            
            //Overload
            fnirsSessionsGroup.append("rect")
                .attr("x", xScaleFnirsSessions.range()[1] + 15)
                .attr("y", currentY+5)
                .attr("width", xScaleFnirsSessions(sessionObject[variableName+"Overload"]/sessionObject[variableName+"Total"] ))
                .attr("height", 15)
                .style("fill", "#99070d" )
                .attr("class","fnirs-session-bar t"+sessionObject.trial+"-s"+sessionObject.subject);

            //optimal
            fnirsSessionsGroup.append("rect")
                .attr("x", xScaleFnirsSessions.range()[1] + 15)
                .attr("y", currentY+20)
                .attr("width", xScaleFnirsSessions(sessionObject[variableName+"Optimal"]/sessionObject[variableName+"Total"] ))
                .attr("height", 15)
                .style("fill", "#eb5a4d" )
                .attr("class","fnirs-session-bar t"+sessionObject.trial+"-s"+sessionObject.subject);

            //underload
            fnirsSessionsGroup.append("rect")
                .attr("x", xScaleFnirsSessions.range()[1] + 15)
                .attr("y", currentY+35)
                .attr("width", xScaleFnirsSessions(sessionObject[variableName+"Underload"]/sessionObject[variableName+"Total"] ))
                .attr("height", 15)
                .style("fill", "#ffb0b0" )                
                .attr("class","fnirs-session-bar t"+sessionObject.trial+"-s"+sessionObject.subject);

            

            let errorData = dataFiles[5].filter(obj => obj.subject_id == sessionObject.subject && obj.trial_id == sessionObject.trial)[0];
            
            if (errorData){
                //Non Error
                fnirsSessionsGroup.append("rect")
                    .attr("x", 0)
                    .attr("y", currentY+5)
                    .attr("width", xScaleFnirsSessions((100-errorData['percentage_error'])/100 ))
                    .attr("height", 15)
                    .style("fill", "#AEAEAE" )
                    .attr("class","error-session-bar t"+errorData.trial_id+"-s"+errorData.subject_id);

                //Error
                fnirsSessionsGroup.append("rect")
                    .attr("x", 0)
                    .attr("y", currentY+20)
                    .attr("width", xScaleFnirsSessions(errorData['percentage_error']/100 ))
                    .attr("height", 15)
                    .style("fill", "black" )
                    .attr("class","error-session-bar t"+errorData.trial_id+"-s"+errorData.subject_id);

            }

            else{
                fnirsSessionsGroup.append("text")
                    .attr("x", 0)
                    .attr("y", currentY + 25)
                    .style("font-size", "10px")
                    .attr("text-anchor","start")
                    .style("fill","black")
                    .text("Error data not found") 
                    .style("fill-opacity",0.5)  
                    
            }

            const xScaleCorrelations=d3.scaleLinear()
                .domain([-1,1])
                .range(xScaleFnirsSessions.range())

            if (d3.select("#corr-checkbox").property("checked") == true){

                fnirsSessionsGroup.append('g')
                    .attr('class', "x-axis t"+sessionObject.trial+"-s"+sessionObject.subject)
                    .attr('transform', `translate(0, ${currentY+60})`)
                    .call(d3.axisBottom(xScaleCorrelations)
                    .tickValues([-1, -0.5, 0, 0.5, 1]));
                
                let correlations = dataFiles[8].session_correlations[sessionObject.subject][sessionObject.trial]
                if (correlations!= null){
                    let optimalCorr = correlations[selectedFnirs+"_Optimal"]
                    let overloadCorr = correlations[selectedFnirs+"_Overload"]
                    let underloadCorr = correlations[selectedFnirs+"_Underload"]
                    if(optimalCorr != null)
                        fnirsSessionsGroup.append("rect")
                            .attr("x", xScaleCorrelations(optimalCorr))
                            .attr("y", currentY +51)
                            .attr("fill", "#eb5a4d")
                            .attr("width", 9)
                            .attr("height", 9)
                            .attr("class","t"+sessionObject.trial+"-s"+sessionObject.subject);    
                    if(overloadCorr != null)
                        fnirsSessionsGroup.append("rect")
                            .attr("x", xScaleCorrelations(overloadCorr))
                            .attr("y", currentY +51)
                            .attr("fill", "#99070d")
                            .attr("width", 9)
                            .attr("height", 9)
                            .attr("class","t"+sessionObject.trial+"-s"+sessionObject.subject);
                    if(underloadCorr != null)
                        fnirsSessionsGroup.append("rect")
                            .attr("x", xScaleCorrelations(underloadCorr))
                            .attr("y", currentY +51)
                            .attr("fill", "#ffb0b0")
                            .attr("width", 9)
                            .attr("height", 9)
                            .attr("class","t"+sessionObject.trial+"-s"+sessionObject.subject);
                }
        
            }
            currentY+=90
            if (fnirsSessionsSvg.attr("height")<=currentY+200){
                fnirsSessionsGroup.attr("height",currentY+200)
                fnirsSessionsSvg.attr("height",currentY+250+margins.fnirsSessions.top+margins.fnirsSessions.bottom)     
            }
        })
        currentY+=50
        if (fnirsSessionsSvg.attr("height")<=currentY+200){
            fnirsSessionsGroup.attr("height",currentY+200)
            fnirsSessionsSvg.attr("height",currentY+250+margins.fnirsSessions.top+margins.fnirsSessions.bottom)   
        }
    })
}
