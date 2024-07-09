import * as d3 from 'd3';
import { get_allTimestamps, get_stepColorScale, get_margins, get_unique_subjects, get_unique_trials, get_selectedFnirs, get_selectedItems, get_selectedGroupby} from './config.js'
import { get_matrixGroup, get_matrixSvg, get_matrixTooltip } from './containersSVG.js';


export function updateMatrix( dataFiles ){

    /*
    async function fetchProcessedData(data) {
        const response = await fetch('https://localhost:8001/process-brain-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
    
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    
        return response.json();
    }

    (async () => {
        try {
            const result = await fetchProcessedData(requestData);
            console.log('Fetch result:', result);
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    })();
    */

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
                currentY+=100;
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
            }

            else{
                d3.select("#brain-dropdown")
                    .style("visibility","hidden");
                stepsPresent.forEach(step => createPie( session, step));
            }    
            currentY+=100;
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

        let requestData = {
            "subjects_id": row.subject=="293"? "0293" : String(row.subject),
            "trial_id": String(row.trial),
            "plot_sensors": false,
            "plot_annotation": false,
            "picks": "hbo",
            "selected_events": [String(step)],
            "initial_time": 0,
            "end_time": null,
            "aggregate_by": null
        }

        async function fetchProcessedData(data) {
            const response = await fetch('https://localhost:8001/process-brain-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
        
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        
            return response.json();
        }
    
        (async () => {
            try {
                const result = await fetchProcessedData(requestData);
                const imageData = result[1];  // Assuming the RGB pixel data is in result[1]

                // Assuming imageData is structured as a 2D array of RGB values
                const width = imageData.length;  // Width of the image
                const height = imageData[0].length;  // Height of the image
                
                // Create a canvas element to draw the image
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const context = canvas.getContext('2d');
                
                // Prepare imageData for Canvas API
                const imageDataUint8 = new Uint8ClampedArray(width * height * 4);  // RGBA format
                
                // Convert RGB values to RGBA format for Canvas API
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const index = (y * width + x) * 4;
                        imageDataUint8[index] = imageData[x][y][0];  // Red
                        imageDataUint8[index + 1] = imageData[x][y][1];  // Green
                        imageDataUint8[index + 2] = imageData[x][y][2];  // Blue
                        imageDataUint8[index + 3] = 255;  // Alpha (fully opaque)
                    }
                }
                
                // Create ImageData object
                const imgData = new ImageData(imageDataUint8, width, height);
                
                // Put the image data onto the canvas
                context.putImageData(imgData, 0, 0);
                
                // Convert canvas to data URL
                const imageUrl = canvas.toDataURL();  // This will give you a data URL (base64 encoded)
                
                // Append the image to the SVG or HTML
                matrixGroup.append("image")
                    .attr("xlink:href", imageUrl)
                    .attr("class", "brainimg")
                    .attr("id", "brainimg-" + step + "-" + row.subject + "-" + row.trial)
                    .attr("x", xScaleMatrix(step))  // X coordinate of the image
                    .attr("y", currentY)  // Y coordinate of the image
                    .attr("width", brainWidth)  // Width of the image (same as SVG width)
                    .attr("height", 100)  // Height of the image (same as SVG height)
                    .attr("preserveAspectRatio", "xMidYMid meet");
        
            } catch (error) {
                console.log(error);
            }
        })();
        
        /*

        (async () => {

        })();

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
        /*
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
            */
    }



}