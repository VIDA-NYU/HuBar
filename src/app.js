// Import D3
import * as d3 from 'd3';
import lasso from './lasso.js'; // Adjust the path if necessary

const videoFolder = "data/video/"
const videoPlayer = document.getElementById('video-player');
let dataFiles, selectedItems, selectedScatterSource, selectedGroupby, uniqueTrials, uniqueSubjects,
    eventTimelineSvg , eventTimelineGroup, 
    scatterSvg, scatterGroup, scatterColorScaleSubject, scatterColorScaleTrial;
let vidStart = 0;
let vidEnd = 5;
let maxTimestamp=0.0;

const stepColorScale = d3.scaleOrdinal()
  .domain(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"])
  .range(d3.schemeCategory10);

const margins={ 
    scatterplot:{ top:35, left:15, right:15, bottom:10},
    video:{ top:0, left:0, right:0, bottom:0},
    eventTimeline:{top:20, left:10, right:30, bottom:20},

}

Promise.all([
        d3.csv("data/scatterplot_imu_gaze_complete.csv"),
        d3.json("data/formatted_mission_log.json"),
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
        .attr("value", d => d);
    
    // Add onchange event to get dropdown source and update scatterplot
    sourceDropdown.on("change", function() {
        selectedScatterSource = sourceDropdown.property("value");
        updateScatterplot();
    });

    const groupbyDropdown = d3.select("#groupby-dropdown");
        
    // Add onchange event to get groupBy and update scatterplot
    groupbyDropdown.on("change", function() {
        selectedGroupby = groupbyDropdown.property("value");
        updateScatterplot();

    });
    

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

    //initialise select variables
    selectedScatterSource = sources[0]
    selectedGroupby="trial";
    selectedItems = [];

    //
    
    
    //TIMESTAMP ADD FLOAT

    dataFiles[1].forEach((trial)=>{
        let firstTimestampInSeconds = timestampToSeconds(trial['data'][0].timestamp);
        trial['data'].forEach((record, index) => {
            // For the first event, set float_timestamp to 0.0
            if (index === 0) {
                record.float_timestamp = 0.0;
            } else {
                // For subsequent events, calculate float_timestamp based on the difference from the first event
                let currentTimestampInSeconds = timestampToSeconds(record.timestamp);
                record.float_timestamp = (currentTimestampInSeconds - firstTimestampInSeconds); // Convert milliseconds to seconds
            }
        });

        //consolidate step data:
        let consolidatedData = {
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
                if (consolidatedData.step.length > 0) {
                consolidatedData.step[consolidatedData.step.length - 1].endTimestamp = record.float_timestamp;
                }
                consolidatedData.step.push({
                startTimestamp: record.float_timestamp,
                endTimestamp: record.float_timestamp,
                value: record.Step
                });
                currentStep = record.Step;
            } else {
                consolidatedData.step[consolidatedData.step.length - 1].endTimestamp = record.float_timestamp;
            }

            // Consolidate 'FlightPhase' data
            if (record.FlightPhase !== currentFlightPhase) {
                if (consolidatedData.flightPhase.length > 0) {
                consolidatedData.flightPhase[consolidatedData.flightPhase.length - 1].endTimestamp = record.float_timestamp;
                }
                consolidatedData.flightPhase.push({
                startTimestamp: record.float_timestamp,
                endTimestamp: record.float_timestamp,
                value: record.FlightPhase
                });
                currentFlightPhase = record.FlightPhase;
            } else {
                consolidatedData.flightPhase[consolidatedData.flightPhase.length - 1].endTimestamp = record.float_timestamp;
            }

            // Consolidate 'Error' data
            if (record.Error !== currentError) {
                if (consolidatedData.error.length > 0) {
                consolidatedData.error[consolidatedData.error.length - 1].endTimestamp = record.float_timestamp;
                }
                consolidatedData.error.push({
                startTimestamp: record.float_timestamp,
                endTimestamp: record.float_timestamp,
                value: record.Error
                });
                currentError = record.Error;
            } else {
                consolidatedData.error[consolidatedData.error.length - 1].endTimestamp = record.float_timestamp;
            }
        });
        maxTimestamp= Math.max(consolidatedData.flightPhase[consolidatedData.flightPhase.length - 1].endTimestamp, maxTimestamp)
        trial['consolidatedData'] = consolidatedData;
    })
    console.log(dataFiles[1])
    
    //initialize colorscales for scatterplot

    function generateColorScale(data, accessor) {
        const uniqueValues = Array.from(new Set(data.map(d => d[accessor])));
        return d3.scaleOrdinal()
            .domain(uniqueValues)
            .range(d3.schemePaired);
    }
    
    scatterColorScaleSubject = generateColorScale(dataFiles[0], "subject");
    scatterColorScaleTrial = generateColorScale(dataFiles[0], "trial");       

    //TEMP EVENTS
    /*
   
    let arr = filteredObjects[0]["data"];
    // Log the first element
    console.log("First element:", arr[0]);

    console.log("q2 element:", arr[Math.floor(arr.length*0.25)]);

    console.log("q3 element:", arr[Math.floor(arr.length*0.5)]);

    console.log("q4 element:", arr[Math.floor(arr.length*0.75)]);
    // Log the last element
    console.log("Last element:", arr[arr.length - 1]);
    */

    //TEMP VIDEO
    videoPlayer.src = videoFolder+"0293/2/hl2_rgb/codec_hl2_rgb.mp4";
    fitVideoToContainer();
    videoPlayer.load();
    videoPlayer.play();
    videoPlayer.addEventListener('timeupdate', function() {
        if (this.currentTime >= vidEnd) {
          // Loop back to the start time
          this.currentTime = vidStart;
        }
      });
    setTimeout(() => videoPlayer.src = videoFolder+"0293/11/hl2_rgb/codec_hl2_rgb_vfr.mp4",10000);

    console.log("initialized");

}

function updateScatterplot (){
    console.log("Updating Scatterplot")
    const filteredData = dataFiles[0].filter(d => d.source === selectedScatterSource);
    let scatterplotDiv = d3.select("#scatterplot-container") 
    console.log(selectedScatterSource)
    console.log(selectedGroupby)
    const xScale = d3.scaleLinear()
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

    const yScale = d3.scaleLinear()
        .domain(d3.extent(filteredData, d => +d.y))
        .range([scatterplotDiv.node().clientHeight - margins.scatterplot.bottom - margins.scatterplot.top, 0]);

 

    // Select all existing circles
    const circles = scatterGroup.selectAll("circle")
        .data(filteredData);

    // Update existing circles
    circles
        .attr("cx", d => xScale(+d.x))
        .attr("cy", d => yScale(+d.y))
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
        .attr("cx", d => xScale(+d.x))
        .attr("cy", d => yScale(+d.y))
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
            selectedItems = []
            lassoBrush.items().attr("class","scatterpoints");
        }
        updateEventTimeline();
    }
}

function updateEventTimeline(){
    eventTimelineGroup.selectAll('*').remove();
    if (selectedItems.length == 0){
        return;
    }
    let filteredObjects=[];

    let eventTooltip =d3.select("#event-timeline-container").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    //.style("width","150px")
    .style("background-color", "white")
    .style("padding", "8px")
    .style("border-radius", "5px")
    .style("box-shadow", "0 2px 4px rgba(0,0,0,0.2)")
    .style("text-align", "left"); // Add text-align: left to align text left
    

    selectedItems.forEach((item)=>{
        console.log()
        let tempObject = dataFiles[1].filter(obj => obj.subject_id == item.subject && obj.trial_id == item.trial);
        if (tempObject.length!=1){
            console.log("ERROR: Either MORE THAN 1 MATCH OR NO MATCH FOUND FOR SUBJECT AND TRIAL ID")
            //console.log(tempObject)
            //console.log(tempObject.length)
            //console.log(item)
        }
        
        else
            filteredObjects.push(tempObject[0]) 
    })
    
    let xEventTimelineScale= d3.scaleLinear()
        .domain([0.0, maxTimestamp])
        .range([0, d3.select("#event-timeline-container").node().clientWidth -margins.eventTimeline.left - margins.eventTimeline.right ])  
    let brushes=[]
    let currentY = margins.eventTimeline.top
    
    if(selectedGroupby=="trial"){
        uniqueTrials.forEach((trial)=>{
            let groupedObj = filteredObjects.filter(obj => obj.trial_id == trial)
            if (groupedObj.length>0)
                eventTimelineGroup.append("text").attr("x", xEventTimelineScale.range()[1]/2).attr("y", currentY-10).text("Trial "+ trial).style("font-size", "14px").attr("alignment-baseline","middle").style("fill","black")
            else
                return
            groupedObj.forEach((session)=>{ 
                
                let stepData = session.consolidatedData.step;
                let errorData = session.consolidatedData.error;
                let phaseData = session.consolidatedData.flightPhase;
                

               
                stepData.forEach(data => {
                    eventTimelineGroup.append("rect")
                        .attr("x", xEventTimelineScale(data.startTimestamp))
                        .attr("y", currentY)
                        .attr("width", xEventTimelineScale(data.endTimestamp) - xEventTimelineScale(data.startTimestamp)) 
                        .attr("height", 30)
                        .style("fill", stepColorScale(data.value))
                        .on("mouseover", function(d) {
                            console.log("Mouseover rect")
                            eventTooltip.transition()
                                .duration(200)
                                .style("opacity", .9);
                                eventTooltip.html(`<strong>Step:</strong> ${data.value}`)
                                .style("left", (d.layerX + 10) + "px")
                                .style("top", (d.layerY - 28) + "px");
                        })
                        .on("mouseout", function(d) {
                            eventTooltip.transition()
                                .duration(500)
                                .style("opacity", 0);
                        })

                        ;
                });
                let sessionTitle=eventTimelineGroup.append("text").attr("x", xEventTimelineScale.range()[1]-10).attr("y", currentY+11).text("Sub:"+ session.subject_id).style("font-size", "10px").attr("text-anchor","end").style("fill","black")
                let bbox = sessionTitle.node().getBBox();
                eventTimelineGroup.append("rect")
                    .attr("x", bbox.x - 3)
                    .attr("y", bbox.y - 3)
                    .attr("width", bbox.width + 6)
                    .attr("rx",5)
                    .attr("ry",5)
                    .attr("height", bbox.height + 6)
                    .style("fill", "#FFD166");
                eventTimelineGroup.append("text").attr("x", xEventTimelineScale.range()[1]-10).attr("y", currentY+11).text("Sub:"+ session.subject_id).style("font-size", "10px").attr("text-anchor","end").style("fill","#05668D")

                currentY +=30;
                errorData.forEach(data => {
                    eventTimelineGroup.append("rect")
                        .attr("x", xEventTimelineScale(data.startTimestamp))
                        .attr("y", currentY+1)
                        .attr("width", xEventTimelineScale(data.endTimestamp) - xEventTimelineScale(data.startTimestamp)) 
                        .attr("height", 14)
                        .style("fill", () => data.value == "error" || data.value == "Error" ? "red" : "steelblue")
                        .on("mouseover", function() {
                            eventTooltip.transition()
                                .duration(200)
                                .style("opacity", .9);
                                eventTooltip.html(`<strong>Error:</strong> ${data.value}`)
                                .style("left", (d.layerX + 10) + "px")
                                .style("top", (d.layerY - 28) + "px");
                        })
                        .on("mouseout", function(d) {
                            eventTooltip.transition()
                                .duration(500)
                                .style("opacity", 0);
                        });
                });
                currentY +=15;

                phaseData.forEach(data => {
                    eventTimelineGroup.append("rect")
                        .attr("x", xEventTimelineScale(data.startTimestamp))
                        .attr("y", currentY+1)
                        .attr("width", xEventTimelineScale(data.endTimestamp) - xEventTimelineScale(data.startTimestamp)) 
                        .attr("height", 14)
                        .style("fill", () => data.value ==  "Preflight" ? "#8BC34A" : "#FF5722")
                        .on("mouseover", function() {
                            eventTooltip.transition()
                                .duration(200)
                                .style("opacity", .9);
                                eventTooltip.html(`<strong>Flight Phase:</strong> ${data.value}`)
                                .style("left", (d.layerX + 10) + "px")
                                .style("top", (d.layerY - 28) + "px");
                        })
                        .on("mouseout", function(d) {
                            eventTooltip.transition()
                                .duration(500)
                                .style("opacity", 0);
                        });;
                });
                
                currentY += 15

                let brush = d3.brushX()
                    .extent([[0, currentY-60], [xEventTimelineScale.range()[1] , currentY]])
                    .on("start", brushstart)
                    .on("end", brushended);
            
                eventTimelineGroup.append("g")
                    .attr("class", "brush timelinebrush")
                    .attr("data-trial",session.trial_id)
                    .attr("data-subject",session.subject_id)
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

                function brushended (selection){
                    console.log("Brushed");
                    console.log(selection)
                    let selected_trial = selection.sourceEvent.srcElement.parentElement.getAttribute("data-trial")
                    let selected_subject = selection.sourceEvent.srcElement.parentElement.getAttribute("data-subject")

                }

                currentY+=10

                if (eventTimelineGroup.attr("height")<=currentY+150){
                    eventTimelineGroup.attr("height",currentY+150)
                    eventTimelineSvg.attr("height",currentY+150+margins.eventTimeline.top+margins.eventTimeline.bottom)     
                }
            })
            currentY+= 50
            if (eventTimelineGroup.attr("height")<=currentY+150){
                eventTimelineGroup.attr("height",currentY+150)
                eventTimelineSvg.attr("height",currentY+150+margins.eventTimeline.top+margins.eventTimeline.bottom)     
            } 
        })
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
