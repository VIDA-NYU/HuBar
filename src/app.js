// Import D3
import * as d3 from 'd3';
import { updateScatterplot } from './views/ScatterPlot.js';
import { updateFnirsAgg } from './views/FnirsAggregations.js';
import {updateTimeDistribution } from './views/TimeDistribution.js'
// import {maxTimestamp} from './views/config.js'
import { cleanUpdateHl2Details, updateHl2Details } from './views/Hl2Details.js'
import { updateEventTimeline } from './views/EventTimeline.js'
import { compute_unique_data, get_unique_sources, set_selectedFnirs, set_selectedImu, set_selectedGaze, set_selectedItems, set_selectedScatterSource, set_selectedGroupby, set_selectedFilter, set_stepColorScale } from './views/config.js'
import { updateMatrix } from './views/MatrixView.js';
import { updateFnirsSessions } from './views/FnirsErrorSessions.js';
import { initialise_svgs } from './views/containersSVG.js';
import { add_legendFnirs } from './views/legendFnirs.js';
import { consolidate_data } from './views/utils.js';
import { TestScript } from './views/IdealView.js';

const videoFolder = "data/video/"
let dataFiles; 

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
        dataFiles = consolidate_data(files);;
        initializeContainers();
        updateScatterplot( dataFiles );
        updateFnirsAgg( dataFiles)
        updateTimeDistribution( dataFiles );
    })
    .catch(function(err) {
    console.log(err)
    console.log("Data Files not loaded!")
})

async function initializeContainers(){
    console.log("initializing")

    TestScript();
    
    set_stepColorScale();
    // Extract unique sources from the data
    compute_unique_data(dataFiles);
    const sources = get_unique_sources();

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
        set_selectedScatterSource(sourceDropdown.property("value"));
        updateScatterplot( dataFiles )
        // selectedItems = [];
        updateFnirsAgg( dataFiles)
        updateTimeDistribution( dataFiles );
        updateEventTimeline( dataFiles )
        updateMatrix( dataFiles )
        updateFnirsSessions( dataFiles)
        cleanUpdateHl2Details( null );
    });

    const groupbyDropdown = d3.select("#groupby-dropdown");
        
    // Add onchange event to get groupBy and update scatterplot
    groupbyDropdown.on("change", function() {
        set_selectedGroupby(groupbyDropdown.property("value"));
        updateScatterplot( dataFiles )
        // selectedItems = [];
        updateFnirsAgg( dataFiles)
        updateTimeDistribution( dataFiles );
        updateEventTimeline( dataFiles )
        updateMatrix( dataFiles )
        updateFnirsSessions( dataFiles)
        cleanUpdateHl2Details( null );
    });
    
    const filterDropdown = d3.select("#filter-dropdown");
    
    // Add onchange event to get groupBy and update scatterplot
    filterDropdown.on("change", function() {
        set_selectedFilter(filterDropdown.property("value"));
        updateScatterplot( dataFiles )
        // selectedItems = [];
        updateFnirsAgg( dataFiles)
        updateTimeDistribution( dataFiles );
        updateEventTimeline( dataFiles )
        updateMatrix( dataFiles )
        updateFnirsSessions( dataFiles)
        cleanUpdateHl2Details( null );
    });

    const fnirsDropdown = d3.select("#fnirs-dropdown");
    
    // Add onchange event to get groupBy and update scatterplot
    fnirsDropdown.on("change", function() {
        set_selectedFnirs(fnirsDropdown.property("value"))
        updateEventTimeline( dataFiles )
        updateMatrix( dataFiles )
        updateFnirsSessions( dataFiles)
        cleanUpdateHl2Details( null );
    });

    d3.select("#corr-checkbox").on("change", function() {
        updateFnirsSessions( dataFiles)
    });

    const gazeDropdown = d3.select("#gaze-dropdown");

    gazeDropdown.on("change", function() {
        set_selectedGaze(gazeDropdown.property("value"));
        updateHl2Details(dataFiles);
    });

    const imuDropdown = d3.select("#imu-dropdown");

    imuDropdown.on("change", function() {
        set_selectedImu(imuDropdown.property("value"));
        updateHl2Details(dataFiles);
    });;

    //initialise select variables
    set_selectedScatterSource(sourceDropdown.property("value"));
    set_selectedGroupby(groupbyDropdown.property("value"));
    set_selectedFilter(filterDropdown.property("value"));
    set_selectedFnirs(fnirsDropdown.property("value"));
    set_selectedItems([]);
    set_selectedGaze(gazeDropdown.property("value"));
    set_selectedImu(imuDropdown.property("value"));

    //initialise svgs
    initialise_svgs();
    add_legendFnirs();
}
