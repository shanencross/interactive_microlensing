console.log("Executing PSPL_microlensing_event_animation.js");

var PSPL_microlensing_event_animation = (function() {
  var eventModule = PSPL_microlensing_event;
  var lensPlaneModule = PSPL_microlensing_event_lens_plane;

  var fps = 1000;

  var time;
  var timer;
  var running = false;

  var minTime = eventModule.xAxisInitialDay;
  var maxTime = eventModule.xAxisFinalDay;
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
  }

  function run() {
    if (running === true) {
      timer = window.setTimeout(run, 1000/fps);
      animateFrame();
    }
  }

  function animateFrame() {
    console.log("doing stuff");
    if (time > maxTime) {
        updatePlayback("pause");
        return;
    }
    eventModule.plotLightcurve(time);
    animateFrameSource();

    time += dt;
    timeReadout.innerHTML = Number(time).toFixed(4);
    console.log("TIME: " + time);
  }

  function animateFrameSource() {
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
        animateFrame();
      }
    }
    else if (command === "play") {
      console.log("play");
      if (time > maxTime) {
        updatePlayback("timeReset");
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
      animateFrame();
    }
    else if (command === "timeReset") {
      console.log("reset time");
      running = false;
      time = minTime - dt;
      animateFrame();
    }
  }

  init();

  return {
    get running() { return running; },
    get time() { return time; },
  }
})();
