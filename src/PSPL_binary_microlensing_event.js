/** Event module.
  * Handles calculation and drawing lightcurve plot for the microlensing.
  * event.
  *
  * Depicts magnification vs. time curve for microlensing event.
  *
  * Also listens for events from related UI buttons/sliders.
  *
  * @module PSPL_binary_microlensing_event_animation
  */

console.log("Executing PSPL_binary_microlensing_event.js");

// used in resetParams()
// var lensPlaneModule = require("./PSPL_binary_microlensing_event_lens_plane.js");

// used in updateParam()
// var animationModule = require("./PSPL_binary_microlensing_event_animation.js")

var errorHandler = require("./errorHandler.js");
// used in updateCurveData
var bin_len_faster = require("./bin_len_faster.js");

var initialized = false; // whether module init function has been executed

var canvas = document.getElementById("lcurveCanvas");
var context = canvas.getContext("2d");

var graphLeftBorder = 50; // left border of graph x-pixel value, NOT including any trailing gridlines
var graphTopBorder = 50; // top border of graph y-pixel value, NOT including any trailing gridlines

var graphWidth = 400;
var graphHeight = 300;

// "trail" lengths for gridlines extending beyond graph border
var graphLeftTrail = 10;
var graphRightTrail = 0;
var graphTopTrail = 0;
var graphBottomTrail = 10;

var graphRightBorder = graphLeftBorder + graphWidth; // right border of graph x-pixel value, NOT including any trailing gridlines
var graphBottomBorder = graphTopBorder + graphHeight; // bottom border of y-pixel value, NOT including any trailing gridlines

var graphLeftTrailingBorder = graphLeftBorder - graphLeftTrail; // left border of graph x-pixel value, INCLUDING any trailing gridlines
var graphRightTrailingBorder = graphRightBorder + graphRightTrail; // right border of graph x-pixel value, INCLUDING any trailing gridlines
var graphTopTrailingBorder = graphTopBorder - graphTopTrail; // top border of graph y-pixel value, INCLUDING any trailing gridlines
var graphBottomTrailingBorder = graphBottomBorder + graphBottomTrail; // bottom border of graph y-pixel value, INCLUDING any trailing gridlines

// var graphRightBorder = canvas.width - 50; // right border of graph x-pixel value, NOT including any trailing gridlines
// var graphBottomBorder = canvas.height - 50; // bottom border of graph y-pixel value
// var graphWidth = graphRightBorder - graphLeftBorder;
// var graphHeight = graphBottomBorder - graphTopBorder;

var centerX = graphWidth/2 + graphLeftBorder;
var centerY = graphHeight/2 + graphTopBorder;

// slider parameters; only tE, t0, and thetaY work/have reasonable ranges/values
// NOTE: There are/should be corellations between several of these for instance tE depends
// on the rest, and mu depends on Ds and Dl;
// need to figure that out so that updating one changes the related ones

// Physical constants
var G = 6.67384e-11; // m3 kg−1 s−2 (astropy value); const
var c = 299792458.0; // m s-1 (astropy value); const

// conversion constants
var masToRad = 4.84813681109536e-9; // rad/mas; const

// Dl slider/value is kept one "step" below Ds; determines size of that step
var sourceLensMinSeparation = 0.01; // kpc; const

// base quantities set by user
var Ml1; // solMass
var Ml2; // solMass
var Ds; // kpc: Ds =  Dl / (1 - 1/mu)
var thetaY; // milliarcseconds (mas)
var Dl; // kpc: Dl = Ds * (1 - 1/mu)
var t0; // days
var mu; // mas/yr: mu = thetaE / tE; mu = Ds / (Ds - Dl) = 1/(1 - Dl/Ds)
var lensSep;
var incline;

// derived quantities
var u0;
var tE; // days
var Drel; // kpc
var thetaE; // radians (or should we use milliarcsecond?)

// lightcurve information
var lightcurveData = null;

// tracks whether u0 is to be held fixed while other quantities vary
var fixU0;

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

// var dayWidthDefault = 32; // const
var dayWidthDefault = 200; // debug value; temp
var magnifHeightDefault = 10; // const
// var xAxisInitialDayDefault = -16; // const
var xAxisInitialDayDefault = -100; // debug value; temp
var yAxisInitialMagnifDefault = 0.5; // const

// gridlines
var xGridInitial;
var yGridInitial;
var xGridFinal;
var yGridFinal;
var xGridStep;
var yGridStep;

// var xGridStepDefault = 2; // const
var xGridStepDefault = 20; // debug value; temp
var yGridStepDefault = 1; // const

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
var tickLabelSpacing = 7; // spacking between tick label and end of trailing gridline

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

var Ml1slider = document.getElementById("Ml1slider");
var Ml1readout = document.getElementById("Ml1readout");

var Ml2slider = document.getElementById("Ml2slider");
var Ml2readout = document.getElementById("Ml2readout");

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

var inclineSlider = document.getElementById("inclineSlider");
var inclineReadout = document.getElementById("inclineReadout");

var lensSepSlider = document.getElementById("lensSepSlider");
var lensSepReadout = document.getElementById("lensSepReadout");

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

var centerLayout = false; // const
var finiteSourceFlag = false; // toggle finite source effects
var binaryFlag = true; // switch between binary and single lens modes

// controls whether plot updates when slider is moved
// or when slider is released
var updateOnSliderMovementFlag = false;
var updateOnSliderReleaseFlag = true;

/** init */
function init() {
  initParams();
  initListeners();
  updateGridRange(xGridStepDefault, yGridStepDefault); // initialize gridline vars
  // initialize plot scale/range vars
  updatePlotScaleAndRange(dayWidthDefault, magnifHeightDefault,
                          xAxisInitialDayDefault, yAxisInitialMagnifDefault);
  updateCurveData();

  // display lightcurve after all modules have been loaded
  // window.onload = function() { plotLightcurve(); }
  plotLightcurve();
  console.log(`tE: ${tE}`);
  console.log(`thetaE: ${thetaE}`);
  console.log(`Drel: ${Drel}`);
  console.log(`mu: ${mu}`);
  console.log(`lensSep: ${lensSep}`);

  initialized = true;
}

/** initListeners */
function initListeners(updateOnSliderMovement=updateOnSliderMovementFlag,
                       updateOnSliderRelease=updateOnSliderReleaseFlag) {

  // update plot when slider is moved
  if (updateOnSliderMovement == true) {
    tEslider.addEventListener("input", function() { updateParam("tE"); }, false);
    u0slider.addEventListener("input", function() { updateParam("u0"); }, false);
    Ml1slider.addEventListener("input", function() { updateParam("Ml1"); }, false);
    Ml2slider.addEventListener("input", function() { updateParam("Ml2"); }, false);
    DsSlider.addEventListener("input", function() { updateParam("Ds"); }, false);
    thetaYslider.addEventListener("input", function() { updateParam("thetaY"); }, false);
    DlSlider.addEventListener("input", function() { updateParam("Dl"); }, false);
    t0slider.addEventListener("input", function() { updateParam("t0"); }, false);
    muSlider.addEventListener("input", function() { updateParam("mu"); }, false);
    inclineSlider.addEventListener("input", function() { updateParam("incline"); }, false);
    lensSepSlider.addEventListener("input", function() { updateParam("lensSep"); }, false);
  }

  // update plot when slider is released
  if (updateOnSliderRelease === true) {
    tEslider.addEventListener("change", function() { updateParam("tE"); }, false);
    u0slider.addEventListener("change", function() { updateParam("u0"); }, false);
    Ml1slider.addEventListener("change", function() { updateParam("Ml1"); }, false);
    Ml2slider.addEventListener("change", function() { updateParam("Ml2"); }, false);
    DsSlider.addEventListener("change", function() { updateParam("Ds"); }, false);
    thetaYslider.addEventListener("change", function() { updateParam("thetaY"); }, false);
    DlSlider.addEventListener("change", function() { updateParam("Dl"); }, false);
    t0slider.addEventListener("change", function() { updateParam("t0"); }, false);
    muSlider.addEventListener("change", function() { updateParam("mu"); }, false);
    inclineSlider.addEventListener("change", function() { updateParam("incline"); }, false);
    lensSepSlider.addEventListener("change", function() { updateParam("lensSep"); }, false);

    // if plot updates only upon slider release,
    // update slider readout alone while slider is being moved,
    // without recalculating/updating other sliders (until after current slider is released)
    if (updateOnSliderMovement === false) {
      tEslider.addEventListener("input", function() { updateSliderReadout(tEslider, tEreadout, "tE"); }, false);
      u0slider.addEventListener("input", function() { updateSliderReadout(u0slider, u0readout, "u0"); }, false);
      Ml1slider.addEventListener("input", function() { updateSliderReadout(Ml1slider, Ml1readout, "Ml1"); }, false);
      Ml2slider.addEventListener("input", function() { updateSliderReadout(Ml2slider, Ml2readout, "Ml2"); }, false);
      DsSlider.addEventListener("input", function() { updateSliderReadout(DsSlider, DsReadout, "Ds"); }, false);
      thetaYslider.addEventListener("input", function() { updateSliderReadout(thetaYslider, thetaYreadout, "thetaY"); }, false);
      DlSlider.addEventListener("input", function() { updateSliderReadout(DlSlider, DlReadout, "Dl"); }, false);
      t0slider.addEventListener("input", function() { updateSliderReadout(t0slider, t0readout, "t0"); }, false);
      muSlider.addEventListener("input", function() { updateSliderReadout(muSlider, muReadout, "mu"); }, false);
      inclineSlider.addEventListener("input", function() { updateSliderReadout(inclineSlider, inclineReadout, "incline"); }, false);
      lensSepSlider.addEventListener("input", function() { updateSliderReadout(lensSepSlider, lensSepReadout, "lensSep"); }, false);
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
  // finiteSourceCheckbox.addEventListener("change", toggleFiniteSource, false);
  updateSliders(); // in case HTML slider values differ from actual starting values
}

/** initParams */
function initParams() {
  // set lense curve parameters to defaults

  // set base quantity defaults
  // tE = 10; // tE = thetaE / mu // old, don't use
  // Ml1 = 0.1; // solMass
  // Ds = 8.0; // kpc: Ds =  Dl / (1 - 1/mu)
  // thetaY = 0.0121; // milliarcseconds (mas)
  // Dl = 7.0; // kpc: Dl = Ds * (1 - 1/mu)
  // t0 = 0; // days
  // mu = 7; // mas/yr  (milliarcseconds/year): mu = thetaE / tE

  fixU0 = fixU0checkbox.checked
  // Ml1 = 0.1;
  // Ml2 = 0.1;
  Ml1 = 1*0.62
  Ml2 = 1*1 - Ml1;
  Ds = 8.0;
  // thetaY = -0.05463809952990817329;
  thetaY =  -0.03 * 0.8346900557366428;
  Dl = 4.75;
  t0 = 0;
  mu = 7;
  // mu = 20; // DEBUG value, TEMPORARY
  // lensSep = 1 * 0.8346900557366428; // mas (milliarcseconds)
  lensSep = 2.150;
  incline = Math.atan(0.12) * 180/Math.PI; // degrees

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

  // console.log(`tE before: ${tE}`);
  updateTE();
  // console.log(`tE after: ${tE}`);
}

/** updateU0 */
function updateU0() {
  var thetaY_rad = thetaY * masToRad; // convert from mas to radians
  u0 = thetaY_rad / thetaE; // unitless ("units" of thetaE)
}

/** updateThetaY */
function updateThetaY() {
  var thetaE_mas = thetaE / masToRad ;// convert from radians to mas
  thetaY = u0 * thetaE_mas; // mas
}

/** updateDrel */
function updateDrel() {
  Drel = 1/((1/Dl) - (1/Ds)); // kpc
}

/** updateThetaE */
function updateThetaE() {
  thetaE = calculateThetaE();
}

/** calculateThetaE */
function calculateThetaE(get_mas=false, useBinaryMass=binaryFlag, lensToUse=1) {
  /*
  G: m3 kg−1 s−2 (astropy value)
  c: 299792458.0; // m s-1 (astropy value)
  Ml1: solMass
  Drel: kpc

  solMass -> kg: 1.9891e+30 kg/solMass
  kpc -> m: 3.0856775814671917e+19 m/kpc

  kg -> solMass: 5.02739932632849e-31
  m -> kpc: 3.240779289469756e-20 kpc/m
  */

  var solMassToKg = 1.9891e30; // kg/solMass; const
  var kpcToM = 3.0856775814671917e19; // m/kpc; const

  var eqMl1 = Ml1 * solMassToKg; // Ml1 converted for equation to kg
  var eqMl2 = Ml2 * solMassToKg; // Ml2 converted for equation to kg
  var eqDrel = Drel * kpcToM; // Drel converted for equation to m

  if (useBinaryMass === true) {
    // var eqReducedMl = (eqMl1 * eqMl2)/(eqMl1 + eqMl2); // reduced mass from
    //                                                    // Ml1 and Ml2 in kg
    var eqTotalMl = eqMl1 + eqMl2; // total mass from Ml1 and Ml2 in kg

    eqMl = eqTotalMl;
  }

  else { // single lens, not binary
    if (lensToUse === 2) {
      eqMl = eqMl2;
    }
    else { // lensToUse === 1 or otherwise
      eqMl = eqMl1;
    }
  }

  // G is m^3 /(kg * s^2)
  // c is m/s
  var thetaEresult = Math.sqrt(4 * G * eqMl/(c*c*eqDrel)); // radians (i.e. unitless)

  if (get_mas === true)
    thetaEresult = thetaEresult / masToRad;

  return thetaEresult;
}

/** updateTE */
function updateTE(debug=false) {
  var yearToDay = 365.25; // day/year; const

  var eqMu = mu * masToRad / yearToDay // mu converted for equation to rad/yr
  // thetaE is in radians
  tE = thetaE/eqMu; // days
  if (debug)
    tE *= 1e10; // something is wrong; have to multiply by 1e9+ to get reasonable plot
}

/** updateSliderReadout */
function updateSliderReadout(slider, readout, sliderName="") {
  // Update individual slider readout to match slider value

  var fixedDecimalPlace = 3; // Default value for tE, u0, thetaY, lensSep

  if (sliderName === "Ml1" || sliderName === "Ml2")
    fixedDecimalPlace = 6;

  else if (sliderName === "Ds" || sliderName === "Dl" ||
           sliderName === "mu"|| sliderName === "incline")
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
  var tEmax = 365; // days
  var u0max = 2; // unitless (einstein radii)
  var Ml1Max = 15; // solMass
  var Ml2Max = 15; // solMass
  var DsMax = 8.5 // kpc
  var thetaYmax = 2; // mas
  var DlMax = 8.5 // kpc
  var t0max = 75 // days
  var muMax = 10 // milliarcseconds/year
  // var lensSepMax = 0.7; // milliarcseconds

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
  // u0readout.innerHTML = Number(u0slider.value).toFixed(3);
  updateSliderReadout(u0slider, u0readout, "u0");
  if (u0 > u0max) {
    u0readout.innerHTML += "+";
  }

  Ml1slider.value = Ml1;
  // Ml1readout.innerHTML = Number(Ml1slider.value).toFixed(6);
  updateSliderReadout(Ml1slider, Ml1readout, "Ml1");
  if (Ml1 > Ml1Max) {
    Ml1readout.innerHTML += "+";
  }

  Ml2slider.value = Ml2;
  // Ml2readout.innerHTML = Number(Ml2slider.value).toFixed(6);
  updateSliderReadout(Ml2slider, Ml2readout, "Ml2");
  if (Ml2 > Ml2Max) {
    Ml2readout.innerHTML += "+";
  }

  DsSlider.value = Ds;
  // DsReadout.innerHTML = Number(DsSlider.value).toFixed(2);
  updateSliderReadout(DsSlider, DsReadout, "Ds");
  if (Ds > DsMax) {
    DsReadout.innerHTML += "+";
  }

  thetaYslider.value = thetaY;
  // thetaYreadout.innerHTML = Number(thetaYslider.value).toFixed(3);
  updateSliderReadout(thetaYslider, thetaYreadout, "thetaY");
  if (thetaY > thetaYmax) {
    thetaYreadout.innerHTML += "+";
  }

  DlSlider.value = Dl;
  // DlReadout.innerHTML = Number(DlSlider.value).toFixed(2);
  updateSliderReadout(DlSlider, DlReadout, "Dl");
  if (Dl > DlMax) {
    DlReadout.innerHTML += "+";
  }

  t0slider.value = t0;
  // t0readout.innerHTML = Number(t0slider.value).toFixed(1);
  updateSliderReadout(t0slider, t0readout, "t0");
  if (t0 > t0max) {
    t0Readout.innerHTML += "+";
  }

  muSlider.value = mu;
  // muReadout.innerHTML = Number(muSlider.value).toFixed(2);
  updateSliderReadout(muSlider, muReadout, "mu");
  if (mu > muMax) {
    muReadout.innerHTML += "+";
  }

  inclineSlider.value = incline;
  // inclineReadout.innerHTML = Number(inclineSlider.value).toFixed(2);
  updateSliderReadout(inclineSlider, inclineReadout, "incline");

  lensSepSlider.value = lensSep;
  // lensSepReadout.innerHTML = Number(lensSepSlider.value).toFixed(3);
  updateSliderReadout(lensSepSlider, lensSepReadout, "lensSep");
  // if (lensSep > lensSepMax) {
    // lensSepReadout.innerHTML += "+";
  // }

  // update thetaE readout (no slider)

  if (thetaEreadout !== null) {
    var thetaE_mas = thetaE / masToRad;
    console.log(`thetaE (mas): ${thetaE_mas}`);
    thetaEreadout.innerHTML = Number(thetaE_mas).toFixed(4);
  }
}

/** resetParams */
function resetParams() {
  // reset lense curve parameters to defaults and redraw curve
  initParams();
  updateSliders();

  try {
    var lensPlaneModule = require("./PSPL_binary_microlensing_event_lens_plane.js");
  }
  catch(ex) {
    errorHandler.handle(ex);
  }


  if (lensPlaneModule !== undefined && lensPlaneModule.initialized === true) {
    lensPlaneModule.initSourceRadius();
  }

  updateCurveData();
  redrawCanvases();
  // if (finiteSourceFlag === true)
  //   updateCurveData();
  // if (typeof PSPL_binary_microlensing_event_lens_plane !== "undefined") {
  //   PSPL_binary_microlensing_event_lens_plane.initSourceRadius(noRedraw=false);
  //   PSPL_binary_microlensing_event_lens_plane.redraw();
  // }
  // plotLightcurve();
}

/** updateParam */
function updateParam(param) {
  if (param === "Ml1") {
    Ml1 = Number(Ml1slider.value);
    // tE depends on thetaE which depends on Ml1
  }
  else if (param === "Ml2") {
    Ml2 = Number(Ml2slider.value);
  }
  else if (param === "Ds") {
    if (Number(DsSlider.value) > Dl) { // source must be farther than lens
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
    if (Number(DlSlider.value) < Ds) { // lens must be closer than source
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
    /*
    thetaE = k * sqrt(M)
    tE = thetaE / mu

    tE = (k/mu) * sqrt(M)
       = k2 * sqrt(M)

     M = (tE/k2)**2
     M = k3 * tE**2
     */

     // NOTE: Pretty hacky way of doing this
     // modify Ml1 accordingly of tE is changed, where
     // Ml1 is propotional to tE^2
     Ml1 *= (tE/oldTE)*(tE/oldTE);
  }
  else if (param === "u0") {
    u0 = Number(u0slider.value);
    var thetaY_rad = u0 * thetaE; // thetaY in radians
    thetaY = thetaY_rad / masToRad; // converted to milliarcseconds (mas)
  }

  else if (param === "incline") {
    incline = Number(inclineSlider.value);
  }

  else if (param === "lensSep") {
    lensSep = Number(lensSepSlider.value);
  }

  // updates Drel, then thetaE, then tE, each of which depends on the last,
  // and collectively depends on some of these base quantities;
  // not necessary for every option, but probably cleaner code this way
  //
  updateDerivedQuantities();
  updateSliders();
  updateCurveData();
  redrawCanvases();
}

/** redrawCanvases */
function redrawCanvases() {
  try {
    var lensPlaneModule = require("./PSPL_binary_microlensing_event_lens_plane.js");
  }
  catch(ex) {
    errorHandler.handle(ex);
  }

  if (lensPlaneModule !== undefined && lensPlaneModule.initialized === true) {
    lensPlaneModule.redraw();
  }

  try {
    var animationModule = require("./PSPL_binary_microlensing_event_animation.js");
  }
  catch(ex) {
    errorHandler.handle(ex);
  }

  if (animationModule !== undefined && animationModule.initialized === true) {
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

  // console.log(Math.floor)
  // console.log("MathFloored xAxisInitialDay: " + Math.floor(xAxisInitialDay));
  // console.log("xGridInitial: " + xGridInitial);
  // console.log("xGridFinal: " + xGridFinal);
  // console.log("MathFloored yAxisInitialMagnif: " + Math.floor(yAxisInitialMagnif));
  // console.log("yGridInitial: " + yGridInitial);
  // console.log("yGridFinal: " + yGridFinal);
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
}

/** initPlot */
function initPlot() {
  clearGraph();
  // updatePlotScaleAndRange(undefined, undefined, undefined,
  //                         undefined, undefined, 1.5);
  // console.log("tE: " + tE);
  // console.log("dayWidth: " + dayWidth);
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
  else { // no input parameter given
    if (lightcurveData !== null) { // module lightcurve variable already initialized
      curveData = lightcurveData; // use module variable in function
    }
    else { // module lightcurve variable not initialized yet
      // window.alert("lightcurveData uninitialized; updating");
      updateCurveData(); // initialize module variable
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
      context.setLineDash([dashedCurveLength, dashedCurveSpacing]); // turn on dashed lines

    // prepare to draw curve and move to initial pixel coordinate
    var tPixel = xDayToPixel(tDay);
    var magnifPixel = yMagnifToPixel(magnif);
    context.beginPath();
    context.moveTo(tPixel, magnifPixel);

    // Iterate over remaining days and draw lines from each pixel coordinate
    // to the next

    var index = 0; // // Index tracks place in data arrays if reading in data
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
  var yearToDay = 365.25; // day/year; const
  var eqMu = mu / yearToDay; // convert mu to milliarcseconds/day
  var thetaX = eqMu * (t - t0);
  return thetaX;
}

/** updateCurveData */
function updateCurveData() {
  if (binaryFlag === true) {
    // send GM1, GM2, D, cof1, cof2, minXLM, maxXLM, and NPN
    // to bin_len_faster.plot_binary() function
    var debug = false; // use debug values for binary variables

    var thetaE_mas = thetaE / masToRad;
    var totalMass = Ml1 + Ml2;
    var GM1 = Ml1/totalMass;
    var GM2 = Ml2/totalMass;
    var D = (lensSep/2)/thetaE_mas; // "D" is the half-separation in units of

    var cof2 = thetaY/thetaE_mas;

    // var cof1 = incline; // DEBUG: temp, not correct;
                        // cof1 should be negative slope,
                        // incline should be degrees, need conversion

    var incline_radians = incline * Math.PI/180;
    var cof1 = -Math.tan(incline_radians);
    var minXLM = getThetaX(xAxisInitialDay) / thetaE_mas;
    // window.alert(minXLM*thetaE_mas);
    // var minXLM = -0.5;
    var maxXLM = getThetaX(xAxisFinalDay) / thetaE_mas;

    var NPN = 4000; // Number of points for lightcurve
    var NR = 30000; // Number of points for critical and caustic curves

    // Sampling density of critical and caustic curve points
    // var DR = 3/NR;vv
    var DR = 0.0003; // was 0.0001 by default, but this seems to work better

    if (debug === true) {
      // GM1 = 0.2;
      // GM2 = 0.8;
      // D = 0.5;
      // cof1 = 0;
      // cof2 = -0.5;
      // var thetaE_mas_temp = 0.6539599913692768;
      // minXLM = -1.1617229221914211;
      // maxXLM = 1.1617229221914211;
      //
      // NPN = 4000;

      // GM1 = 0.61383532827548774
      // GM2 = 1 - GM1;
      // D = lensSep/2;
      // cof1 = 0;
      // cof2 = thetaY;
      // NPN = 4000;
    }

    console.log(`(binary) GM1: ${GM1}`);
    console.log(`(binary) GM2: ${GM2}`);
    console.log(`(binary) D: ${D}`);

    console.log(`(binary) cof1: ${cof1}`);
    console.log(`(binary) cof2: ${cof2}`);
    console.log(`(binary) NPN: ${NPN}`);
    console.log(`(binary) minXLM: ${minXLM}`);
    console.log(`(binary) maxXLM: ${maxXLM}`);
    console.log(`(binary) xAxisInitialDay: ${xAxisInitialDay}`);
    console.log(`(binary) xAxisFinalDay: ${xAxisFinalDay}`);
    console.log(`(binary) thetaE_mas: ${thetaE_mas}`);


    var windowAlertParamDebugFlag = false;

    if (windowAlertParamDebugFlag === true) {
      window.alert(`\
        GM1: ${GM1}
        GM2: ${GM2}
        D: ${D}
        cof1: ${cof1}
        cof2: ${cof2}`);
    }

    var binaryCaclulationResults = bin_len_faster.plot_binary(GM1, GM2, D, cof1, cof2,
                                                              minXLM, maxXLM, NPN, NR, DR);

    var times = numeric.linspace(xAxisInitialDay, xAxisFinalDay, NPN);
    var magnifs = binaryCaclulationResults.magnifs;
    var normalizedImagePositions = binaryCaclulationResults.normalizedImagePositions;
    var causticAndCritNormalized = binaryCaclulationResults.causticAndCrit; // units of thetaE

    // window.alert(times.length + " " + magnifs.length)
    console.log(`(binary) times.length: ${times.length}`);
    console.log(`(binary) magnifs.length: ${magnifs.length}`);
    // console.log(`(binary) times: ${times}`);
    // console.log(`(binary) magnifs: ${magnifs}`);
    console.log(`(binary) crit.x1.length: ${causticAndCritNormalized.crit.x1.length}`);
    console.log(`(binary) caustic.x1.length: ${causticAndCritNormalized.caustic.x1.length}`);
  }

  else  {
    var times = [];
    var magnifs = [];

    for (var tDay = xAxisInitialDay; tDay <= xAxisFinalDay; tDay += dt) {
      var magnif = getMagnif(tDay);
      // if (tDay === 0)
        // console.log("magnif: " + magnif);
      times.push(tDay);
      magnifs.push(magnif);
    }
  }
  var curveData = {
    times:times,
    magnifs:magnifs,
    // normalized (over thetaE) positions of the (five or three) lensed images
    imagesNormalizedPos: normalizedImagePositions,
    causticNormalized: causticAndCritNormalized.caustic,
    critNormalized: causticAndCritNormalized.crit};

  var autoScaleMagnifHeight = false;

  if (autoScaleMagnifHeight === true) {
    var maxMagnif = math.max(curveData.magnifs);
    updatePlotScaleAndRange(undefined, maxMagnif+1, undefined, 0.5);
    // updateGridRange(xGridStepDefault, (maxMagnif+1)/10);
  }
  lightcurveData = curveData;

  try {
    var lensPlaneModule = require("./PSPL_binary_microlensing_event_lens_plane.js");
  }
  catch(ex) {
    errorHandler.handle(ex);
  }

  var prerenderCurves = true;

  if (prerenderCurves === true && lensPlaneModule !== undefined &&
      lensPlaneModule.initialized === true) {
    lensPlaneModule.renderCurves();
  }

  var updateLensedImages = true;
  if (updateLensedImages === true && lensPlaneModule !== undefined &&
      lensPlaneModule.initialized === true) {
    lensPlaneModule.convertLensedImagesPos();
  }
}

/** toggleFiniteSource */
function toggleFiniteSource() {
  finiteSourceFlag = !finiteSourceFlag;
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
function getMagnifFromU(u) {
  var magnifNumerator = u*u + 2;
  var magnifDenominator = u * Math.sqrt(u * u + 4);
  magnif = magnifNumerator / magnifDenominator; // unitless
  return magnif;
}

/** getMagnif */
function getMagnif(t) {
  var timeTerm = getTimeTerm(t); // unitless
  var u = getU(timeTerm); // unitless
  var magnif = getMagnifFromU(u); // unitless

  if (finiteSourceFlag === true &&
      typeof PSPL_microlensing_event_finite_source !== "undefined") {
    magnif *= PSPL_microlensing_event_finite_source.getFiniteSourceFactor(u);
  }

  return magnif;
}

// public properties to be stored in module object,
// accessible via module object by code executed after this script
module.exports = {
  //initialization
  init: init, // initialization function
  get initialized() { return initialized; }, // whether initialization is done

  // getters for variables we want to share
  get Ml1() { return Ml1; }, // base modeling parameters
  get Ds() { return Ds; }, // kpc
  get thetaY() { return thetaY; }, // milliarcseconds (mas)
  get Dl() { return Dl; }, // kpc
  get t0() { return t0; }, // days
  get mu() { return mu; }, // mas/yr

  get Drel() { return Drel; }, // derived modeling parameters
  get thetaE() { return thetaE; }, // radians
  get thetaE_mas() { return thetaE / masToRad; }, // milliarcseconds (mas)
  get tE() { return tE; }, // days
  get u0() { return u0; }, // unitless (units of thetaE)
  get lensSep() { return lensSep; }, // milliarcseconds (mas)
  get incline() { return incline; }, // degrees

  get finiteSourceFlag() { return finiteSourceFlag; }, // whether finite or point source is being used

  // controls if plot updates when slider is moved and/or released
  get updateOnSliderMovementFlag() { return updateOnSliderMovementFlag; },
  get updateOnSliderReleaseFlag() { return updateOnSliderReleaseFlag; },

  // used for animation
  get dt() { return dt; }, // time step used for drawing curve (days)
  get xAxisInitialDay() { return xAxisInitialDay; },
  get xAxisFinalDay() { return xAxisFinalDay; },
  plotLightcurve: plotLightcurve,

  // redrawing both canvases
  redrawCanvases: redrawCanvases,

  // toggling finite source effects
  toggleFiniteSource: toggleFiniteSource,

  // for calculating thetaE for individual lens masses, in addition to the
  // thetaE of the summed lens masses
  calculateThetaE: calculateThetaE,

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

  // plotLightcurveSegment: plotLightcurveSegment,
  // initPlot: initPlot,
  // context: context,
  // xDayToPixel: xDayToPixel,
  // getMagnif: getMagnif,
  // yMagnifToPixel: yMagnifToPixel,
};
