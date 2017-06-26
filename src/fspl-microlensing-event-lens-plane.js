/** Lens Plane Module.
  * Handles calculation and drawing of the lens plane plot for the microlensing
  * event.
  *
  * Depicts the source's path across the sky when the lenses are held fixed.
  *
  * Also listens for events from related UI buttons/sliders.
  *
  * @module fspl-microlensing-event-lens-plane
  */

console.log("Executing fspl-microlensing-event-lens-plane.js");

var _ = require("lodash");

var eventModule = require("./fspl-microlensing-event.js")

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
var xAxisInitialThetaX = -(4)/2
// half of thetaYheight so that 0 is the middle
var yAxisInitialThetaY = -3/2;
var xGridStepDefault = 0.25;
var yGridStepDefault = 0.25;

var lens1;

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
var ringRadius = {x: undefined, y: undefined}
var lensedImages;
var sourceOutline;
var lensedImageOutlines;

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

var curveCanvases = {crit:critCanvas, caustic:causticCanvas};
var curveContexts = {crit:critContext, caustic:causticContext};

// readout of current source thetaX position
var thetaXreadout = document.getElementById("thetaXreadout");

var sourceRadiusNormalizedReadout = document.getElementById("sourceRadiusNormalizedReadout");
var sourceRadiusSlider = document.getElementById("sourceRadiusSlider");
var sourceRadiusReadout = document.getElementById("sourceRadiusReadout");

// checkboxes
var displayImagesCheckbox = document.getElementById("displayImagesCheckbox");
var displayRingsCheckbox = document.getElementById("displayRingsCheckbox");

// flags toggled by checkbox
var displayFlags = {};

// display lensed images of source
if (typeof displayImagesCheckbox !== "undefined" &&
    displayImagesCheckbox !== null) {
  displayFlags.images = displayImagesCheckbox.checked;
  }
else {
  displayFlags.images = true;
}

// display separate rings for each lens
if (typeof displayRingsCheckbox !== "undefined" &&
    displayRingsCheckbox !== null) {
  displayFlags.rings = displayRingsCheckbox.checked;
}
else {
  displayFlags.rings = true;
}

// debug flags
var centerLayoutFlag = false;
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
  redraw();

  initialized = true;
}

/** initListeners */
function initListeners(updateOnSliderMovement=updateOnSliderMovementFlag,
                       updateOnSliderRelease=updateOnSliderReleaseFlag) {
  initCheckboxes();
  initSliders(updateOnSliderMovement, updateOnSliderRelease);
}

/** initCheckboxes() */
function initCheckboxes() {

  if (typeof displayImagesCheckbox !== "undefined" &&
      displayImagesCheckbox !== null) {
    displayImagesCheckbox.addEventListener("change",
                                           function() {
                                             displayFlags.images = displayImagesCheckbox.checked;
                                             redraw();
                                           },
                                           false);
  }

  if (typeof displayRingsCheckbox !== "undefined" &&
      displayRingsCheckbox !== null) {
    displayRingsCheckbox.addEventListener("change",
                                          function() {
                                            displayFlags.rings = displayRingsCheckbox.checked;
                                            redraw();
                                          },
                                          false);
  }
}

/** initSliders */
function initSliders(updateOnSliderMovement=updateOnSliderMovementFlag,
                       updateOnSliderRelease=updateOnSliderReleaseFlag) {
  console.log("updateOnSliderMovement: " + updateOnSliderMovement);
  console.log("updateOnSliderRelease: " + updateOnSliderRelease);

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
                                            function() {
                                              eventModule.updateSliderReadout(sourceRadiusSlider,
                                                                              sourceRadiusReadout,
                                                                              "sourceRadius");
                                            },
                                            false);
      }
    }
  }
}

/** initLenses */
function initLenses() {
  var ring1radius_mas = eventModule.calculateThetaE(get_mas=true);

  lens1 = new Lens(xPixelScale, yPixelScale,
                  thetaXtoPixel, thetaYtoPixel,
                  0, 0, lensPixelRadius, lensColor,
                  lensOutlineWidth, lensOutlineColor,
                  ring1radius_mas,
                  ringColor, ringWidth, dashedRingLength, dashedRingSpacing);
}

/** initSourceRadius */
function initSourceRadius() {
  sourceRadius = 4/xPixelScale; // source radius in mas

  lensedImageRadius = sourceRadius*xPixelScale;

  if (sourceRadiusSlider !== null)
    updateSourceRadiusSlider();
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
  sourcePos = {x: getThetaX(eventModule.xAxisInitialDay), y: sourcePosY};
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
  centerX = picWidth/2 + picLeftBorder;
  centerY = picHeight/2 + picTopBorder;

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
  xDayPixelScale = picWidth/dayWidth;
  xPixelScale = picWidth/thetaXwidth;
  yPixelScale = picHeight/thetaYheight;

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
    var newThetaXreadout = Number(sourcePos.x).toFixed(4)
    if (Number(newThetaXreadout) === -0) {
      newThetaXreadout = Number(0).toFixed(4);
    }
    thetaXreadout.innerHTML = newThetaXreadout; // update source thetaX readout
  }

  if (typeof sourceRadiusNormalizedReadout !== "undefined" &&
      sourceRadiusNormalizedReadout !== null) {
    var newSourceRadiusNormalizedReadout = Number(sourceRadius / eventModule.thetaE_mas).toFixed(4);
    if (Number(newSourceRadiusNormalizedReadout) === -0) {
      newSourceRadiusNormalizedReadout = Number(0).toFixed(4);
    }
    sourceRadiusNormalizedReadout.innerHTML = newSourceRadiusNormalizedReadout;
  }

  // convert position to pixel units
  sourcePixelPos = {x: thetaXtoPixel(sourcePos.x), y: thetaYtoPixel(sourcePos.y)};

  // initialize lense position, appearance, etc.
  initLenses();

  // initialize lensed image positions
  lensedImages = getLensedImages(sourcePos);
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
   // day/year; const
  var yearToDay = 365.25;
  // convert mu to milliarcseconds/day
  var eqMu = mu / yearToDay;
  var thetaX = eqMu * (t - t0);
  return thetaX;
}

/** getThetaYpathValue */
function getThetaYpathValue(thetaX) {

  if (typeof eventModule.incline !== "undefined" &&
      eventModule.incline !== null) {
    var incline_radians = eventModule.incline * Math.PI/180;
    var slope = Math.tan(incline_radians);
  }
  else {
    var slope = 0;
  }

  var thetaYintercept = eventModule.thetaY; // mas

  var thetaYvalue = slope*thetaX + thetaYintercept;
  return thetaYvalue;
}

/** getCircleOutline */
function getCircleOutline(radius=sourceRadius, thetaPos=sourcePos,
                          numPoints=numPointsDefault, initialAngle=0,
                          finalAngle=2*Math.PI, lens=lens1) {
  var outline = [];
  var deltaAngle = (finalAngle - initialAngle)/numPoints;

  for (var angle=initialAngle; (angle<finalAngle && almostEquals(angle, finalAngle) === false); angle+=deltaAngle) {
    var xOffset = radius * Math.cos(angle);
    var yOffset = radius * Math.sin(angle);
    var point = {x: thetaPos.x + xOffset, y: thetaPos.y + yOffset};

    var deltaX = point.x - lens.pos.x;
    var deltaY = point.y - lens.pos.y;
    var distR = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
    var nextAngle = angle+deltaAngle;

    outline.push(point);
    if (lensProximityCheckFlag === true)
      addExtraPoints(outline, radius, thetaPos, angle, nextAngle, distR)
  }
  return outline;
}

/** addExtraPoints */
function addExtraPoints(outline, radius, thetaPos, initialAngle, finalAngle, distR, numExtraPoints=numExtraPointsDefault) {
  var deltaAngle = (finalAngle - initialAngle)/numExtraPoints;
  if (almostEquals(distR, 0, epsilon=1/xPixelScale) === true) {
    for (var angle=initialAngle+deltaAngle; (angle<finalAngle && almostEquals(angle, finalAngle) === false); angle+=deltaAngle) {
      var xOffset = radius * Math.cos(angle);
      var yOffset = radius * Math.sin(angle);
      var point = {x: thetaPos.x + xOffset, y: thetaPos.y + yOffset};
      outline.push(point);
    }
  }
}

/** getCircleOutlineWithRecursion */
function getCircleOutlineWithRecursion(radius=sourceRadius, thetaPos=sourcePos,
                          numPoints=numPointsDefault,
                          numExtraPoints=numExtraPointsDefault,
                          initialAngle, finalAngle, recurring=false,
                          lens=lens1) {
  // get points (in mas units) for outline of a circle, given its pixel radius
  // and theta position; defaults to getting source outline

  if (initialAngle === undefined)
    initialAngle = 0;

  if (finalAngle === undefined)
    finalAngle = 2*Math.PI;

  if (recurring === undefined)
    recurring = false;

  var outline = [];
  var deltaAngle = (finalAngle - initialAngle)/numPoints;
  for (var angle=initialAngle;
       (angle<finalAngle && almostEquals(angle, finalAngle) === false);
       angle += deltaAngle) {
    var xOffset = radius * Math.cos(angle);
    var yOffset = radius * Math.sin(angle);

    var point = {x: thetaPos.x + xOffset, y: thetaPos.y + yOffset}

    var deltaX = point.x - lens.pos.x;
    var deltaY = point.y - lens.pos.y;
    var distR = Math.sqrt(deltaX*deltaX + deltaY*deltaY);


    // how close outline point must be in pixels to lens for extra points to be added
    // var pixelProximity = sourceRadius*xPixelScale/4;
    var pixelProximity = sourceRadius / 0.0133;

    // if (pixelProximity > 30) // cap at 10 pixels
      // pixelProximity = 30;

    // output pixel proximity ONCE whenever value changes
    if (typeof this.pixelProximity !== "undefined" && pixelProximity !== this.pixelProximity) {
      console.log(`new pixelProximity: ${pixelProximity}`);
    }
    this.pixelProximity = pixelProximity;

    // if (almostEquals(distR, 0, epsilon=10/xPixelScale) === true && recurring === false && lensProximityCheckFlag===true) {
    if (almostEquals(distR, 0, epsilon=pixelProximity/xPixelScale) === true && recurring === false && lensProximityCheckFlag===true) {
      var nextAngle = angle + deltaAngle;
      // var halfwayAngle = (angle + nextAngle)/2;
      // var quarterAngle = (angle + halfwayAngle)/2;
      // var threeQuartersRadian = (halfwayAngle + nextAngle)/2;
      // var subOutline = getCircleOutline(radius, thetaPos, numPoints, quarterRadian, threeQuartersRadian, true);

      // var numExtraPoints2 = (nextAngle - angle)/(2*Math.PI/numExtraPoints);
      // console.log(`numExtraPoints2: ${numExtraPoints2}`);
      var subOutline = getCircleOutline(radius, thetaPos, numExtraPoints, numExtraPoints, angle, nextAngle, true);
      outline = outline.concat(subOutline);
    }
    else { // not close enough to center, or on a recursion iteration, or lens proximity check flag is off
      outline.push(point);
    }
  }

  return outline;
}

/** getLensedImages */
function getLensedImages(thetaPos=sourcePos, lens=lens1) {
  var thetaE_mas = eventModule.thetaE_mas;
  // var u0 = eventModule.u0;

  var images = {plus: {pos: undefined, pixelPos: undefined},
                minus: {pos: undefined, pixelPos: undefined}};

  var thetaR = Math.sqrt(thetaPos.x*thetaPos.x + thetaPos.y*thetaPos.y);
  var u = thetaR / thetaE_mas;
  var plusLensedImageR = ( ( u + Math.sqrt(u*u + 4) ) / 2 ) * thetaE_mas;
  // var minusLensedImageR = Math.abs( ( u - Math.sqrt(u*u + 4) ) / 2 ) * thetaE_mas;
  var minusLensedImageR = 1/plusLensedImageR * thetaE_mas*thetaE_mas;


  if (thetaPos.y >= 0)
    var thetaYsign = 1;
  else // thetaY is negative
    var thetaYsign = -1;

  var phi = Math.acos(thetaPos.x/thetaR) * thetaYsign;

  // var phi = Math.atan(thetaPos.y/thetaPos.x);
  //
  // // top-left or bottom-left quadrant
  // if (thetaPos.x < 0)
  //   phi += Math.PI;
  //
  // // bottom-right quadrant
  // if (thetaPos.x > 0 && thetaPos.y < 0)
  //   phi += 2*Math.PI;


  images.plus.pos = {x: lens.pos.x + plusLensedImageR * Math.cos(phi),
                     y: lens.pos.y + plusLensedImageR * Math.sin(phi)};
  images.minus.pos = {x: lens.pos.x + minusLensedImageR * Math.cos(Math.PI + phi),
                      y: lens.pos.y + minusLensedImageR * Math.sin(Math.PI + phi)};

  images.plus.pixelPos = {x: thetaXtoPixel(images.plus.pos.x),
                          y: thetaYtoPixel(images.plus.pos.y)};
  images.minus.pixelPos = {x: thetaXtoPixel(images.minus.pos.x),
                           y: thetaYtoPixel(images.minus.pos.y)};


  return images;
}

/** getLensedImageOutlines */
function getLensedImageOutlines(sourceOutline) {
  var outlines = {plus: [], minus: []};

  for (var index=0; index<sourceOutline.length; index++) {
    var sourcePoint = sourceOutline[index];
    // var sourcePoint = sourceOutline[0];
    var images = getLensedImages(sourcePoint);
    // images = {plus: {pos: {x:0, y:0}, pixelPos: {x:0, y:0}}, minus: {pos: {x:0, y:0}, pixelPos: {x:0, y:0}}};
    outlines.plus.push(images.plus);
    outlines.minus.push(images.minus);
  }
  return outlines;
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
}

/** xDayToThetaX */
function xDayToThetaX() {}
/** drawing */
var drawing = (function(context=mainContext, canvas=mainCanvas) {
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
    context.arc(lens.pixelPos.x, lens.pixelPos.y, lens.pixelRadius, 0, 2*Math.PI, false);
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
      ellipse(context, lens.pixelPos.x, lens.pixelPos.y, ring.pixelRadius.x, ring.pixelRadius.y);
    else
      context.ellipse(lens.pixelPos.x, lens.pixelPos.y, ring.pixelRadius.x,
                      ring.pixelRadius.y, 0, 0, 2*Math.PI)
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
    context.arc(sourcePixelPos.x, sourcePixelPos.y, radiusPixels, 0, 2*Math.PI, false);
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
      // converts to "0.00"

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

  /** drawPointLensedImages */
  function drawPointLensedImages() {
    // console.log("Lensed image mas position (plus): " + String(lensedImages.plus.pos.x) + ", " + String(lensedImages.plus.pos.y));
    // console.log("Lensed image mas position (minus): " + String(lensedImages.minus.pos.x) + ", " + String(lensedImages.minus.pos.y));

    // console.log("Lensed image pixel position (plus): " + String(lensedImages.plus.pixelPos.x) + ", " + String(lensedImages.plus.pixelPos.y));
    // console.log("Lensed image pixel position (minus): " + String(lensedImages.minus.pixelPos.x) + ", " + String(lensedImages.minus.pixelPos.y));

    context.lineWidth = lensedImageLineWidth;
    context.fillStyle = lensedImagePlusColor;
    context.strokeStyle = lensedImagePlusOutlineColor;

    context.setLineDash([dashedLensedImageLength, dashedLensedImageSpacing]);
    context.beginPath();
    context.arc(lensedImages.plus.pixelPos.x, lensedImages.plus.pixelPos.y, lensedImageRadius, 0, 2*Math.PI, false);
    context.fill();
    context.stroke();

    context.fillStyle = lensedImageMinusColor;
    context.strokeStyle = lensedImageMinusOutlineColor;
    context.beginPath();
    context.arc(lensedImages.minus.pixelPos.x, lensedImages.minus.pixelPos.y, lensedImageRadius, 0, 2*Math.PI, false);
    context.fill();
    context.stroke();
    context.setLineDash([]);
  }

  /** drawFullLensedImage */
  function drawFullLensedImage(sign="plus", debug=false, fillOn=true,
                               strokeOn=false, lens=lens1) {
    // draw either a plus or minus lensed image

    // set aesthetics and select plus or minus outlines object
    context.lineWidth = lensedImageLineWidth;
    if (sign === "plus") {
      context.strokeStyle = "fuchsia";
      context.fillStyle = "purple";

      if (debug === true) {
        context.fillStyle = "black";
      }
      var outlines = lensedImageOutlines.plus;
    }

    else if (sign === "minus") {
      context.strokeStyle = "lime";
      context.fillStyle = "green";

      if (debug === true) {
        context.fillStyle = "DarkGrey";
      }
      var outlines = lensedImageOutlines.minus;
    }

    else {
      console.log(`sign ${sign} is in valid. Must be "plus" or "minus"`)
      return;
    }

    if (outlines === undefined || outlines.length === 0) {
      return;
    }

    // draw line through each point in outline array
    if (debug === false) {
      context.beginPath();
      context.moveTo(outlines[0].pixelPos.x, outlines[0].pixelPos.y);
    }

    for (var index = 0; index<outlines.length; index++) {
      var pixelPos = outlines[index].pixelPos;

      if (debug === false) {
        context.lineTo(pixelPos.x, pixelPos.y);
      }
      else {
        context.beginPath();
        // filling in rectangles for points is much faster than
        // filling circles with arc function
        context.fillRect(pixelPos.x-0.5, pixelPos.y-0.5, 1, 1);
        // context.arc(pixelPos.x, pixelPos.y, 1, 0, 2*Math.PI);
        // context.fill();
      }
    }
    // context.closePath();
    if (debug === false) {
       context.lineTo(outlines[0].pixelPos.x, outlines[0].pixelPos.y);
      //context.closePath();

      //context.setLineDash([dashedLensedImageLength, dashedLensedImageSpacing]);

      if (fillOn === true)
        context.fill();
      if (strokeOn === true)
        context.stroke();

      //context.setLineDash([]);
    }
  }

  /** drawCombinedImage */
  function drawCombinedImage(fillOn=true, strokeOn=false) {

    function drawInnerOutline() {
      context.moveTo(innerOutlines[0].pixelPos.x, innerOutlines[0].pixelPos.y);
      for (var i=1; i<innerOutlines.length; i++) {
        var pixelPos = innerOutlines[i].pixelPos;
        context.lineTo(pixelPos.x, pixelPos.y);
      }
      //context.closePath();
      context.lineTo(innerOutlines[0].pixelPos.x, innerOutlines[0].pixelPos.y);


    }

    function drawOuterOutline(outerConnectionIndex) {
      var seenStartBefore=false;
      var loop = true;
      for (var j=outerConnectionIndex; loop===true; j--) {
        if (j < 0) {
          j = outerOutlines.length + j;
        }

        if (j === outerConnectionIndex)  {
          if (seenStartBefore === true) {
            loop = false;
          }
          else { // seenStartBefore === false
            seenStartBefore = true;
          }
        }

        var pixelPos = outerOutlines[j].pixelPos;
        context.lineTo(pixelPos.x, pixelPos.y);
      }
      context.lineTo(outerOutlines[outerOutlines.length-1].pixelPos.x,
                     outerOutlines[outerOutlines.length-1].pixelPos.y);
    }

    context.lineWidth = lensedImageLineWidth;
    context.strokeStyle = "aqua";
    context.fillStyle = "navy";

    outerOutlines = lensedImageOutlines.plus;
    innerOutlines = lensedImageOutlines.minus;

    if (outerOutlines === undefined || outerOutlines.length === 0 ||
        innerOutlines === undefined || innerOutlines.length === 0) {
      return;
    }

    if (fillOn === true) {
      // connect inner outline to outer outline and set outer path start

      // draw inner outline
      context.beginPath();
      drawInnerOutline();

      // set outer outline start
      var outerConnectionIndex = outerOutlines.length-1;
      // connect inner outline to outer outline start
      context.lineTo(outerOutlines[outerConnectionIndex].pixelPos.x, outerOutlines[outerConnectionIndex].pixelPos.y);
      drawOuterOutline(outerConnectionIndex);

      context.fill();
    }

    if (strokeOn === true) {
      // draw separate outline for outer and inner outlines

      //context.setLineDash([dashedLensedImageLength, dashedLensedImageSpacing]);

      // draw and display inner outline
      context.beginPath();
      drawInnerOutline();
      context.stroke();

      // draw and display outer outline as separate path
      context.beginPath();
      // set outer path start point
      var outerConnectionIndex = outerOutlines.length-1;
      // move to outer outline start, without connecting inner outline
      context.moveTo(outerOutlines[outerConnectionIndex].pixelPos.x, outerOutlines[outerConnectionIndex].pixelPos.y);
      drawOuterOutline(outerConnectionIndex);
      context.stroke();

      //context.setLineDash([]);
    }
  }

  /** drawFullLensedImages */
  function drawFullLensedImages(debug=false, fillOn=false, strokeOn=false,
                                lens=lens1) {
    // draw both plus and minus lensed images

    sourceLensDistX = sourcePos.x - lens.pos.x;
    sourceLensDistY = sourcePos.y - lens.pos.y;
    sourceLensDist = Math.sqrt(sourceLensDistX * sourceLensDistX +
                               sourceLensDistY * sourceLensDistY);

    if (sourceLensDist <= sourceRadius && debug === false) {
      console.log("draw combination of full lensed images");
      drawCombinedImage(fillOn, strokeOn);
    }
    else {
      console.log("draw full lensed images");
      drawFullLensedImage("plus", debug, fillOn, strokeOn, lens1); // draw plus image
      drawFullLensedImage("minus", debug, fillOn, strokeOn, lens1); // draw minus image
    }
  }

  /** getTimeFromThetaX */
  function getTimeFromThetaX(thetaX) {
    // temp: very hacky
      var yearToDay = 365.25; // day/year; const
      var eqMu = eventModule.mu / yearToDay; // convert mu to milliarcseconds/day
      var time = thetaX/eqMu + eventModule.t0
      return time;
  }

  /** drawPic */
  function drawPic(display=displayFlags,
                   context=mainContext, canvas=mainCanvas) {
    clearPic();
    drawBackgrounds();
    drawBorder();
    drawGridlinesAndTicks();
    toggleClippingRegion(turnOn=true);

    drawLens(lens1);

    if (display.rings === true) {
      // draw separate rings for each lens
      drawRing(lens1);
    }

    if (display.images === true)
      ;

    drawSourcePath();
    drawSource();
    drawPointLensedImages();

    toggleClippingRegion(turnOn=false);
    drawAxes();
  }

  return {
    drawPic: drawPic,
  }

})();

// public properties to be stored in module object,
// accessible via module object by code executed after this script
module.exports = {
  // initialization

  // initialization function
  init: init,
  // whether initialization is done
  get initialized() { return initialized; },

  // mas
  get sourcePos() { return sourcePos; },
  // mas
  get xAxisInitialThetaX() { return xAxisInitialThetaX; },
  // mas
  get sourceRadius() { return sourceRadius; },
  redraw: redraw,
  getThetaX: getThetaX,
  initSourceRadius: initSourceRadius,
};
