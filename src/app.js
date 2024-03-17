// Import D3
import * as d3 from 'd3';
import lasso from './lasso.js'; // Adjust the path if necessary

const videoFolder = "data/video/"
const videoPlayer = document.getElementById('video-player');
let selectedScatterSource, selectedGroupby, scatterSvg, scatterGroup, dataFiles, scatterColorScaleSubject, scatterColorScaleTrial;
let vidStart = 0;
let vidEnd = 5;

const margins={ 
    scatterplot:{ top:35, left:15, right:15, bottom:10},
    video:{ top:0, left:0, right:0, bottom:0}

}

Promise.all([
        d3.csv("data/scatterplot_imu_gaze.csv"),
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
    
    selectedGroupby="trial";

    let scatterplotDiv = d3.select("#scatterplot-container") 
    scatterSvg = scatterplotDiv
        .append("svg")
        .attr("width", scatterplotDiv.node().clientWidth)
        .attr("height", scatterplotDiv.node().clientHeight)
        
    scatterGroup= scatterSvg.append("g")
        .attr("transform", `translate(${margins.scatterplot.left}, ${margins.scatterplot.top})`)
        .attr("width", scatterplotDiv.node().clientWidth -margins.scatterplot.left - margins.scatterplot.right )
        .attr("height", scatterplotDiv.node().clientHeight - margins.scatterplot.top - margins.scatterplot.bottom);

    
    selectedScatterSource = sources[0]
    
    
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
            Step: [],
            FlightPhase: [],
            Error: []
        };  
        let currentStep = null;
        let currentFlightPhase = null;
        let currentError = null;

        trial['data'].forEach(record => {
            // Consolidate 'Step' data
            if (record.Step !== currentStep) {
                if (consolidatedData.Step.length > 0) {
                consolidatedData.Step[consolidatedData.Step.length - 1].endTimestamp = record.float_timestamp;
                }
                consolidatedData.Step.push({
                startTimestamp: record.float_timestamp,
                endTimestamp: record.float_timestamp,
                value: record.Step
                });
                currentStep = record.Step;
            } else {
                consolidatedData.Step[consolidatedData.Step.length - 1].endTimestamp = record.float_timestamp;
            }

            // Consolidate 'FlightPhase' data
            if (record.FlightPhase !== currentFlightPhase) {
                if (consolidatedData.FlightPhase.length > 0) {
                consolidatedData.FlightPhase[consolidatedData.FlightPhase.length - 1].endTimestamp = record.float_timestamp;
                }
                consolidatedData.FlightPhase.push({
                startTimestamp: record.float_timestamp,
                endTimestamp: record.float_timestamp,
                value: record.FlightPhase
                });
                currentFlightPhase = record.FlightPhase;
            } else {
                consolidatedData.FlightPhase[consolidatedData.FlightPhase.length - 1].endTimestamp = record.float_timestamp;
            }

            // Consolidate 'Error' data
            if (record.Error !== currentError) {
                if (consolidatedData.Error.length > 0) {
                consolidatedData.Error[consolidatedData.Error.length - 1].endTimestamp = record.float_timestamp;
                }
                consolidatedData.Error.push({
                startTimestamp: record.float_timestamp,
                endTimestamp: record.float_timestamp,
                value: record.Error
                });
                currentError = record.Error;
            } else {
                consolidatedData.Error[consolidatedData.Error.length - 1].endTimestamp = record.float_timestamp;
            }
        });
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
    const filteredObjects = dataFiles[1].filter(obj => obj.subject_id === 293 && obj.trial_id === 2);
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
        }
        //case where no nodes are selected - reset filters and inform parent
        else{
            lassoBrush.items().attr("class","scatterpoints");
            //selected
        }
    }
}

function updateEventTimeline(){
    


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
