console.log("Executing PSPL_microlensing_event_animation.js");

var PSPL_microlensing_event_animation = (function() {
  var eventModule = PSPL_microlensing_event;
  var lensPlaneModule = PSPL_microlensing_event_lens_plane;

  var fps = 1000;

  var time;
  var timer;
  var running = false;

  var minTime = -5;
  var maxTime = 5;
  var dt = eventModule.dt;
  console.log(minTime + " " + dt + " " + maxTime);

  var timeReadout = document.getElementById("timeReadout");
  var stepBackButton = document.getElementById("stepBack");
  var playButton = document.getElementById("play");
  var pauseButton = document.getElementById("pause");
  var stepForwardButton = document.getElementById("stepForward");
  var timeResetButton = document.getElementById("timeReset");

  function init() {
    time = minTime;
    timeReadout.innerHTML = Number(time).toFixed(4);
    initListeners();
    run();
  }

  function run() {
    if (running === true) {
      timer = window.setTimeout(run, 1000/fps);
      doStuff();
    }
  }

  function doStuff() {
    console.log("doing stuff");
    if (time >= maxTime) {
        updatePlayback("timeReset");
        return;
    }
    animateLightcurve();
    animateSource();

    time += dt;
    timeReadout.innerHTML = Number(time).toFixed(4);
    console.log("TIME: " + time);
  }

  function animateLightcurve() {
    eventModule.initPlot();
    var isFirstPoint = false;
    var isLastPoint = false;
    if (almostEquals(time, minTime))
      isFirstPoint = true;
    else if (almostEquals(time, maxTime))
      isLastPoint = true;
    // eventModule.plotLightcurveSegment(time, firstPoint=isFirstPoint, lastPoint=isLastPoint);
    eventModule.plotLightcurveSegment(time, firstPoint=isFirstPoint, lastPoint=isLastPoint);
  }

  function almostEquals(a, b, epsilon=(1e-12)) {
    return (Math.abs(a - b) < epsilon);
  }

  function animateSource() {
    var mu = eventModule.mu;
    var yearToDay = 365.25; // day/year; const
    var eqMu = mu / yearToDay; // convert mu to milliarcseconds/day
    console.log("mu: " + mu);
    var newSourcePosX = mu * time;

    lensPlaneModule.sourcePos.x = newSourcePosX;
    lensPlaneModule.redraw();
  }

  function initListeners() {
    stepBackButton.addEventListener("click", function() { updatePlayback("stepBack"); }, false);
    playButton.addEventListener("click", function() { updatePlayback("play"); }, false);
    pauseButton.addEventListener("click", function() { updatePlayback("pause"); }, false);
    stepForwardButton.addEventListener("click", function() { updatePlayback("stepForward"); }, false);
    timeResetButton.addEventListener("click", function() { updatePlayback("timeReset"); }, false);
  }

  function updatePlayback(command="play") {
    window.clearTimeout(timer);

    if (command === "stepBack") {
      console.log("step back");
      if (time > minTime) {
        time -= 2*dt;
        doStuff();
      }
    }
    else if (command === "play") {
      console.log("play");
      running = true;
      run();
    }
    else if (command === "pause") {
      console.log("pause");
      running = false;
    }
    else if (command === "stepForward") {
      console.log("step forward");
      doStuff();
    }
    else if (command === "timeReset") {
      console.log("reset time");
      running = false;
      time = minTime - dt;
      doStuff();
    }
  }

  init();

  return {
    get running() { return running; },
  }
})();
