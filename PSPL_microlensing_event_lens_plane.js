console.log("Executing PSPL_microlensing_event_lens_plane.js");

/* Pseudocode


// May want to put event parameters and sliders, along calling of initialization function,
//  in a script separate from lcurveCanvas drawing: that way each canvas is on "equal
// footing. For example:
var PSPL_micorlensing_event_params_and_sliders = (function() {
/stuff

return {
  // parameters and maybe some related functions (and u and t arrays once I added storage of those)
}
})();
*/

// "revealing pattern" module object for this script file
var PSPL_microlensing_event_lens_plane = (function() {
  // reference to module holding parameter values
  var eventModule = PSPL_microlensing_event;

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
  var thetaXwidth = 4/3;
  var thetaYheight = 1; // mas
  var xAxisInitialDay = -15;
  var xAxisInitialThetaX = -(4/3)/2
  var yAxisInitialThetaY = -0.5; // half of thetaYheight so that 0 is the middle
  var xGridStepDefault = 0.1;
  var yGridStepDefault = 0.1;

  // lens (thetaX, thetaY) position in milliarcseconds
  var lensPos = {x: 0, y:0};

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
  var dashedPathSpacing = 10

  var sourceColor = "teal";
  // initialized elsewhere in function
  var sourceRadius;
  var sourceOutlineWidth = 2;
  var sourceOutlineColor = sourceColor;

  var lensColor = "red";
  var lensRadius = 2;
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
  var lensedImagePlusColor = "navy";
  var lensedImagePlusOutlineColor = "navy";
  var lensedImageMinusColor = "olive";
  var lensedImageMinusOutlineColor = "olive";

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
  var lensPixelPos;
  var ringRadius = {x: undefined, y: undefined}
  var lensedImages;
  var sourceOutline;
  var lensedImageOutlines;

  //sort of derived variables? but not really? (canvas/context)
  var canvas = document.getElementById("lensPlaneCanvas")
  var context = canvas.getContext("2d");
  var thetaXreadout = document.getElementById("thetaXreadout"); // readout of current source thetaX position
                                                                // mainly for debugging, but may keep
  var imageShapeCheckbox = document.getElementById("imageShapeCheckbox");
  var rhoSlider = document.getElementById("rhoSlider");
  var rhoReadout = document.getElementById("rhoReadout");

  // if on, display shapes for the lensed images, not just points;
  // toggled by checkbox
  var displayImageShapeFlag = true;

  var fractionDefault = 500; // number of points into which source outline is divided
                           // i.e. a value of 8 would divide the outline into 8
                           // evenly spaced points

  // debug flags
  var animationFlag = true;
  var debugFlag = false;
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

  // called from PSPL_microlensing_event.js (or whichever script holds the parameter
  // values) after initializations and slider updates),
  // because we NEED parameters intialized first to do drawing and scaling

  function init(animation=animationFlag, debug=debugFlag) {
    initListeners();
    updateScaleAndRangeValues();
    initSourcePos();
    initRho();
    redraw();
  }

  function initListeners() {
   imageShapeCheckbox.addEventListener("change", function() { displayImageShapeFlag = !displayImageShapeFlag;
                                                          console.log(`displayImageShapeFlag: ${displayImageShapeFlag}`); }, false);
  rhoSlider.addEventListener("input", function() { updateRho(); }, false);
  rhoSlider.addEventListener("change", function() { updateRho(); }, false);
  }

  function initRho() {
    sourceRadius = 1/75 * 4;
    updateRhoSlider();
  }

  function updateRhoSlider() {
    rhoSlider.value = sourceRadius; // source radisu in mas
    rhoReadout.innerHTML = Number(rhoSlider.value).toFixed(4);
  }

  function updateRho() {
    sourceRadius = rhoSlider.value; // source radisu in mas
    updateRhoSlider();
    redraw();
  }

  function initSourcePos(animation=animationFlag, debug=debugFlag) {
    var sourcePosY = eventModule.thetaY;
    sourcePos = {x: getThetaX(eventModule.xAxisFinalDay), y: sourcePosY};

    if (animation === false)
      sourcePos.x = xAxisFinalThetaX;

    if (debug === true)
      sourcePos.x = lensPos.x - 1/4 *(thetaXwidth);
  }

  function redraw(animation=animationFlag, debug=debugFlag) {
    updateDrawingValues(animation=animation, debug=debug);
    drawPic();
  }

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

  function updateDrawingValues() {
    sourcePos.y = eventModule.thetaY; // update source thetaY

    // makes sure "0.0000" is displayed instead of "-0.0000" if rounding error
    // occurs
    var newThetaXreadout = Number(sourcePos.x).toFixed(4)
    if (Number(newThetaXreadout) === -0) {
      newThetaXreadout = Number(0).toFixed(4);
    }
    thetaXreadout.innerHTML = newThetaXreadout; // update source thetaX readout

    // convert position to pixel units
    sourcePixelPos = {x: thetaXtoPixel(sourcePos.x), y: thetaYtoPixel(sourcePos.y)};
    ringRadius.x = eventModule.thetaE_mas * xPixelScale;
    ringRadius.y = eventModule.thetaE_mas * yPixelScale;

    // lens pixel position
    lensPixelPos = {x:thetaXtoPixel(lensPos.x), y: thetaYtoPixel(lensPos.y)};

    // lensed image positions;
    lensedImages = getLensedImages(sourcePos);

    // lensed image outlines;
    // NOTE: This hammers the the dperformance signifcantly right now
    if (drawFullLensedImagesFlag === true) {
      sourceOutline = getCircleOutline(radius=sourceRadius, thetaPos=sourcePos);
      lensedImageOutlines = getLensedImageOutlines(sourceOutline, checkLensOverlapPoints=true);
      // if (lensedImageOutlines.plus.length === sourceOutline.length) {
      //   console.log(`lensedImageOutlines plus length !== sourceOutline length: ${lensedImageOutlines.plus.length} !== ${sourceOutline.length}`);
      //   for (i in lensedImageOutlines.plus) {
      //     console.log(`lensedImageOutlines plus: (${lensedImageOutlines.plus[i].pos.x}, ${lensedImageOutlines.plus[i].pos.y})`);
      //   }
      // }
    }
  }

  function thetaXtoPixel(xPicThetaX) {
    var xPixel = (xPicThetaX - xAxisInitialThetaX) * xPixelScale + picLeftBorder;
    return xPixel;
  }

  function xDayToPixel(xPicDay) {
    var xPixel = (xPicDay - xAxisInitialDay) * xDayPixelScale + picLeftBorder;
    return xPixel;
  }

  function thetaYtoPixel(yPicThetaY) {
    var yPixel = picBottomBorder - (yPicThetaY - yAxisInitialThetaY) * yPixelScale
    return yPixel;
  }

  function getThetaX(t) {
    var mu = eventModule.mu;
    var t0 = eventModule.t0;
    var yearToDay = 365.25; // day/year; const
    var eqMu = mu / yearToDay; // convert mu to milliarcseconds/day
    var thetaX = eqMu * (t - t0);
    return thetaX;
  }


  // NOTE: Hacky -- fix
  function almostEquals(a, b, epsilon=1e-12) {
    return (Math.abs(a - b) < epsilon);
  }

  function getCircleOutline(radius=sourceRadius, thetaPos=sourcePos, fraction=fractionDefault) {
    // get points (in mas units) for outline of a circle, given its pixel radius
    // and theta position; defaults to getting source outline


    // NOTE: Assumes xPixelScale = yPixelScale, or if not prioritizes xPixelScale;
    // should probably have some kind of check on this
    // var radius_mas = radiusPixels / xPixelScale;

    var radius_mas = radius;
    console.log(`ro: ${radius_mas}`);

    var outline = [];
    for (var radians=0; (radians<2*Math.PI && almostEquals(radians, 2*Math.PI) === false); radians += 2*Math.PI/fraction) {
      var xOffset = radius_mas * Math.cos(radians);
      var yOffset = radius_mas * Math.sin(radians);

      var point = {x: thetaPos.x + xOffset, y: thetaPos.y + yOffset}
      outline.push(point);
    }

    console.log("outline:");
    for (var index in outline) {
      // console.log(`Outline point: (${outline[index].x}, ${outline[index].y})`)
    }
    return outline;
  }

  function getLensedImages(thetaPos=sourcePos) {
    var thetaE_mas = eventModule.thetaE_mas;
    // var u0 = eventModule.u0;

    var images = {plus: {pos: undefined, pixelPos: undefined},
                  minus: {pos: undefined, pixelPos: undefined}};

    var u = Math.sqrt(thetaPos.x*thetaPos.x + thetaPos.y*thetaPos.y) / thetaE_mas;
    var plusLensedImageR = ( ( u + Math.sqrt(u*u + 4) ) / 2 ) * thetaE_mas;
    // console.log("Lensed images: " + String(u));
    // console.log("lensed x: " + String(thetaPos.x));
    // console.log("lensed y: " + String(thetaPos.y));
    // console.log("lensed thetaE_mas: " + String(thetaE_mas));
    // var minusLensedImageR = Math.abs( ( u - Math.sqrt(u*u + 4) ) / 2 ) * thetaE_mas;
    var minusLensedImageR = 1/plusLensedImageR * thetaE_mas*thetaE_mas;
    // console.log("minusLensedImageR: " + String(minusLensedImageR));

    var thetaR = Math.sqrt(thetaPos.y*thetaPos.y + thetaPos.x*thetaPos.x);
    var thetaYsign = thetaPos.y/Math.abs(thetaPos.y);
    var phi = Math.acos(thetaPos.x/thetaR) * thetaYsign;
    // console.log("phi: " + String(phi));

    images.plus.pos = {x: lensPos.x + plusLensedImageR * Math.cos(phi), y: lensPos.y + plusLensedImageR * Math.sin(phi)};
    images.minus.pos = {x: lensPos.x + minusLensedImageR * Math.cos(Math.PI + phi), y: lensPos.y + minusLensedImageR * Math.sin(Math.PI + phi)};

    images.plus.pixelPos = {x: thetaXtoPixel(images.plus.pos.x),
                                  y: thetaYtoPixel(images.plus.pos.y)};
    images.minus.pixelPos = {x: thetaXtoPixel(images.minus.pos.x),
                                   y: thetaYtoPixel(images.minus.pos.y)};


    return images;
  }

  function getLensedImageOutlines(sourceOutline, checkLensOverlapPoints=false) {
    var outlines = {plus: [], minus: []};

    if (checkLensOverlapPoints === true) {
      for (index in sourceOutline) {
        var sourcePoint = sourceOutline[index];
        // console.log(`checkLensOverlapPoints: sourcePoint.x, lensPos.x: ${sourcePoint.x}, ${lensPos.x}`);
        var deltaX = sourcePoint.x - lensPos.x;
        var deltaY = sourcePoint.y - lensPos.y;
        var distR = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
        if (almostEquals(distR, 0, epsilon=1/xPixelScale) === false) {
          var images = getLensedImages(sourcePoint);
          outlines.plus.push(images.plus);
          outlines.minus.push(images.minus);
        }
        else {

          // console.log("Lens/source overlap!");
        }
      }
    }
    else {
      for (var index=0; index<sourceOutline.length; index++) {
        var sourcePoint = sourceOutline[index];
        // var sourcePoint = sourceOutline[0];
        var images = getLensedImages(sourcePoint);
        // images = {plus: {pos: {x:0, y:0}, pixelPos: {x:0, y:0}}, minus: {pos: {x:0, y:0}, pixelPos: {x:0, y:0}}};
        outlines.plus.push(images.plus);
        outlines.minus.push(images.minus);
      }
    }
    return outlines;
  }

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
    // NOTE: hacky almostEquals solution to rounding error issue that isn't very readable: fix
    if ((centerXgridOnZero === true) && (xGridStep - Math.abs(xAxisInitialThetaX % xGridStep) > 1e-10))
     xGridInitial = xAxisInitialThetaX - (xAxisInitialThetaX % xGridStep);
    else
      xGridInitial = xAxisInitialThetaX;
    console.log(`xGridInitial: ${xGridInitial}`);

    xGridFinal = xAxisFinalThetaX;

    // NOTE: hacky almostEquals solution to rounding error issue that isn't very readable: fix
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

  function xDayToThetaX() {}

  function drawPic() {
    function clearPic() {
      context.clearRect(picLeftBorder, picTopBorder, picWidth, picHeight);
    }

    function drawBackgrounds() {
      // canvas background
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvas.width, canvas.height);

      // picture drawing area background
      context.fillStyle = picBackgroundColor;
      context.fillRect(picLeftBorder, picTopBorder, picWidth, picHeight);
    }

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

    function drawLens() {
      context.beginPath();
      context.arc(lensPixelPos.x, lensPixelPos.y, lensRadius, 0, 2*Math.PI, false);
      context.fillStyle = lensColor;
      context.fill();
      context.lineWidth = lensOutlineWidth;
      context.strokeStyle = lensOutlineColor;
      context.stroke();
    }
    function drawRing(firefoxCompatibility=firefoxCompatibilityFlag) {
      context.beginPath();
      // ellipse not compatible with firefox
      if (firefoxCompatibility === true)
        context.arc(centerX, centerY, ringRadius.x, 0, 2*Math.PI, false);
      else
        context.ellipse(lensPixelPos.x, lensPixelPos.y, ringRadius.x, ringRadius.y, 0, 0, 2*Math.PI)
      context.strokeStyle = ringColor;
      context.lineWidth = ringWidth;
      context.setLineDash([dashedRingLength, dashedRingSpacing]); // turn on dashed lines
      context.stroke();
      context.setLineDash([]); // turn off dashed-line drawing
    }

    // use this for when implementing animation;
    // for now, should be at end of path, if we bother placing it
    function drawSource(useOutline=false) {
      // set aesthetics
      context.lineWidth = sourceOutlineWidth;
      context.strokeStyle = sourceOutlineColor;
      context.fillStyle = sourceColor;

      // draw source
      if (useOutline === true) {
        // context.moveTo(thetaXtoPixel(sourceOutline[0].x), thetaYtoPixel(sourceOutline[0].y));
        // for (var i=1; i<sourceOutline.length; i++) {
        //   context.lineTo(thetaXtoPixel(sourceOutline[i].x), thetaYtoPixel(sourceOutline[i].y));
        // }
        for (i in sourceOutline) {
          context.beginPath();
          context.arc(thetaXtoPixel(sourceOutline[i].x), thetaYtoPixel(sourceOutline[i].y), 1, 0, 2*Math.PI, false);
          context.fill();
        }
      }
      else {
        context.beginPath();
        var radiusPixels = thetaXtoPixel(sourceRadius);
        context.arc(sourcePixelPos.x, sourcePixelPos.y, radiusPixels, 0, 2*Math.PI, false);
        context.fill();
        context.stroke();
      }
    }

    function drawSourcePath() {
      // dashed line (path yet to be travelled)
      context.beginPath();
      context.moveTo(picLeftBorder, sourcePixelPos.y);
      context.lineTo(picRightBorder, sourcePixelPos.y);
      context.setLineDash([dashedPathLength, dashedPathSpacing]); // turn on dashed lines
      context.strokeStyle = dashedPathColor;
      context.lineWidth = dashedPathWidth;
      context.stroke();
      context.setLineDash([]); // turn off dashed lines

      // solid line (path traveled so far)
      context.beginPath();
      context.moveTo(picLeftBorder, sourcePixelPos.y);
      context.lineTo(sourcePixelPos.x, sourcePixelPos.y);
      context.strokeStyle = pathColor;
      context.lineWidth = pathWidth;
      context.stroke();
    }

    // for animation, pointless to implement before animation
    function drawUarrow() {}

    function drawBorder() {
      context.beginPath();
      context.strokeStyle = picBorderColor;
      context.lineWidth = picBorderWidth;
      context.strokeRect(picLeftBorder, picTopBorder, picWidth, picHeight);
    }

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

    function drawPointLensedImages() {
      // console.log("Lensed image mas position (plus): " + String(lensedImages.plus.pos.x) + ", " + String(lensedImages.plus.pos.y));
      // console.log("Lensed image mas position (minus): " + String(lensedImages.minus.pos.x) + ", " + String(lensedImages.minus.pos.y));

      // console.log("Lensed image pixel position (plus): " + String(lensedImages.plus.pixelPos.x) + ", " + String(lensedImages.plus.pixelPos.y));
      // console.log("Lensed image pixel position (minus): " + String(lensedImages.minus.pixelPos.x) + ", " + String(lensedImages.minus.pixelPos.y));

      context.lineWidth = lensedImageLineWidth;
      context.fillStyle = lensedImagePlusColor;
      context.strokeStyle = lensedImagePlusOutlineColor;

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
    }

    function drawFullLensedImage(sign="plus", debug=false, arcDebug=false) {
      // draw either a plus or minus lensed image

      // set aesthetics and select plus or minus outlines object
      if (sign === "plus") {
        context.strokeStyle = "fuchsia";
        context.fillStyle = "purple";

        if (arcDebug === true) {
          context.strokeStyle = "purple"
          context.fillStyle = "fuchsia";
        }
        var outlines = lensedImageOutlines.plus;
      }
      else if (sign === "minus") {
      context.strokeStyle = "lime";
      context.fillStyle = "green";

      if (arcDebug === true) {
        context.strokeStyle = "green";
        context.fillStyle = "lime";
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

      context.lineWidth = lensedImageLineWidth;

      // draw line through each point in outline array
      if (debug === false) {
        context.beginPath();
        var index = 1;
        context.moveTo(outlines[index-1].pixelPos.x, outlines[index-1].pixelPos.y);
      }
      else {
        var index = 0;
        context.moveTo(outlines[index].pixelPos.x, outlines[index].pixelPos.y);
      }

      for (index; index<outlines.length; index++) {
        var pixelPos = outlines[index].pixelPos;
        var pos = outlines[index].pos;
        // var lensDistX = pixelPos.x - thetaXtoPixel(lensPos.x);
        // var lensDistY = pixelPos.y - thetaYtoPixel(lensPos.y);
        // var lensDistR = Math.sqrt(lensDistX*lensDistX + lensDistY*lensDistY);

        if (debug === true)
          context.beginPath(); // debug

        if (debug === false) {
          if (index > 0) {
            var prevPixelPos = outlines[index-1].pixelPos;
            var deltaX = pixelPos.x - prevPixelPos.x;
            var deltaY = pixelPos.y - prevPixelPos.y;
            var dist = Math.sqrt(deltaX*deltaX + deltaY*deltaY);

            var prevPos = outlines[index-1].pos;

            if (dist > 1 && arcDebug === true) {
              var prevPhi = Math.atan(prevPos.y/prevPos.x);
              var phi = Math.atan(pos.y/pos.x);

              // top-left or bottom-left quadrant
              if (prevPos.x < 0)
                prevPhi += Math.PI;
              if (pos.x < 0)
                phi += Math.PI;

              // bottom-right quadrant
              if (prevPos.x > 0 && prevPos.y < 0 )
                prevPhi += 2*Math.PI;
              if (pos.x > 0 && pos.y < 0)
                phi += 2*Math.PI;

              context.beginPath();
              context.arc(lensPixelPos.x, lensPixelPos.y, ringRadius.x, phi, prevPhi);
              // console.log(`crazy images (x, mas): ${prevPos.x}, ${pos.x}`);
              // console.log(`crazy images (y, mas): ${prevPos.y}, ${pos.y}`);
              // console.log(`crazy images (phi, degrees): ${prevPhi*180/Math.PI}, ${phi*180/Math.PI}`);
              context.stroke();
            }
            else if (dist < 1 || arcDebug === false) {
              // console.log(`crazy images (dist, pixels): ${dist}`);
              // context.moveTo(prevPixelPos.x, prevPixelPos.y);
              context.lineTo(pixelPos.x, pixelPos.y);
            }
          }
        }
        else {
          if (sign==="plus")
            context.fillStyle = "black";
          if (sign==="minus")
            context.fillStyle = "grey";
          context.arc(pixelPos.x, pixelPos.y, 1, 0, 2*Math.PI);
          context.fill(); // debug
        }
      }
      // context.closePath();
      if (debug === false && arcDebug === false) {
        context.closePath();
        // context.fill();
        context.stroke();
      }
    }

    function drawFullLensedImages(debug=false, arcDebug=false) {
      // draw both plus and minus lensed images
      console.log("draw full lensed images");
      drawFullLensedImage("plus", debug, arcDebug); // draw plus image
      drawFullLensedImage("minus", debug, arcDebug); // draw minus image
    }

    clearPic();
    drawBackgrounds();
    drawBorder();
    drawGridlinesAndTicks();
    toggleClippingRegion(turnOn=true);
    drawRing();
    drawSourcePath();
    drawSource(useOutline=true);
    drawUarrow();
    if (displayImageShapeFlag === true) {
      //
      // context.save();
      // clipRevert(circlePath.bind(null, lensPixelPos.x, lensPixelPos.y, ringRadius.x));
      // drawFullLensedImages(debug=false, arcDebug=true);
      drawFullLensedImages(debug=false, arcDebug=false);
      drawFullLensedImages(debug=true);
      // drawFullLensedImages(debug=true);
      // context.restore();
    }
    drawPointLensedImages();
    drawLens();
    toggleClippingRegion(turnOn=false);
    drawAxes();
  }


  function circlePath(x, y, r) {
      context.arc(x, y, r, 0, Math.PI * 2, true);
  }

  // clips the canvas with the invert of provided path function
  // if pathFunction is an array, remove clips defined by all functions
  function clipRevert(pathFunction) {
      context.beginPath();
      context.rect(0, 0, canvas.width, context.canvas.height);
      if (Array.isArray(pathFunction)) pathFunction.forEach(execute);
      else pathFunction();
      context.clip();
  }


  function execute(fn) {
      return fn();
  }


  // executing script initialization
  init();
  // public properties to be stored in module object,
  // accessible via module object by code executed after this script
  return {
    get sourcePos() { return sourcePos; },
    get xAxisInitialThetaX() { return xAxisInitialThetaX; },
    redraw: redraw,
    getThetaX: getThetaX,
    initRho: initRho,
  };
})();
