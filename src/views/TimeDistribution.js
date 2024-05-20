import * as d3 from 'd3';
import { get_maxTimestamp, get_margins, get_unique_subjects, get_unique_trials, get_selectedItems, get_selectedGroupby, get_selectedFilter} from './config.js'
import { get_timeDistGroup, get_timeDistSvg } from './containersSVG.js';

export function updateTimeDistribution( dataFiles ){

    // Extract unique sources from the data
    let uniqueTrials = get_unique_trials();
    let uniqueSubjects = get_unique_subjects();
    const margins = get_margins();
    let selectedItems = get_selectedItems();
    let maxTimestamp = get_maxTimestamp();

    // get selected value from dropdown menus
    let selectedGroupby = get_selectedGroupby();
    let selectedFilter = get_selectedFilter();

    // get svgs
    let timeDistGroup = get_timeDistGroup();
    let timeDistSvg = get_timeDistSvg();

    timeDistGroup.selectAll('*').remove();
    let topTrialValues;
    let filteredTimeFile = {};
    let filteredTimeData = [];
    if (selectedFilter!="all"){
        let trialFrequency = {};
        dataFiles[4].forEach(obj => {
            trialFrequency[obj.trial] = (trialFrequency[obj.trial] || 0) + 1;
        });
        //Sort trials based on their frequencies
        topTrialValues = Object.keys(trialFrequency).sort((a, b) => trialFrequency[b] - trialFrequency[a]).slice(0,selectedFilter=="t10"? 10 : 5);
        topTrialValues = topTrialValues.map(str => parseInt(str))
    }
    else
        topTrialValues=uniqueTrials;
    // Store filtered keys in an object
    Object.keys(dataFiles[9]).forEach((subjectVal)=>{
        filteredTimeFile[subjectVal] = {}
        topTrialValues.forEach(trialVal => {
        if (trialVal in dataFiles[9][subjectVal]) 
            filteredTimeFile[subjectVal][trialVal] = dataFiles[9][subjectVal][trialVal];
        })
    })

    
    for (let subjectId in filteredTimeFile) {
        for (let trialId in filteredTimeFile[subjectId]) {
            filteredTimeData.push({
                trial: trialId,
                subject: subjectId,
                seconds: filteredTimeFile[subjectId][trialId].duration_seconds
            });
        }
    }

    // Check and filter if there's a matching subject and trial in selectedItems
    if (selectedItems.length>0){
        filteredTimeData = filteredTimeData.filter(obj => {
            return selectedItems.some(item => item.subject == obj.subject && item.trial == obj.trial);
        }); 
    }

    const groupAndCalculateAverage = (data, selectedGroupBy) => {
        const groupedData = data.reduce((groups, obj) => {
            const key = obj[selectedGroupBy];
            const group = groups.get(key) || { [selectedGroupBy]: key, totalSeconds: 0, count: 0 };
            group.totalSeconds += obj.seconds;
            group.count++;
            groups.set(key, group);
            return groups;
        }, new Map());
    
        const averages = Array.from(groupedData.values(), group => ({
            [selectedGroupBy]: group[selectedGroupBy],
            average: group.totalSeconds / group.count
        }));
    
        return averages;
    };

    
    let averageTimeData = groupAndCalculateAverage(filteredTimeData, selectedGroupby)

    if (selectedItems.length>0){
        let groupArray = uniqueSubjects
        if (selectedGroupby=="trial")
            groupArray = uniqueTrials;

        let indexMap = new Map();
        groupArray.forEach((id, i) => {
            indexMap.set(id, i);
        });

        // Sort data based on the order of selectedItems
        averageTimeData.sort((a, b) => {
            const indexA = indexMap.get(selectedGroupby == "trial" ? a.trial : a.subject);
            const indexB = indexMap.get(selectedGroupby == "trial" ? b.trial : b.subject);
            return indexA - indexB;
        });
    }
    const totalHeight = averageTimeData.length * 50;
    const newHeight = totalHeight + margins.fnirs.top + margins.fnirs.bottom;

    timeDistSvg.attr('height', newHeight+50);
    timeDistGroup.attr('height', newHeight+40);

    let yScaleTimeDist

    if(selectedGroupby=="trial"){
        yScaleTimeDist = d3.scaleBand()
            .domain(averageTimeData.map(d => `Trial ${d.trial}`))
            .range([0, totalHeight])
            .paddingInner(0.4)
            .paddingOuter(0.1);
    }
    else{
        yScaleTimeDist = d3.scaleBand()
            .domain(averageTimeData.map(d => `Sub ${d.subject}`))
            .range([0, totalHeight])
            .paddingInner(0.3)
            .paddingOuter(0.1);
    }

    let xScaleTimeDist = d3.scaleLinear()
        .domain([0,maxTimestamp])
        .range([0, d3.select("#time-distribution-container").node().clientWidth - margins.timeDist.left - margins.timeDist.right])

    timeDistGroup.selectAll("rect")
        .data(averageTimeData)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", (d) => {return selectedGroupby=="trial" ? yScaleTimeDist("Trial "+d.trial) +10: yScaleTimeDist("Sub "+d.subject)+26})
        .attr("height", 15)
        .attr("width", d => xScaleTimeDist(d.average))
        .attr("fill","#737373")

    timeDistGroup.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, -10)`)
        .call(d3.axisTop(xScaleTimeDist)
            .tickValues([0, maxTimestamp/2, maxTimestamp])
            .tickFormat(d => Math.round(d/60) + "min"));

    
}
