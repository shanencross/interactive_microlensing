var lcurveCanvas = document.getElementById("lcurveCanvas");
var lcurveContext = lcurveCanvas.getContext("2d");

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
var tE; // tE = thetaE / mu
var Ml;
var Ds; // Ds =  Dl / (1 - 1/mu)
var u0;
var Dl; // Dl = Ds * (1 - 1/mu)
var tMax;
var mu; // mu = thetaE / tE; mu = Ds / (Ds - Dl) = 1/(1 - Dl/Ds)
initParams();

// Physical constants
const G = 1; //temp value
const c = 1; //temp value

// derived parameters
var thetaE = Math.sqrt(4 * G * Ml / (mu * Dl * c*c))
console.log("thetaE: " + thetaE)

// plot scale
var dayWidth;
var magnifHeight;
var xPixelScale; // pixels per day
var yPixelScale; // pixels per magnif unit

// plot range
var xAxisInitialDay;
var yAxisInitialMagnif;
var xAxisFinalDay;
var yAxisFinalMagnif;

const dayWidthDefault = 30;
const magnifHeightDefault = 10;
const xAxisInitialDayDefault = 0;
const yAxisInitialMagnifDefault = 0.5;
// initialize plot scale/range vars
updatePlotScaleAndRange(dayWidthDefault, magnifHeightDefault,
                        xAxisInitialDayDefault, yAxisInitialMagnifDefault);

// gridlines
var xGridInitial;
var yGridInitial;
var xGridFinal;
var yGridFinal;
var xGridStep;
var yGridStep;

const xGridStepDefault = 2;
const yGridStepDefault = 1;
updateGridRange(xGridStepDefault, yGridStepDefault); // initialize gridline vars

// Step increments used by debug buttons to alter range/scale
var xGraphShiftStep = 0.25;
var yGraphShiftStep = xGraphShiftStep;
var xGraphZoomStep = 0.25;
var yGraphZoomStep = xGraphZoomStep;

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
const initialTdayDefault = 0;
var dt = 0.01;

// flag for whether graph is generated from calculating
// magnifications for a range of times from an equation,
// or from an input of time/magnificaiton arrays
const fromEquationDefault = true;

// parameter sliders and their readouts
var tEslider = document.getElementById("tEslider");
var tEreadout = document.getElementById("tEreadout");

var tMaxSlider = document.getElementById("tMaxSlider");
var tMaxReadout = document.getElementById("tMaxReadout");

var u0slider = document.getElementById("u0slider");
var u0readout = document.getElementById("u0readout");

var resetParamsButton = document.getElementById("resetParams");

// debug plot scale/range buttons
var xLeftButton = document.getElementById("xLeft");
var xRightButton = document.getElementById("xRight");
var yUpButton = document.getElementById("yUp");
var yDownButton = document.getElementById("yDown");

var xZoomInButton = document.getElementById("xZoomIn");
var xZoomOutButton = document.getElementById("xZoomOut");
var yZoomInButton = document.getElementById("yZoomIn");
var yZoomOutButton = document.getElementById("yZoomOut");

var resetGraphButton = document.getElementById("resetGraph");

window.onload = init;

function init() {
  initListeners();
  plotLightcurve();
}

function initListeners() {
  // sliders
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

  // reset buttons
  resetParamsButton.addEventListener("click", resetParams, false);

  // debug plot range/scale and reset buttons
  xLeftButton.addEventListener("click", function() { updateGraph("xLeft"); }, false);
  xRightButton.addEventListener("click", function() {updateGraph("xRight"); }, false);
  yUpButton.addEventListener("click", function() { updateGraph("yUp"); }, false);
  yDownButton.addEventListener("click", function() { updateGraph("yDown"); }, false);

  xZoomInButton.addEventListener("click", function() { updateGraph("xZoomIn"); }, false);
  xZoomOutButton.addEventListener("click", function() {updateGraph("xZoomOut"); }, false);
  yZoomInButton.addEventListener("click", function() { updateGraph("yZoomIn"); }, false);
  yZoomOutButton.addEventListener("click", function() { updateGraph("yZoomOut"); }, false);

  resetGraphButton.addEventListener("click", function() { updateGraph("reset"); }, false)

}

function initParams() {
  // set lense curve parameters to defaults
  tE = 10; // tE = thetaE / mu
  Ml = 10;
  Ds = 15; // Ds =  Dl / (1 - 1/mu)
  u0 = 0.1;
  Dl = 15; // Dl = Ds * (1 - 1/mu)
  tMax = 15;
  mu = 15; // mu = thetaE / tE; mu = Ds / (Ds - Dl) = 1/(1 - Dl/Ds)
}

function resetParams() {
  // reset lense curve parameters to defaults and redraw curve
  // NOTE: Need to update sliders too
  console.log("RESET");
  initParams();
  resetSliders();
  plotLightcurve();
}

function resetSliders() {
  // set slider values to current parameter values and update readouts
  tEslider.value = tE;
  MlSlider.value = Ml;
  DsSlider.value = Ds;
  u0slider.value = u0;
  DlSlider.value = Dl
  tMaxSlider.value = tMax;
  muSlider.value = mu;

  updateTE();
  updateMl();
  updateDs();
  updateU0();
  updateDl();
  updateTMax();
  updateMu();
}

function clearGraph() {
  lcurveContext.clearRect(graphLeftBorder, graphTopBorder, graphWidth, graphHeight);
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

function updateGraph(shift) {
  console.log(shift);
  var xInit, yInit, xWidth, yHeight;
  if (shift === undefined)
    return;
  else if (shift === "xLeft") {
    xInit = xAxisInitialDay + xGraphShiftStep;
  }
  else if (shift === "xRight") {
    xInit = xAxisInitialDay - xGraphShiftStep;
  }
  else if (shift === "yUp") {
    yInit = yAxisInitialMagnif - yGraphShiftStep;
  }
  else if (shift === "yDown") {
    yInit = yAxisInitialMagnif + yGraphShiftStep;
  }
  else if (shift === "xZoomIn") {
    xWidth = dayWidth - xGraphZoomStep;
  }
  else if (shift === "xZoomOut") {
    xWidth = dayWidth + xGraphZoomStep;
  }
  else if (shift === "yZoomIn") {
    yHeight = magnifHeight - yGraphZoomStep;
  }
  else if (shift === "yZoomOut") {
    yHeight = magnifHeight + yGraphZoomStep;
  }
  else if (shift === "reset") {
    updatePlotScaleAndRange(dayWidthDefault, magnifHeightDefault,
                            xAxisInitialDayDefault, yAxisInitialMagnifDefault);
    updateGridRange(xGridStepDefault, yGridStepDefault);
  }

  // width=30, height=10,xStep=2,yStep=1,
  //                                  xInit=0, yInit=0.5
  updatePlotScaleAndRange(xWidth, yHeight, xInit, yInit);
  plotLightcurve();
}

function updateGridRange(xStep, yStep) {
  // if both arguments are undefined, update grid step values;
  // otherwise leave grid steps unchanged
  if ( !(xStep === undefined) && !(yStep === undefined)) {
    xGridStep = xStep;
    yGridStep = yStep;
  }

  // Round the initial x grid line placement from initial day on axis
  // up to next xGridStep increment, except when exactly on an xGridStep
  // increment
  if (xAxisInitialDay % xGridStep === 0)
    xGridInitial = xAxisInitialDay;
  else
    xGridInitial = xGridStep * (Math.floor(xAxisInitialDay / xGridStep) + 1);

  // same rounding for final grid line placement
  if (xAxisFinalDay % xGridStep === 0)
    xGridFinal = xAxisFinalDay;
  else
    xGridFinal = xGridStep * (Math.floor(xAxisFinalDay / xGridStep));

  // same rounding for initial y grid line placement
  if (yAxisInitialMagnif % yGridStep === 0)
    yGridInitial = yAxisInitialMagnif;
  else
    yGridInitial = yGridStep * (Math.floor(Math.floor(yAxisInitialMagnif) / yGridStep) + 1);

  // same rounding for final y grid line placement
  if (yAxisFinalMagnif % yGridStep === 0)
    yGridFinal = yAxisFinalMagnif;
  else
    yGridFinal = yGridStep * (Math.floor(yAxisFinalMagnif / yGridStep));

  // console.log(Math.floor)
  // console.log("MathFloored xAxisInitialDay: " + Math.floor(xAxisInitialDay));
  // console.log("xGridInitial: " + xGridInitial);
  // console.log("xGridFinal: " + xGridFinal);
  // console.log("MathFloored yAxisInitialMagnif: " + Math.floor(yAxisInitialMagnif));
  // console.log("yGridInitial: " + yGridInitial);
  // console.log("yGridFinal: " + yGridFinal);
}

function xDayToPixel(xPlotDay) {
  var xPlotPixel = (xPlotDay - xAxisInitialDay) * xPixelScale + graphLeftBorder;
  return xPlotPixel;
}

function yMagnifToPixel(yPlotMagnif) {
  yPlotPixel = graphBottomBorder - (yPlotMagnif - yAxisInitialMagnif) * yPixelScale;
  return yPlotPixel;
}

function drawAxes() {
  lcurveContext.beginPath();

  // x axis
  // the -axisWidth/2 makes the x and y axes fully connect
  // at their intersection for all axis linewidths
  lcurveContext.moveTo(graphLeftBorder - axisWidth/2, graphBottomBorder);
  lcurveContext.lineTo(graphRightBorder + 15, graphBottomBorder);

  // y axis;
  lcurveContext.moveTo(graphLeftBorder, graphBottomBorder);
  lcurveContext.lineTo(graphLeftBorder, graphTopBorder - 15);

  // x axis arrow
  // NOTE: Doesn't look right for linewidth > 2
  lcurveContext.moveTo(graphRightBorder + 15, graphBottomBorder);
  lcurveContext.lineTo(graphRightBorder + 8, graphBottomBorder - 5);
  lcurveContext.moveTo(graphRightBorder + 15, graphBottomBorder);
  lcurveContext.lineTo(graphRightBorder + 8, graphBottomBorder + 5);

  // y axis arrow
  // NOTE: Doesn't look right for linewidth > 2
  lcurveContext.moveTo(graphLeftBorder, graphTopBorder - 15);
  lcurveContext.lineTo(graphLeftBorder - 5, graphTopBorder - 8);
  lcurveContext.moveTo(graphLeftBorder, graphTopBorder - 15);
  lcurveContext.lineTo(graphLeftBorder + 5, graphTopBorder - 8);

  lcurveContext.strokeStyle = axisColor;
  lcurveContext.lineWidth = axisWidth;
  lcurveContext.stroke();
}

function drawAxisLabels(centerLayout=false) {
  // x label
  lcurveContext.font = axisLabelFont;
  lcurveContext.textAlign = axisLabelAlign;
  lcurveContext.textBaseline = axisLabelBaseline;
  lcurveContext.fillStyle = axisLabelColor;

  if (centerLayout) {
    // x label
    lcurveContext.fillText(xLabel, centerX, graphBottomTrailingBorder + axisLabelSpacing)

    // y label
    lcurveContext.save();
    lcurveContext.translate(graphLeftTrailingBorder - 25, centerY);
    lcurveContext.rotate(-Math.PI/2);
    lcurveContext.textAlign = "center";
    lcurveContext.fillText(yLabel, 0, 0);
    lcurveContext.restore();
  }
  else {
    // x label
    lcurveContext.textAlign = "left";
    lcurveContext.fillText(xLabel, graphRightTrailingBorder + 20, graphBottomBorder);

    // y label
    lcurveContext.textBaseline = "bottom";
    lcurveContext.textAlign = "center";
    lcurveContext.fillText(yLabel, graphLeftBorder, graphTopTrailingBorder - 20);
  }
}

function updatePlotScaleAndRange(width, height, xInit, yInit) {
  // Change range/scale of plot

  //  console.log("updatePlotScale: " + width + " " + height + " "
  //                                  + xInit + " " + yInit);
  // plot scale
  if (width !== undefined)
    dayWidth = width;
  if (height !== undefined)
    magnifHeight = height;
  xPixelScale = graphWidth/dayWidth; // pixels per day
  yPixelScale = graphHeight/magnifHeight; // pixels per magnif unit
  if (xInit !== undefined)
    xAxisInitialDay = xInit;
  if (yInit !== undefined)
    yAxisInitialMagnif = yInit;
  xAxisFinalDay = xAxisInitialDay + dayWidth;
  yAxisFinalMagnif = yAxisInitialMagnif + magnifHeight;

  updateGridRange();

  /*

  */
}

function initPlot() {
  clearGraph();
  // updatePlotScaleAndRange(undefined, undefined, undefined,
  //                         undefined, undefined, 1.5);
  console.log("tE: " + tE);
  console.log("dayWidth: " + dayWidth);
  // fill in canvas background
  lcurveContext.fillStyle = canvasBackgroundColor;
  lcurveContext.fillRect(0, 0, lcurveCanvas.width, lcurveCanvas.height);

  // fill in graph background
  lcurveContext.fillStyle = graphBackgroundColor;
  lcurveContext.fillRect(graphLeftBorder, graphTopBorder, graphWidth, graphHeight);

  // draw vertical lines and x axis tick labels
  lcurveContext.beginPath();
  for (var xPlotDay = xGridInitial; xPlotDay <= xGridFinal; xPlotDay+=xGridStep) {
    var xPlotPixel = xDayToPixel(xPlotDay);
    lcurveContext.moveTo(xPlotPixel, graphTopTrailingBorder);
    lcurveContext.lineTo(xPlotPixel, graphBottomTrailingBorder);

    // tick text label
    var xTickLabel = xPlotDay;
    lcurveContext.font = tickLabelFont;
    lcurveContext.fillStyle = tickLabelColor;
    lcurveContext.textAlign = tickLabelAlign;
    lcurveContext.textBaseline = tickLabelBaseline;
    lcurveContext.fillText(xTickLabel, xPlotPixel, graphBottomTrailingBorder + tickLabelSpacing);
  }

  //draw horizontal lines and y axis tick label
  for (var yPlotMagnif = yGridInitial; yPlotMagnif <= yGridFinal; yPlotMagnif+=yGridStep) {
    var yPlotPixel = yMagnifToPixel(yPlotMagnif);
    lcurveContext.moveTo(graphLeftTrailingBorder, yPlotPixel);
    lcurveContext.lineTo(graphRightTrailingBorder, yPlotPixel);

    var yTickLabel = yPlotMagnif;
    lcurveContext.font = tickLabelFont;
    lcurveContext.fillStyle = tickLabelColor;
    lcurveContext.textAlign = "right";
    lcurveContext.textBaseline = tickLabelBaseline;
    lcurveContext.fillText(yTickLabel,graphLeftTrailingBorder - tickLabelSpacing,  yPlotPixel);
  }
  lcurveContext.lineWidth = gridWidth;
  lcurveContext.strokeStyle = gridColor;
  lcurveContext.stroke();

  // draw border
  lcurveContext.strokeStyle = graphBorderColor;
  lcurveContext.lineWidth = graphBorderWidth;
  lcurveContext.strokeRect(graphLeftBorder, graphTopBorder, graphWidth, graphHeight);

  drawAxes();
  drawAxisLabels(centerLayout=false);
}

function plotLightcurve(inputData, fromEquation=fromEquationDefault) {
  // console.log("fromEquation: " + fromEquation);
  // console.log("inputData: " + inputData);
  initPlot();
  // var initialTday, initialMagnif, indexMax, indexIncrement;
  var tDay, magnif;
  if (fromEquation) {
    tDay = xAxisInitialDay;
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

  lcurveContext.save();
    // set up clipping region as graph region, so that curve does not
    // extend beyond graph region
    lcurveContext.beginPath();
    lcurveContext.rect(graphLeftBorder, graphTopBorder, graphWidth, graphHeight);
    lcurveContext.clip();

    // prepare to draw curve and move to initial pixel coordinate
    var tPixel = xDayToPixel(tDay);
    var magnifPixel = yMagnifToPixel(magnif);
    lcurveContext.beginPath();
    lcurveContext.moveTo(tPixel, magnifPixel);

    // Iterate over remaining days and draw lines from each pixel coordinate
    // to the next
    if (!fromEquation) // Index tracks place in data arrays if reading in data
      var index = 0; //
    while (tDay < xAxisFinalDay) {
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
      lcurveContext.lineTo(tPixel, magnifPixel);
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
    lcurveContext.lineJoin = "round";
    lcurveContext.lineWidth = curveWidth;
    lcurveContext.strokeStyle = curveColor;
    lcurveContext.stroke();
  lcurveContext.restore();
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
