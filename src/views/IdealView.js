import { get_brushedSubject, get_brushedTrial, get_vidEnd, get_vidStart, set_brushedSubject, set_brushedTrial, set_brushesAdded, set_vidEnd, set_vidStart } from './configHl2Details.js';
import { get_videoPlayer } from './videoPlayerUtils.js';
import * as d3 from 'd3';

var FlightPhase = null;
var Task = null;
var TimeDemand = null;
var PerceptualOperations = [];
var CognitiveOperations = [];
var MotorOperations = [];
var WorkingMemoryLoad = null;
var OverallWorkload = null ;
var ChartImg = null;
var MissionLogData = null;

var PreviousTrialID = null;
var PreviousSubjectID = null;
var PreviousFlightPhase = null;
var PreviousProcedure = null;

export async function TestScript() {
    let SubjectID = get_brushedSubject();
    let TrialID = get_brushedTrial();
    let VideoCurrentTime = get_videoPlayer().currentTime;
    if(SubjectID !== null && TrialID !== null && (VideoCurrentTime !== null && VideoCurrentTime > 0)){
        if(PreviousSubjectID !== SubjectID || PreviousTrialID !== TrialID){
            resetToDefaultView();
            MissionLogData = await fetchMissionLogNData("../data/formatted_mission_log_seconds.json");
            PreviousSubjectID = SubjectID;
            PreviousTrialID = TrialID;
        }
        var PhaseAndProcedure = findCurrentPhaseAndProcedure(MissionLogData, SubjectID, TrialID, VideoCurrentTime);
        if(PhaseAndProcedure){
          if(PreviousFlightPhase !== PhaseAndProcedure.FlightPhase || PreviousProcedure !== PhaseAndProcedure.Procedure){
            console.log(PhaseAndProcedure)
            updateOptimalTaskView();
            PreviousFlightPhase = PhaseAndProcedure.FlightPhase;
            PreviousProcedure = PhaseAndProcedure.Procedure;
          }
        }
    }
    else{
        resetToDefaultView();
    }

    // Simulate an asynchronous operation (e.g., a delay)
    await new Promise(resolve => setTimeout(resolve, 1000));
  
    TestScript();
  }

  function resetToDefaultView(){
    FlightPhase = null;
    Task = null;
    TimeDemand = null;
    PerceptualOperations = [];
    CognitiveOperations = [];
    MotorOperations = [];
    WorkingMemoryLoad = null;
    OverallWorkload = null; 
    ChartImg = null;
    MissionLogData =null;

    PreviousSubjectID = null;
    PreviousTrialID = null ;
    PreviousFlightPhase = null;
    PreviousProcedure = null;

    const targetDiv = document.getElementById('ideal-log-container-child');
    if (targetDiv) {
      targetDiv.innerHTML = '';
    }
  }

  function updateOptimalTaskView(){

    const targetDiv = document.getElementById('ideal-log-container-child');

    if (targetDiv) {
      // Create the main container div
      const mainContainer = document.createElement('div');
      mainContainer.style.display = 'flex';
      mainContainer.style.flexDirection = 'row';
      mainContainer.style.flexWrap = 'wrap';
      mainContainer.style.justifyContent = 'center';
      mainContainer.style.overflow = 'auto';

      // mainContainer.style.height = '100%';
      
      // List of field labels
      const fieldLabels = [
        'Flight Stage',
        'Total Time Demand',
        'Overall Workload',
        'Flight Stage',
        'Time Demand',
        'Perceptual Operations',
        'Cognitive Operations',
        'Motor Operations',
        'Working Memory Load',
        'Overall Workload'
      ];
      
      // Create and append the data fields
      fieldLabels.forEach(label => {
        const dataField = document.createElement('div');
        dataField.className = 'ideal-workload-datafield';
      
        const innerDiv = document.createElement('div');
        innerDiv.style.textAlign = 'center';
        innerDiv.style.display = 'flex';
        innerDiv.style.flexDirection = 'row';
        innerDiv.style.margin = 'auto';
      
        const valueDiv = document.createElement('div');
        valueDiv.style.marginTop = 'auto';
        const valueText = document.createElement('h1');
        valueText.style.margin = "auto";
        valueText.textContent = '6'; // Example value, you can set this dynamically
        valueDiv.appendChild(valueText);
      
        const unitDiv = document.createElement('div');
        unitDiv.style.marginTop = 'auto';
        const unitText = document.createElement('p');
        unitText.style.marginBottom = "0px";
        unitText.textContent = 's'; // Example unit, you can set this dynamically
        unitDiv.appendChild(unitText);
      
        innerDiv.appendChild(valueDiv);
        innerDiv.appendChild(unitDiv);
      
        dataField.appendChild(innerDiv);
      
        const strongElement = document.createElement('p');
        strongElement.style.fontStyle = "italic";
        strongElement.style.margin = "0px";
        strongElement.textContent = label;
        dataField.appendChild(strongElement);
      
        mainContainer.appendChild(dataField);
      });

      // Create the image container
      const imageContainer = document.createElement('div');
      imageContainer.style.width = "100%";
      const imageElement = document.createElement('img');
      imageElement.src = 'data/images/preflight_1_chartView.png';
      imageElement.style.width = "inherit";
      imageContainer.appendChild(imageElement);

      // Clear the existing content
      targetDiv.innerHTML = '';

      // Append the main container and image container to the target div
      targetDiv.appendChild(mainContainer);
      targetDiv.appendChild(imageContainer);
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
      const procedure = Number.isInteger(parsedProcedure) ? parsedProcedure : closest.Procedure;
      return {
        FlightPhase: closest.FlightPhase,
        Procedure: procedure,
      };
    }

    return null;
  }

  async function fetchMissionLogNData(filePath) {
    return d3.json(filePath)
    .then(data => data)
    .catch(error => {
      console.error('Error reading or parsing file:', error);
      throw error;
    });
}