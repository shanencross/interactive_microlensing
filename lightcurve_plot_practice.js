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

var tE = 10;
var tMax = 15;
var u0 = 0.1;

var dayWidth = 50;
var magnifHeight = 10;
var xPixelScale = canvas.width/dayWidth; // pixels per day
var xPlotStep = 1; // Spacing between vertical lines in days
var yPixelScale = canvas.height/magnifHeight; // pixels per magnif unit
var yPlotStep = 1; // Spacing between horizontal lines in magnification units

var initialT = 0;
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
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "black";
  context.lineWidth = 0.1;
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

function plotLightcurve(inputData, fromEquation=false) {
  initPlot();
  context.lineWidth = 2;
  context.strokeStyle = "blue";
  if (fromEquation)
    plotLightcurveFromEquation();
  else
    plotLightcurveFromData(inputData);
}

function plotLightcurveFromData(inputData) {
  var curveData;
  if (inputData === undefined) {
    curveData = getCurveData();
  }
  else {
    curveData = inputData;
  }

  var times = curveData.times;
  var magnifs = curveData.magnifs;

  var prevTday = times[0];
  var prevMagnif = magnifs[0];

  for (var i=0; i<times.length; i++) {
    var tDay = times[i];
    var magnif = magnifs[i];

    plotLine(prevTday, prevMagnif, tDay, magnif);
    prevTday = tDay;
    prevMagnif = magnif;
  }
}

function plotLightcurveFromEquation() {
  var prevTday = initialT;
  var prevMagnif = getMagnif(initialT);

  for (var tDay=initialT + dt; tDay <= dayWidth; tDay += dt) {
    var magnif = getMagnif(tDay);

    plotLine(prevTday, prevMagnif, tDay, magnif);
    prevTday = tDay;
    prevMagnif = magnif;
  }
}

function plotLine(prevTday, prevMagnif, tDay, magnif) {
  var tPixel = tDay * xPixelScale;
  var prevTpixel = prevTday * xPixelScale;

  var magnifPixel = canvas.height - magnif * yPixelScale;
  var prevMagnifPixel = canvas.height - prevMagnif * yPixelScale;

  context.beginPath();
  context.moveTo(prevTpixel, prevMagnifPixel);
  context.lineTo(tPixel, magnifPixel);
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
