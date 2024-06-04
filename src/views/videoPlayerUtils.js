import * as d3 from 'd3';
const videoPlayer = document.getElementById('video-player');

let eventListeners = {}; // Keep track of added event listeners

export function reset_videoPlayer() {
    // Reset video source
    videoPlayer.src = "";
    // Reset playback
    videoPlayer.load();
    // Remove additional attributes
    videoPlayer.removeAttribute('src');
    videoPlayer.load();
    
    // Remove all event listeners
    removeAllEventListeners(videoPlayer);
}

export function addTimeUpdateListener(vidStart, vidEnd, xScaleHL2) {
    let timeupdate = 0;
    // Add timeupdate event listener
    const timeUpdateListener = function() {
        let curTime = videoPlayer.currentTime;
        d3.selectAll(".seekline")
            .attr("x1", xScaleHL2(curTime))
            .attr("x2", xScaleHL2(curTime));
        if (curTime >= vidEnd) {
            // Loop back to the start time
            videoPlayer.currentTime = vidStart;
        } else if (curTime < vidStart && timeupdate > 5) {
            // Jump to the start time if below the start time
            videoPlayer.currentTime = vidStart;
            timeupdate = 0;
        }
        
        timeupdate++;
    };

    // Save the event listener reference
    eventListeners['timeupdate'] = timeUpdateListener;

    // Add the event listener
    videoPlayer.addEventListener('timeupdate', timeUpdateListener);
}

function removeAllEventListeners(element) {
    // Loop over the event listeners and remove them
    Object.keys(eventListeners).forEach(eventType => {
        element.removeEventListener(eventType, eventListeners[eventType]);
        delete eventListeners[eventType]; // Remove reference from the eventListeners object
    });
}

// Function to set video source, adjust playback start time, and play
export function playVideoWithStartTime(videoPath, vidStart) {
    reset_videoPlayer();
    
    // Set video source
    videoPlayer.src = videoPath;
    
    // Define the event listener function for loadeddata event
    const loadedDataListener = function() {
        // Adjust playback start time
        videoPlayer.currentTime = vidStart;
        // Play video
        videoPlayer.play();
        
        // After playback starts, remove the event listener to avoid accumulation
        videoPlayer.removeEventListener('loadeddata', loadedDataListener);
    };
    
    // Add the event listener for loadeddata event
    videoPlayer.addEventListener('loadeddata', loadedDataListener);
    
    // Load the video
    videoPlayer.load();
}

// Getter function to retrieve the video player
export function get_videoPlayer() {
    return videoPlayer;
}