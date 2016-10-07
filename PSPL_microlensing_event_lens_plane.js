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
  var thetaYheight = 30; // temp value
  var xAxisInitialDay = 0;
  var yAxisInitialThetaY = 0;
  var xGridStepDefault = 2;
  var yGridStepDefault = 1;

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

  //base variables (tick labels)
  var tickLabelFont = "10pt Arial";
  var tickLabelColor = "black";
  var tickLabelAlign = "center";
  var tickLabelBaseline = "middle";
  var tickLabelSpacing = 7; // spacking between tick label and end of trailing gridline

  // base variables (axis labels)
  var xLabel = "thetaX";
  var yLabel = "thetaY";
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
  var xPixelScale;
  var yPixelScale;
  var xAxisFinalDay;
  var yAxisFinalThetaY;

  // derived variable (source position)
  var sourcePos; // x value: time (days); y value: thetaY
  var sourcePixelPos; // pixel x and y values
  var ringRadius;


  //sort of derived variables? but not really? (canvas/context)
  canvas = document.getElementById("lensPlaneCanvas")
  context = canvas.getContext("2d");

  // called from PSPL_microlensing_event.js (or whichever script holds the parameter
  // values) after initializations and slider updates),
  // because we NEED parameters intialized first to do drawing and scaling
  function init() {
    initDerivedValues();
    drawPic();
  }

  function initDerivedValues(animation=false, debug=true) {
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
    xPixelScale = picWidth/dayWidth;
    yPixelScale = picHeight/thetaYheight;
    xAxisFinalDay = xAxisInitialDay + dayWidth;
    yAxisFinalThetaY = yAxisInitialThetaY + thetaYheight;

    // source position
    var sourceThetaY = thetaYheight/2 + 5; // temp value
    sourcePos = {x: xAxisInitialDay, y: sourceThetaY}; // place source at start of path

    if (animation === false) {
      console.log("no animation");
      sourcePos.x = xAxisFinalDay; // if not animated, immediately place source at end of path
    }

     // places source partway in between left/right canvas borders for debugging
     // line and dashed line drawing
    if (debug === true) {
      sourcePos. x = xAxisFinalDay - 12;
    }

    // convert position to pixel units
    sourcePixelPos = {x: xDayToPixel(sourcePos.x), y: thetaYtoPixel(sourcePos.y)};
    ringRadius = eventModule.tE * xPixelScale;
    console.log(eventModule.tE);
    console.log(ringRadius);
  }

  function thetXtoPixel() {
    console.log("ERROR: use of thetaXtoXpixel(). This function isn't ready yet!");
    console.log("Returning undefined.");
    return undefined; // not working yet
  }

  function xDayToPixel(xPicDay) {
    var xPlotPixel = (xPicDay - xAxisInitialDay) * xPixelScale + picLeftBorder;
    return xPlotPixel;
  }

  function thetaYtoPixel(yPicThetaY) {
    var yPlotPixel = picBottomBorder - (yPicThetaY - yAxisInitialThetaY) * yPixelScale;
    return yPlotPixel;
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

    function switchClippingRegion(turnOn) {
      // set up clipping region as graph region, so that curve does not
      // extend beyond graph region

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
      context.arc(centerX, centerY, ringRadius, 0, 2*Math.PI, false);
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
      drawThetaXaxis();
      drawTaxis();
      drawThetaYaxis();
      drawAxisArrows();

      function drawThetaXaxis() {} // horizontal (x) axis
      function drawTaxis() {} // second horizontal (x) axis
      function drawThetaYaxis() {} // vertical (y) axis
      function drawAxisArrows() {}
    }

    clearPic();
    drawBackgrounds();
    switchClippingRegion(turnOn=true);
    drawLens();
    drawRing();
    drawSource();
    drawSourcePath();
    drawUarrow();
    switchClippingRegion(turnOn=false);
    drawBorder();
    drawAxes();
  }

  // executing script initialization
  init();
  // public properties to be stored in module object,
  // accessible via module object by code executed after this script
  return {
    init: init
  };
})();
