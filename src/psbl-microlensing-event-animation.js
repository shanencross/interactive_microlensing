/** Animation module.
  * Handles animated playback of microlensing event.
  *
  * @module PSBL_microlensing_event_animation
  */

console.log("Executing psbl-microlensing-event-animation.js");

// var eventModule = PSBL_microlensing_event;
// var lensPlaneModule = PSBL_microlensing_event_lens_plane;

var eventModule = require("./psbl-microlensing-event.js");
var lensPlaneModule = require("./psbl-microlensing-event-lens-plane.js");

var almostEquals = require("./utils.js").almostEquals;

var initialized = false; // whether module init function has been executed

var fps = 60; // frames rendered per second (ideally; runs slow in non-Chrome browsers now)

var time;
var timer;
var running = false;

var minTime;
var maxTime;
var animationStep = 0.1; // (days) time step per frame of animation
var playbackControlStep = 5; // (days) time step for "stepBack" and "stepForward" playback commands

var timeReadout = document.getElementById("timeReadout");
var stepBackButton = document.getElementById("stepBack");
var playButton = document.getElementById("play");
var pauseButton = document.getElementById("pause");
var stepForwardButton = document.getElementById("stepForward");
var timeResetButton = document.getElementById("timeReset");

var roundingErrorThreshold = 1e-12; // if values passed to almostEquals have a smaller difference
                                    // than this, they will pass as "almost" equal

/** init */
function init() {
  updateMinAndMaxTimes();
  if (animationStep >= 0)
    time = minTime;
  else
    time = maxTime;
  timeReadout.innerHTML = Number(time).toFixed(4);
  initListeners();
  initialized = true;
}

/** updateMinAndMaxTimes */
function updateMinAndMaxTimes(min, max) {

// default to min/max values of lightcurve plot time axis
  if (min === undefined)
    min = eventModule.xAxisInitialDay;

  if (max === undefined)
    max = eventModule.xAxisFinalDay;

  minTime = min;
  maxTime = max;
}

/** initListeners */
function initListeners() {
  stepBackButton.addEventListener("click", function() { updatePlayback("stepBack"); }, false);
  playButton.addEventListener("click", function() { updatePlayback("play"); }, false);
  pauseButton.addEventListener("click", function() { updatePlayback("pause"); }, false);
  stepForwardButton.addEventListener("click", function() { updatePlayback("stepForward"); }, false);
  timeResetButton.addEventListener("click", function() { updatePlayback("timeReset"); }, false);
}

/** run */
function run() {
  if (running === true) {
    timer = window.setTimeout(run, 1000/fps);

    updateMinAndMaxTimes();
    updateTime(time + animationStep);

    animateFrame();

    if (time >= maxTime || almostEquals(time, maxTime) === true ||
        time <= minTime || almostEquals(time, minTime) === true) {
      updatePlayback("Pause");
    }
  }
}

/** updateTime */
function updateTime(newTime) {

  var newTimeOverMax = false;
  var newTimeUnderMin = false;

  // don't let time exceed maximum limit
  if (newTime >= maxTime || almostEquals(newTime, maxTime) === true) {
    newTime = maxTime;
    newTimeOverMax = true;
  }

  // don't let time fall under minimum limit
  if (newTime <= minTime || almostEquals(newTime, minTime) === true) {
    newTime = minTime;
    newTimeUnderMin = true;
  }

  // Pause animation if time has reached minimum or maximum limit
  if (newTimeOverMax === true && newTimeUnderMin === true)
    updatePlayback("Pause");

  // update time property
  time = newTime;

  // update time readout on page
  // makes sure we display "0.00" instead of "-0.00" if 0 time has rounding error
  var newTimeReadout = Number(time).toFixed(4);
  if (almostEquals(time, 0) === true) {
    newTimeReadout = Number(0).toFixed(4);
  }
  timeReadout.innerHTML = newTimeReadout; // update time readout
}

/** animateFrame */
function animateFrame() {
  console.log("animating frame");

  eventModule.plotLightcurve(time); // animate frame for lightcurve
  animateFrameSource(); // animate frame for source movement on lens plane figure
  console.log("TIME: " + time);
  var u = eventModule.getU(eventModule.getTimeTerm(time));
  var magnif = eventModule.getMagnif(time);
  console.log("debugging u: " + String(u));
  console.log("debugging magnif: " + String(magnif));
}

/** animateFrameSource */
function animateFrameSource() {
  // update source thetaX position for new time
  lensPlaneModule.sourcePos.x = lensPlaneModule.getThetaX(time);
  lensPlaneModule.redraw();
}

/** updatePlayback */
function updatePlayback(command="play", updateFrame=true) {
  //setting updateFrame to false lets us modify the internal frame without
  // actually updating the display, in case we want to issue multiple playback
  // command before actually updating the displayed frame (like multiple
  // steps backwards/forwards)
  window.clearTimeout(timer);

  if (command === "stepBack") {
    console.log("step back");
    if (time > minTime && almostEquals(time, minTime) === false) {
      updateTime(time - playbackControlStep);
      if (updateFrame === true)
        animateFrame();
    }
  }
  else if (command === "play") {
    console.log("play");
    console.log(time);
    if (time >= maxTime || almostEquals(time, maxTime) === true ||
        time <= minTime || almostEquals(time, minTime) === true) {
      updatePlayback("timeReset");
      console.log("At or past time limit, reset");
    }
    running = true;
    run();
  }
  else if (command === "pause") {
    console.log("pause");
    running = false;
  }
  else if (command === "stepForward") {
    console.log("step forward");
    updateTime(time + playbackControlStep);
    if (updateFrame === true)
      animateFrame();
  }
  else if (command === "timeReset") {
    console.log("reset time");
    running = false;

    // if playing forwards (positive step), reset to minimum time
    var newTime;
    if (animationStep >= 0)
      newTime = minTime;
    // if playing backwards (negative step), reset to maximum time
    else // animationStep < 0
      newTime = maxTime;

    updateTime(newTime);
    if (updateFrame === true)
      animateFrame();
  }
}

module.exports = {
  //initialization
  init: init, // initialization function
  get initialized() { return initialized; }, // whether initialization is done

  get running() { return running; },
  get time() { return time; },

  updatePlayback: updatePlayback,
  animateFrame: animateFrame,
}
