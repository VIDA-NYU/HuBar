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