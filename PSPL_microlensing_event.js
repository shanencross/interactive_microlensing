var lcurveCanvas = document.getElementById("lcurveCanvas");
var context = lcurveCanvas.getContext("2d");

var graphLeftBorder = 50; // left border of graph x-pixel value, NOT including any trailing gridlines
var graphTopBorder = 50; // top border of graph y-pixel value, NOT including any trailing gridlines

var graphWidth = 400;
var graphHeight = 300;

var graphRightBorder = graphLeftBorder + graphWidth; // right border of graph x-pixel value, NOT including any trailing gridlines
var graphBottomBorder = graphTopBorder + graphHeight; // bottom border of y-pixel value, NOT including any trailing gridlines

var graphLeftTrailingBorder = graphLeftBorder - 10; // left border of graph x-pixel value, including any trailing gridlines
var graphRightTrailingBorder = graphRightBorder; // right border of graph x-pixel value, including any trailing gridlines
var graphTopTrailingBorder = graphTopBorder; // top border of graph y-pixel value, including any trailing gridlines
var graphBottomTrailingBorder = graphBottomBorder + 10; // bottom border of graph y-pixel value, including any trailing gridlines

// var graphRightBorder = lcurveCanvas.width - 50; // right border of graph x-pixel value, NOT including any trailing gridlines
// var graphBottomBorder = lcurveCanvas.height - 50; // bottom border of graph y-pixel value
// var graphWidth = graphRightBorder - graphLeftBorder;
// var graphHeight = graphBottomBorder - graphTopBorder;

var centerX = graphWidth/2 + graphLeftBorder;
var centerY = graphHeight/2 + graphTopBorder;

// slider parameters; only tE, tMax, and u0 work/have reasonable ranges/values
// NOTE: There are/should be corellations between several of these for instance tE depends
// on the rest, and mu depends on Ds and Dl;
// need to figure that out so that updating one changes the related ones
var tE = 10; // tE = thetaE / mu
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
var xPlotStep = 2; // Spacing between vertical lines in days
var yPixelScale = graphHeight/magnifHeight; // pixels per magnif unit
var yPlotStep = 1; // Spacing between horizontal lines in magnification units

// plot aesthetics
var canvasBackgroundColor = "#ffffe6"
var graphBackgroundColor = "#eff";
var gridColor = "grey";
var gridWidth = 1;
var curveColor = "blue";
var curveWidth = 2;
var graphBorderColor = "grey";
var graphBorderWidth = 1;
var axisColor = "black";
var axisWidth = 2;

// tick label text aesthetics
var tickLabelFont = "10pt Arial";
var tickLabelColor = "black";
var tickLabelAlign = "center";
var tickLabelBaseline = "middle";
var tickLabelSpacing = 7; // spacking between tick label and end of trailing gridline

// axis label text aesthetics
var xLabel = "time (days)";
var yLabel = "magnification";
var axisLabelFont = "10pt Arial";
var axisLabelColor = "black";
var axisLabelAlign = "center";
var axisLabelBaseline = "middle";
var axisLabelSpacing = 27;

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

function drawAxes() {
  context.beginPath();

  // x axis
  // the -axisWidth/2 makes the x and y axes fully connect
  // at their intersection for all axis linewidths
  context.moveTo(graphLeftBorder - axisWidth/2, graphBottomBorder);
  context.lineTo(graphRightBorder + 15, graphBottomBorder);

  // y axis;
  context.moveTo(graphLeftBorder, graphBottomBorder);
  context.lineTo(graphLeftBorder, graphTopBorder - 15);

  // x axis arrow
  // NOTE: Doesn't look right for linewidth > 2
  context.moveTo(graphRightBorder + 15, graphBottomBorder);
  context.lineTo(graphRightBorder + 8, graphBottomBorder - 5);
  context.moveTo(graphRightBorder + 15, graphBottomBorder);
  context.lineTo(graphRightBorder + 8, graphBottomBorder + 5);

  // y axis arrow
  // NOTE: Doesn't look right for linewidth > 2
  context.moveTo(graphLeftBorder, graphTopBorder - 15);
  context.lineTo(graphLeftBorder - 5, graphTopBorder - 8);
  context.moveTo(graphLeftBorder, graphTopBorder - 15);
  context.lineTo(graphLeftBorder + 5, graphTopBorder - 8);

  context.strokeStyle = axisColor;
  context.lineWidth = axisWidth;
  context.stroke();
}

function drawAxisLabels(centerLayout=false) {
  // x label
  context.font = axisLabelFont;
  context.textAlign = axisLabelAlign;
  context.textBaseline = axisLabelBaseline;
  context.fillStyle = axisLabelColor;

  if (centerLayout) {
    // x label
    context.fillText(xLabel, centerX, graphBottomTrailingBorder + axisLabelSpacing)

    // y label
    context.save();
    context.translate(graphLeftTrailingBorder - 25, centerY);
    context.rotate(-Math.PI/2);
    context.textAlign = "center";
    context.fillText(yLabel, 0, 0);
    context.restore();
  }
  else {
    // x label
    context.textAlign = "left";
    context.fillText(xLabel, graphRightTrailingBorder + 20, graphBottomBorder);

    // y label
    context.textBaseline = "bottom";
    context.textAlign = "center";
    context.fillText(yLabel, graphLeftBorder, graphTopTrailingBorder - 20);
  }

  // x label

  // y label

}

// not used right now, but useful if we add interactive scaling
function updatePlotScale(width=30, height=10,xStep=2,yStep=1) {
  dayWidth = width;
  magnifHeight = height;
  xPixelScale = graphWidth/dayWidth; // pixels per day
  xPlotStep = xStep; // Spacing between vertical lines in days
  yPixelScale = graphHeight/magnifHeight; // pixels per magnif unit
  yPlotStep = yStep; // Spacing between horizontal lines in magnification units
}

function initPlot() {
  clearGraph();
  console.log("tE: " + tE);
  console.log("dayWidth: " + dayWidth);
  // fill in canvas background
  context.fillStyle = canvasBackgroundColor;
  context.fillRect(0, 0, lcurveCanvas.width, lcurveCanvas.height);

  // fill in graph background
  context.fillStyle = graphBackgroundColor;
  context.fillRect(graphLeftBorder, graphTopBorder, graphWidth, graphHeight);

  // draw vertical lines and x axis tick labels
  context.beginPath();
  for (var xPlotDay = 0; xPlotDay <= dayWidth; xPlotDay+=xPlotStep) {
    var xPlotPixel = xDayToPixel(xPlotDay);
    context.moveTo(xPlotPixel, graphTopTrailingBorder);
    context.lineTo(xPlotPixel, graphBottomTrailingBorder);

    // tick text label
    var xTickLabel = xPlotDay;
    context.font = tickLabelFont;
    context.fillStyle = tickLabelColor;
    context.textAlign = tickLabelAlign;
    context.textBaseline = tickLabelBaseline;
    context.fillText(xTickLabel, xPlotPixel, graphBottomTrailingBorder + tickLabelSpacing);
  }

  //draw horizontal lines and y axis tick label
  for (var yPlotMagnif = 0; yPlotMagnif <= magnifHeight; yPlotMagnif+=yPlotStep) {
    var yPlotPixel = yMagnifToPixel(yPlotMagnif);
    context.moveTo(graphLeftTrailingBorder, yPlotPixel);
    context.lineTo(graphRightTrailingBorder, yPlotPixel);

    var yTickLabel = yPlotMagnif;
    context.font = tickLabelFont;
    context.fillStyle = tickLabelColor;
    context.textAlign = tickLabelAlign;
    context.textBaseline = tickLabelBaseline;
    context.fillText(yTickLabel,graphLeftTrailingBorder - tickLabelSpacing,  yPlotPixel);
  }
  context.lineWidth = gridWidth;
  context.strokeStyle = gridColor;
  context.stroke();

  // draw border
  context.strokeStyle = graphBorderColor;
  context.lineWidth = graphBorderWidth;
  context.strokeRect(graphLeftBorder, graphTopBorder, graphWidth, graphHeight);

  drawAxes();
  drawAxisLabels(centerLayout=false);
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
