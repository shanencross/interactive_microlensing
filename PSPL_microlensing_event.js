var lcurveCanvas = document.getElementById("lcurveCanvas");
var context = lcurveCanvas.getContext("2d");

var graphLeftTrailingBorder = 20; //left border of graph x-pixel value, including any trailing gridliens
var graphLeftBorder = 20; // left border of graph x-pixel value, NOT including any trailing gridlines
var graphRightBorder = lcurveCanvas.width - 50; // right border of graph x-pixel value, NOT including any trailing gridlines
var graphTopBorder = 20; // top border of graph y-pixel value
var graphBottomBorder = lcurveCanvas.height - 50; // bottom border of graph y-pixel value

var graphWidth = graphRightBorder - graphLeftBorder;
var graphHeight = graphBottomBorder - graphTopBorder;

var centerX = graphWidth/2 + graphLeftBorder;
var centerY = graphHeight/2 + graphTopBorder;

// slider parameters; only tE, tMax, and u0 work/have reasonable ranges/values
// NOTE: There are/should be corellations between several of these for instance tE depends
// on the rest, and mu depends on Ds and Dl;
// need to figure that out so that updating one changes the related ones
var tE = 1.5; // tE = thetaE / mu
var Ml = 10;
var Ds = 15; // Ds =  Dl / (1 - 1/mu)
var u0 = 0.1;
var Dl = 15; // Dl = Ds * (1 - 1/mu)
var tMax = 15;
var mu = 15; // mu = thetaE / tE; mu = Ds / (Ds - Dl) = 1/(1 - Dl/Ds)

// Physical constants
const G = 1; //temp value
const c = 1; //temp value

// derived parameters
var thetaE = Math.sqrt(4 * G * Ml / (mu * Dl * c*c))
console.log("thetaE: " + thetaE)


// plot scale and range
var dayWidth = 30;
var magnifHeight = 10;
var xPixelScale = graphWidth/dayWidth; // pixels per day
var xPlotStep = 1; // Spacing between vertical lines in days
var yPixelScale = graphHeight/magnifHeight; // pixels per magnif unit
var yPlotStep = 1; // Spacing between horizontal lines in magnification units

// plot aesthetics
var canvasBackgroundColor = "#ffffe6"
var graphBackgroundColor = "#eff";
var gridColor = "black";
var gridWidth = 0.2;
var curveColor = "blue";
var curveWidth = 2;
var graphBorderColor = "black";

// starting time and time increment
  var initialTdayDefault = 0;
var dt = 0.1;

var tEslider = document.getElementById("tEslider");
var tEreadout = document.getElementById("tEreadout");

var tMaxSlider = document.getElementById("tMaxSlider");
var tMaxReadout = document.getElementById("tMaxReadout");

var u0slider = document.getElementById("u0slider");
var u0readout = document.getElementById("u0readout");

console.log(graphLeftBorder + " " + graphRightBorder + " " + graphTopBorder + " " + graphBottomBorder);

window.onload = init;

function init() {
  initListeners();
  initPlot();
  plotLightcurve();
}

function initListeners() {
  tEslider.addEventListener("input", updateTE, false);
  tEslider.addEventListener("change", updateTE, false);

  MlSlider.addEventListener("input", updateMl, false);
  MlSlider.addEventListener("change", updateMl, false);

  DsSlider.addEventListener("input", updateDs, false);
  DsSlider.addEventListener("change", updateDs, false);

  u0slider.addEventListener("input", updateU0, false);
  u0slider.addEventListener("change", updateU0, false);

  DlSlider.addEventListener("input", updateDl, false);
  DlSlider.addEventListener("change", updateDl, false);

  tMaxSlider.addEventListener("input", updateTMax, false);
  tMaxSlider.addEventListener("change", updateTMax, false);

  muSlider.addEventListener("input", updateMu, false);
  muSlider.addEventListener("change", updateMu, false);
}

function clearGraph() {
  context.clearRect(graphLeftBorder, graphTopBorder, graphWidth, graphHeight);
}

function updateTE() {
  tEreadout.innerHTML = Number(tEslider.value).toFixed(1);
  tE = tEslider.value;
  clearGraph();
  plotLightcurve();
}

function updateMl() {
  MlReadout.innerHTML = Number(MlSlider.value).toFixed(1);
  Ml = MlSlider.value;
  clearGraph();
  plotLightcurve();
}

function updateDs() {
  DsReadout.innerHTML = DsSlider.value;
  Ds = DsSlider.value;
  clearGraph();
  plotLightcurve();
}


function updateU0() {
  u0readout.innerHTML = Number(u0slider.value).toFixed(3);
  u0 = u0slider.value;
  clearGraph();
  plotLightcurve();
}

function updateDl() {
  DlReadout.innerHTML = DlSlider.value;
  Dl = DlSlider.value;
  clearGraph();
  plotLightcurve();
}

function updateTMax() {
  tMaxReadout.innerHTML = tMaxSlider.value;
  tMax = tMaxSlider.value;
  clearGraph();
  plotLightcurve();
}

function updateMu() {
  muReadout.innerHTML = muSlider.value
  mu = muSlider.value;
  clearGraph();
  plotLightcurve();
}

function xDayToPixel(xPlotDay) {
  var xPlotPixel = xPlotDay * xPixelScale + graphLeftBorder;
  return xPlotPixel;
}

function yMagnifToPixel(yPlotMagnif) {
  yPlotPixel = graphBottomBorder - yPlotMagnif * yPixelScale;
  return yPlotPixel;
}

function drawAxisArrows() {
  ;
}

function drawAxisTicks() {
  ;
}

function initPlot() {
  clearGraph();

  // fill in canvas background
  context.fillStyle = canvasBackgroundColor;
  context.fillRect(0, 0, lcurveCanvas.width, lcurveCanvas.height);

  // fill in graph background
  context.fillStyle = graphBackgroundColor;
  context.fillRect(graphLeftBorder, graphTopBorder, graphWidth, graphHeight);

  // draw vertical lines
  context.lineWidth = gridWidth;
  context.strokeStyle = gridColor;
  context.beginPath();
  for (var xPlotDay = 0; xPlotDay <= dayWidth; xPlotDay+=xPlotStep) {
    var xPlotPixel = xDayToPixel(xPlotDay);
    context.moveTo(xPlotPixel, graphTopBorder);
    context.lineTo(xPlotPixel, graphBottomBorder);
  }

  //draw horizontal lines;
  for (var yPlotMagnif = 0; yPlotMagnif < magnifHeight; yPlotMagnif+=yPlotStep) {
    var yPlotPixel = yMagnifToPixel(yPlotMagnif);
    context.moveTo(graphLeftBorder, yPlotPixel);
    context.lineTo(graphRightBorder, yPlotPixel);
  }
  context.stroke();

  drawAxisArrows();
  drawAxisTicks();

  // draw border
  context.strokeStyle = graphBorderColor;
  context.lineWidth = 1;
  context.strokeRect(graphLeftBorder, graphTopBorder, graphWidth, graphHeight);
}

function plotLightcurve(inputData, fromEquation=true) {
  // console.log("fromEquation: " + fromEquation);
  // console.log("inputData: " + inputData);
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
      curveData = getCurveData()
    }
    else {
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

  context.save();
    // set up clipping region as graph region, so that curve does not
    // extend beyond graph region
    context.beginPath();
    context.rect(graphLeftBorder, graphTopBorder, graphWidth, graphHeight);
    context.clip();

    // prepare to draw curve and move to initial pixel coordinate
    var tPixel = xDayToPixel(tDay);
    var magnifPixel = yMagnifToPixel(magnif);
    context.beginPath();
    context.moveTo(tPixel, magnifPixel);

    // Iterate over remaining days and draw lines from each pixel coordinate
    // to the next
    if (!fromEquation) // Index tracks place in data arrays if reading in data
      var index = 0; //
    while (tDay < dayWidth) {
      // If calculating from equation, increment day by set amount and
      // calculate magnification
      if (fromEquation) {
        tDay += dt;
        magnif = getMagnif(tDay);
      }
      // If reading in data, proceed to the next elements for the
      //  day and magnification arrays
      else {
        index += 1;
        tDay = times[index];
        magnif = magnifs[index];
      }

      var tPixel = xDayToPixel(tDay);
      var magnifPixel = yMagnifToPixel(magnif);
      context.lineTo(tPixel, magnifPixel);
    }
    // console.log(index);
    // if (!fromEquation) {
    //   console.log(times.length);
    //   console.log(times[index]);
    // }
    // else {
    //   console.log(tDay);
    //   console.log(dayWidth);
    // }
    context.lineJoin = "round";
    context.lineWidth = curveWidth;
    context.strokeStyle = curveColor;
    context.stroke();
  context.restore();
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
  u = Math.sqrt(u0*u0 + timeTerm*timeTerm);
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

/*
A = (u**2 + 2)/(u * sqrt(u0**2 + ((t-tMax)/tE)**2 ))
thetaE = sqrt(4*G*Ml / (mu*Dl*c**2))

mu = Ds / (Ds - Dl)


*/
