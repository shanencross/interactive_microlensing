

/** Lens Plane Module.
  * Handles calculation and drawing of the lens plane plot for the microlensing
  * event.
  *
  * Depicts the source's path across the sky when the lenses are held fixed.
  *
  * Also listens for events from related UI buttons/sliders.
  *
  * @module psbl-microlensing-event-lens-plane
  */

console.log("Executing psbl-microlensing-event-lens-plane.js");

var _ = require("lodash");

var eventModule = require("./psbl-microlensing-event.js");

var almostEquals = require("./utils.js").almostEquals;
var ellipse = require("./utils.js").ellipse;
var Lens = require("./Lens.js");

// whether module init function has been executed
var initialized = false;

// base variables (borders)
var picLeftBorder = 50;
var picTopBorder = 50;
var picWidth = 400;
var picHeight = 300;

// base variables (trails)
var picLeftTrail = 10;
var picRightTrail = 0;
var picTopTrail = 0;
var picBottomTrail = 10;

// plot range/scale
var dayWidth = 30;
var thetaXwidth = 4;
var thetaYheight = 3;
var xAxisInitialDay = -15;
var xAxisInitialThetaX = -4 / 2;
// half of thetaYheight so that 0 is the middle
var yAxisInitialThetaY = -3 / 2;
var xGridStepDefault = 0.25;
var yGridStepDefault = 0.25;

var lens1;
var lens2;

//base variables (background/picture aesthetics)
var backgroundColor = "#ffffe6";
var picBackgroundColor = "#eff";
var picBorderColor = "grey";
var picBorderWidth = 1;

var ringColor = "dimgrey";
var ringWidth = 2;
var dashedRingLength = 5;
var dashedRingSpacing = 5;

var pathColor = "blue";
var pathWidth = 2;

var dashedPathColor = "green";
var dashedPathWidth = 2;
var dashedPathLength = 8;
var dashedPathSpacing = 10;

// darker teal
var sourceColor = "#004d4d";
// initialized elsewhere in function

// mas
var sourceRadius;
var sourceOutlineWidth = 2;
var sourceOutlineColor = "teal";

var lensPixelRadius = 2;
var lensColor = "red";
var lensOutlineWidth = 2;
var lensOutlineColor = lensColor;

var uArrowColor;
var uArrowWidth;

var axisColor = "black";
var axisWidth = "2";

var gridColor = "grey";
var gridWidth = 1;

var lensedImageRadius = 2;
var lensedImageLineWidth = 2;
var dashedLensedImageLength = 5;
var dashedLensedImageSpacing = 0;
var lensedImagePlusColor = "purple";
var lensedImagePlusOutlineColor = "fuchsia";
var lensedImageMinusColor = "green";
var lensedImageMinusOutlineColor = "lime";

// when not debugging, caustic colors 1 & 2 should be the same
var causticColor1 = "purple";
var causticColor2 = "purple";

// when not debugging, crit colors 1 & 2 should be the same
var critColor1 = "crimson";
var critColor2 = "crimson";

// critColor1 = critColor2; // when not debugging, these should be the same
var causticPointSizeX = 2;
var causticPointSizeY = 2;
var critPointSizeX = 2;
var critPointSizeY = 2;

var binaryLensedImagePointSizeX = 2;
var binaryLensedImagePointSizeY = 2;

var binaryLensedImageOutlineColors = ["black", "black", "black", "black", "black"];
var binaryLensedImageFillColors = ["orange", "orange", "orange", "orange", "orange"];

//base variables (tick labels)
var tickLabelFont = "8pt Arial";
var tickLabelColor = "black";
var tickLabelAlign = "center";
var tickLabelBaseline = "middle";
// spacing between tick label and end of trailing gridline
var tickLabelSpacing = 7;

// base variables (axis labels)
var xDayLabel = "time (days)";
// thetaX
var xLabel = String.fromCharCode(952) + "x (mas)";
// thetaY
var yLabel = String.fromCharCode(952) + "y (mas)";
var axisLabelFont = "10pt Arial";
var axisLabelColor = "black";
var axisLabelAlign = "center";
var axisLabelBaseline = "middle";
var axisLabelSpacing = 27;

//derived variables (borders)
var picRightBorder;
var picBottomBorder;
var centerX;
var centerY;

// derived variables (trails)
var picLeftTrailingBorder;
var picRightTrailingBorder;
var picTopTrailingBorder;
var picBottomTrailingBorder;

// derived variables (range/scale)
var xDayPixelScale;
var xPixelScale;
var yPixelScale;
var xAxisFinalDay;
var yAxisFinalThetaY;

// derived variables (gridlines)
var xGridInitial;
var yGridInitial;
var xGridFinal;
var yGridFinal;
var xGridStep;
var yGridStep;

// derived variable (source/lens/ring)
// x value: time (days), y value: thetaY
var sourcePos;
// pixel x and y values
var sourcePixelPos;
var ringRadius = { x: undefined, y: undefined };
var lensedImageOutlines;

// caustic and crit
var caustic = null;
var crit = null;

// positions of lensed images as function of time/source position
var lensedImagesPos;
var lensedImagesPixelPos;

//sort of derived variables? but not really? (canvas/context)
var mainCanvas = document.getElementById("lensPlaneCanvas");
var mainContext = mainCanvas.getContext("2d");

// off-screen canvases for critical/caustic curves
var critCanvas = document.createElement("canvas");
critCanvas.width = mainCanvas.width;
critCanvas.height = mainCanvas.width;
var critContext = critCanvas.getContext("2d");

var causticCanvas = document.createElement("canvas");
causticCanvas.width = mainCanvas.width;
causticCanvas.height = mainCanvas.width;
var causticContext = causticCanvas.getContext("2d");

var curveCanvases = { crit: critCanvas, caustic: causticCanvas };
var curveContexts = { crit: critContext, caustic: causticContext };

// readout of current source thetaX position
var thetaXreadout = document.getElementById("thetaXreadout");

var sourceRadiusNormalizedReadout = document.getElementById("sourceRadiusNormalizedReadout");
var sourceRadiusSlider = document.getElementById("sourceRadiusSlider");
var sourceRadiusReadout = document.getElementById("sourceRadiusReadout");

// checkboxes
var displayImagesCheckbox = document.getElementById("displayImagesCheckbox");
var displayRingsCheckbox = document.getElementById("displayRingsCheckbox");
var displayCritCheckbox = document.getElementById("displayCritCheckbox");
var displayCausticCheckbox = document.getElementById("displayCausticCheckbox");

// flags toggled by checkbox
var displayFlags = {
  // display lensed images of source
  images: displayImagesCheckbox.checked,
  // display separate rings for each lens
  rings: displayRingsCheckbox.checked,
  // display critical curve
  crit: displayCritCheckbox.checked,
  // display caustic curve
  caustic: displayCausticCheckbox.checked

  // debug flags
};var centerLayoutFlag = false;
var drawGridFlag = true;
var drawFullLensedImagesFlag = true;

// if true, grid lines/ticks for that axis are created in steps starting from 0,
// rather than starting from the lowest x-axis value or y-axis value
var centerXgridOnZeroFlag = true;
var centerYgridOnZeroFlag = true;

// firefox doesn't support context.ellipse, so this replaces it with a custom
// ellipse function using context.arc and canvas rescaling/translating
var firefoxCompatibilityFlag = true;

var updateOnSliderMovementFlag = eventModule.updateOnSliderMovementFlag;
var updateOnSliderReleaseFlag = eventModule.updateOnSliderReleaseFlag;

/** init */
function init() {
  initListeners();
  updateScaleAndRangeValues();
  initLenses();
  initSourcePos();
  initSourceRadius();
  drawing.renderCurves();
  redraw();

  initialized = true;
}

/** initListeners */
function initListeners() {
  var updateOnSliderMovement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : updateOnSliderMovementFlag;
  var updateOnSliderRelease = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : updateOnSliderReleaseFlag;

  initCheckboxes();
  initSliders(updateOnSliderMovement, updateOnSliderRelease);
}

/** initCheckboxes() */
function initCheckboxes() {
  displayImagesCheckbox.addEventListener("change", function () {
    displayFlags.images = displayImagesCheckbox.checked;
    redraw();
  }, false);

  displayRingsCheckbox.addEventListener("change", function () {
    displayFlags.rings = displayRingsCheckbox.checked;
    redraw();
  }, false);

  displayCritCheckbox.addEventListener("change", function () {
    displayFlags.crit = displayCritCheckbox.checked;
    redraw();
  }, false);

  displayCausticCheckbox.addEventListener("change", function () {
    displayFlags.caustic = displayCausticCheckbox.checked;
    redraw();
  }, false);
}

/** initSliders */
function initSliders() {
  var updateOnSliderMovement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : updateOnSliderMovementFlag;
  var updateOnSliderRelease = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : updateOnSliderReleaseFlag;

  console.log("(binary_lens_plane) updateOnSliderMovement: " + updateOnSliderMovement);
  console.log("(binary_lens_plane) updateOnSliderRelease: " + updateOnSliderRelease);

  // update plot when slider is moved
  if (sourceRadiusSlider !== null) {
    if (updateOnSliderMovement === true) {
      sourceRadiusSlider.addEventListener("input", function () {
        updateSourceRadius();
      }, false);
    }

    // update plot when slider is released
    if (updateOnSliderRelease === true) {
      sourceRadiusSlider.addEventListener("change", function () {
        updateSourceRadius();
      }, false);

      // if plot updates only upon slider release,
      // update slider readout alone while slider is being moved,
      // without recalculating/updating other sliders (until after current slider is released)
      if (updateOnSliderMovement === false) {
        sourceRadiusSlider.addEventListener("input", function () {
          eventModule.updateSliderReadout(sourceRadiusSlider, sourceRadiusReadout, "sourceRadius");
        }, false);
      }
    }
  }
}

/** initLenses */
function initLenses() {
  var lensSep = eventModule.lensSep;

  var ring1radius_mas = eventModule.calculateThetaE(get_mas = true, useBinaryMass = false, lensToUse = 1);

  lens1 = new Lens(xPixelScale, yPixelScale, thetaXtoPixel, thetaYtoPixel, -lensSep / 2, 0, lensPixelRadius, lensColor, lensOutlineWidth, lensOutlineColor, ring1radius_mas, ringColor, ringWidth, dashedRingLength, dashedRingSpacing);

  var ring2radius_mas = eventModule.calculateThetaE(get_mas = true, useBinaryMass = false, lensToUse = 2);

  lens2 = new Lens(xPixelScale, yPixelScale, thetaXtoPixel, thetaYtoPixel, lensSep / 2, 0, lensPixelRadius, lensColor, lensOutlineWidth, lensOutlineColor, ring2radius_mas, ringColor, ringWidth, dashedRingLength, dashedRingSpacing);
}

/** initSourceRadius */
function initSourceRadius() {
  sourceRadius = 4 / xPixelScale; // source radius in mas

  lensedImageRadius = sourceRadius * xPixelScale;

  if (sourceRadiusSlider !== null) updateSourceRadiusSlider();
}

/** updateSourceRadiusSlider */
function updateSourceRadiusSlider() {
  // source radius in mas
  sourceRadiusSlider.value = sourceRadius;
  eventModule.updateSliderReadout(sourceRadiusSlider, sourceRadiusReadout, "sourceRadius");
}

/** updateSourceRadius */
function updateSourceRadius() {
  // source radisu in mas
  sourceRadius = sourceRadiusSlider.value;
  lensedImageRadius = sourceRadius * xPixelScale;
  updateSourceRadiusSlider();
  eventModule.updateCurveData();
  eventModule.redrawCanvases();
}

/** initSourcePos */
function initSourcePos() {
  var sourcePosY = eventModule.thetaY;
  sourcePos = { x: getThetaX(eventModule.xAxisInitialDay), y: sourcePosY };
}

/** redraw */
function redraw() {
  updateDrawingValues();
  drawing.drawPic();
}

/** updateScaleAndRangeValues */
function updateScaleAndRangeValues() {
  // borders

  // right border of picture x-pixel value, NOT including any trailing gridlines
  picRightBorder = picLeftBorder + picWidth;
  // bottom border of picture y-pixel value, NOT including any trailing gridlines
  picBottomBorder = picTopBorder + picHeight;
  centerX = picWidth / 2 + picLeftBorder;
  centerY = picHeight / 2 + picTopBorder;

  // trails

  // left border of picture x-pixel value, INCLUDING any trailing gridlines
  picLeftTrailingBorder = picLeftBorder - picLeftTrail;
  // right border of picture x-pixel value, INCLUDING any trailing gridlines
  picRightTrailingBorder = picRightBorder + picRightTrail;
  // top border of picture y-pixel value, INCLUDING any trailing gridlines
  picTopTrailingBorder = picTopBorder - picTopTrail;
  // bottom border of picture y-pixel value, INCLUDING any trailing gridlines
  picBottomTrailingBorder = picBottomBorder + picBottomTrail;

  // range/scale
  xDayPixelScale = picWidth / dayWidth;
  xPixelScale = picWidth / thetaXwidth;
  yPixelScale = picHeight / thetaYheight;

  xAxisFinalDay = xAxisInitialDay + dayWidth;
  xAxisFinalThetaX = xAxisInitialThetaX + thetaXwidth;
  yAxisFinalThetaY = yAxisInitialThetaY + thetaYheight;

  // grid values
  // initialize gridline vars
  updateGridRange(xGridStepDefault, yGridStepDefault);
}

/** updateDrawingValues */
function updateDrawingValues() {
  // update source thetaY
  sourcePos.y = getThetaYpathValue(sourcePos.x);

  // makes sure "0.0000" is displayed instead of "-0.0000" if rounding error
  // occurs
  if (thetaXreadout !== null) {
    var newThetaXreadout = Number(sourcePos.x).toFixed(4);
    if (Number(newThetaXreadout) === -0) {
      newThetaXreadout = Number(0).toFixed(4);
    }
    thetaXreadout.innerHTML = newThetaXreadout; // update source thetaX readout
  }

  if (sourceRadiusNormalizedReadout !== null) {
    var newSourceRadiusNormalizedReadout = Number(sourceRadius / eventModule.thetaE_mas).toFixed(4);
    if (Number(newSourceRadiusNormalizedReadout) === -0) {
      newSourceRadiusNormalizedReadout = Number(0).toFixed(4);
    }
    sourceRadiusNormalizedReadout.innerHTML = newSourceRadiusNormalizedReadout;
  }

  // convert position to pixel units
  sourcePixelPos = { x: thetaXtoPixel(sourcePos.x), y: thetaYtoPixel(sourcePos.y) };
  initLenses();
}

/** thetaXtoPixel */
function thetaXtoPixel(xPicThetaX) {
  var xPixel = (xPicThetaX - xAxisInitialThetaX) * xPixelScale + picLeftBorder;
  return xPixel;
}

/** xDayToPixel */
function xDayToPixel(xPicDay) {
  var xPixel = (xPicDay - xAxisInitialDay) * xDayPixelScale + picLeftBorder;
  return xPixel;
}

/** thetaYtoPixel */
function thetaYtoPixel(yPicThetaY) {
  var yPixel = picBottomBorder - (yPicThetaY - yAxisInitialThetaY) * yPixelScale;
  return yPixel;
}

/** getThetaX */
function getThetaX(t) {
  var mu = eventModule.mu;
  var t0 = eventModule.t0;
  // day/year; const
  var yearToDay = 365.25;
  // convert mu to milliarcseconds/day
  var eqMu = mu / yearToDay;
  var thetaX = eqMu * (t - t0);
  return thetaX;
}

/** getThetaYpathValue */
function getThetaYpathValue(thetaX) {
  var incline_radians = eventModule.incline * Math.PI / 180;
  var slope = Math.tan(incline_radians);
  var thetaYintercept = eventModule.thetaY; // mas

  var thetaYvalue = slope * thetaX + thetaYintercept;
  return thetaYvalue;
}

/** updateGridRange */
function updateGridRange(xStep, yStep) {
  var centerXgridOnZero = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : centerXgridOnZeroFlag;
  var centerYgridOnZero = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : centerYgridOnZeroFlag;

  // update grid with new step values,

  // and/or update grid for new initial/final axis values using

  // if new step values are passed in, update grid step values;

  // otherwise leave grid steps unchanged when updating grid
  if (!(xStep === undefined) && !(yStep === undefined)) {
    xGridStep = xStep;
    yGridStep = yStep;
  }

  // update grid using current x/y axis initial and final values
  if (centerXgridOnZero === true && xGridStep - Math.abs(xAxisInitialThetaX % xGridStep) > 1e-10) xGridInitial = xAxisInitialThetaX - xAxisInitialThetaX % xGridStep;else xGridInitial = xAxisInitialThetaX;
  console.log("xGridInitial: " + xGridInitial);

  xGridFinal = xAxisFinalThetaX;

  if (centerYgridOnZero === true && yGridStep - Math.abs(yAxisInitialThetaY % yGridStep) > 1e-10) yGridInitial = yAxisInitialThetaY - yAxisInitialThetaY % yGridStep;else yGridInitial = yAxisInitialThetaY;

  console.log("y axis grid offset: " + yAxisInitialThetaY % yGridStep);
  console.log("yGridStep - Math.abs(yAxisInitialThetaY % yGridStep): " + (yGridStep - Math.abs(yAxisInitialThetaY % yGridStep) < 0.01));
  console.log("yAxisInitialThetaY: " + yAxisInitialThetaY);
  console.log("yGridInitial: " + yGridInitial);

  // same rounding for final y grid line placement
  yGridFinal = yAxisFinalThetaY;
}

/** xDayToThetaX */
function xDayToThetaX() {}
/** drawing */
var drawing = function () {
  var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mainContext;
  var canvas = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : mainCanvas;

  /** clearPic */
  function clearPic() {
    var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mainContext;

    context.clearRect(picLeftBorder, picTopBorder, picWidth, picHeight);
  }

  /** drawBackgrounds */
  function drawBackgrounds() {
    // canvas background
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // picture drawing area background
    context.fillStyle = picBackgroundColor;
    context.fillRect(picLeftBorder, picTopBorder, picWidth, picHeight);
  }

  /** toggleClippingRegion */
  function toggleClippingRegion(turnOn) {
    // set up clipping region as picture region, so that curve does not
    // extend beyond picture region

    // isOn flag tracks whether clipping was last turned on/off; off by default
    if (this.isOn === undefined) {
      this.isOn = false;
    }

    // toggle clipping if on/off command not specified
    if (turnOn !== true && turnOn !== false) {
      turnOn = !this.isOn;
    }

    // if told to turn clipping on, and clipping is not already on:
    if (turnOn === true && this.isOn === false) {
      context.save();
      context.beginPath();
      context.rect(picLeftBorder, picTopBorder, picWidth, picHeight);
      context.clip();
      this.isOn = true;
    }
    // If told to turn clipping off, and clipping is not already off:
    else if (turnOn === false && this.isOn === true) {
        context.restore();
        this.isOn = false;
      }
  }

  /** drawLens */
  function drawLens() {
    var lens = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : lens1;

    context.beginPath();
    context.arc(lens.pixelPos.x, lens.pixelPos.y, lens.pixelRadius, 0, 2 * Math.PI, false);
    context.fillStyle = lens.color;
    context.fill();
    context.lineWidth = lens.outlineWidth;
    context.strokeStyle = lens.outlineColor;
    context.stroke();
  }

  /** drawRing */
  function drawRing() {
    var lens = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : lens1;
    var firefoxCompatibility = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : firefoxCompatibilityFlag;

    var ring = lens.ring;
    context.beginPath();
    // ellipse not compatible with firefox
    if (firefoxCompatibility === true) ellipse(context, lens.pixelPos.x, lens.pixelPos.y, ring.pixelRadius.x, ring.pixelRadius.y);else context.ellipse(lens.pixelPos.x, lens.pixelPos.y, ring.pixelRadius.x, ring.pixelRadius.y, 0, 0, 2 * Math.PI);
    context.strokeStyle = ring.color;
    context.lineWidth = ring.width;
    // turn on dashed lines
    context.setLineDash([ring.dashedLength, ring.dashedSpacing]);
    context.stroke();
    // turn off dashed-line drawing
    context.setLineDash([]);
  }

  // use this for when implementing animation

  // for now, should be at end of path, if we bother placing it
  /** drawSource */
  function drawSource() {
    // set aesthetics
    context.lineWidth = sourceOutlineWidth;
    context.strokeStyle = sourceOutlineColor;
    context.fillStyle = sourceColor;

    // draw source
    context.beginPath();
    var radiusPixels = sourceRadius * xPixelScale;
    context.arc(sourcePixelPos.x, sourcePixelPos.y, radiusPixels, 0, 2 * Math.PI, false);
    context.fill();
    context.stroke();
  }

  /** drawSourcePath */
  function drawSourcePath() {
    var thetaYleft = getThetaYpathValue(xAxisInitialThetaX);
    var thetaYright = getThetaYpathValue(xAxisFinalThetaX);
    var thetaYpixelLeft = thetaYtoPixel(thetaYleft);
    var thetaYpixelRight = thetaYtoPixel(thetaYright);

    // dashed line (path yet to be travelled)
    context.beginPath();
    context.moveTo(picLeftBorder, thetaYpixelLeft);
    context.lineTo(picRightBorder, thetaYpixelRight);
    context.setLineDash([dashedPathLength, dashedPathSpacing]); // turn on dashed lines
    context.strokeStyle = dashedPathColor;
    context.lineWidth = dashedPathWidth;
    context.stroke();
    context.setLineDash([]); // turn off dashed lines

    // solid line (path traveled so far)
    context.beginPath();
    context.moveTo(picLeftBorder, thetaYpixelLeft);
    context.lineTo(sourcePixelPos.x, sourcePixelPos.y);
    context.strokeStyle = pathColor;
    context.lineWidth = pathWidth;
    context.stroke();
  }

  // for animation, pointless to implement before animation
  /** drawUarrow */
  function drawUarrow() {}

  /** drawBorder */
  function drawBorder() {
    context.beginPath();
    context.strokeStyle = picBorderColor;
    context.lineWidth = picBorderWidth;
    context.strokeRect(picLeftBorder, picTopBorder, picWidth, picHeight);
  }

  /** drawAxes */
  function drawAxes() {
    function drawAxisLines() {
      context.beginPath();

      // x axis

      // the -axisWidth/2 makes the x and y axes fully connect
      // at their intersection for all axis linewidths
      context.moveTo(picLeftBorder - axisWidth / 2, picBottomBorder);
      context.lineTo(picRightBorder + 15, picBottomBorder);

      // y axis
      context.moveTo(picLeftBorder, picBottomBorder);
      context.lineTo(picLeftBorder, picTopBorder - 15);

      // x axis arrow

      // NOTE: Doesn't look right for linewidth > 2
      context.moveTo(picRightBorder + 15, picBottomBorder);
      context.lineTo(picRightBorder + 8, picBottomBorder - 5);
      context.moveTo(picRightBorder + 15, picBottomBorder);
      context.lineTo(picRightBorder + 8, picBottomBorder + 5);

      // thetaT axis arrow

      // NOTE: Doesn't look right for linewidth > 2
      context.moveTo(picLeftBorder, picTopBorder - 15);
      context.lineTo(picLeftBorder - 5, picTopBorder - 8);
      context.moveTo(picLeftBorder, picTopBorder - 15);
      context.lineTo(picLeftBorder + 5, picTopBorder - 8);

      context.strokeStyle = axisColor;
      context.lineWidth = axisWidth;
      context.stroke();
    }

    function drawAxisLabels() {
      var centerLayout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : centerLayoutFlag;

      // x label
      context.font = axisLabelFont;
      context.textAlign = axisLabelAlign;
      context.textBaseline = axisLabelBaseline;
      context.fillStyle = axisLabelColor;

      if (centerLayout === true) {
        // x label
        context.fillText(xLabel, centerX, picBottomTrailingBorder + axisLabelSpacing);

        // y label
        context.save();
        context.translate(picLeftTrailingBorder - 25, centerY);
        context.rotate(-Math.PI / 2);
        context.textAlign = "center";
        context.fillText(yLabel, 0, 0);
        context.restore();
      } else {
        // x label
        context.textAlign = "left";
        context.fillText(xLabel, picRightTrailingBorder + 20, picBottomBorder);

        // y label
        context.textBaseline = "bottom";
        context.textAlign = "center";
        context.fillText(yLabel, picLeftBorder, picTopTrailingBorder - 20);
      }
    }

    drawAxisLines();
    drawAxisLabels();
  }

  /** drawGridlinesAndTicks */
  function drawGridlinesAndTicks() {
    var drawGrid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : drawGridFlag;
    var noTicks = arguments[1];

    // draw vertical lines and x axis tick labels
    context.beginPath();
    console.log("yGridStep: " + yGridStep);
    for (var thetaX = xGridInitial; thetaX <= xGridFinal; thetaX += xGridStep) {
      var xPixel = thetaXtoPixel(thetaX);
      // line starts from bottom trail
      context.moveTo(xPixel, picBottomTrailingBorder);

      // if using gridlines, line extends top end of top trail
      var yLineEnd = picTopTrailingBorder;
      // if not using grid lines, draw tick lines
      if (drawGrid === false) {
        // tick lines extend one trailing length on either side of axis
        yLineEnd = picBottomBorder - picBottomTrail;
      }

      context.lineTo(xPixel, yLineEnd);

      // tick text label
      var xTickLabel = Number(thetaX).toFixed(2);

      // catches if yTickLabel is set to "-0.00" due to rounding error and
      // converts to "0.00";

      // (NOTE: 0 === -0 in javascript)
      if (Number(xTickLabel) === -0) {
        xTickLabel = Number(0).toFixed(2);
      }
      context.font = tickLabelFont;
      context.fillStyle = tickLabelColor;
      context.textAlign = tickLabelAlign;
      context.textBaseline = tickLabelBaseline;
      context.fillText(xTickLabel, xPixel, picBottomTrailingBorder + tickLabelSpacing);
    }

    //draw horizontal lines and y axis tick label
    for (var thetaY = yGridInitial; thetaY <= yGridFinal; thetaY += yGridStep) {
      var yPixel = thetaYtoPixel(thetaY);
      context.moveTo(picLeftTrailingBorder, yPixel);
      // if using gridlines, line extends to end of right trail
      var xLineEnd = picRightTrailingBorder;
      // if not using gridlines, draw tick lines
      if (drawGrid === false)
        // tick lines extend one trailing length on either side of axis
        xLineEnd = picLeftBorder + picLeftTrail;
      context.lineTo(xLineEnd, yPixel);

      var yTickLabel = Number(thetaY).toFixed(2);

      // catches if yTickLabel is set to "-0.00" due to rounding error and
      // converts to "0.00"

      // (note 0 === -0 in javascript)
      if (Number(yTickLabel) === -0) {
        yTickLabel = Number(0).toFixed(2);
      }
      context.font = tickLabelFont;
      context.fillStyle = tickLabelColor;
      context.textAlign = "right";
      context.textBaseline = tickLabelBaseline;
      context.fillText(yTickLabel, picLeftTrailingBorder - tickLabelSpacing, yPixel);
    }
    context.lineWidth = gridWidth;
    context.strokeStyle = gridColor;
    context.stroke();
  }

  /** unNormalizeCurve */
  function unNormalizeCurve(normalizedCurve) {
    var curve = {};
    _.forOwn(normalizedCurve, function (coordList, coordKey) {
      if (coordKey !== "transitionIndex") {
        curve[coordKey] = numeric.mul(coordList, eventModule.thetaE_mas);
      }
    });
    return curve;
  }

  /** pixelizeCoordList */
  function pixelizeCoordList(coordList) {
    var axis = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "x";

    var pixelizedCoordList = new Array(coordList.length);

    for (var i = 0; i < coordList.length; i++) {
      if (axis === "y") pixelizedCoordList[i] = thetaYtoPixel(coordList[i]);else pixelizedCoordList[i] = thetaXtoPixel(coordList[i]);
    }

    return pixelizedCoordList;
  }

  /** pixelizeCurve */
  function pixelizeCurve(curve) {
    var pixelizedCurve = {};
    _.forOwn(curve, function (coordList, coordKey) {
      if (coordKey !== "transitionIndex") {
        pixelizedCurve[coordKey] = pixelizeCoordList(coordList, coordKey[0]);
      }
    });
    return pixelizedCurve;
  }

  /** renderCaustic */
  function renderCaustic() {
    var color1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "purple";
    var color2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "green";
    var pointSizeX = arguments[2];
    var pointSizeY = arguments[3];
    var context = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : causticContext;

    renderCurve(eventModule.causticNormalized, color1, color2, pointSizeX, pointSizeY, context);
  }

  /** renderCrit */
  function renderCrit() {
    var color1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "purple";
    var color2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "green";
    var pointSizeX = arguments[2];
    var pointSizeY = arguments[3];
    var context = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : critContext;

    renderCurve(eventModule.critNormalized, color1, color2, pointSizeX, pointSizeY, context);
  }

  /** renderCurves */
  function renderCurves() {
    var causColor1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : causticColor1;
    var causColor2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : causticColor2;
    var crtColor1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : critColor1;
    var crtColor2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : critColor2;
    var causPointSizeX = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : causticPointSizeX;
    var causPointSizeY = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : causticPointSizeY;
    var crtPointSizeX = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : critPointSizeX;
    var crtPointSizeY = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : critPointSizeY;
    var contexts = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : curveContexts;

    // clear off-screen canvases
    for (key in contexts) {
      if (contexts.hasOwnProperty(key)) {
        var context = contexts[key];

        clearPic(context);
      }
    }
    renderCaustic(causColor1, causColor2, causPointSizeX, causPointSizeY, contexts.caustic);
    renderCrit(crtColor1, crtColor2, crtPointSizeX, crtPointSizeY, contexts.crit);
  }

  /** setPixel */
  function setPixel(imageData, x, y, r, g, b, a) {

    if (x >= picLeftBorder && x <= picRightBorder && y >= picTopBorder && y <= picBottomBorder) {
      index = (x + y * imageData.width) * 4;
      imageData.data[index + 0] = r;
      imageData.data[index + 1] = g;
      imageData.data[index + 2] = b;
      imageData.data[index + 3] = a;
    }
  }

  /** setPicPixel */
  function setPicPixel(imageData, x, y, r, g, b, a) {
    // only draw if inside graph borders
    var xList = [x];
    var yList = [y];

    xList.push(x + 1);
    yList.push(y);

    xList.push(x - 1);
    yList.push(y3 = y);

    xList.push(x);
    yList.push(y + 1);

    xList.push(x);
    yList.push(y - 1);

    for (var i = 0; i < xList.length; i++) {
      setPixel(imageData, xList[i], yList[i], r, g, b, a);
    }
  }

  /** colorToRGBA */
  function colorToRGBA(color) {
    // Returns the color as an array of [r, g, b, a] -- all range from 0 - 255
    // color must be a valid canvas fillStyle. This will cover most anything
    // you'd want to use.
    // Examples:
    // ```
    // colorToRGBA("red")  // [255, 0, 0, 255]
    // colorToRGBA(""#f00") // [255, 0, 0, 255]
    // ```
    var tempCanvas = document.createElement("canvas");
    tempCanvas.height = 1;
    tempCanvas.width = 1;
    var tempContext = tempCanvas.getContext("2d");
    tempContext.fillStyle = color;
    tempContext.fillRect(0, 0, 1, 1);
    return tempContext.getImageData(0, 0, 1, 1).data;
  }

  /** renderCurve */
  function renderCurve(curveNormalized) {
    var color1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "purple";
    var color2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "green";
    var pointSizeX = arguments[3];
    var pointSizeY = arguments[4];
    var context = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : critContext;

    var curve = unNormalizeCurve(curveNormalized);
    var pixelCurve = pixelizeCurve(curve);

    // debug: check if following comments on performance are obsolete or not

    // fast, but looks kinda bad
    var drawPointsDebugTest = false;
    // not quite as fast, but looks good
    var drawPoints = true;
    // slow; don't use this
    var drawCircles = false;
    // fastest, but doesn't work right
    var drawLines = false;

    if (drawPointsDebugTest === true) {

      var color1RGBA = colorToRGBA(color1);
      var color2RGBA = colorToRGBA(color2);

      context.beginPath();
      // only do this once per page
      var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      for (var i = 1; i < pixelCurve.x1.length; i += 1) {
        var x1 = Math.round(pixelCurve.x1[i]);
        var y1 = Math.round(pixelCurve.y1[i]);
        // debug default: 138, 43, 226, 255
        setPicPixel(imageData, x1, y1, color1RGBA[0], color1RGBA[1], color1RGBA[2], color1RGBA[3]);
      }

      for (var i = 1; i < pixelCurve.x2.length; i += 1) {
        var x2 = Math.round(pixelCurve.x2[i]);
        var y2 = Math.round(pixelCurve.y2[i]);
        // debug default: 0, 128, 0, 255);
        setPicPixel(imageData, x2, y2, color2RGBA[0], color2RGBA[1], color2RGBA[2], color2RGBA[3]);
      }

      context.putImageData(imageData, 0, 0);
    }

    if (drawPoints === true) {
      context.beginPath();
      if (color1 === color2) {
        for (var i = 0; i < pixelCurve.x1.length; i += 1) {
          var x1 = pixelCurve.x1[i];
          var y1 = pixelCurve.y1[i];
          context.rect(x1 - pointSizeX / 2, y1 - pointSizeY / 2, pointSizeX, pointSizeY);

          var x2 = pixelCurve.x2[i];
          var y2 = pixelCurve.y2[i];
          context.rect(x2 - pointSizeX / 2, y2 - pointSizeY / 2, pointSizeX, pointSizeY);
        }
        context.fillStyle = color1;
        context.fill();
      } else {
        for (var i = 0; i < pixelCurve.x1.length; i += 1) {
          var x1 = pixelCurve.x1[i];
          var y1 = pixelCurve.y1[i];

          context.rect(x1 - pointSizeX / 2, y1 - pointSizeY / 2, pointSizeX, pointSizeY);
        }
        context.fillStyle = color1;
        context.fill();

        context.beginPath();
        for (var i = 0; i < pixelCurve.x2.length; i += 1) {
          var x2 = pixelCurve.x2[i];
          var y2 = pixelCurve.y2[i];

          context.rect(x2 - pointSizeX / 2, y2 - pointSizeY / 2, pointSizeX, pointSizeY);
        }
        context.fillStyle = color2;
        context.fill();
      }
    }

    if (drawCircles === true) {
      context.fillStyle = color1;
      for (var i = 0; i < pixelCurve.x1.length; i += 1) {
        var x1 = pixelCurve.x1[i];
        var y1 = pixelCurve.y1[i];
        context.beginPath();
        context.arc(x1, y1, pointSizeX, 0, 2 * Math.PI, false);
        context.fill();
      }

      context.fillStyle = color2;
      for (var i = 0; i < pixelCurve.x2.length; i += 1) {
        var x2 = pixelCurve.x2[i];
        var y2 = pixelCurve.y2[i];
        context.beginPath();
        context.arc(x2, y2, pointSizeX, 0, 2 * Math.PI, false);
        context.fill();
      }
    }

    if (drawLines === true) {
      // minimum pixel separation allowed between points that we connect with
      // lines
      var pointSeparationThreshold = 1;

      context.beginPath();
      context.moveTo(pixelCurve.x1[0], pixelCurve.y1[0]);

      var prevX1;
      var prevY1;
      // debugging: for length 16220, line starts displaying wrong at i=2411
      for (var i = 1; i < pixelCurve.x1.length; i += 1) {
        var x1 = pixelCurve.x1[i];
        var y1 = pixelCurve.y1[i];

        if (prevX1 !== undefined && prevY1 !== undefined) {
          var x1Diff = x1 - prevX1;
          var y1Diff = y1 - prevY1;

          var dist1 = Math.sqrt(x1Diff * x1Diff + y1Diff * y1Diff);

          if (i === curveNormalized.transitionIndex) {
            context.moveTo(x1, y1);
          } else {
            context.lineTo(x1, y1);
          }
        } else context.lineTo(x1, y1);

        prevX1 = x1;
        prevY1 = y1;
      }
      context.strokeStyle = color1;
      context.stroke();

      context.beginPath();
      context.moveTo(pixelCurve.x2[0], pixelCurve.y2[0]);
      var prevX2;
      var prevY2;
      // debugging: for length 16220, line starts displaying wrong at i=2411
      for (var i = 1; i < pixelCurve.x2.length; i += 1) {
        var x2 = pixelCurve.x2[i];
        var y2 = pixelCurve.y2[i];

        if (prevX2 !== undefined && prevY2 !== undefined) {
          var x2Diff = x2 - prevX2;
          var y2Diff = y2 - prevY2;

          var dist2 = Math.sqrt(x2Diff * x2Diff + y2Diff * y2Diff);

          if (i === curveNormalized.transitionIndex) {
            context.moveTo(x2, y2);
          } else {
            context.lineTo(x2, y2);
          }
        } else context.lineTo(x2, y2);

        prevX2 = x2;
        prevY2 = y2;
      }
      context.strokeStyle = color2;
      context.stroke();
    }
  }

  /** drawRenderedCurve */
  function drawRenderedCurve() {
    var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mainContext;
    var imgCanvas = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : critCanvas;

    // Draw images from image canvases onto (most likely main) context
    context.drawImage(imgCanvas, 0, 0);
  }

  /** convertLensedImagesPos */
  function convertLensedImagesPos() {
    // Unnormalize positions of lensed images (originally normalized over
    // thetaE) and convert them to pixel positions. Store both angular and
    // pixel coordinates.

    var imagesNormalizedPos = eventModule.imagesNormalizedPos;

    var imageCount = imagesNormalizedPos.x.length;
    imagesPos = new Array(imageCount);
    imagesPixelPos = new Array(imageCount);
    for (var i = 0; i < imageCount; i++) {
      var curveNormalized = { x: imagesNormalizedPos.x[i], y: imagesNormalizedPos.y[i] };
      var curve = unNormalizeCurve(curveNormalized);
      var pixelCurve = pixelizeCurve(curve);
      imagesPos[i] = curve;
      imagesPixelPos[i] = pixelCurve;
    }

    // store result in global variables
    lensedImagesPos = imagesPos;
    lensedImagesPixelPos = imagesPixelPos;
  }

  /** getTimeFromThetaX */
  function getTimeFromThetaX(thetaX) {
    // temp: very hacky
    var yearToDay = 365.25; // day/year; const
    var eqMu = eventModule.mu / yearToDay; // convert mu to milliarcseconds/day
    var time = thetaX / eqMu + eventModule.t0;
    return time;
  }

  /** drawBinaryPointLensedImages */
  function drawBinaryPointLensedImages() {
    var outlineColors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : binaryLensedImageOutlineColors;
    var fillColors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : binaryLensedImageFillColors;
    var pointSizeX = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : binaryLensedImagePointSizeX;
    var pointSizeY = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : binaryLensedImagePointSizeY;
    var debugPlotAllPoints = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    if (lensedImagesPos === undefined) {
      // unnormalize and pixelize positions of lensed images
      convertLensedImagesPos();
    }

    // debug: this solution is hacky:
    // the way this converts back and forth between time and position,
    // and iterates through the time array to find the right index
    // for the image position arrays, is not good;
    // fix: restructure modules to keep track of the time array index

    // also: the image colors appear to change when they really shouldn't
    var useHackySolution = true;

    if (useHackySolution === true) {
      var time = getTimeFromThetaX(sourcePos.x);

      var times = eventModule.times;

      var timeIndex;
      for (var i = 0; i < times.length; i++) {
        if (times[i] > time) {
          timeIndex = i;
          break;
        }
      }

      if (timeIndex === undefined) timeIndex = times.length - 1;

      var imageParities = eventModule.imageParities;

      for (var i = 0; i < lensedImagesPixelPos.length; i++) {
        var imageParity = imageParities[i][timeIndex];

        // only draw the image if its parity is non-zero.
        // images with parity 0 are non-physical solutions.
        if (imageParity !== 0) {
          var imagePixelPos = lensedImagesPixelPos[i];
          var x = imagePixelPos.x[timeIndex];
          var y = imagePixelPos.y[timeIndex];
          context.beginPath();
          context.strokeStyle = outlineColors[i];
          context.fillStyle = fillColors[i];
          context.arc(x, y, 4, 0, 2 * Math.PI, false);
          context.fill();
          context.stroke();
        }
      }
    }

    // debug: plots every x,y point in image arrays, coded by color, regardless
    // of time; produces some wacky looking curves; neato
    if (debugPlotAllPoints === true) {
      for (var i = 0; i < lensedImagesPixelPos.length; i++) {
        var imagePixelPos = lensedImagesPixelPos[i];
        // context.rect(imagePixelPos.x[100], imagePixelPos.y[100], 10, 10);

        context.beginPath();
        for (var j = 0; j < imagePixelPos.x.length; j++) {
          var x = imagePixelPos.x[j];
          var y = imagePixelPos.y[j];
          context.rect(x, y, pointSizeX, pointSizeY);
        }
        context.fillStyle = fillColors[i];
        context.fill();
      }
    }
  }

  /** drawPic */
  function drawPic() {
    var display = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : displayFlags;
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : mainContext;
    var canvas = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : mainCanvas;
    var crvCanvases = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : curveCanvases;

    clearPic();
    drawBackgrounds();
    drawBorder();
    drawGridlinesAndTicks();
    toggleClippingRegion(turnOn = true);
    drawUarrow();

    drawLens(lens1);
    drawLens(lens2);

    if (display.caustic === true) {
      // draw prerendered caustic
      drawRenderedCurve(context, crvCanvases.caustic);
    }

    if (display.crit === true) {
      // draw prerendered crit
      drawRenderedCurve(context, crvCanvases.crit);
    }

    if (display.rings === true) {

      // draw separate rings for each lens
      drawRing(lens1);
      drawRing(lens2);
    }

    if (display.images === true) drawBinaryPointLensedImages();
    drawSourcePath();
    drawSource();

    toggleClippingRegion(turnOn = false);
    drawAxes();
  }

  return {
    renderCurves: renderCurves,
    convertLensedImagesPos: convertLensedImagesPos,
    drawPic: drawPic
  };
}();

// public properties to be stored in module object,
// accessible via module object by code executed after this script
module.exports = {
  // initialization

  // initialization function
  init: init,
  // whether initialization is done
  get initialized() {
    return initialized;
  },

  // mas
  get sourcePos() {
    return sourcePos;
  },
  // mas
  get xAxisInitialThetaX() {
    return xAxisInitialThetaX;
  },
  // mas
  get sourceRadius() {
    return sourceRadius;
  },
  renderCurves: drawing.renderCurves,
  convertLensedImagesPos: drawing.convertLensedImagesPos,
  redraw: redraw,
  getThetaX: getThetaX,
  initSourceRadius: initSourceRadius
};
