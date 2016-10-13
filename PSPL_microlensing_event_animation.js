console.log("Executing PSPL_microlensing_event_animation.js");

var PSPL_microlensing_event_animation = (function() {
  var testVar = 3;
  var frameIndex = 0;
  var time = 0;
  var timer;
  var running = false;

  var timeReadout = document.getElementById("timeReadout");
  var stepBackButton = document.getElementById("stepBack");
  var playButton = document.getElementById("play");
  var pauseButton = document.getElementById("pause");
  var stepForwardButton = document.getElementById("stepForward");
  var timeResetButton = document.getElementById("timeReset");

  function init() {
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
    if (time >= 10) {
        updatePlayback("timeReset");
    }

    frameIndex += 1;
    time = frameIndex/100;
    timeReadout.innerHTML = Number(time).toFixed(4);
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
      if (frameIndex > 0) {
        frameIndex -= 2;
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
      frameIndex = -1;
      doStuff();
    }
  }

  init();

  return {
    get testVar() { return testVar; },
  }
})();
