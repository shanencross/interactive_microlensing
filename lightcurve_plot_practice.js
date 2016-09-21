var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var centerX = canvas.width/2;
var centerY = canvas.height/2;

/*
k = 4*G/c**2
D_rel = 1/(1/D_l - 1/D_s)
pi_rel = 1/D_rel
theta_E = sqrt(k*mass*pi_rel)

tE = theta_E / mu_rel

timeTerm = (t - tMax)/tE
u = sqrt(u0**2 + timeTerm**2)
magnif(u) = (u**2 + 2)/(u * sqrt(u**2 + 4))


OK let's say tE=10 days, tMax = 15 days, u0 = 0.1

so we get timeTerm from tMax and tE and t
then we get u from timeTerm and u0
then we get magnif from u

Also, there are 30 days per x_pixel (0 to 30)
and 4 magnification units per y_pixel (0 to 4)
*/

// default parameter values
var tE = 1.5;
var tMax = 15;
var u0 = 0.1;

// plot scale and range
var dayWidth = 30;
var magnifHeight = 10;
var xPixelScale = canvas.width/dayWidth; // pixels per day
var xPlotStep = 1; // Spacing between vertical lines in days
var yPixelScale = canvas.height/magnifHeight; // pixels per magnif unit
var yPlotStep = 1; // Spacing between horizontal lines in magnification units

// plot aesthetics
var backgroundColor = "white";
var gridColor = "black";
var gridWidth = 0.2;
var curveColor = "blue";
var curveWidth = 2;

// starting time and time increment
var initialTdayDefault = 0;
var dt = 0.1;

var tEslider = document.getElementById("tEslider");
var tEreadout = document.getElementById("tEreadout");

var tMaxSlider = document.getElementById("tMaxSlider");
var tMaxReadout = document.getElementById("tMaxReadout");

var u0slider = document.getElementById("u0slider");
var u0readout = document.getElementById("u0readout");

window.onload = init;

function init() {
  initListeners();
  initPlot();
  plotLightcurve();
}

function initListeners() {
  tEslider.addEventListener("input", updateTE, false);
  tEslider.addEventListener("change", updateTE, false);

  tMaxSlider.addEventListener("input", updateTMax, false);
  tMaxSlider.addEventListener("change", updateTMax, false);

  u0slider.addEventListener("input", updateU0, false);
  u0slider.addEventListener("change", updateU0, false);
}

function updateTE() {
  tEreadout.innerHTML = tEslider.value;
  tE = tEslider.value;
  context.clearRect(0, 0, canvas.width, canvas.height);
  plotLightcurve();
}

function updateTMax() {
  tMaxReadout.innerHTML = tMaxSlider.value;
  tMax = tMaxSlider.value;
  context.clearRect(0, 0, canvas.width, canvas.height);
  plotLightcurve();
}

function updateU0() {
  u0readout.innerHTML = u0slider.value;
  u0 = u0slider.value;
  context.clearRect(0, 0, canvas.width, canvas.height);
  plotLightcurve();
}


function initPlot() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  // fill in background
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.lineWidth = gridWidth;
  context.strokeStyle = gridColor;
  // draw vertical lines
  for (var xPlotDay = 0; xPlotDay < dayWidth; xPlotDay+=xPlotStep) {
    var xPlotPixel = xPlotDay * xPixelScale;
    context.beginPath();
    context.moveTo(xPlotPixel, 0)
    context.lineTo(xPlotPixel, canvas.height);
    context.stroke();
  }

  //draw horizontal lines;
  for (var yPlotMagnif = 0; yPlotMagnif < magnifHeight; yPlotMagnif+=yPlotStep) {
    var yPlotPixel = yPlotMagnif * yPixelScale;
    context.beginPath();
    context.moveTo(0, yPlotPixel);
    context.lineTo(canvas.width, yPlotPixel);
    context.stroke();
  }
}

function plotLightcurve(inputData, fromEquation=true) {
  console.log("fromEquation: " + fromEquation);
  console.log("inputData: " + inputData);
  initPlot();
  // var initialTday, initialMagnif, indexMax, indexIncrement;
  var tDay, magnif;
  if (fromEquation) {
    tDay = initialTdayDefault;
    magnif = getMagnif(tDay);
    // initialTday = initialTdayDefault;
    // initialMagnif = getMagnif(initialTday);

    // indexMax = dayWidth;
    // indexIncrement = dt;
  }
  else {
    var curveData;
    if (inputData === undefined) {
      console.log("hi");
      curveData = getCurveData()
    }
    else {
      console.log("hullo");
      curveData = inputData;
    }
    var times = curveData.times;
    var magnifs = curveData.magnifs;
    tDay = times[0];
    magnif = times[0];
    // initialTday = times[0];
    // initialMagnif = magnifs[0];

    // indexMax = times.length - 1;
    // indexIncrement = 1;
  }

  var tPixel = tDay * xPixelScale;
  var magnifPixel = canvas.height - magnif * yPixelScale;

  context.beginPath();
  context.moveTo(tPixel, magnifPixel);

  var index = 0;
  while (tDay < dayWidth) {
    if (fromEquation) {
      tDay += dt;
      magnif = getMagnif(tDay);
    }
    else {
      index += 1;
      tDay = times[index];
      magnif = magnifs[index];
    }

    var tPixel = tDay * xPixelScale;
    var magnifPixel = canvas.height - magnif * yPixelScale;
    context.lineTo(tPixel, magnifPixel);
  }
  console.log(index);
  if (!fromEquation) {
    console.log(times.length);
    console.log(times[index]);
  }
  else {
    console.log(tDay);
    console.log(dayWidth);
  }

  context.restore();
  context.lineJoin = "round";
  context.lineWidth = curveWidth;
  context.strokeStyle = curveColor;
  context.stroke();
}

function getCurveData() {
  var times = [];
  var magnifs = [];

  for (var tDay=0; tDay <= dayWidth; tDay += dt) {
    var magnif = getMagnif(tDay);
    times.push(tDay);
    magnifs.push(magnif);
  }

  var curveData = {times:times, magnifs:magnifs};
  return curveData;
}

function getTimeTerm(t) {
  timeTerm = (t - tMax)/tE;
  return timeTerm;
}

function getU(timeTerm) {
  u = Math.sqrt(u0*u0 + timeTerm*timeTerm)
  return u;
}

function getMagnifFromU(u) {
  var magnifNumerator = u*u + 2;
  var magnifDenominator = u * Math.sqrt(u * u + 4);
  magnif = magnifNumerator / magnifDenominator;
  return magnif;
}

function getMagnif(t) {
  var timeTerm = getTimeTerm(t);
  var u = getU(timeTerm);
  var magnif = getMagnifFromU(u);
  return magnif;
}
