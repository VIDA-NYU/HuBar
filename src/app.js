// Import D3
import * as d3 from 'd3';
import lasso from './lasso.js'; // Adjust the path if necessary

const videoFolder = "data/video/"
const videoPlayer = document.getElementById('video-player');
let dataFiles, videoPath, selectedItems,uniqueTrials, uniqueSubjects,
    selectedScatterSource, selectedGroupby, selectedFilter, selectedFNIRS,
    scatterSvg, scatterGroup, scatterColorScaleSubject, scatterColorScaleTrial,
    eventTimelineSvg , eventTimelineGroup, xEventTimelineScale, reverseTimelineScale,
    matrixSvg, matrixGroup;

let vidStart = 0;
let vidEnd = 5;
let maxTimestamp=0.0;

const allSteps = ["a", "b", "c", "d", "e", "f", "?", "*", "1", "2", "v"]

const stepColorScale = d3.scaleOrdinal()
  .domain(allSteps)
  .range(d3.schemePaired);

const margins={ 
    scatterplot:{ top:35, left:15, right:15, bottom:10},
    video:{ top:0, left:0, right:0, bottom:0},
    eventTimeline:{top:25, left:55, right:10, bottom:20},
    matrix:{top:25, left:5, right:5, bottom:20}
}

Promise.all([
        d3.csv("data/scatterplot_imu_gaze_complete.csv"),
        d3.json("data/formatted_mission_log_seconds.json"),
        d3.json("data/steps_error_distribution.json"),
        d3.json("data/FNIRS_sampled.json"),
    ])
    
    .then(function(files) {
        dataFiles = files;
        initializeContainers();
        updateScatterplot();
    })
    .catch(function(err) {
    console.log(err)
    console.log("Data Files not loaded!")
})

function initializeContainers(){
    console.log("initializing")
    
    // Extract unique sources from the data
    const sources = [...new Set(dataFiles[0].map(d => d.source))];
    uniqueTrials = [...new Set(dataFiles[0].map(d => d.trial))]
    uniqueSubjects = [...new Set(dataFiles[0].map(d => d.subject))]
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
        updateScatterplot();
        selectedItems = [];
        updateEventTimeline();
        updateMatrix();
    });

    const groupbyDropdown = d3.select("#groupby-dropdown");
        
    // Add onchange event to get groupBy and update scatterplot
    groupbyDropdown.on("change", function() {
        selectedGroupby = groupbyDropdown.property("value");
        updateScatterplot();
        selectedItems = [];
        updateEventTimeline();
        updateMatrix();
    });
    
    const filterDropdown = d3.select("#filter-dropdown");
    
    // Add onchange event to get groupBy and update scatterplot
    filterDropdown.on("change", function() {
        selectedFilter = filterDropdown.property("value");
        updateScatterplot();
        selectedItems = [];
        updateEventTimeline();
        updateMatrix();
    });

    const fnirsDropdown = d3.select("#fnirs-dropdown");
    
    // Add onchange event to get groupBy and update scatterplot
    fnirsDropdown.on("change", function() {
        selectedFNIRS = fnirsDropdown.property("value");
        updateEventTimeline();
    });

    //initialise select variables
    selectedScatterSource = sourceDropdown.property("value");
    selectedGroupby=groupbyDropdown.property("value");
    selectedFilter = filterDropdown.property("value");
    selectedFNIRS = fnirsDropdown.property("value");
    selectedItems = [];

    //intialise svgs

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

    //TIMESTAMP ADD FLOAT

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
        maxTimestamp= Math.max(consolidatedStepData.flightPhase[consolidatedStepData.flightPhase.length - 1].endTimestamp, maxTimestamp)
        trial['consolidatedStepData'] = consolidatedStepData;
    })

    //consolidate FNIRS Data
    dataFiles[3].forEach((trial)=>{
        let consolidatedFNIRS = {
            workload: [],
            attention: [],
            perception: [],
        };

        let currentWorkload = null;
        let currentAttention = null;
        let currentPerception = null;
        
        trial['data'].forEach(record => {
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
        maxTimestamp= Math.max(consolidatedFNIRS.perception[consolidatedFNIRS.perception.length - 1].endTimestamp, maxTimestamp)
        trial['consolidatedFNIRS'] = consolidatedFNIRS; 
    })
    //initialize colorscales for scatterplot

    function generateColorScale(data, accessor) {
        const uniqueValues = Array.from(new Set(data.map(d => d[accessor])));
        return d3.scaleOrdinal()
            .domain(uniqueValues)
            .range(d3.schemePaired);
    }
    
    scatterColorScaleSubject = generateColorScale(dataFiles[0], "subject");
    scatterColorScaleTrial = generateColorScale(dataFiles[0], "trial");       
    
    //TEMP VIDEO
    videoPlayer.src = videoFolder+"0293/2/hl2_rgb/codec_hl2_rgb.mp4";
    //fitVideoToContainer();
    videoPlayer.addEventListener('timeupdate', function() {
        if (this.currentTime >= vidEnd) {
          // Loop back to the start time
          this.currentTime = vidStart;
        }
      });

    //videoPlayer.load();
    


    console.log("initialized");

}

function updateScatterplot(){
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

    let scatterplotDiv = d3.select("#scatterplot-container") 
    const xScaleScatter = d3.scaleLinear()
        .domain(d3.extent(filteredData, d => +d.x))
        .range([0, scatterplotDiv.node().clientWidth - margins.scatterplot.left - margins.scatterplot.right]);

    // Append tooltip
    let scatterTooltip =scatterplotDiv.append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
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

 

    // Select all existing circles
    const circles = scatterGroup.selectAll("circle")
        .data(filteredData);

    // Update existing circles
    circles
        .attr("cx", d => xScaleScatter(+d.x))
        .attr("cy", d => yScaleScatter(+d.y))
        .attr("fill", d => {
            if (selectedGroupby == "trial") {
                
                return scatterColorScaleTrial(d.trial);
            } else if (selectedGroupby == "subject") {
                return scatterColorScaleSubject(d.subject);
            }
        });

    // Enter new circles
    circles.enter()
        .append("circle")
        .attr("cx", d => xScaleScatter(+d.x))
        .attr("cy", d => yScaleScatter(+d.y))
        .attr("r", 5)
        .attr("fill", d => {
            if (selectedGroupby == "trial") {
                
                return scatterColorScaleTrial(d.trial);
            } else if (selectedGroupby == "subject") {
                return scatterColorScaleSubject(d.subject);
            }
        })
        .attr("class", "scatterpoints")
        .on("mouseover", function(d) {
            scatterTooltip.transition()
                .duration(200)
                .style("opacity", .9);
                scatterTooltip.html(`<strong>Trial:</strong> ${d.target.__data__.trial}<br><strong>Subject:</strong> ${d.target.__data__.subject}`)
                .style("left", (d.layerX + 10) + "px")
                .style("top", (d.layerY - 28) + "px");
        })
        .on("mouseout", function(d) {
            scatterTooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Remove circles that are no longer needed
    circles.exit().remove();

    //add brush
    let lassoBrush=lasso()
        .items(scatterGroup.selectAll('.scatterpoints'))
        .targetArea(scatterSvg)
        .on("end",lasso_end)
        .on("start",()=>{lassoBrush.items().attr("class","scatterpoints");});

    scatterSvg.call(lassoBrush);

    //on drawing of lasso
    function lasso_end(){
        selectedItems = []
        let itemsBrushed=lassoBrush.selectedItems()["_groups"][0];
        if (itemsBrushed.length>0){
            
            lassoBrush.notSelectedItems().attr("class","scatterpoints unselectedscatter");
            lassoBrush.selectedItems().attr("class","scatterpoints");         
            itemsBrushed.forEach((item)=>{
                selectedItems.push({trial:item.__data__.trial ,subject:item.__data__.subject})
            })
        }
        //case where no nodes are selected - reset filters and inform parent
        else{
            lassoBrush.items().attr("class","scatterpoints");
        }
        updateEventTimeline();
        updateMatrix();
    }
}

function updateEventTimeline(){   
    
    eventTimelineGroup.selectAll('*').remove();
    if (selectedItems.length == 0){
        return;
    }

    let filteredMissionData=[];
    let filteredFnirs = [];
    let currentY = margins.eventTimeline.top
    let groupArray = uniqueSubjects
    if(selectedGroupby=="trial")
        groupArray = uniqueTrials
 
    xEventTimelineScale= d3.scaleLinear()
        .domain([0.0, maxTimestamp])
        .range([0, d3.select("#event-timeline-container").node().clientWidth -margins.eventTimeline.left - margins.eventTimeline.right ])  
    reverseTimelineScale = d3.scaleLinear()
        .domain([0, d3.select("#event-timeline-container").node().clientWidth -margins.eventTimeline.left - margins.eventTimeline.right ])
        .range([0.0, maxTimestamp])
    
    selectedItems.forEach((item)=>{
        //filter Mission File
        let tempObject = dataFiles[1].filter(obj => obj.subject_id == item.subject && obj.trial_id == item.trial);
        if (tempObject.length==0){
            console.log("ERROR:NO MATCH FOUND FOR SUBJECT AND TRIAL ID")
            tempObject= [{subject_id: item.subject, trial_id: item.trial, missing:true}]
        }
        else
            tempObject[0]["missing"]=false
        filteredMissionData.push(tempObject[0])
        
        //Filter Fnirs file
        tempObject = dataFiles[3].filter(obj => obj.subject_id == item.subject && obj.trial_id == item.trial);
        if (tempObject.length==0){
            console.log("ERROR:NO MATCH FOUND FOR SUBJECT AND TRIAL ID")
            tempObject= [{subject_id: item.subject, trial_id: item.trial, missing:true}]
        }
        else
            tempObject[0]["missing"]=false
        filteredFnirs.push(tempObject[0])
    })

    groupArray.forEach((id)=>{
        let groupedObj = filteredMissionData.filter(obj => obj.subject_id == id)
        if (selectedGroupby=="trial")
            groupedObj = filteredMissionData.filter(obj => obj.trial_id == id)
        if (groupedObj.length>0 && selectedGroupby=="trial")
            eventTimelineGroup.append("text").attr("x", xEventTimelineScale.range()[1]/2).attr("y", currentY-15).text("Trial "+ id).style("font-size", "16px").attr("text-anchor","middle").style("fill","black")
        else if (groupedObj.length>0 && selectedGroupby=="subject")
            eventTimelineGroup.append("text").attr("x", xEventTimelineScale.range()[1]/2).attr("y", currentY-15).text("Subject "+ id).style("font-size", "16px").attr("text-anchor","middle").style("fill","black")
        else
            return

        groupedObj.forEach((sessionMission)=>{
            let sessionFnirs = filteredFnirs.filter(obj => obj.subject_id == sessionMission.subject_id && obj.trial_id == sessionMission.trial_id)[0]  
            if (sessionMission.missing){
                let displayMissing= `Missing mission info for Subject:${sessionMission.subject_id} Trial:${sessionMission.trial_id}`

                if (sessionFnirs.missing)
                    displayMissing= `Missing Mission and FNIRS info for Subject:${sessionMission.subject_id} Trial:${sessionMission.trial_id}`
  
                let missingText = eventTimelineGroup.append("text").attr("x", xEventTimelineScale.range()[0] - margins.eventTimeline.left + 5).attr("y", currentY+22).text(displayMissing).style("font-size", "12px").attr("text-anchor","start").style("fill","black")
                let bbox = missingText.node().getBBox();
                
                eventTimelineGroup.append("rect")
                    .attr("x", bbox.x - 3)
                    .attr("y", bbox.y - 3)
                    .attr("width", bbox.width + 6)
                    .attr("rx",5)
                    .attr("ry",5)
                    .attr("height", bbox.height + 6)
                    .style("fill", "#FFB3B2");

                eventTimelineGroup.append("text").attr("x", xEventTimelineScale.range()[0] - margins.eventTimeline.left + 5).attr("y", currentY+22).text(displayMissing).style("font-size", "12px").attr("text-anchor","start").style("fill","black")
                currentY+=65

                if(!sessionFnirs.missing){
                    let fnirsToDisplay = sessionFnirs.consolidatedFNIRS[selectedFNIRS];
                    fnirsToDisplay.forEach(data => {
                        eventTimelineGroup.append("rect")
                            .attr("x", xEventTimelineScale(data.startTimestamp))
                            .attr("y", currentY+1)
                            .attr("width", xEventTimelineScale(data.endTimestamp) - xEventTimelineScale(data.startTimestamp)) 
                            .attr("height", 24)
                            .style("fill", () => {return data.value == "Underload" ? "#91bfdb" : data.value == "Overload" ? "#ff834f" : "#ffffbf";});
                    });
                }
                
                currentY += 25

                if(eventTimelineSvg.attr("height")<=currentY+220){
                    eventTimelineGroup.attr("height",currentY+220)
                    eventTimelineSvg.attr("height",currentY+270+margins.eventTimeline.top+margins.eventTimeline.bottom)     
                }
                return
            }
            let stepData = sessionMission.consolidatedStepData.step;
            let errorData = sessionMission.consolidatedStepData.error;
            let phaseData = sessionMission.consolidatedStepData.flightPhase;
            console.log(sessionFnirs)
            console.log(sessionMission.consolidatedStepData)
            let fnirsToDisplay = sessionFnirs.consolidatedFNIRS[selectedFNIRS];

            stepData.forEach(data => {
                eventTimelineGroup.append("rect")
                    .attr("x", xEventTimelineScale(data.startTimestamp))
                    .attr("y", currentY)
                    .attr("width", xEventTimelineScale(data.endTimestamp) - xEventTimelineScale(data.startTimestamp)) 
                    .attr("height", 25)
                    .style("fill", stepColorScale(data.value));
            });
            let sessionTitle
            if (selectedGroupby=="trial")
                sessionTitle=eventTimelineGroup.append("text").attr("x", xEventTimelineScale.range()[0]-margins.eventTimeline.left + 5).attr("y", currentY+25).text("Sub:"+ sessionMission.subject_id).style("font-size", "10px").attr("text-anchor","start").style("fill","black")
            else
                sessionTitle=eventTimelineGroup.append("text").attr("x", xEventTimelineScale.range()[0]-margins.eventTimeline.left + 5).attr("y", currentY+25).text("Trial:"+ sessionMission.trial_id).style("font-size", "10px").attr("text-anchor","start").style("fill","black")
            let bbox = sessionTitle.node().getBBox();
            eventTimelineGroup.append("rect")
                .attr("x", bbox.x - 2)
                .attr("y", bbox.y - 2)
                .attr("width", bbox.width + 4)
                .attr("rx",5)
                .attr("ry",5)
                .attr("height", bbox.height + 4)
                .style("fill", "#FFD166");
            
            eventTimelineGroup.append("text").attr("x", xEventTimelineScale.range()[0]- margins.eventTimeline.left + 5).attr("y", currentY+25).text(sessionTitle.text()).style("font-size", "10px").attr("text-anchor","start").style("fill","#05668D")
            currentY+=25;

            errorData.forEach(data => {
                eventTimelineGroup.append("rect")
                    .attr("x", xEventTimelineScale(data.startTimestamp))
                    .attr("y", currentY+1)
                    .attr("width", xEventTimelineScale(data.endTimestamp) - xEventTimelineScale(data.startTimestamp)) 
                    .attr("height", 14)
                    .style("fill", () => data.value == "error" || data.value == "Error" ? "black" : "#AEAEAE");
            });
            currentY+=15;

            fnirsToDisplay.forEach(data => {
                eventTimelineGroup.append("rect")
                    .attr("x", xEventTimelineScale(data.startTimestamp))
                    .attr("y", currentY+1)
                    .attr("width", xEventTimelineScale(data.endTimestamp) - xEventTimelineScale(data.startTimestamp)) 
                    .attr("height", 24)
                    .style("fill", () => {return data.value == "Underload" ? "#91bfdb" : data.value == "Overload" ? "#ff834f" : "#ffffbf";});
            });
            currentY+=25;

            phaseData.forEach(data => {
                eventTimelineGroup.append("rect")
                    .attr("x", xEventTimelineScale(data.startTimestamp))
                    .attr("y", currentY+1)
                    .attr("width", xEventTimelineScale(data.endTimestamp) - xEventTimelineScale(data.startTimestamp)) 
                    .attr("height", 14)
                    .style("fill", () => data.value ==  "Preflight" ? "#8BC34A" : "#FF5722");

                eventTimelineGroup.append("rect")
                    .attr("x",  xEventTimelineScale(data.startTimestamp))
                    .attr("y", currentY+1)
                    .attr("width", xEventTimelineScale(data.endTimestamp) - xEventTimelineScale(data.startTimestamp))
                    .attr("height", 14)
                    .style("fill", "white")
                    .style("stroke", "black")
                    .style("stroke-width", "2px");
            
                eventTimelineGroup.append("text")
                    .attr("x", xEventTimelineScale(data.startTimestamp) + (xEventTimelineScale(data.endTimestamp) - xEventTimelineScale(data.startTimestamp)) /2) 
                    .attr("y", currentY + 11)
                    .attr("text-anchor", "middle") 
                    .style("font-size", "10px")
                    .style("fill", "black")
                    .text(()=> {
                        if (data.value === "Preflight") {
                            return "PF";
                        } else {
                            return "FL";
                        }
                    })
            });
            
            currentY+=15
            eventTimelineGroup.append("rect")
                .attr("x", 0)
                .attr("y", currentY-80)
                .attr("width", xEventTimelineScale.range()[1])
                .attr("height", 80)
                .style("stroke", "black")
                .style("stroke-width", "1px")
                .style("fill", "none")
                .style("fill-opacity", 0)
                .style("stroke-dasharray", "5,5");

            let brush = d3.brushX()
                .extent([[0, currentY-80], [xEventTimelineScale.range()[1] , currentY]])
                .on("start", brushstart)
                .on("end", brushended);
        
            eventTimelineGroup.append("g")
                .attr("class", "brush timelinebrush")
                .attr("data-trial",sessionMission.trial_id)
                .attr("data-subject",sessionMission.subject_id)
                .datum({brush:brush})
                .call(brush);
            //clear all other brushes when brushing starts
            function brushstart(){
                let allBrushes = eventTimelineGroup.selectAll(".timelinebrush").nodes()
                allBrushes.forEach((eachBrush)=>{
                    if (eachBrush !=this)
                        d3.select(eachBrush).call(d3.brush().move, null); 
                })
            }   

            function brushended (e){
                console.log("Brushed");
                let selected_trial = e.sourceEvent.srcElement.parentElement.getAttribute("data-trial")
                let selected_subject = e.sourceEvent.srcElement.parentElement.getAttribute("data-subject")
                vidStart = reverseTimelineScale(e.selection[0])
                vidEnd = reverseTimelineScale(e.selection[1])
                videoPath = `data/video/${String(selected_subject).padStart(4, '0')}/${selected_trial}/hl2_rgb/codec_hl2_rgb_vfr.mp4`
                videoPlayer.src = videoPath;
                videoPlayer.addEventListener('loadeddata', function() {
                    videoPlayer.currentTime = vidStart;
                    videoPlayer.play();
                });
                
                videoPlayer.load();
                

            }

            currentY+=10

            if (eventTimelineSvg.attr("height")<=currentY+200){
                eventTimelineGroup.attr("height",currentY+200)
                eventTimelineSvg.attr("height",currentY+250+margins.eventTimeline.top+margins.eventTimeline.bottom)     
            }
        })
        currentY+=50
        if (eventTimelineSvg.attr("height")<=currentY+200){
            eventTimelineGroup.attr("height",currentY+200)
            eventTimelineSvg.attr("height",currentY+250+margins.eventTimeline.top+margins.eventTimeline.bottom)     
        }
    })


}

function updateMatrix(){
    matrixGroup.selectAll('*').remove();
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
        groupedObj.forEach((session)=>{
            if (session.missing){
                console.log("Missing", session)
                let displayMissing= `Missing mission info for Subject:${session.subject} Trial:${session.trial}`
                let missingText = matrixGroup.append("text").attr("x", xScaleMatrix.range()[0] - margins.matrix.left + 5).attr("y", currentY+22).text(displayMissing).style("font-size", "12px").attr("text-anchor","start").style("fill","black")
                let bbox = missingText.node().getBBox();
                
                matrixGroup.append("rect")
                    .attr("x", bbox.x - 3)
                    .attr("y", bbox.y - 3)
                    .attr("width", bbox.width + 6)
                    .attr("rx",5)
                    .attr("ry",5)
                    .attr("height", bbox.height + 6)
                    .style("fill", "#FFB3B2");

                matrixGroup.append("text").attr("x", xScaleMatrix.range()[0] - margins.matrix.left + 5).attr("y", currentY+22).text(displayMissing).style("font-size", "12px").attr("text-anchor","start").style("fill","black")
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
        const total = row[step] ?? 0;
        const none = row[step + "_None"] ?? 0;
        const error = row[step + "_error"] ?? 0;
        if (total==0)
            return
        else if (error==0 || none==0){
            matrixGroup.append('circle')
                .attr('cx', xScaleMatrix(step)+maxRadius)
                .attr('cy', currentY + 30)
                .attr('r', radiusScale(total))
                .attr('fill', ()=> error==0? stepColorScale(step) : "black");

            return
        }
        const radius = radiusScale(total); // Scale the radius according to the total
    
        const color = d3.scaleOrdinal()
            .domain(["None", "error"])
            .range([stepColorScale(step), "black"]);
    
        const pie = d3.pie()([none, error]);
    
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);
    
        const arcs = matrixGroup.selectAll(".arc-" + step + "-"+row.subject +"-"+row.trial)
            .data(pie)
            .enter()
            .append("g")
            .attr("class", ".arc-" + step + "-"+row.subject +"-"+row.trial)
            .attr("transform", "translate(" + (xScaleMatrix(step)+maxRadius) + "," + (currentY + 30) + ")");
    
        arcs.append("path")
            .attr("fill", (d, i) => color(i === 0 ? "None" : "error"))
            .attr("d", arc);
    
        //arcs.append("text")
          //  .attr("transform", d => "translate(" + arc.centroid(d) + ")")
            //.attr("text-anchor", "middle")
            //.attr("fill", "white")
            //.text(d => d.value);
    }
}

function fitVideoToContainer( ) {
    let videoContainer = document.getElementById('video-container')
    let videoWidth = videoPlayer.videoWidth;
    let videoHeight = videoPlayer.videoHeight;
    let contianerWidth = videoContainer.offsetWidth;
    let containerHeight = videoContainer.offsetHeight;
    let widthRatio = contianerWidth / videoWidth;
    let heightRatio = (containerHeight - margins.video.top) / videoHeight;
    let scale = Math.min(widthRatio, heightRatio); 
    // Set the width and height of the video player
    videoPlayer.style.width = (videoWidth * scale) + 'px';
    videoPlayer.style.height = Math.min( (videoHeight * scale), (containerHeight - margins.video.top)) + 'px';
}

// Function to convert timestamp to seconds from strings
function timestampToSeconds(timestamp) {
    let [hours, minutes, seconds] = timestamp.split(':').map(parseFloat);
    return hours * 3600 + minutes * 60 + seconds;
}