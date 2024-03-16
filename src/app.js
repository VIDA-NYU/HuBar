// Import D3
import * as d3 from 'd3';

let selectedScatterSource
let scatterSvg
let data
const margins={ 
    scatterplot:{ top:35, left:15, right:15, bottom:10},

}

Promise.all([
    d3.csv("data/scatterplot_imu_gaze.csv"),
    d3.json("data/ocarina_mission_log.json"),
]).then(function(files) {
    data = files;
    console.log(data)
    initializeContainers();
    updateScatterplot();
  

}).catch(function(err) {
    // handle error here
})

function initializeContainers(){
    //initialize scatterplot options
    console.log("initializing")
    // Extract unique sources from the data
    const sources = [...new Set(data[0].map(d => d.source))];

    // Populate dropdown with options
    const dropdown = d3.select("#sourceDropdown");
    dropdown.selectAll("option")
        .data(sources)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);
    
    // Add onchange event listener
    dropdown.on("change", function() {
        // Get the selected value
        selectedScatterSource = dropdown.property("value");
        
        // Update plot
        updateScatterplot();
    });
    
    let scatterplotDiv = d3.select("#scatterplot-container") 
    scatterSvg = scatterplotDiv
        .append("svg")
        .attr("width", scatterplotDiv.node().clientWidth)
        .attr("height", scatterplotDiv.node().clientHeight)
        .append("g")
        .attr("transform", `translate(${margins.scatterplot.left}, ${margins.scatterplot.top})`)
        .attr("width", scatterplotDiv.node().clientWidth -margins.scatterplot.left - margins.scatterplot.right )
        .attr("height", scatterplotDiv.node().clientHeight - margins.scatterplot.top - margins.scatterplot.bottom);

    selectedScatterSource = sources[0]
    
    console.log("initialized");

}

function updateScatterplot (){
    console.log("Updating Scatterplot")
    const filteredData = data[0].filter(d => d.source === selectedScatterSource);
    let scatterplotDiv = d3.select("#scatterplot-container") 
    console.log(selectedScatterSource)
    const xScale = d3.scaleLinear()
        .domain(d3.extent(filteredData, d => +d.x))
        .range([0, scatterplotDiv.node().clientWidth - margins.scatterplot.left - margins.scatterplot.right]);

    console.log(d3.extent(filteredData, d => +d.x))

    const yScale = d3.scaleLinear()
        .domain(d3.extent(filteredData, d => +d.y))
        .range([scatterplotDiv.node().clientHeight - margins.scatterplot.bottom - margins.scatterplot.top, 0]);
    console.log(d3.extent(filteredData, d => +d.y))
    // Select all existing circles
    const circles = scatterSvg.selectAll("circle")
        .data(filteredData);

    // Update existing circles
    circles
        .attr("cx", d => xScale(+d.x))
        .attr("cy", d => yScale(+d.y));

    // Enter new circles
    circles.enter()
        .append("circle")
        .attr("cx", d => xScale(+d.x))
        .attr("cy", d => yScale(+d.y))
        .attr("r", 4)
        .attr("fill", "steelblue");

    // Remove circles that are no longer needed
    circles.exit().remove();

}