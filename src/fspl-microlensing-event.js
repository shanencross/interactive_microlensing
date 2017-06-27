/** Event module.
  * Handles calculation and drawing lightcurve plot for the microlensing.
  * event.
  *
  * Depicts magnification vs. time curve for microlensing event.
  *
  * Also listens for events from related UI buttons/sliders.
  *
  * @module fspl-microlensing-event
  */

console.log("Executing fspl-microlensing-event.js");

var handleError = require("./utils.js").handleError;

// whether module init function has been executed
var initialized = false;

var canvas = document.getElementById("lcurveCanvas");
var context = canvas.getContext("2d");

// left border of graph x-pixel value, NOT including any trailing gridlines
var graphLeftBorder = 50;
 // top border of graph y-pixel value, NOT including any trailing gridlines
var graphTopBorder = 50;

var graphWidth = 400;
var graphHeight = 300;

// "trail" lengths for gridlines extending beyond graph border
var graphLeftTrail = 10;
var graphRightTrail = 0;
var graphTopTrail = 0;
var graphBottomTrail = 10;

// right border of graph x-pixel value, NOT including any trailing gridlines
var graphRightBorder = graphLeftBorder + graphWidth;
// bottom border of y-pixel value, NOT including any trailing gridlines
var graphBottomBorder = graphTopBorder + graphHeight;

// left border of graph x-pixel value, INCLUDING any trailing gridlines
var graphLeftTrailingBorder = graphLeftBorder - graphLeftTrail;
// right border of graph x-pixel value, INCLUDING any trailing gridlines
var graphRightTrailingBorder = graphRightBorder + graphRightTrail;
// top border of graph y-pixel value, INCLUDING any trailing gridlines
var graphTopTrailingBorder = graphTopBorder - graphTopTrail;
// bottom border of graph y-pixel value, INCLUDING any trailing gridlines
var graphBottomTrailingBorder = graphBottomBorder + graphBottomTrail;

var centerX = graphWidth/2 + graphLeftBorder;
var centerY = graphHeight/2 + graphTopBorder;

// Physical constants

// m3 kg−1 s−2 (astropy value); const
var G = 6.67384e-11;
 // m s-1 (astropy value); const
var c = 299792458.0;

// conversion constants

// rad/mas; const
var masToRad = 4.84813681109536e-9;

// Dl slider/value is kept one "step" below Ds; determines size of that step

// kpc; const
var sourceLensMinSeparation = 0.01;

// base quantities set by user

// solMass
var Ml;
// kpc: Ds =  Dl / (1 - 1/mu)
var Ds;
// milliarcseconds (mas)
var thetaY;
// kpc: Dl = Ds * (1 - 1/mu)
var Dl;
// days
var t0;
// mas/yr:
// ```
// mu = thetaE / tE; mu = Ds / (Ds - Dl) = 1/(1 - Dl/Ds)
// ```
var mu;

// derived quantities

// unitless
var u0;
// days
var tE;
// kpc
var Drel;
// radians (or should we use milliarcsecond?)
var thetaE;

// lightcurve information
var lightcurveData = null;

// tracks whether u0 is to be held fixed while other quantities vary
var fixU0;

// plot scale
var dayWidth;
var magnifHeight;
// pixels per day
var xPixelScale;
// pixels per magnif unit
var yPixelScale;

// plot range
var xAxisInitialDay;
var yAxisInitialMagnif;
var xAxisFinalDay;
var yAxisFinalMagnif;

// arbitrarily chosen value; const
var dayWidthDefault = 32;
// const
var magnifHeightDefault = 10;
// arbitrarily chosen value; const
var xAxisInitialDayDefault = -16;
// const
var yAxisInitialMagnifDefault = 0.5;

// gridlines
var xGridInitial;
var yGridInitial;
var xGridFinal;
var yGridFinal;
var xGridStep;
var yGridStep;

// arbitrarily chosen value; const
var xGridStepDefault = 2;
// const
var yGridStepDefault = 1;

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
var dashedCurveColor = "green";
var dashedCurveWidth = 2;
var dashedCurveLength = 8;
var dashedCurveSpacing = 10;
var graphBorderColor = "grey";
var graphBorderWidth = 1;
var axisColor = "black";
var axisWidth = 2;

// tick label text aesthetics
var tickLabelFont = "10pt Arial";
var tickLabelColor = "black";
var tickLabelAlign = "center";
var tickLabelBaseline = "middle";
// spacing between tick label and end of trailing gridline
var tickLabelSpacing = 7;

// axis label text aesthetics
var xLabel = "time (days)";
var yLabel = "magnification";
var axisLabelFont = "10pt Arial";
var axisLabelColor = "black";
var axisLabelAlign = "center";
var axisLabelBaseline = "middle";
var axisLabelSpacing = 27;

// time increment for drawing curve
var dt = 0.01;

// parameter sliders and their readouts
var tEslider = document.getElementById("tEslider");
var tEreadout = document.getElementById("tEreadout");

var thetaEreadout = document.getElementById("thetaEreadout");

var u0slider = document.getElementById("u0slider");
var u0readout = document.getElementById("u0readout");

var MlSlider = document.getElementById("MlSlider");
var MlReadout = document.getElementById("MlReadout");

var DsSlider = document.getElementById("DsSlider");
var DsReadout = document.getElementById("DsReadout");

var thetaYslider = document.getElementById("thetaYslider");
var thetaYreadout = document.getElementById("thetaYreadout");

var DlSlider = document.getElementById("DlSlider");
var DlReadout = document.getElementById("DlReadout");

var t0slider = document.getElementById("t0slider");
var t0readout = document.getElementById("t0readout");

var muSlider = document.getElementById("muSlider");
var muReadout = document.getElementById("muReadout");

var resetParamsButton = document.getElementById("resetParams");
var fixU0checkbox = document.getElementById("fixU0checkbox");

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

var finiteSourceCheckbox = document.getElementById("finiteSourceCheckbox");

// const
var centerLayout = false;
if (typeof finiteSourceCheckbox !== "undefined" &&
    finiteSourceCheckbox !== null)
  var finiteSourceFlag = finiteSourceCheckbox.checked;

// controls whether plot updates when slider is moved
// or when slider is released
var updateOnSliderMovementFlag = true;
var updateOnSliderReleaseFlag = false;

/** init */
function init() {
  initParams();
  initListeners();
  updateGridRange(xGridStepDefault, yGridStepDefault); // initialize gridline vars
  // initialize plot scale/range vars
  updatePlotScaleAndRange(dayWidthDefault, magnifHeightDefault,
                          xAxisInitialDayDefault, yAxisInitialMagnifDefault);
  updateCurveData();

  plotLightcurve();
  console.log(`tE: ${tE}`);
  console.log(`thetaE: ${thetaE}`);
  console.log(`Drel: ${Drel}`);
  console.log(`mu: ${mu}`);

  initialized = true;
}

/** initListeners */
function initListeners(updateOnSliderMovement=updateOnSliderMovementFlag,
                       updateOnSliderRelease=updateOnSliderReleaseFlag) {

  // update plot when slider is moved
  if (updateOnSliderMovement == true) {
    tEslider.addEventListener("input", function() { updateParam("tE"); }, false);
    u0slider.addEventListener("input", function() { updateParam("u0"); }, false);
    MlSlider.addEventListener("input", function() { updateParam("Ml"); }, false);
    DsSlider.addEventListener("input", function() { updateParam("Ds"); }, false);
    thetaYslider.addEventListener("input", function() { updateParam("thetaY"); }, false);
    DlSlider.addEventListener("input", function() { updateParam("Dl"); }, false);
    t0slider.addEventListener("input", function() { updateParam("t0"); }, false);
    muSlider.addEventListener("input", function() { updateParam("mu"); }, false);
  }

  // update plot when slider is released
  if (updateOnSliderRelease === true) {
    tEslider.addEventListener("change", function() { updateParam("tE"); }, false);
    u0slider.addEventListener("change", function() { updateParam("u0"); }, false);
    MlSlider.addEventListener("change", function() { updateParam("Ml"); }, false);
    DsSlider.addEventListener("change", function() { updateParam("Ds"); }, false);
    thetaYslider.addEventListener("change", function() { updateParam("thetaY"); }, false);
    DlSlider.addEventListener("change", function() { updateParam("Dl"); }, false);
    t0slider.addEventListener("change", function() { updateParam("t0"); }, false);
    muSlider.addEventListener("change", function() { updateParam("mu"); }, false);

    // if plot updates only upon slider release,
    // update slider readout alone while slider is being moved,
    // without recalculating/updating other sliders (until after current slider is released)
    if (updateOnSliderMovement === false) {
      tEslider.addEventListener("input", function() { updateSliderReadout(tEslider, tEreadout, "tE"); }, false);
      u0slider.addEventListener("input", function() { updateSliderReadout(u0slider, u0readout, "u0"); }, false);
      MlSlider.addEventListener("input", function() { updateSliderReadout(MlSlider, MlReadout, "Ml"); }, false);
      DsSlider.addEventListener("input", function() { updateSliderReadout(DsSlider, DsReadout, "Ds"); }, false);
      thetaYslider.addEventListener("input", function() { updateSliderReadout(thetaYslider, thetaYreadout, "thetaY"); }, false);
      DlSlider.addEventListener("input", function() { updateSliderReadout(DlSlider, DlReadout, "Dl"); }, false);
      t0slider.addEventListener("input", function() { updateSliderReadout(t0slider, t0readout, "t0"); }, false);
      muSlider.addEventListener("input", function() { updateSliderReadout(muSlider, muReadout, "mu"); }, false);
    }
  }

  // reset buttons
  resetParamsButton.addEventListener("click", resetParams, false);

  // checkbox to hold u0 value fixed while varying other quantities besides thetaY
  fixU0checkbox.addEventListener("change", function() { fixU0 = fixU0checkbox.checked;
                                                        console.log(`fixU0: ${fixU0}`); }, false);
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
  if (typeof finiteSourceCheckbox !== "undefined" &&
     finiteSourceCheckbox !== null)
    finiteSourceCheckbox.addEventListener("change", toggleFiniteSource, false);
  else
    finiteSourceFlag = false;

   // in case HTML slider values differ from actual starting values
  updateSliders();
}

/** initParams */
function initParams() {
  // set lense curve parameters to defaults

  // set base quantity defaults

  fixU0 = fixU0checkbox.checked
  // solMass
  Ml = 0.1
  // kpc: Ds =  Dl / (1 - 1/mu)
  Ds = 8.0;
  // milliarcseconds (mas)
  thetaY = -0.05463809952990817329;
  // kpc:
  // ```
  // Dl = Ds * (1 - 1/mu)
  // ```
  Dl = 4.75;
  // days
  t0 = 0;
  // mas/yr (milliarcseconds/year):
  // ```
  // mu = thetaE/tE
  // ```
  mu = 7;

  // set derived quantities
  updateDerivedQuantities(initializing=true);
}

/** updateDerivedQuantities */
function updateDerivedQuantities(initializing=false) {
  updateDrel();
  updateThetaE();
  if (fixU0 === false || initializing === true)
    updateU0();
  else
    updateThetaY();

  updateTE();
}

/** updateU0 */
function updateU0() {
  // convert from mas to radians
  var thetaY_rad = thetaY * masToRad;
  // unitless ("units" of thetaE)
  u0 = thetaY_rad / thetaE;
}

/** updateThetaY */
function updateThetaY() {
  // convert from radians to mas
  var thetaE_mas = thetaE / masToRad ;
  // mas
  thetaY = u0 * thetaE_mas;
}

/** updateDrel */
function updateDrel() {
  // kpc
  Drel = 1/((1/Dl) - (1/Ds));
}

/** updateThetaE */
function updateThetaE() {
  thetaE = calculateThetaE();
}

/** calculateThetaE */
function calculateThetaE(get_mas=false) {
  /*
  G: m3 kg−1 s−2 (astropy value)
  c: 299792458.0; // m s-1 (astropy value)
  Ml: solMass
  Drel: kpc

  solMass -> kg: 1.9891e+30 kg/solMass
  kpc -> m: 3.0856775814671917e+19 m/kpc

  kg -> solMass: 5.02739932632849e-31
  m -> kpc: 3.240779289469756e-20 kpc/m
  */

  // kg/solMass; const
  var solMassToKg = 1.9891e30;
  // m/kpc; const
  var kpcToM = 3.0856775814671917e19;

  // Ml converted for equation to kg
  var eqMl = Ml * solMassToKg;
  // Drel converted for equation to m
  var eqDrel = Drel * kpcToM;

  // G is m^3 /(kg * s^2)

  // c is m/s
  var thetaEresult = Math.sqrt(4 * G * eqMl/(c*c*eqDrel)); // radians (i.e. unitless)

  if (get_mas === true)
    thetaEresult = thetaEresult / masToRad;

  return thetaEresult;
}

/** updateTE */
function updateTE() {
  var yearToDay = 365.25; // day/year; const

  // mu converted for equation to rad/yr
  var eqMu = mu * masToRad / yearToDay

  // thetaE is in radians

  // days
  tE = thetaE/eqMu;
}

/** updateSliderReadout */
function updateSliderReadout(slider, readout, sliderName="") {
  // Update individual slider readout to match slider value

  // Default value for tE, u0, thetaY
  var fixedDecimalPlace = 3;

  if (sliderName === "Ml")
    fixedDecimalPlace = 6;

  else if (sliderName === "Ds" || sliderName === "Dl" ||
           sliderName === "mu")
    fixedDecimalPlace = 2;

  else if (sliderName === "t0") {
    fixedDecimalPlace = 1;
  }
  else if (sliderName === "sourceRadius") {
    fixedDecimalePlace = 4;
  }
  readout.innerHTML = Number(slider.value).toFixed(fixedDecimalPlace);
}

/** updateSliders */
function updateSliders() {
  // maximum parameter values that can be displayed;

  // need to match up with max value on HTML sliders

  // days
  var tEmax = 365;
  // unitless (einstein radii)
  var u0max = 2;
  // solMass
  var MlMax = 15;
  // kpc
  var DsMax = 8.5
  // mas
  var thetaYmax = 2;
  // kpc
  var DlMax = 8.5
  // days
  var t0max = 75
  // milliarcseconds/year
  var muMax = 10

  // update slider values and readouts to reflect current variable values
  tEslider.value = tE;
  // tEreadout.innerHTML = Number(tEslider.value).toFixed(3);
  updateSliderReadout(tEslider, tEreadout, "tE");
  // add "+" once after exceeding maximum slider value;

  // NOTE: Very hacky. Improve this
  if (tE > tEmax) {
    tEreadout.innerHTML += "+";
  }

  u0slider.value = u0;
  updateSliderReadout(u0slider, u0readout, "u0");
  if (u0 > u0max) {
    u0readout.innerHTML += "+";
  }

  MlSlider.value = Ml;
  updateSliderReadout(MlSlider, MlReadout, "Ml");
  if (Ml > MlMax) {
    MlReadout.innerHTML += "+";
  }

  DsSlider.value = Ds;
  updateSliderReadout(DsSlider, DsReadout, "Ds");
  if (Ds > DsMax) {
    DsReadout.innerHTML += "+";
  }

  thetaYslider.value = thetaY;
  updateSliderReadout(thetaYslider, thetaYreadout, "thetaY");
  if (thetaY > thetaYmax) {
    thetaYreadout.innerHTML += "+";
  }

  DlSlider.value = Dl;
  updateSliderReadout(DlSlider, DlReadout, "Dl");
  if (Dl > DlMax) {
    DlReadout.innerHTML += "+";
  }

  t0slider.value = t0;
  updateSliderReadout(t0slider, t0readout, "t0");
  if (t0 > t0max) {
    t0Readout.innerHTML += "+";
  }

  muSlider.value = mu;
  updateSliderReadout(muSlider, muReadout, "mu");
  if (mu > muMax) {
    muReadout.innerHTML += "+";
  }

  // update thetaE readout (no slider)
  if (thetaEreadout !== null) {
    var thetaE_mas = thetaE / masToRad;
    console.log(`thetaE (mas): ${thetaE_mas}`);
    thetaEreadout.innerHTML = Number(thetaE_mas).toFixed(4);
  }
}

/** resetParams */
function resetParams(isFiniteSource = finiteSourceFlag) {
  // reset lense curve parameters to defaults and redraw curve
  initParams();
  updateSliders();

  try {
    var lensPlaneModule = require("./fspl-microlensing-event-lens-plane.js");
  }
  catch(ex) {
    handleError(ex);
  }

  if (typeof lensPlaneModule !== "undefined" && lensPlaneModule.initialized === true) {
    lensPlaneModule.initSourceRadius();
  }

  if (isFiniteSource === true)
    updateCurveData();
  redrawCanvases();
}

/** updateParam */
function updateParam(param) {
  if (param === "Ml") {
    Ml = Number(MlSlider.value);
    // tE depends on thetaE which depends on Ml
  }
  else if (param === "Ds") {
    // source must be farther than lens
    if (Number(DsSlider.value) > Dl) {
      Ds = Number(DsSlider.value);
    }
    // If Ds slider is less than or equal to Dl, we should set Ds to one step above Dl
    else {
      Ds = Dl + sourceLensMinSeparation;
    }
    // tE depends on thetaE depends on Drel depends on Ds
  }
  else if (param === "thetaY" && fixU0 === false) {
    thetaY = Number(thetaYslider.value);
  }
  else if (param === "Dl") {
     // lens must be closer than source
    if (Number(DlSlider.value) < Ds) {
      Dl = Number(DlSlider.value);
    }
    // If Dl slider is less than or equal to Dl, we should set Dl to one step below Ds
    else {
      Dl = Ds - sourceLensMinSeparation;
    }
    // TE depends on thetaE depends on Drel depends on Dl
  }
  else if (param === "t0") {
    t0 = Number(t0slider.value);
  }
  else if (param === "mu") {
    mu = Number(muSlider.value);
    // tE depends on mu
  }
  else if (param === "tE") {
    console.log("Can't change tE yet (since it's a derived quantity)");
    var oldTE = tE;
    tE = Number(tEslider.value);

    // NOTE: Pretty hacky way of doing this

    // modify Ml accordingly of tE is changed, where
    // Ml is propotional to tE^2
    Ml *= (tE/oldTE)*(tE/oldTE);
  }
  else if (param === "u0") {
    u0 = Number(u0slider.value);
    // thetaY in radians
    var thetaY_rad = u0 * thetaE;
    // converted to milliarcseconds (mas)
    thetaY = thetaY_rad / masToRad;
  }

  // updates Drel, then thetaE, then tE, each of which depends on the last,
  // and collectively depends on some of these base quantities

  // not necessary for every option, but probably cleaner code this way
  updateDerivedQuantities();
  updateSliders();
  updateCurveData();
  redrawCanvases();
}

/** redrawCanvases */
function redrawCanvases() {
  try {
    var lensPlaneModule = require("./fspl-microlensing-event-lens-plane.js");
  }
  catch(ex) {
    handleError(ex);
  }

  if (typeof lensPlaneModule !== "undefined" && lensPlaneModule.initialized === true) {
    lensPlaneModule.redraw();
  }

  try {
    var animationModule = require("./fspl-microlensing-event-animation.js");
  }
  catch(ex) {
    handleError(ex);
  }

  if (typeof animationModule !== "undefined" && animationModule.initialized === true) {
    plotLightcurve(animationModule.time);
    //redraw current animation frame
    animationModule.animateFrame();
  }
  else {
    plotLightcurve();
  }
}

/** updateGraph */
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

  updatePlotScaleAndRange(xWidth, yHeight, xInit, yInit);
  updateCurveData();
  plotLightcurve();
}

/** updateGridRange */
function updateGridRange(xStep, yStep) {
  // update grid with new step values,
  // and/or update grid for new initial/final axis values using

  // if new step values are passed in, update grid step values;

  // otherwise leave grid steps unchanged when updating grid
  if ( xStep !== undefined && yStep !== undefined) {
    xGridStep = xStep;
    yGridStep = yStep;
  }

  // update grid using current x/y axis initial and final values

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
}

/** clearGraph */
function clearGraph() {
  context.clearRect(graphLeftBorder, graphTopBorder, graphWidth, graphHeight);
}

/** xDayToPixel */
function xDayToPixel(xPlotDay) {
  var xPlotPixel = (xPlotDay - xAxisInitialDay) * xPixelScale + graphLeftBorder;
  return xPlotPixel;
}

/** yMagnifToPixel */
function yMagnifToPixel(yPlotMagnif) {
  var yPlotPixel = graphBottomBorder - (yPlotMagnif - yAxisInitialMagnif) * yPixelScale;
  return yPlotPixel;
}

/** drawAxes */
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

/** drawAxisLabels */
function drawAxisLabels() {
  // x label
  context.font = axisLabelFont;
  context.textAlign = axisLabelAlign;
  context.textBaseline = axisLabelBaseline;
  context.fillStyle = axisLabelColor;

  if (centerLayout === true) {
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
}

/** updatePlotScaleAndRange */
function updatePlotScaleAndRange(width, height, xInit, yInit) {
  // Change range/scale of plot

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
}

/** initPlot */
function initPlot() {
  clearGraph();

  // fill in canvas background
  context.fillStyle = canvasBackgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // fill in graph background
  context.fillStyle = graphBackgroundColor;
  context.fillRect(graphLeftBorder, graphTopBorder, graphWidth, graphHeight);

  // draw vertical lines and x axis tick labels
  context.beginPath();
  for (var xPlotDay = xGridInitial; xPlotDay <= xGridFinal; xPlotDay+=xGridStep) {
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
  for (var yPlotMagnif = yGridInitial; yPlotMagnif <= yGridFinal; yPlotMagnif+=yGridStep) {
    var yPlotPixel = yMagnifToPixel(yPlotMagnif);
    context.moveTo(graphLeftTrailingBorder, yPlotPixel);
    context.lineTo(graphRightTrailingBorder, yPlotPixel);

    var yTickLabel = yPlotMagnif;
    context.font = tickLabelFont;
    context.fillStyle = tickLabelColor;
    context.textAlign = "right";
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
}

/** plotLightcurve */
function plotLightcurve(tDayFinal=xAxisFinalDay, inputData) {
  // Draw plot background, as well as both complete (dashed) lightcurve and
  // partial (solid) lightcurve up to a given time
  // draw plot with gridlines, etc. (no axes or axis labels yet).
  initPlot();
  // draw complete lightcurve across entire time axis as dashed line
  plotLightcurveAlone(xAxisFinalDay, inputData, dashedCurve=true);
  // draw lightcurve up to the time argument as solid line
  plotLightcurveAlone(tDayFinal, inputData, dashedCurve=false);
  // draw axes and their labels;
  // goes last because axes are IN FRONT of lightcurve
  drawAxes();
  drawAxisLabels();
}

/** plotLightcurveAlone */
function plotLightcurveAlone(tDayFinal=xAxisFinalDay, inputData, dashedCurve=false) {
  // draw a single lightcurve (dashed or solid) up to a given time

  var tDay, magnif;
  if (inputData !== undefined) {
    curveData = inputData;
  }
  // no input parameter given
  else {
    // module lightcurve variable already initialized
    if (lightcurveData !== null) {
      // use module variable in function
      curveData = lightcurveData;
    }
    // module lightcurve variable not initialized yet
    else {
      // initialize module variable
      updateCurveData();
      curveData = lightcurveData; // use newly initialized module variable in function
    }
  }
  var times = curveData.times;
  var magnifs = curveData.magnifs;
  tDay = times[0];
  magnif = magnifs[0];

  context.save();
    // set up clipping region as graph region, so that curve does not
    // extend beyond graph region
    context.beginPath();
    context.rect(graphLeftBorder, graphTopBorder, graphWidth, graphHeight);
    context.clip();

    if (dashedCurve === true)
      // turn on dashed lines
      context.setLineDash([dashedCurveLength, dashedCurveSpacing]);

    // prepare to draw curve and move to initial pixel coordinate
    var tPixel = xDayToPixel(tDay);
    var magnifPixel = yMagnifToPixel(magnif);
    context.beginPath();
    context.moveTo(tPixel, magnifPixel);

    // Iterate over remaining days and draw lines from each pixel coordinate
    // to the next

    // Index tracks place in data arrays if reading in data
    var index = 0;
    while (tDay < tDayFinal) {
      // proceed to the next elements for the day and magnification arrays
      index += 1;
      tDay = times[index];
      magnif = magnifs[index];

      var tPixel = xDayToPixel(tDay);
      var magnifPixel = yMagnifToPixel(magnif);
      context.lineTo(tPixel, magnifPixel);
    }

    if (dashedCurve === true) {
      context.strokeStyle = dashedCurveColor;
      context.lineWidth = dashedCurveWidth;
    }
    else {
      context.lineJoin = "round";
      context.lineWidth = curveWidth;
      context.strokeStyle = curveColor;
    }
    context.stroke();

    if (dashedCurve === true)
      context.setLineDash([]); // turn off dashed lines
  context.restore();
}

/** getThetaX */
function getThetaX(t) {
  // day/year; const
  var yearToDay = 365.25;
  // convert mu to milliarcseconds/day
  var eqMu = mu / yearToDay;
  var thetaX = eqMu * (t - t0);
  return thetaX;
}

/** updateCurveData */
function updateCurveData(isFiniteSource = finiteSourceFlag) {
  var times = [];
  var magnifs = [];

  var finiteSourceModule;
  if (isFiniteSource) {
    try {
      finiteSourceModule = require("./fspl-microlensing-event-finite-source.js");
    }
    catch(ex) {
      handleError(ex);
    }
  }

  for (var tDay = xAxisInitialDay; tDay <= xAxisFinalDay; tDay += dt) {
    var magnif = getMagnif(tDay, isFiniteSource, finiteSourceModule);
    // if (tDay === 0)
    //   console.log("magnif: " + magnif);
    times.push(tDay);
    magnifs.push(magnif);
  }
  var curveData = {
    times:times,
    magnifs:magnifs
  };

  lightcurveData = curveData;

  var autoScaleMagnifHeight = false;

  if (autoScaleMagnifHeight === true) {
    var maxMagnif = math.max(curveData.magnifs);
    updatePlotScaleAndRange(undefined, maxMagnif+1, undefined, 0.5);
  }

  lightcurveData = curveData;
}

/** toggleFiniteSource */
function toggleFiniteSource() {
  finiteSourceFlag = finiteSourceCheckbox.checked;
  updateCurveData();
  redrawCanvases();
}

// functions to calculate magnification from parameters for a given time
/** getTimeTerm */
function getTimeTerm(t) {
  var timeTerm = (t - t0)/tE; // unitless
  return timeTerm;
}

/** getU */
function getU(timeTerm) {
  var u = Math.sqrt(u0*u0 + timeTerm*timeTerm); // unitless
  return u;
}

/** getMagnifFromU */
function getMagnifFromU(u, isFiniteSource = finiteSourceFlag, finiteSourceModule) {
  var magnifNumerator = u*u + 2;
  var magnifDenominator = u * Math.sqrt(u * u + 4);
  // unitless
  magnif = magnifNumerator / magnifDenominator;
  if (isFiniteSource && typeof finiteSourceModule !== "undefined" &&
     finiteSourceModule !== null) {
    magnif *= finiteSourceModule.getFiniteSourceFactor(u);
  }

  return magnif;
}

/** getMagnif */
function getMagnif(t, isFiniteSource=finiteSourceFlag, finiteSourceModule) {
    // unitless
  var timeTerm = getTimeTerm(t);
  // unitless
  var u = getU(timeTerm);
  // unitless
  var magnif = getMagnifFromU(u, isFiniteSource, finiteSourceModule);

  return magnif;
}

// public properties to be stored in module object,
// accessible via module object by code executed after this script
module.exports = {
  // initialization

  // initialization function
  init: init,
  // whether initialization is done
  get initialized() { return initialized; },

  // getters for variables we want to share

  // base modeling parameters
  get Ml() { return Ml; },
  // kpc
  get Ds() { return Ds; },
  // milliarcseconds (mas)
  get thetaY() { return thetaY; },
  // kpc
  get Dl() { return Dl; },
  // days
  get t0() { return t0; },
  // mas/yr
  get mu() { return mu; },

  // derived modeling parameters

  // debug: find out units for Drel
  get Drel() { return Drel; },
  // radians
  get thetaE() { return thetaE; },
  // milliarcseconds (mas)
  get thetaE_mas() { return thetaE / masToRad; },
  // days
  get tE() { return tE; },
  // unitless (units of thetaE)
  get u0() { return u0; },

  get finiteSourceFlag() { return finiteSourceFlag; }, // whether finite or point source is being used

  // controls if plot updates when slider is moved and/or released
  get updateOnSliderMovementFlag() { return updateOnSliderMovementFlag; },
  get updateOnSliderReleaseFlag() { return updateOnSliderReleaseFlag; },

  // used for animation

  // time step used for drawing curve (days)
  get dt() { return dt; },
  get xAxisInitialDay() { return xAxisInitialDay; },
  get xAxisFinalDay() { return xAxisFinalDay; },
  plotLightcurve: plotLightcurve,

  // redrawing both canvases
  redrawCanvases: redrawCanvases,

  // for calculating thetaE for individual lens masses, in addition to the
  // thetaE of the summed lens masses
  calculateThetaE: calculateThetaE,

  get imageParities() {
    if (lightcurveData !== null && lightcurveData !== undefined)
      return lightcurveData.imageParities;
  },

  // normalized (over thetaE) positions of the (five or three) lensed images
  get imagesNormalizedPos() {
    if (lightcurveData !== null && lightcurveData !== undefined)
      return lightcurveData.imagesNormalizedPos;
  },

  // get caustic and critical curve data points,
  // normalized in units of (binary) thetaE
  get causticNormalized() {
    if (lightcurveData !== null && lightcurveData !== undefined)
      return lightcurveData.causticNormalized;
  },

  get critNormalized() {
    if (lightcurveData !== null && lightcurveData !== undefined)
      return lightcurveData.critNormalized;
  },

  get times() {
    if (lightcurveData !== null && lightcurveData !== undefined)
      return lightcurveData.times;
  },

  // for debugging
  getU: getU,
  getTimeTerm: getTimeTerm,
  getMagnif: getMagnif,
  updateCurveData: updateCurveData,
  getThetaX: getThetaX,

  // for updating slider readout
  updateSliderReadout: updateSliderReadout,
};
