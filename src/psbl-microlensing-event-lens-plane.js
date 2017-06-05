/** Lens Plane Module.
  * Handles calculation and drawing of the lens plane plot for the microlensing
  * event.
  *
  * Depicts the source's path across the sky when the lenses are held fixed.
  *
  * Also listens for events from related UI buttons/sliders.
  *
  * @module PSBL_microlensing_event_lens_plane
  */

console.log("Executing psbl-microlensing-event-lens-plane.js");

var _ = require("lodash");

var eventModule = require("./psbl-microlensing-event.js")

var almostEquals = require("./utils.js").almostEquals;

var initialized = false; // whether module init function has been executed

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
// var thetaXwidth = 4/3;
var thetaXwidth = 4;
// var thetaYheight = 1; // mas
var thetaYheight = 3;
var xAxisInitialDay = -15;
// var xAxisInitialThetaX = -(4/3)/2
var xAxisInitialThetaX = -(4)/2
// var yAxisInitialThetaY = -0.5; // half of thetaYheight so that 0 is the middle
var yAxisInitialThetaY = -3/2;
// var xGridStepDefault = 0.1;
var xGridStepDefault = 0.25;
// var yGridStepDefault = 0.1;
var yGridStepDefault = 0.25;

/** A lens -- one of the two binary lenses.
  * @class Lens */
function Lens(xPos, yPos, radius, color, outlineWidth, outlineColor,
              ringRadiusX, ringRadiusY,
              ringColor, ringWidth, dashedRingLength, dashedRingSpacing) {
  this.updatePos = function(xPos, yPos) {
    this.pos = {
      x: xPos,
      y: yPos,
    };

    this.pixelPos = {
      x: thetaXtoPixel(xPos),
      y: thetaYtoPixel(yPos),
    };
  }

  this.updatePos(xPos, yPos);

  this.radius = 2;

  this.color = "red";
  this.outlineWidth = outlineWidth;
  this.outlineColor = outlineColor;

  this.ring = {
    radius: {
      x: ringRadiusX,
      y: ringRadiusY,
    },
    color: ringColor,
    width: ringWidth,
    dashedLength: dashedRingLength,
    dashedSpacing: dashedRingSpacing,
  };
}

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

var sourceColor = "#004d4d"; // darker teal
// initialized elsewhere in function
var sourceRadius; // mas
var sourceOutlineWidth = 2;
var sourceOutlineColor = "teal";

var lensRadius = 2;
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

var causticColor1 = "fuchsia";
var causticColor2 = "purple";
// causticColor1 = causticColor2; // when not debugging, these should be the same
var critColor1 = "orangeRed";
var critColor2 = "crimson";
// critColor1 = critColor2; // when not debugging, these should be the same
var causticPointSizeX = 2;
var causticPointSizeY = 2;
var critPointSizeX = 2;
var critPointSizeY = 2;

var binaryLensedImagePointSizeX = 2;
var binaryLensedImagePointSizeY = 2;
// var binaryLensedImageOutlineColors = ["aqua", "teal", "orange", "black", "pink"];
// var binaryLensedImageFillColors = ["pink", "aqua", "teal", "orange", "black"];
var binaryLensedImageOutlineColors = ["black", "black", "black", "black", "black"];
var binaryLensedImageFillColors = ["orange", "orange", "orange", "orange", "orange"];

//base variables (tick labels)
var tickLabelFont = "8pt Arial";
var tickLabelColor = "black";
var tickLabelAlign = "center";
var tickLabelBaseline = "middle";
var tickLabelSpacing = 7; // spacking between tick label and end of trailing gridline

// base variables (axis labels)
var xDayLabel = "time (days)";
var xLabel = String.fromCharCode(952) + "x (mas)"; // thetaX
var yLabel = String.fromCharCode(952) + "y (mas)"; // thetaY
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
var sourcePos; // x value: time (days); y value: thetaY
var sourcePixelPos; // pixel x and y values
// var lens1pixelPos;
// var lens2pixelPos;
var ringRadius = {x: undefined, y: undefined}
var sourceOutline;
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

// off-screen canvas for critical/caustic curves
var curveCanvas = document.createElement("canvas");
curveCanvas.width = mainCanvas.width;
curveCanvas.height = mainCanvas.width;
var curveContext = curveCanvas.getContext("2d");

var thetaXreadout = document.getElementById("thetaXreadout"); // readout of current source thetaX position
                                                              // mainly for debugging, but may keep
var sourceRadiusNormalizedReadout = document.getElementById("sourceRadiusNormalizedReadout");
var imageShapeCheckbox = document.getElementById("imageShapeCheckbox");
var sourceRadiusSlider = document.getElementById("sourceRadiusSlider");
var sourceRadiusReadout = document.getElementById("sourceRadiusReadout");

// if on, display shapes for the lensed images, not just points;
// toggled by checkbox
var displayImageShapeFlag = false;

var numPointsDefault = 360; // number of points into which source outline is divided
                         // i.e. a value of 8 would divide the outline into 8
                         // evenly spaced points

var numExtraPointsDefault = 360;

// debug flags
var animationFlag = true;
var centerLayoutFlag = false;
var drawGridFlag = true;
var drawFullLensedImagesFlag = true; //NOTE: Hammers performance currently
// if on, grid lines/ticks for that axis are created in steps starting from 0,
// rather than starting from the lowest x-axis value or y-axis value
var centerXgridOnZeroFlag = true;
var centerYgridOnZeroFlag = true;
// need on to work in Firefox;
// replaces context.ellipse with context.arc since firefox doesn't support ellipse;
// however, y-scaling of ring won't be correct if x/y aspect ratio is not square;
var firefoxCompatibilityFlag = true;
// add more points to outline if source is close to lens
var lensProximityCheckFlag = true;
var clippingImageFlag = false;
var binaryFlag = true;
var separateBinaryRingsFlag = true; // desplay separate rings for each lens;
                                    // for debugging/testing
var causticCurveFlag = true; // display caustic curve
var critCurveFlag = true; // display critical curve

var updateOnSliderMovementFlag = eventModule.updateOnSliderMovementFlag;
var updateOnSliderReleaseFlag = eventModule.updateOnSliderReleaseFlag;

// called from PSPL_microlensing_event.js (or whichever script holds the parameter
// values) after initializations and slider updates),
// because we NEED parameters initialized first to do drawing and scaling

/** init */
function init(animation=animationFlag) {
  initListeners();
  updateScaleAndRangeValues();
  initLenses();
  initSourcePos(animation=animation);
  initSourceRadius();
  drawing.renderCurves();
  redraw();

  initialized = true;
}

/** initListeners */
function initListeners(updateOnSliderMovement=updateOnSliderMovementFlag,
                       updateOnSliderRelease=updateOnSliderReleaseFlag) {
  imageShapeCheckbox.addEventListener("change", function() { displayImageShapeFlag = imageShapeCheckbox.checked;
                                                             redraw();
                                                             console.log(`displayImageShapeFlag: ${displayImageShapeFlag}`); }, false);
  console.log("(binary_lens_plane) updateOnSliderMovement: " + updateOnSliderMovement);
  console.log("(binary_lens_plane) updateOnSliderRelease: " + updateOnSliderRelease);

  // update plot when slider is moved

  if (sourceRadiusSlider !== null) {
    if (updateOnSliderMovement === true) {
      sourceRadiusSlider.addEventListener("input", function() { updateSourceRadius(); }, false);
    }

    // update plot when slider is released

    if (updateOnSliderRelease === true) {
      sourceRadiusSlider.addEventListener("change", function() { updateSourceRadius(); }, false);

      // if plot updates only upon slider release,
      // update slider readout alone while slider is being moved,
      // without recalculating/updating other sliders (until after current slider is released)
      if (updateOnSliderMovement === false) {
        sourceRadiusSlider.addEventListener("input",
                                            function() { eventModule.updateSliderReadout(sourceRadiusSlider,
                                                                                        sourceRadiusReadout,
                                                                                        "sourceRadius"); }, false);
      }

    }
  }
}

/** initLenses */
function initLenses(isBinary=binaryFlag) {
  var ring1radius_mas = eventModule.calculateThetaE(get_mas=true, useBinaryMass=false, lensToUse=1);
  var ring1radiusX = ring1radius_mas * xPixelScale;
  var ring1radiusY = ring1radius_mas * yPixelScale;

  lens1 = new Lens(0, 0, lensRadius, lensColor,
                   lensOutlineWidth, lensOutlineColor,
                   ring1radiusX, ring1radiusY,
                   ringColor, ringWidth, dashedRingLength, dashedRingSpacing);

  if (isBinary === true) {
    var ring2radius_mas = eventModule.calculateThetaE(get_mas=true, useBinaryMass=false, lensToUse=2);
    var ring2radiusX = ring2radius_mas * xPixelScale;
    var ring2radiusY = ring2radius_mas * yPixelScale;

    var lensSep = eventModule.lensSep;
    lens1.updatePos(-lensSep/2, 0);
    lens2 = new Lens(lensSep/2, 0, lensRadius, lensColor,
                     lensOutlineWidth, lensOutlineColor,
                     ring2radiusX, ring2radiusY,
                     ringColor, ringWidth, dashedRingLength, dashedRingSpacing);
  }
}

/** initSourceRadius */
function initSourceRadius() {
  sourceRadius = 4/xPixelScale; // source radius in mas
  // sourceRadius = 0.0133; // mas
  // sourceRadius = 0.0636; // mas

  lensedImageRadius = sourceRadius*xPixelScale;

  if (sourceRadiusSlider !== null)
    updateSourceRadiusSlider();
}

/** updateSourceRadiusSlider */
function updateSourceRadiusSlider() {
  sourceRadiusSlider.value = sourceRadius; // source radius in mas
  eventModule.updateSliderReadout(sourceRadiusSlider, sourceRadiusReadout, "sourceRadius");
  // sourceRadiusReadout.innerHTML = Number(sourceRadiusSlider.value).toFixed(4);
}

/** updateSourceRadius */
function updateSourceRadius() {
  sourceRadius = sourceRadiusSlider.value; // source radisu in mas
  lensedImageRadius = sourceRadius * xPixelScale;
  updateSourceRadiusSlider();
  eventModule.updateCurveData();
  eventModule.redrawCanvases();
  // eventModule.plotLightcurve();
  // redraw();
}

/** initSourcePos */
function initSourcePos(animation=animationFlag) {
  var sourcePosY = eventModule.thetaY;
  sourcePos = {x: getThetaX(eventModule.xAxisInitialDay), y: sourcePosY};

  if (animation === false) {
    sourcePos.x = xAxisFinalThetaX;
    // sourcePos.x = xAxisInitialThetaX;
  }
}

/** redraw */
function redraw(animation=animationFlag) {
  updateDrawingValues(animation=animation);
  drawing.drawPic();
}

/** updateScaleAndRangeValues */
function updateScaleAndRangeValues() {
  // borders
  picRightBorder = picLeftBorder + picWidth; // right border of picture x-pixel value, NOT including any trailing gridlines
  picBottomBorder = picTopBorder + picHeight; // bottom border of picture y-pixel value, NOT including any trailing gridlines
  centerX = picWidth/2 + picLeftBorder;
  centerY = picHeight/2 + picTopBorder;

  // trails
  picLeftTrailingBorder = picLeftBorder - picLeftTrail; // left border of picture x-pixel value, INCLUDING any trailing gridlines
  picRightTrailingBorder = picRightBorder + picRightTrail; // right border of picture x-pixel value, INCLUDING any trailing gridlines
  picTopTrailingBorder = picTopBorder - picTopTrail; // top border of picture y-pixel value, INCLUDING any trailing gridlines
  picBottomTrailingBorder = picBottomBorder + picBottomTrail; // bottom border of picture y-pixel value, INCLUDING any trailing gridlines

  // range/scale
  xDayPixelScale = picWidth/dayWidth;
  xPixelScale = picWidth/thetaXwidth;
  yPixelScale = picHeight/thetaYheight;

  xAxisFinalDay = xAxisInitialDay + dayWidth;
  xAxisFinalThetaX = xAxisInitialThetaX + thetaXwidth;
  yAxisFinalThetaY = yAxisInitialThetaY + thetaYheight;

  //grid values
  updateGridRange(xGridStepDefault, yGridStepDefault); // initialize gridline vars
}

/** updateDrawingValues */
function updateDrawingValues(animation=animationFlag) {
  // if (animation === true)
  //   sourcePos.x = getThetaX(eventModule.xAxisInitialDay);
  sourcePos.y = getThetaYpathValue(sourcePos.x); // update source thetaY

  // makes sure "0.0000" is displayed instead of "-0.0000" if rounding error
  // occurs
  if (thetaXreadout !== null) {
    var newThetaXreadout = Number(sourcePos.x).toFixed(4)
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
  sourcePixelPos = {x: thetaXtoPixel(sourcePos.x), y: thetaYtoPixel(sourcePos.y)};
  // ringRadius.x = eventModule.thetaE_mas * xPixelScale;
  // ringRadius.y = eventModule.thetaE_mas * yPixelScale;

  // lens pixel position
  // lens1.pixelPos = {x:thetaXtoPixel(lens1.pos.x), y: thetaYtoPixel(lens1.pos.y)};
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
  var yPixel = picBottomBorder - (yPicThetaY - yAxisInitialThetaY) * yPixelScale
  return yPixel;
}

/** getThetaX */
function getThetaX(t) {
  var mu = eventModule.mu;
  var t0 = eventModule.t0;
  var yearToDay = 365.25; // day/year; const
  var eqMu = mu / yearToDay; // convert mu to milliarcseconds/day
  var thetaX = eqMu * (t - t0);
  return thetaX;
}

/** getThetaYpathValue */
function getThetaYpathValue(thetaX) {
  var incline_radians = eventModule.incline * Math.PI/180;
  var slope = Math.tan(incline_radians);
  var thetaYintercept = eventModule.thetaY; // mas

  var thetaYvalue = slope*thetaX + thetaYintercept;
  return thetaYvalue;
}

/** updateGridRange */
function updateGridRange(xStep, yStep, centerXgridOnZero=centerXgridOnZeroFlag,
                         centerYgridOnZero=centerYgridOnZeroFlag) {
  // update grid with new step values,
  // and/or update grid for new initial/final axis values using

  // if new step values are passed in, update grid step values;
  // otherwise leave grid steps unchanged when updating grid
  if ( !(xStep === undefined) && !(yStep === undefined)) {
    xGridStep = xStep;
    yGridStep = yStep;
  }

  // update grid using current x/y axis initial and final values
  if ((centerXgridOnZero === true) && (xGridStep - Math.abs(xAxisInitialThetaX % xGridStep) > 1e-10))
   xGridInitial = xAxisInitialThetaX - (xAxisInitialThetaX % xGridStep);
  else
    xGridInitial = xAxisInitialThetaX;
  console.log(`xGridInitial: ${xGridInitial}`);

  xGridFinal = xAxisFinalThetaX;

  if ((centerYgridOnZero === true) && (yGridStep - Math.abs(yAxisInitialThetaY % yGridStep) > 1e-10))
    yGridInitial = yAxisInitialThetaY - (yAxisInitialThetaY % yGridStep);
  else
    yGridInitial = yAxisInitialThetaY;

  console.log(`y axis grid offset: ${yAxisInitialThetaY % yGridStep}`)
  console.log(`yGridStep - Math.abs(yAxisInitialThetaY % yGridStep): ${yGridStep - Math.abs(yAxisInitialThetaY % yGridStep) < 0.01}`);
  console.log(`yAxisInitialThetaY: ${yAxisInitialThetaY}`);
  console.log(`yGridInitial: ${yGridInitial}`);

  // same rounding for final y grid line placement
  yGridFinal = yAxisFinalThetaY;

  // console.log(Math.floor)
  // console.log("MathFloored xAxisInitialDay: " + Math.floor(xAxisInitialDay));
  // console.log("xGridInitial: " + xGridInitial);
  // console.log("xGridFinal: " + xGridFinal);
  // console.log("MathFloored yAxisInitialThetaY: " + Math.floor(yAxisInitialThetaY));
  // console.log("yGridInitial: " + yGridInitial);
  // console.log("yGridFinal: " + yGridFinal);
}

/** xDayToThetaX */
function xDayToThetaX() {}
/** drawing */
var drawing = (function(isBinary=binaryFlag, context=mainContext, canvas=mainCanvas) {
  /** clearPic */
  function clearPic(context=mainContext) {
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
    if (turnOn !== true && turnOn !==false) {
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
    else if (turnOn === false && this.isOn === true){
      context.restore();
      this.isOn = false;
    }
  }

  /** drawLens */
  function drawLens(lens=lens1) {
    context.beginPath();
    context.arc(lens.pixelPos.x, lens.pixelPos.y, lens.radius, 0, 2*Math.PI, false);
    context.fillStyle = lens.color;
    context.fill();
    context.lineWidth = lens.outlineWidth;
    context.strokeStyle = lens.outlineColor;
    context.stroke();
  }

  /** drawRing */
  function drawRing(lens=lens1, firefoxCompatibility=firefoxCompatibilityFlag) {
    var ring = lens.ring;
    context.beginPath();
    // ellipse not compatible with firefox
    if (firefoxCompatibility === true)
      context.arc(lens.pixelPos.x, lens.pixelPos.y, ring.radius.x, 0, 2*Math.PI, false);
    else
      context.ellipse(lens.pixelPos.x, lens.pixelPos.y, ring.radius.x,
                      ring.radius.y, 0, 0, 2*Math.PI)
    context.strokeStyle = ring.color;
    context.lineWidth = ring.width;
    context.setLineDash([ring.dashedLength, ring.dashedSpacing]); // turn on dashed lines
    context.stroke();
    context.setLineDash([]); // turn off dashed-line drawing
  }

  // use this for when implementing animation;
  // for now, should be at end of path, if we bother placing it
  /** drawSource */
  /** drawSource */
  function drawSource(useOutline=false) {
    // set aesthetics
    context.lineWidth = sourceOutlineWidth;
    context.strokeStyle = sourceOutlineColor;
    context.fillStyle = sourceColor;

    // draw source
    if (useOutline === true) {
      for (i in sourceOutline) {
        context.fillStyle = "SpringGreen";
        context.beginPath();
        context.arc(thetaXtoPixel(sourceOutline[i].x), thetaYtoPixel(sourceOutline[i].y), 1, 0, 2*Math.PI, false);
        context.fill();
      }
    }
    else {
      context.beginPath();
      var radiusPixels = sourceRadius * xPixelScale;
      context.arc(sourcePixelPos.x, sourcePixelPos.y, radiusPixels, 0, 2*Math.PI, false);
      context.fill();
      context.stroke();
    }
  }

  /** drawSourcePath */
  function drawSourcePath() {

    var thetaYleft = getThetaYpathValue(xAxisInitialThetaX);
    var thetaYright = getThetaYpathValue(xAxisFinalThetaX);
    var thetaYpixelLeft = thetaYtoPixel(thetaYleft);
    var thetaYpixelRight = thetaYtoPixel(thetaYright);

    // dashed line (path yet to be travelled)
    context.beginPath();
    // context.moveTo(picLeftBorder, sourcePixelPos.y);
    context.moveTo(picLeftBorder, thetaYpixelLeft);
    // context.lineTo(picRightBorder, sourcePixelPos.y);
    context.lineTo(picRightBorder, thetaYpixelRight);
    context.setLineDash([dashedPathLength, dashedPathSpacing]); // turn on dashed lines
    context.strokeStyle = dashedPathColor;
    context.lineWidth = dashedPathWidth;
    context.stroke();
    context.setLineDash([]); // turn off dashed lines

    // solid line (path traveled so far)
    context.beginPath();
    // context.moveTo(picLeftBorder, sourcePixelPos.y);
    context.moveTo(picLeftBorder, thetaYpixelLeft);
    // context.lineTo(sourcePixelPos.x, sourcePixelPos.y);
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
      context.moveTo(picLeftBorder - axisWidth/2, picBottomBorder);
      context.lineTo(picRightBorder + 15, picBottomBorder);

      // y axis;
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

    function drawAxisLabels(centerLayout=centerLayoutFlag) {
      // x label
      context.font = axisLabelFont;
      context.textAlign = axisLabelAlign;
      context.textBaseline = axisLabelBaseline;
      context.fillStyle = axisLabelColor;

      if (centerLayout === true) {
        // x label
        context.fillText(xLabel, centerX, picBottomTrailingBorder + axisLabelSpacing)

        // y label
        context.save();
        context.translate(picLeftTrailingBorder - 25, centerY);
        context.rotate(-Math.PI/2);
        context.textAlign = "center";
        context.fillText(yLabel, 0, 0);
        context.restore();
      }
      else {
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
  function drawGridlinesAndTicks(drawGrid=drawGridFlag, noTicks) {
    // draw vertical lines and x axis tick labels
    context.beginPath();
    console.log(`yGridStep: ${yGridStep}`);
    for (var thetaX = xGridInitial; thetaX <= xGridFinal; thetaX+=xGridStep) {
      // console.log(thetaX);
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
      // (note 0 === -0 in javascript)
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
    for (var thetaY = yGridInitial; thetaY <= yGridFinal; thetaY+=yGridStep) {
      var yPixel = thetaYtoPixel(thetaY);
      context.moveTo(picLeftTrailingBorder, yPixel);
      // if using gridlines, line extends to end of right trail
      var xLineEnd = picRightTrailingBorder;
      // if not using gridlines, draw tick lines
      if (drawGrid ===false)
        // tick lines extend one trailing length on either side of axis
        xLineEnd = picLeftBorder + picLeftTrail;
      context.lineTo(xLineEnd, yPixel);

      var yTickLabel = Number(thetaY).toFixed(2);

      // catches if yTickLabel is set to "-0.00" due to rounding error and
      // converts to "0.00";
      // (note 0 === -0 in javascript)
      if (Number(yTickLabel) === -0) {
        yTickLabel = Number(0).toFixed(2);
      }
      context.font = tickLabelFont;
      context.fillStyle = tickLabelColor;
      context.textAlign = "right";
      context.textBaseline = tickLabelBaseline;
      context.fillText(yTickLabel,picLeftTrailingBorder - tickLabelSpacing,  yPixel);
    }
    context.lineWidth = gridWidth;
    context.strokeStyle = gridColor;
    context.stroke();
  }

  /** unNormalizeCurve */
  function unNormalizeCurve(normalizedCurve) {
    var curve = {};
    _.forOwn(normalizedCurve, function(coordList, coordKey) {
      if (coordKey !== "transitionIndex") {
        curve[coordKey] = numeric.mul(coordList, eventModule.thetaE_mas)
      }
    });
    return curve;
  }

  /** pixelizeCoordList */
  function pixelizeCoordList(coordList, axis="x") {
    var pixelizedCoordList = new Array(coordList.length);

    for (var i=0; i<coordList.length; i++) {
      if (axis === "y")
        pixelizedCoordList[i] = thetaYtoPixel(coordList[i]);
      else
        pixelizedCoordList[i] = thetaXtoPixel(coordList[i]);
    }

    return pixelizedCoordList
  }

  /** pixelizeCurve */
  function pixelizeCurve(curve) {
    var pixelizedCurve = {};
    _.forOwn(curve, function(coordList, coordKey) {
      if (coordKey !== "transitionIndex") {
        pixelizedCurve[coordKey] = pixelizeCoordList(coordList, coordKey[0]);
      }
    });
    return pixelizedCurve;
  }

  /** renderCaustic */
  function renderCaustic(color1="purple", color2="green", pointSizeX,
                        pointSizeY, context=curveContext) {
    renderCurve(eventModule.causticNormalized, color1, color2, pointSizeX,
                pointSizeY, context);
  }

  /** renderCrit */
  function renderCrit(color1="purple", color2="green", pointSizeX,
                      pointSizeY, context=curveContext) {
    renderCurve(eventModule.critNormalized, color1, color2, pointSizeX,
                pointSizeY, context);
  }

  /** renderCurves */
  function renderCurves(causColor1=causticColor1, causColor2=causticColor2,
                        crtColor1=critColor1, crtColor2=critColor2,
                        causPointSizeX=causticPointSizeX,
                        causPointSizeY=causticPointSizeY,
                        crtPointSizeX=critPointSizeX,
                        crtPointSizeY=critPointSizeY,
                        caustic=causticCurveFlag, crit=critCurveFlag,
                        context=curveContext) {
    clearPic(context); // clear off-screen canvas

    if (caustic === true)
      renderCaustic(causColor1, causColor2, causPointSizeX, causPointSizeY, context);

    if (crit === true)
      renderCrit(crtColor1, crtColor2, crtPointSizeX, crtPointSizeY, context);
  }

  /** setPixel */
  function setPixel(imageData, x, y, r, g, b, a) {

    if (x >= picLeftBorder && x <= picRightBorder
        && y >= picTopBorder && y <= picBottomBorder) {
      index = (x + y * imageData.width) * 4;
      imageData.data[index+0] = r;
      imageData.data[index+1] = g;
      imageData.data[index+2] = b;
      imageData.data[index+3] = a;
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

    // xList.push(x + 1);
    // yList.push(y + 1);

    // xList.push(x - 1);
    // yList.push(y + 1);

    // xList.push(x + 1);
    // yList.push(y - 1);

    // xList.push(x - 1);
    // yList.push(y - 1);

    for (var i=0; i<xList.length; i++) {
      setPixel(imageData, xList[i], yList[i], r, g, b, a);
    }
  }

  /** colorToRGBA */
  function colorToRGBA(color) {
    // Returns the color as an array of [r, g, b, a] -- all range from 0 - 255
    // color must be a valid canvas fillStyle. This will cover most anything
    // you'd want to use.
    // Examples:
    // colorToRGBA("red")  # [255, 0, 0, 255]
    // colorToRGBA(""#f00") # [255, 0, 0, 255]
    var tempCanvas = document.createElement("canvas");
    tempCanvas.height = 1;
    tempCanvas.width = 1;
    var tempContext = tempCanvas.getContext("2d");
    tempContext.fillStyle = color;
    tempContext.fillRect(0, 0, 1, 1);
    return tempContext.getImageData(0, 0, 1, 1).data;
  }

  /** renderCurve */
  function renderCurve(curveNormalized, color1="purple", color2="green",
                       pointSizeX, pointSizeY, context=curveContext) {
    var curve = unNormalizeCurve(curveNormalized);
    var pixelCurve = pixelizeCurve(curve);

    var drawPointsDebugTest = false; // fast, but looks kinda bad
    var drawPoints = true;  // not quite as fast, but looks good
    var drawCircles = false; // slow; don't use this
    var drawLines = false; // fastest, but doesn't work right

    if (drawPointsDebugTest === true) {

      var color1RGBA = colorToRGBA(color1);
      var color2RGBA = colorToRGBA(color2);

      context.beginPath();
      var imageData = context.getImageData(0, 0, canvas.width, canvas.height); // only do this once per page

      for (var i=1; i<pixelCurve.x1.length; i+=1) {
        var x1 = Math.round(pixelCurve.x1[i]);
        var y1 = Math.round(pixelCurve.y1[i]);
        // debug default: 138, 43, 226, 255
        setPicPixel(imageData, x1, y1, color1RGBA[0], color1RGBA[1], color1RGBA[2], color1RGBA[3]);
        // context.fillRect(x1, y1, 1, 1);
        // window.alert(x1 + " " + y1);
      }

      for (var i=1; i<pixelCurve.x2.length; i+=1) {
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
        for (var i=0; i<pixelCurve.x1.length; i+=1) {
          var x1 = pixelCurve.x1[i];
          var y1 = pixelCurve.y1[i];
          context.rect(x1-pointSizeX/2, y1-pointSizeY/2, pointSizeX, pointSizeY);

          var x2 = pixelCurve.x2[i];
          var y2 = pixelCurve.y2[i];
          context.rect(x2-pointSizeX/2, y2-pointSizeY/2, pointSizeX, pointSizeY);
        }
        context.fillStyle = color1;
        context.fill();
      }
      else {
        for (var i=0; i<pixelCurve.x1.length; i+=1) {
          var x1 = pixelCurve.x1[i];
          var y1 = pixelCurve.y1[i];

          context.rect(x1-pointSizeX/2, y1-pointSizeY/2, pointSizeX, pointSizeY);
        }
        context.fillStyle = color1;
        context.fill();

        context.beginPath();
        for (var i=0; i<pixelCurve.x2.length; i+=1) {
          var x2 = pixelCurve.x2[i];
          var y2 = pixelCurve.y2[i];

          context.rect(x2-pointSizeX/2, y2-pointSizeY/2, pointSizeX, pointSizeY);
        }
        context.fillStyle = color2;
        context.fill();
      }
    }

    if (drawCircles === true) {
      context.fillStyle = color1;
      for (var i=0; i<pixelCurve.x1.length; i+=1) {
        var x1 = pixelCurve.x1[i];
        var y1 = pixelCurve.y1[i];
        context.beginPath();
        context.arc(x1, y1, pointSizeX, 0, 2*Math.PI, false)
        context.fill();
      }

      context.fillStyle = color2;
      for (var i=0; i<pixelCurve.x2.length; i+=1) {
        var x2 = pixelCurve.x2[i];
        var y2 = pixelCurve.y2[i];
        context.beginPath();
        context.arc(x2, y2, pointSizeX, 0, 2*Math.PI, false)
        context.fill();
      }
    }

    if (drawLines === true) {
      var pointSeparationThreshold = 1; // minimum pixel separation allowed
                                               // between points that we connect
                                               // with lines
      context.beginPath();
      context.moveTo(pixelCurve.x1[0], pixelCurve.y1[0]);
      // window.alert(pixelCurve.x1.length);

      var prevX1;
      var prevY1;
      // window.alert("length: " + pixelCurve.x1.length);
      // debugging: for length 16220, line starts displaying wrong at i=2411
      for (var i=1; i<pixelCurve.x1.length; i+=1) {
        var x1 = pixelCurve.x1[i];
        var y1 = pixelCurve.y1[i];

        if (prevX1 !== undefined && prevY1 !== undefined) {
          var x1Diff = x1 - prevX1;
          var y1Diff = y1 - prevY1;

          var dist1 = Math.sqrt(x1Diff*x1Diff + y1Diff*y1Diff);

          if (i === curveNormalized.transitionIndex ) {
            // window.alert("i: " + i + "\nlength: " + pixelCurve.x1.length
            //              + "\n\nprevX1: " + prevX1 + "\nprevY1: " + prevY1
            //              + "\n\nx1: " + x1 + "\ny1: " + y1
            //              + "\n\ndist1: " + dist1
            //              + "\n\ntransitionIndex: " + curveNormalized.transitionIndex);

            context.moveTo(x1, y1);
          }
          else {
            context.lineTo(x1, y1);
          }
        }
        else
          context.lineTo(x1, y1);

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
      for (var i=1; i<pixelCurve.x2.length; i+=1) {
        var x2 = pixelCurve.x2[i];
        var y2 = pixelCurve.y2[i];

        if (prevX2 !== undefined && prevY2 !== undefined) {
          var x2Diff = x2 - prevX2;
          var y2Diff = y2 - prevY2;

          var dist2 = Math.sqrt(x2Diff*x2Diff + y2Diff*y2Diff);

          if (i === curveNormalized.transitionIndex ) {
            // window.alert("i: " + i + "\nlength: " + pixelCurve.x2.length
            //              + "\n\nprevX2: " + prevX2 + "\nprevY2: " + prevY2
            //              + "\n\nx2: " + x2 + "\ny2: " + y2
            //              + "\n\ndist2: " + dist2);

            context.moveTo(x2, y2);
          }
          else {
            context.lineTo(x2, y2);
          }
        }
        else
          context.lineTo(x2, y2);

        prevX2 = x2;
        prevY2 = y2;
      }
      context.strokeStyle = color2;
      context.stroke();
    }
  }

  /** drawRenderedCurves */
  function drawRenderedCurves(context=mainContext, imgCanvas=curveCanvas) {
    // Draw image from image canvas onto (most likely main) context
    context.drawImage(imgCanvas, 0, 0);
  }

  /** convertLensedImagesPos */
  function convertLensedImagesPos() {
    // Unnormalize positions of lensed images (originally normalized over
    // thetaE) and convert them to pixel positions. Store both angular and
    // pixel coordinates.

    var imagesNormalizedPos = eventModule.imagesNormalizedPos;

    // console.log(`(binary) imagesNormalizedPos.x.length: ${imagesNormalizedPos.x.length}`);
    // console.log(`(binary) imagesNormalizedPos.x.length: ${imagesNormalizedPos.x[0].length}`);

    var imageCount = imagesNormalizedPos.x.length;
    imagesPos = new Array(imageCount);
    imagesPixelPos = new Array(imageCount);
    for (var i=0; i<imageCount; i++) {
      var curveNormalized = {x: imagesNormalizedPos.x[i], y: imagesNormalizedPos.y[i]};
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
      var time = thetaX/eqMu + eventModule.t0
      return time;
  }

  /** drawBinaryPointLensedImages */
  function drawBinaryPointLensedImages(outlineColors=binaryLensedImageOutlineColors,
                                       fillColors=binaryLensedImageFillColors,
                                       pointSizeX=binaryLensedImagePointSizeX,
                                       pointSizeY=binaryLensedImagePointSizeY,
                                       debugPlotAllPoints=false) {
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
      for (var i=0; i<times.length; i++) {
        if (times[i] > time) {
          timeIndex = i;
          break;
        }
      }

      if (timeIndex === undefined)
        timeIndex = times.length-1;

      for (var i=0; i<lensedImagesPixelPos.length; i++) {
        var imagePixelPos = lensedImagesPixelPos[i];
        var x = imagePixelPos.x[timeIndex];
        var y = imagePixelPos.y[timeIndex];
        context.beginPath();
        context.strokeStyle = outlineColors[i];
        context.fillStyle = fillColors[i];
        context.arc(x, y, 4, 0, 2*Math.PI, false);
        context.fill();
        context.stroke();
      }
    }

    // debug: plots every x,y point in image arrays, coded by color, regardless of
    // time; produces some wacky looking curves; neato
    if (debugPlotAllPoints === true) {
      for (var i=0; i<lensedImagesPixelPos.length; i++) {
        var imagePixelPos = lensedImagesPixelPos[i];
        // context.rect(imagePixelPos.x[100], imagePixelPos.y[100], 10, 10);

        context.beginPath();
        for (var j=0; j<imagePixelPos.x.length; j++) {
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
  function drawPic(isBinary=binaryFlag, displayImageShape=displayImageShapeFlag,
                   context=mainContext, canvas=mainCanvas) {
    clearPic();
    drawBackgrounds();
    drawBorder();
    drawGridlinesAndTicks();
    toggleClippingRegion(turnOn=true);
    // drawSource(useOutline=true);
    drawUarrow();
    if (displayImageShape === true && isBinary === false) {
      if (eventModule.finiteSourceFlag === false ||
          eventModule.finiteSourceFlag !== undefined)
        drawPointLensedImages();
      else {
        if (clippingImageFlag === true) {
          context.save();
          context.beginPath();
          context.rect(0, 0, canvas.width, context.canvas.height);
          context.arc(lens1.pixelPos.x, lens1.pixelPos.y, ringRadius.x, 0, Math.PI * 2, true);
          context.clip();
        }
        drawFullLensedImages(debug=false, fillOn=true, strokeOn=true);
        //drawFullLensedImages(debug=true);
        if (clippingImageFlag === true)
          context.restore();
      }
    }
    // drawPointLensedImages();
    drawLens(lens1);

    // drawPointLensedImages();
    if (isBinary === true) {
      // draw second lens
      drawLens(lens2);

      if (causticCurveFlag === true || critCurveFlag === true) {
        // draw caustic and/or crit

        drawRenderedCurves();
        // context.fillRect(canvas.width/2, canvas.height/2, 50*Math.random(), 50);
      }

      if (separateBinaryRingsFlag === true) {

        // draw separate rings for each lens
        drawRing(lens1);
        drawRing(lens2);
      }
      drawBinaryPointLensedImages();
    }
    else { // single, non-binary lens
      drawRing(lens1);
    }
    drawSourcePath();
    drawSource();

    toggleClippingRegion(turnOn=false);
    drawAxes();
  }

  return {
    renderCurves: renderCurves,
    convertLensedImagesPos: convertLensedImagesPos,
    drawPic: drawPic,
  }

})();

// public properties to be stored in module object,
// accessible via module object by code executed after this script

module.exports = {
  //initialization
  init: init, // initialization function
  get initialized() { return initialized; }, // whether initialization is done

  get sourcePos() { return sourcePos; }, // mas
  get xAxisInitialThetaX() { return xAxisInitialThetaX; }, // mas
  get sourceRadius() { return sourceRadius; }, // mas
  renderCurves: drawing.renderCurves,
  convertLensedImagesPos: drawing.convertLensedImagesPos,
  redraw: redraw,
  getThetaX: getThetaX,
  initSourceRadius: initSourceRadius,
};
