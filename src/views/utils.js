import { get_allTimestamps, process_timestamps } from "./config";

export function consolidate_data(files){
    let dataFiles = files;
    // TIMESTAMP
    process_timestamps(dataFiles);
    let allTimestamps = get_allTimestamps();

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
    return dataFiles;
}

// Function to calculate proportions
export function calculateProportions(data, uniqueTrials, selectedGroupby, uniqueSubjects) {
    const proportions = {
        workload : [],
        attention: [],
        perception : [],
    };
    let groupArray = uniqueTrials
    if (selectedGroupby== "subject")
        groupArray= uniqueSubjects
    groupArray.forEach((groupID)=>{

        let filteredData = data.filter(obj => obj.trial == groupID );

        if (selectedGroupby=="subject")
            filteredData = data.filter(obj => obj.subject == groupID );
        // Initialize an object to store the sum of values
        let sumOfValues = {};
        if (filteredData.length<1)
            return
        // Iterate over each object in the array
        filteredData.forEach(entry => {
            // Iterate over each key in the object
            Object.keys(entry).forEach(key => {
                // Skip 'subject' and 'trial'
                if (key !== 'subject' && key !== 'trial') {
                    // If the key doesn't exist in the sumOfValues object, initialize it to 0
                    sumOfValues[key] = sumOfValues[key] || 0;
                    // Add the value of the current key to the sumOfValues object
                    sumOfValues[key] += entry[key] || 0; // If the key is absent, default its value to 0
                }
            });
        });
        let total = (sumOfValues['perception_classification_Optimal'] || 0) + (sumOfValues['perception_classification_Underload'] || 0) + (sumOfValues['perception_classification_Overload'] || 0);
        let optimal = (sumOfValues['perception_classification_Optimal'] || 0) / total;
        let underload = (sumOfValues['perception_classification_Underload'] || 0) / total;
        let overload = (sumOfValues['perception_classification_Overload'] || 0) / total;

        if (selectedGroupby == "trial")
            proportions['perception'].push({ trial: groupID, optimal: optimal, underload: underload, overload: overload });
        else
            proportions['perception'].push({ subject: groupID, optimal: optimal, underload: underload, overload: overload });

        total = (sumOfValues['attention_classification_Optimal'] || 0) + (sumOfValues['attention_classification_Underload'] || 0) + (sumOfValues['attention_classification_Overload'] || 0);
        optimal = (sumOfValues['attention_classification_Optimal'] || 0) / total;
        underload = (sumOfValues['attention_classification_Underload'] || 0) / total;
        overload = (sumOfValues['attention_classification_Overload'] || 0) / total;

        if (selectedGroupby == "trial")
            proportions['attention'].push({ trial: groupID,  optimal: optimal, underload: underload, overload: overload });
        else
            proportions['attention'].push({subject: groupID, optimal: optimal, underload: underload, overload: overload });

        total = (sumOfValues['workload_classification_Optimal'] || 0) + (sumOfValues['workload_classification_Underload'] || 0) + (sumOfValues['workload_classification_Overload'] || 0);
        optimal = (sumOfValues['workload_classification_Optimal'] || 0) / total;
        underload = (sumOfValues['workload_classification_Underload'] || 0) / total;
        overload = (sumOfValues['workload_classification_Overload'] || 0) / total;
        
        if (selectedGroupby == "trial")
            proportions['workload'].push({ trial: groupID,  optimal: optimal, underload: underload, overload: overload });
        else
            proportions['workload'].push({subject: groupID, optimal: optimal, underload: underload, overload: overload });

    });

    return proportions;
}

