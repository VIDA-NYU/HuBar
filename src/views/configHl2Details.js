// Compute unique sources, trials and subjects
// let  brushedTrial, brushedSubject, brushesAdded, xEventTimelineScale, vidStart, vidEnd;

let brushedTrial = null;
let brushedSubject = null;
let brushesAdded=[];
let brushIndices=[];
// let xEventTimelineScale;
// let reverseTimelineScale;
let vidStart = 0;
let vidEnd = 5;

// export function initialize_detailview(){
//     set_brushedTrial(null);
//     set_brushedSubject(null);
//     set_brushesAdded([]);
//     set_brushIndices([]);
// }
export function set_brushedTrial(value){
    brushedTrial = value;
}
export function get_brushedTrial(){
    return brushedTrial;
}

export function set_brushedSubject(value){
    brushedSubject = value;
}
export function get_brushedSubject(){
    return brushedSubject;
}

export function set_brushesAdded(value){
    brushesAdded = value;
}
export function get_brushesAdded(){
    return brushesAdded;
}

export function set_brushIndices(value){
    brushIndices = value;
}
export function get_brushIndices(){
    return brushIndices;
}

export function set_vidStart(value){
    vidStart = value;
}
export function get_vidStart(){
    return vidStart;
}

export function set_vidEnd(value){
    vidEnd = value;
}
export function get_vidEnd(){
    return vidEnd;
}

