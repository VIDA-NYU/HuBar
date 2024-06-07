import * as d3 from 'd3';
import { get_allTimestamps, get_stepColorScale, get_margins, get_unique_subjects, get_unique_trials, get_selectedFnirs, get_selectedItems, get_selectedGroupby} from './config.js'
import { get_matrixGroup, get_matrixSvg, get_matrixTooltip } from './containersSVG.js';
import { get_brushedSubject, get_brushedTrial, get_vidEnd, get_vidStart} from './configHl2Details.js';

export function updateMatrix( dataFiles ){
    // Extract unique sources from the data
    let uniqueTrials = get_unique_trials();
    let uniqueSubjects = get_unique_subjects();
    let selectedItems  = get_selectedItems();

    const margins = get_margins();
    
    // get selected value from dropdown menus
    let selectedGroupby = get_selectedGroupby();
    let selectedFnirs = get_selectedFnirs();

    // get svgs
    let matrixGroup = get_matrixGroup();
    let matrixSvg = get_matrixSvg();
    let matrixTooltip = get_matrixTooltip();

    matrixGroup.selectAll('*').remove();

    let stepColorScale = get_stepColorScale();
    console.log(stepColorScale.range())

    let colorScaleBrain;
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
        .attr('transform', `translate(10, 10)`)
        .call(xAxis);
    
    stepsPresent.forEach((step)=>{
        
        matrixGroup.append('rect')
            .attr("x",xScaleMatrix(step)+ xScaleMatrix.bandwidth()*0.35)
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
                  
                  
            else if (d3.select("#brain-checkbox").property("checked") == true){
                d3.select("#brain-dropdown")
                    .style("visibility","visible");
                
                colorScaleBrain = d3.scaleDiverging([1,0,-1],d3.interpolateRdBu);

                //Add color legend for brain
                const defs = matrixGroup.append("defs");

                const linearGradient = defs.append("linearGradient")
                    .attr("id", "linear-gradient");

                // Create multiple color stops
                const numStops = 40;
                const colorStops = d3.range(numStops).map(i => {
                    const offset = i / (numStops - 1);
                    return {
                        offset: `${offset * 100}%`,
                        color: colorScaleBrain(-1 + offset * 2) // maps to the range [-1, 1]
                    };
                });

                linearGradient.selectAll("stop")
                    .data(colorStops)
                    .enter().append("stop")
                    .attr("offset", d => d.offset)
                    .attr("stop-color", d => d.color);

                matrixGroup.append("rect")
                    .attr("x", xScaleMatrix.range()[1]*0.6)
                    .attr("y", 20)
                    .attr("width", xScaleMatrix.range()[1]*0.35)
                    .attr("height", 10)
                    .style("fill", "url(#linear-gradient)");

                // Add labels to the legend
                const xScaleBrainLegend = d3.scaleLinear()
                    .domain([-1, 1])
                    .range([xScaleMatrix.range()[1]*0.6, xScaleMatrix.range()[1]*0.95]);

                const xAxisBrainLegend = d3.axisBottom(xScaleBrainLegend)
                    .ticks(5);

                matrixGroup.append("g")
                    .attr("class", "x-axis axisHide")
                    .attr("transform", `translate(0,${30})`)
                    .call(xAxisBrainLegend)
                    .selectAll(".tick text")
                    .style("font-weight", "lighter");

                
                stepsPresent.forEach(step => createBrainVis(session, step))

                //check if brush has been activated and add transparency to non brushed instances
                let brushedSubject = get_brushedSubject();
                if (brushedSubject !=null){ 
                    matrixGroup.selectAll(".brainimg")
                        .style("opacity",0.1)

                    matrixGroup.selectAll(".brainpath")
                        .style("fill-opacity",0.1)

                    let brushedTrial = get_brushedTrial()
                    let vidStart = get_vidStart()
                    let vidEnd = get_vidEnd()
                    let sessionObject = dataFiles[1].filter(obj => obj.subject_id == brushedSubject && obj.trial_id == brushedTrial)[0]
                    let stepNames = new Set();
                    sessionObject['consolidatedStepData'].step.forEach((step)=>{
                        if (step.startTimestamp > vidStart && step.startTimestamp < vidEnd)
                            stepNames.add(step.value)
                        else if (step.endTimestamp> vidStart && step.startTimestamp < vidEnd)
                            stepNames.add(step.value)
                    })
                    stepNames.forEach((name)=>{
                        matrixGroup.selectAll("#brainpath-" + name + "-"+brushedSubject +"-" + brushedTrial)
                            .style( "fill-opacity",1);
                        matrixGroup.selectAll("#brainimg-" + name + "-"+brushedSubject +"-" + brushedTrial)
                            .style( "opacity",1);
                    })
                }
            }

            else{
                d3.select("#brain-dropdown")
                    .style("visibility","hidden");
                stepsPresent.forEach(step => createPie( session, step));
            }    
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

    function createBrainVis(row, step){
        const total = row[step] ?? 0;

        if (total==0)
            return


        const brainWidth = xScaleMatrix.bandwidth()
        const brainHeight = 90
   
        let midXPoint = xScaleMatrix(step) + xScaleMatrix.bandwidth()/2
        const midYPoint = currentY + 45
        let span = Math.min(brainHeight, brainWidth);
                
        let pathData= "m6.36429,4.63058c0,0 0.66593,-0.16648 0.99889,-0.16648c0.66593,0 1.66482,0 2.66371,0c0.66593,0 0.99889,0 0.99889,0c0.66593,-0.16648 0.99889,-0.33296 0.99889,-0.33296c0.33296,-0.16648 0.62992,-0.28355 0.99889,-0.33296c0.84138,-0.11268 1.81595,0.41558 2.49723,0.49945c0.4957,0.06102 0.83241,0.16648 0.83241,0.16648c0.16648,0.16648 0.31761,0.58206 0.99889,0.66593c0.16523,0.02034 0.33296,0.16648 0.49944,0.16648c0,0 0,0.33296 0,0.66593c0,0.16648 0.16648,0.33296 0.16648,0.49945c0,0.16648 -0.15019,0.47022 0.16648,0.66593c0.14162,0.08753 0.16648,0.33296 0.16648,0.49945c0,0.16648 0,0.33296 0,0.66593c0,0.33296 0,0.66593 0,1.33186c0,0.33296 0,0.83241 0,1.33186c0,0.33296 0,0.66593 0,0.83241c0,0 0,0.16648 0,0.49945c0,0 0,0.16648 0,0.49945c0,0.16648 0,0.33296 0,0.66593c0,0.33296 0,0.83241 0,0.99889c0,0.16648 0.03825,0.17094 0,0.33296c-0.08553,0.36231 -0.21821,0.34632 -0.33296,0.83241c-0.08553,0.36231 -0.16648,0.49945 -0.16648,0.83241c0,0 0,0 0,0.33296c0,0.16648 -0.10277,0.34564 -0.16648,0.49945c-0.0901,0.21752 -0.41392,0.63659 -0.49945,0.99889c-0.19125,0.81014 0,1.99778 0,3.49612c0,0.99889 -0.26061,1.68996 0.16648,1.99779c0.13506,0.09734 0.33296,0.16648 0.49944,0.16648c0,0 0,0 0,0c-0.16648,0.33296 -0.13714,0.25201 -0.49944,0.16648c-0.48609,-0.11475 -0.97867,-0.08215 -1.49834,-0.16648c-0.82166,-0.13334 -1.51029,-0.11508 -2.33075,-0.33296c-0.50883,-0.13513 -0.83241,-0.16648 -1.16537,-0.16648c-0.33296,0 -0.83241,0 -1.33186,0c-0.66593,0 -1.16537,0 -1.49834,0c-0.33296,0 -0.52479,-0.12742 -0.83241,0c-0.21752,0.0901 -0.49945,0.16648 -0.66593,0.33296c0,0 0,0.49944 -0.16648,0.49944c-0.16648,0 -0.51726,0.31948 -1.16537,0.16648c-1.08692,-0.25659 -2.55487,-1.28282 -2.83019,-1.66482c-0.21767,-0.302 -0.24863,-0.47923 -0.33296,-0.99889c-0.08,-0.493 0,-1.16537 0,-1.8313c0,-0.33296 0.16648,-0.83241 0.33296,-1.16537c0.16648,-0.33296 0.36178,-0.30845 0.49945,-0.49945c0.21767,-0.302 0.09142,-0.49198 0.66593,-0.66593c0.15934,-0.04824 0.16648,0 0.49945,-0.33296c0.16648,-0.16648 0.24744,-0.63659 0.33296,-0.99889c0.11475,-0.48609 0.02746,-1.00003 0,-1.33186c-0.08353,-1.00922 -0.39708,-1.56027 -0.83241,-2.16427c-0.27533,-0.382 -0.55708,-0.78337 -0.83241,-1.16537c-0.21767,-0.302 -0.40935,-0.44841 -0.49945,-0.66593c-0.06371,-0.15381 -0.16648,-0.49945 -0.16648,-0.49945c0,-0.16648 0,-0.49945 0,-0.83241c0,-0.33296 0.02175,-0.85384 0.16648,-1.33186c0.17395,-0.5745 0.47022,-0.84871 0.66593,-1.16537c0.26257,-0.42485 0.16648,-0.99889 0.16648,-1.49834c0,-0.33296 0,-0.66593 0,-0.99889c0,-0.16648 -0.12742,-0.35831 0,-0.66593c0.0901,-0.21752 0.16648,-0.33296 0.16648,-0.49945c0,-0.16648 0.17094,-0.29471 0.33296,-0.33296c0.36231,-0.08553 0.49945,-0.16648 0.66593,-0.16648c0.16648,0 0.16648,0 0.33296,0c0,0 0.33296,0 0.33296,0c0,0 -0.01966,0.1786 0.49945,0.99889c0.32099,0.50723 0.66593,1.16537 0.83241,1.49834l0.16648,0.16648l0,0"
        

        //here simply replace the points.value with the valid data 
        const points = [
            {x: 1, y: 1, value: Math.random()*2 - 1},
            {x: 2, y: 1, value: Math.random()*2 - 1},
            {x: 3, y: 1, value: Math.random()*2 - 1},
            {x: 4, y: 1, value: Math.random()*2 - 1},
            {x: 5, y: 1, value: Math.random()*2 - 1},
            {x: 6, y: 1, value: Math.random()*2 - 1},
            {x: 7, y: 1, value: Math.random()*2 - 1},
            {x: 8, y: 1, value: Math.random()*2 - 1},

            {x: 1, y: 2, value: Math.random()*2 - 1},
            {x: 2, y: 2, value: Math.random()*2 - 1},
            {x: 3, y: 2, value: Math.random()*2 - 1},
            {x: 4, y: 2, value: Math.random()*2 - 1},
            {x: 5, y: 2, value: Math.random()*2 - 1},
            {x: 6, y: 2, value: Math.random()*2 - 1},
            {x: 7, y: 2, value: Math.random()*2 - 1},
            {x: 8, y: 2, value: Math.random()*2 - 1},
        ];
    
        
        // Load the brain model and append it to the SVG
        matrixGroup.append("image")
            .attr("xlink:href", "./imgs/brain_img.png")
            .attr("class","brainimg")
            .attr("id", "brainimg-" + step + "-"+row.subject +"-"+row.trial)
            .attr("x", xScaleMatrix(step))  // X coordinate of the image
            .attr("y", currentY)  // Y coordinate of the image
            .attr("width", brainWidth)  // Width of the image (same as SVG width)
            .attr("height", 90)  // Height of the image (same as SVG height)
            .attr("preserveAspectRatio", "xMidYMid meet");  // Preserve aspect ratio
        

            /*
        // Function to append a path element at a specified location and scale
        function appendPath(x, y, value, span) {
            // Color scale from blue (-1) to red (1)
            const colorScale = d3.scaleDiverging([-1,0,1],d3.interpolateRdBu);
            const randomScale = Math.random() * 0.3 + 1; // Scale between 1 and 1.3; 
            //const randomRotation = Math.random() * 360; // Rotation between 0 and 360 degrees
            const randomSkewX = Math.random() * 50 - 25
            const randomSkewY = Math.random() * 50 - 25

            matrixGroup.append("path")
                .attr("d", pathData)
                .attr("class","brainpath")
                .attr("id", "brainpath-" + step + "-"+row.subject +"-"+row.trial)
                .attr("transform", `translate(${x}, ${y}) scale(${1.4 * span/300 }) scale(${randomScale}) skewX(${randomSkewX}) skewY(${randomSkewY})`)
                .attr("fill", colorScale(value))
                .attr("opacity", 0.7);
        }
        points.forEach(point => {appendPath(point.x,point.y,point.value, span)});
        */
        
        const xScaleBrain = d3.scaleBand()
            .domain([1,2,3,4,5,6,7,8])
            .range([midXPoint-0.41*span, midXPoint+0.41*span])
            .padding(0.1)
        
        matrixGroup.append("g")
            .selectAll("circle")
            .data(points)
            .enter()
            .append("circle")
            .attr("class","brainpath")
            .attr("id", "brainpath-" + step + "-"+row.subject +"-"+row.trial)
            .attr("cx", (d) => xScaleBrain(d.x) + xScaleBrain.bandwidth()/2)
            .attr("cy", (d) =>{
                if (d.y ==1)
                    return midYPoint - 0.05*span
                else
                    return midYPoint - 0.3*span
            })
            .attr("r", xScaleBrain.bandwidth()/2)
            .attr("fill", (d)=> colorScaleBrain(d.value))
            .attr("opacity", 1);
    
    }
}