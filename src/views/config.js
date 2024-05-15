
let allTimestamps = {}
let maxTimestamp=0.0;

export function process_timestamps(dataFiles){
    //TIMESTAMP
    Object.keys(dataFiles[9]).forEach((subjectVal)=>{
        Object.keys(dataFiles[9][subjectVal]).forEach((trialVal)=>{
            if (trialVal == "4" && subjectVal=="8708") 
                dataFiles[9][subjectVal][trialVal].duration_seconds = dataFiles[9][subjectVal][trialVal].duration_seconds - 84004.747   
        
            allTimestamps['t'+trialVal+"-s"+subjectVal]=dataFiles[9][subjectVal][trialVal].duration_seconds
            maxTimestamp = Math.max(maxTimestamp,  dataFiles[9][subjectVal][trialVal].duration_seconds)
        })
    })
}

export function get_allTimestamps(){
    return allTimestamps;
}
export function get_maxTimestamp(){
    return maxTimestamp;
}
    