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
  var thetaXwidth = 1;
  var thetaYheight = 1; // mas
  var xAxisInitialDay = -15;
  var xAxisInitialThetaX = -0.5
  var yAxisInitialThetaY = -0.5; // half of thetaYheight so that 0 is the middle
  var xGridStepDefault = 0.05;
  var yGridStepDefault = 0.05;

  //base variables (background/picture aesthetics)
  var backgroundColor = "#ffffe6";
  var picBackgroundColor = "#eff";
  var picBorderColor = "grey";
  var picBorderWidth = 1;

  var ringColor = "dimgrey";
  var ringWidth = 1;
  var dashedRingLength = 5;
  var dashedRingSpacing = 5;

  var pathColor = "blue";;
  var pathWidth = 2;

  var dashedPathColor = "teal";
  var dashedPathWidth = 1;
  var dashedPathLength = 5;
  var dashedPathSpacing = 15

  var sourceColor = "teal";
  var sourceRadius = 2;
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

  //base variables (tick labels)
  var tickLabelFont = "10pt Arial";
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

  // derived variable (source position)
  var sourcePos; // x value: time (days); y value: thetaY
  var sourcePixelPos; // pixel x and y values
  var ringRadius;

  //sort of derived variables? but not really? (canvas/context)
  canvas = document.getElementById("lensPlaneCanvas")
  context = canvas.getContext("2d");

  // debug flags
  var animationFlag = false;
  var debugFlag = true;
  var centerLayoutFlag = false;

  // called from PSPL_microlensing_event.js (or whichever script holds the parameter
  // values) after initializations and slider updates),
  // because we NEED parameters intialized first to do drawing and scaling

  function init(animation=animationFlag, debug=debugFlag) {
    updateScaleAndRangeValues();
    redraw();
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

  function updateDrawingValues(animation=animationFlag, debug=debugFlag) {

    function getSourceThetaY() {
      var RadToMillarcseconds = 206264806.24709633;
      var u0 = eventModule.u0;
       // convert thetaE from radians to milliarcseconds
      var thetaE_mas = eventModule.thetaE * RadToMillarcseconds;
      var sourceThetaY = u0 * thetaE_mas;
      // var sourceThetaY = u0;
      // var sourceThetaY = thetaYheight/2 + 5; // temp value
      // var sourceThetaY = 0;
      console.log(`sourceThetaY: ${sourceThetaY}`);
      return sourceThetaY;
    }

    // source position
    var sourceThetaY = getSourceThetaY();
    sourcePos = {x:xAxisInitialThetaX, y:sourceThetaY}; // place source at start of path

    if (animation === false) {
      console.log("no animation");
      sourcePos.x = xAxisFinalThetaX; // if not animated, immediately place source at end of path
    }

     // places source partway in between left/right canvas borders for debugging
     // line and dashed line drawing
    if (debug === true) {
      sourcePos. x = xAxisFinalThetaX - 12;
    }

    // convert position to pixel units
    sourcePixelPos = {x: thetaXtoPixel(sourcePos.x), y: thetaYtoPixel(sourcePos.y)};
    ringRadius = eventModule.tE * xPixelScale;
    console.log(eventModule.tE);
    console.log(ringRadius);
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

  function updateGridRange(xStep, yStep) {
    // update grid with new step values,
    // and/or update grid for new initial/final axis values using

    // if new step values are passed in, update grid step values;
    // otherwise leave grid steps unchanged when updating grid
    if ( !(xStep === undefined) && !(yStep === undefined)) {
      xGridStep = xStep;
      yGridStep = yStep;
    }

    // update grid using current x/y axis initial and final values

    // Round the initial x grid line placement from initial day on axis
    // up to next xGridStep increment, except when exactly on an xGridStep
    // increment
    if (xAxisInitialThetaX % xGridStep === 0)
      xGridInitial = xAxisInitialThetaX;
    else
      xGridInitial = xGridStep * (Math.floor(xAxisInitialThetaX / xGridStep) + 1);

    // same rounding for final grid line placement
    if (xAxisFinalThetaX % xGridStep === 0)
      xGridFinal = xAxisFinalThetaX;
    else
      xGridFinal = xGridStep * (Math.floor(xAxisFinalThetaX / xGridStep));

    // same rounding for initial y grid line placement
    if (yAxisInitialThetaY % yGridStep === 0)
      yGridInitial = yAxisInitialThetaY;
    else
      yGridInitial = yGridStep * (Math.floor(Math.floor(yAxisInitialThetaY) / yGridStep) + 1);

    // same rounding for final y grid line placement
    if (yAxisFinalThetaY % yGridStep === 0)
      yGridFinal = yAxisFinalThetaY;
    else
      yGridFinal = yGridStep * (Math.floor(yAxisFinalThetaY / yGridStep));

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

      // iOn flag tracks whether clipping was last turned on/off; off by default
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
      context.arc(centerX, centerY, lensRadius, 0, 2*Math.PI, false);
      context.fillStyle = lensColor;
      context.fill();
      context.lineWidth = lensOutlineWidth;
      context.strokeStyle = lensOutlineColor;
      context.stroke();
    }
    function drawRing() {
      context.beginPath();
      // context.arc(centerX, centerY, ringRadius, 0, 2*Math.PI, false);
      context.ellipse(centerX, centerY, ringRadius, ringRadius, 0, 0, 2*Math.PI)
      context.strokeStyle = ringColor;
      context.strokeWidth = ringWidth;
      context.setLineDash([dashedRingLength, dashedRingSpacing]); // turn on dashed lines
      context.stroke();
      context.setLineDash([]); // turn off dashed-line drawing
    }

    // use this for when implementing animation;
    // for now, should be at end of path, if we bother placing it
    function drawSource() {
      context.beginPath();
      context.arc(sourcePixelPos.x, sourcePixelPos.y, sourceRadius, 0, 2*Math.PI, false);
      context.fillStyle = sourceColor;
      context.fill();
      context.lineWidth = sourceOutlineWidth;
      context.strokeStyle = sourceOutlineColor;
      context.stroke();
    }

    function drawSourcePath() {
      context.beginPath();
      context.moveTo(picLeftBorder, sourcePixelPos.y);
      context.lineTo(sourcePixelPos.x, sourcePixelPos.y);

      // solid line (path traveled so far)
      context.strokeStyle = pathColor;
      context.strokeWidth = pathWidth;
      context.stroke();

      // dashed line (path yet to be travelled)
      context.beginPath();
      context.moveTo(sourcePixelPos.x, sourcePixelPos.y);
      context.lineTo(picRightBorder, sourcePixelPos.y);
      context.setLineDash([dashedPathLength, dashedPathSpacing]); // turn on dashed lines
      context.strokeStyle = dashedPathColor;
      context.strokeWidth = dashedPathWidth;
      context.stroke();

      context.setLineDash([]); // turn off dashed lines
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

    function drawGridlinesAndTicks(drawGrid=true, noTicks) {
      // draw vertical lines and x axis tick labels
      context.beginPath();
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
        var xTickLabel = thetaX;
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

        var yTickLabel = thetaY;
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

    clearPic();
    drawBackgrounds();
    toggleClippingRegion(turnOn=true);
    drawLens();
    drawRing();
    drawSource();
    drawSourcePath();
    drawUarrow();
    toggleClippingRegion(turnOn=false);
    drawBorder();
    drawAxes();
    drawGridlinesAndTicks(drawGrid=false);
  }

  // executing script initialization
  init();
  // public properties to be stored in module object,
  // accessible via module object by code executed after this script
  return {
    redraw: redraw,
  };
})();
