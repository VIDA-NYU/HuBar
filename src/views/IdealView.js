import { get_brushedSubject, get_brushedTrial, get_vidEnd, get_vidStart, set_brushedSubject, set_brushedTrial, set_brushesAdded, set_vidEnd, set_vidStart } from './configHl2Details.js';
import { get_videoPlayer } from './videoPlayerUtils.js';
import * as d3 from 'd3';

// List of field labels
const fieldLabels = [
  ['Total Time Demand','seconds','total-time-demand'],
  ['Overall Working Memeory Load', 'chunks','overall-working-memeory-load'],
  ['Overall Workload Rating', '','overall-workload-rating'],
  ['Procedure Time Demand','seconds','procedure-time-demand'],
  ['Procedure Working Memory Load','chunks','procedure-working-memmory-load'],
  ['Procedure Workload','','procedure-workload'],
];

var ClosestMatch;
var DefaultContainer;
var MissionLogData = null;
var Reset = true;

var PreviousTrialID = null;
var PreviousSubjectID = null;
var PreviousFlightPhase = null;
var PreviousProcedure = null;

window.addEventListener("load", async() => {
  LoadWorkloadModule();
})

export async function TestScript() {
    let SubjectID = get_brushedSubject();
    let TrialID = get_brushedTrial();
    let VideoCurrentTime = get_videoPlayer().currentTime;
    if(SubjectID !== null && TrialID !== null && (VideoCurrentTime !== null && VideoCurrentTime > 0)){
        if(PreviousSubjectID !== SubjectID || PreviousTrialID !== TrialID){
            resetToDefaultView();
            MissionLogData = await fetchData("../data/formatted_mission_log_seconds.json");
            PreviousSubjectID = SubjectID;
            PreviousTrialID = TrialID;
        }
        ClosestMatch = findCurrentPhaseAndProcedure(MissionLogData, SubjectID, TrialID, VideoCurrentTime);
        if(ClosestMatch){
          if(PreviousFlightPhase !== ClosestMatch.FlightPhase || PreviousProcedure !== ClosestMatch.Procedure){
            updateOptimalTaskView(ClosestMatch);
            PreviousFlightPhase = ClosestMatch.FlightPhase;
            PreviousProcedure = ClosestMatch.Procedure;
          }
        }
    }
    else if(!Reset){
        resetToDefaultView();
    }

    // Simulate an asynchronous operation (e.g., a delay)
    await new Promise(resolve => setTimeout(resolve, 1000));
  
    TestScript();
  }

  function resetToDefaultView(){
    ClosestMatch = null;
    MissionLogData =null;

    PreviousSubjectID = null;
    PreviousTrialID = null ;
    PreviousFlightPhase = null;
    PreviousProcedure = null;

    LoadDefaultContainer();
    Reset = true;
  }

  function LoadDefaultContainer(){
    const targetDiv = document.getElementById('ideal-log-container-child');
    if(targetDiv){
      targetDiv.outerHTML = DefaultContainer;
    }
    const titleContainer = document.getElementById('workload-module-title');
    titleContainer.innerHTML = "Workload Module";

    const imageContainer = document.getElementById('work-module-image');
    imageContainer.src = '';
  }

  async function updateOptimalTaskView(Match){
    if(Match.FlightPhase != null || Match.Procedure != null){
      const containerTitle = document.getElementById('workload-module-title');
      containerTitle.innerHTML = `Workload Module ${Match.FlightPhase} ${Match.Procedure}`;

      var LookUpJSON = await fetchData("../data/workload_module_lookup_table.json");

      fieldLabels.forEach(label => {

        var DataTextDiv = document.getElementById(label[2]);

        if(label[2] === "total-time-demand"){
          DataTextDiv.innerText = LookUpJSON[Match.FlightPhase].total_time_demand;
        }
        else if(label[2] === "overall-working-memeory-load"){
          DataTextDiv.innerText = LookUpJSON[Match.FlightPhase].total_working_memory_load;

        }
        else if(label[2] === "overall-workload-rating"){
          DataTextDiv.innerText = LookUpJSON[Match.FlightPhase].overall_workload;
        }
        else{
          DataTextDiv.innerText = LookUpJSON[Match.FlightPhase][Match.Procedure][label[2]];
        }
      })

      const imageContainer = document.getElementById('work-module-image');
      imageContainer.src = LookUpJSON[Match.FlightPhase][Match.Procedure].chart_url;

      Reset = false;
    }
  }


  function findCurrentPhaseAndProcedure(array, subjectId, trialId, currentTime) {
    let closest = null;
  
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      // Check if the item matches the given subject_id and trial_id
      if (item.subject_id == subjectId && item.trial_id == trialId) {
        // Iterate over the 'data' array within the item
        for (let j = 0; j < item.data.length; j++) {
          const dataItem = item.data[j];
          // Check if the 'seconds' of this data item is less than or equal to the currentTime
          if (dataItem.seconds >= currentTime) {
            // If closest is not set yet or the current data item's 'seconds' is greater than the current closest 'seconds'
            if (closest === null || dataItem.seconds < closest.seconds) {
              closest = dataItem;
            }
          }
        }
      }
    }
    // console.log(closest);
    // If closest is found, return the flightphase and procedure
    if (closest) {
      const parsedProcedure = parseInt(closest.Procedure);
      closest.Procedure = Number.isInteger(parsedProcedure) ? parsedProcedure : closest.Procedure;

      if(closest.FlightPhase == "Flight"){
        closest.Procedure = normalizeFlightProcedureString(closest.Procedure);
      }

      return closest;
    }

    return null;
  }

  async function fetchData(filePath) {
    return d3.json(filePath)
    .then(data => data)
    .catch(error => {
      console.error('Error reading or parsing file:', error);
      throw error;
    });
  }

function clearDiv(divID){
  const Div =  document.getElementById(divID);
  if(Div){
    Div.innerHTML = '';
  }
}

function LoadWorkloadModule(){
  
  const targetDiv = document.getElementById('ideal-log-container-child');

  if (targetDiv) {
    // Create the main container div
    const mainContainer = document.createElement('div');
    mainContainer.id = "workload-module-main-container";

    // mainContainer.style.height = '100%';
    
    // Create and append the data fields
    fieldLabels.forEach(label => {
      const dataField = document.createElement('div');
      dataField.className = 'ideal-workload-datafield';
    
      const innerDiv = document.createElement('div');
      innerDiv.classList.add('workload-module-datafield-container');
    
      const valueDiv = document.createElement('div');
      valueDiv.classList.add('workload-module-datafield-inner-div');
      const valueText = document.createElement('h1');
      valueText.id = label[2];
      valueText.style.margin = "auto";
      valueText.textContent = 'N/A'; // Example value, you can set this dynamically
      valueDiv.appendChild(valueText);
    
      const unitDiv = document.createElement('div');
      unitDiv.classList.add('workload-module-datafield-inner-div');
      const unitText = document.createElement('p');
      unitText.style.marginBottom = "4px";
      unitText.style.marginLeft = "2px";
      unitText.textContent = label[1]; // Example unit, you can set this dynamically
      unitDiv.appendChild(unitText);
    
      innerDiv.appendChild(valueDiv);
      innerDiv.appendChild(unitDiv);
    
      dataField.appendChild(innerDiv);
    
      const strongElement = document.createElement('p');
      strongElement.style.fontStyle = "italic";
      strongElement.style.margin = "0px";
      strongElement.textContent = label[0];
      dataField.appendChild(strongElement);
    
      mainContainer.appendChild(dataField);
    });

    // Create the image container
    const imageContainer = document.createElement('div');
    imageContainer.style.width = "100%";
    const imageElement = document.createElement('img');
    imageElement.id = 'work-module-image';
    // imageElement.src = 'data/images/preflight_1_chartView.png';
    imageElement.src = '';
    imageElement.style.width = "inherit";
    imageContainer.appendChild(imageElement);

    // Clear the existing content
    targetDiv.innerHTML = '';

    // Append the main container and image container to the target div
    targetDiv.appendChild(mainContainer);
    targetDiv.appendChild(imageContainer);
  }

  DefaultContainer = targetDiv.outerHTML;
}

function normalizeFlightProcedureString(input) {
    // Convert the input to a string
    let str = input.toString();

    // Regular expression to match patterns with a prefix followed by digits
    const prefixPattern = /^([a-zA-Z]+)-?(\d+)$/;

    // Check if the input matches the pattern with a prefix
    let match = str.match(prefixPattern);
    if (match) {
        // Extract the prefix and number parts
        let prefix = match[1];
        let number = match[2];

        // Normalize the prefix to Title Case (e.g., 'Emer' or 'emer' to 'Emer')
        prefix = prefix.charAt(0).toUpperCase() + prefix.slice(1).toLowerCase();

        // Return the normalized string in the format 'Prefix-Number'
        return `${prefix}-${number}`;
    }

    // If the input is just a number, return it as it is
    if (!isNaN(str)) {
        return str;
    }

    // If input doesn't match the expected patterns, return the original input
    return input;
}