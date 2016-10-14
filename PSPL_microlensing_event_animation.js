console.log("Executing PSPL_microlensing_event_animation.js");

var PSPL_microlensing_event_animation = (function() {
  var eventModule = PSPL_microlensing_event;
  var lensPlaneModule = PSPL_microlensing_event_lens_plane;

  var time;
  var timer;
  var running = false;

  // var minTime = eventModule.xAxisInitialDay;
  // var maxTime = eventModule.xAxisFinalDay;
  var minTime = eventModule.xAxisInitialDay;
  var maxTime = eventModule.xAxisFinalDay;
  var dt = eventModule.dt * 10;
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
      doStuff();
      timer = window.setTimeout(run, 1000/30);
    }
  }

  function doStuff() {
    console.log("doing stuff");
    if (time >= maxTime) {
        updatePlayback("timeReset");
        return;
    }

    var mu = eventModule.mu;
    var yearToDay = 365.25; // day/year; const
    var eqMu = mu / yearToDay; // convert mu to milliarcseconds/day
    console.log("mu: " + mu);
    var newSourcePosX = mu * time;

    /*
    thetaX = mu*time + thetaX_initial

    thetaX_initial = mu*time_initial + thetaX_initial


    */

    lensPlaneModule.sourcePos.x = newSourcePosX;
    lensPlaneModule.redraw();

    time += dt;
    timeReadout.innerHTML = Number(time).toFixed(4);
    console.log("TIME: " + time);
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
