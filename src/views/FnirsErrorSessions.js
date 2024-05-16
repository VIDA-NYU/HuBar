import * as d3 from 'd3';
import { get_selectedFnirs, get_allTimestamps, get_selectedImu, get_selectedGaze, get_margins, get_unique_trials, get_unique_subjects, get_selectedItems, get_selectedGroupby } from './config';
import { get_fnirsGroup, get_fnirsSessionsGroup, get_fnirsSessionsSvg } from './containersSVG';

export function updateFnirsSessions( dataFiles){
    console.log("Updatefnirssessions")

    // get svgs
    let fnirsGroup = get_fnirsGroup();
    let fnirsSessionsGroup = get_fnirsSessionsGroup();
    let fnirsSessionsSvg = get_fnirsSessionsSvg();


    let selectedItems = get_selectedItems();
    let selectedGroupby = get_selectedGroupby();

    fnirsSessionsGroup.selectAll('*').remove();
    
    let selectedFnirs = get_selectedFnirs();
    let margins = get_margins();
    // Extract unique sources from the data
    let uniqueTrials = get_unique_trials();
    let uniqueSubjects = get_unique_subjects();

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
                console.log("CHECK TRUE");
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