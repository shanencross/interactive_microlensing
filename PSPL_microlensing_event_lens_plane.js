console.log("Executing PSPL_microlensing_event_lens_plane.js");

// "revealing pattern" module object for this script file
var PSPL_microlensing_event_lens_plane = (function() {
  var PSPL_main = PSPL_microlensing_event; // shorter name for module

  PSPL_main.Ml = 10;
  console.log(PSPL_main.Ml);
  console.log(PSPL_microlensing_event.Ml);

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

var PSPL_microlensing_event_lens_plane = (function() {
  // reference to module holding parameter values
  paramModule = PSPL_microlensing_event;

  // base variables (borders)
  pictureLeftBorder;
  pictureTopBorder;
  pictureWidth;
  pictureHeight;

  // base variables (trails)
  pictureLeftTrail
  pictureRightTrail
  pictureTopTrail
  pictureBottomTrail

  //base variables (background/picture aesthetics)
  backgroundColor;
  pictureBackgroundColor;
  circleColor;
  circleWidth;
  pathColor;
  pathWidth;
  uArrowColor;
  uArrowWidth;
  axisColor;
  axisWidth;

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
  pictureRightBorder;
  pictureBottomBorder;
  centerX;
  centerY;

  // derived variables (trails)
  pictureLeftTrailingBorder;
  pictureRightTrailingBorder;
  pictureTopTrailingBorder;
  pictureBottomTrailing border

  //sort of derived variables? but not really? (canvas/context)
  canvas = document.getElementById("lensPlaneCanvas")
  context = canvas.getContext("2d");

  // called from PSPL_microlensing_event.js (or whichever script holds the parameter
  // values) after initializations and slider updates),
  // because we NEED parameters intialized first to do drawing and scaling
  function init() {
    initDerivedValues();
    drawPicture();
  }

  function initDerivedValues()

  function drawPicture() {}
    function drawLens() {}
    function drawRing() {}
    function drawSource() {} // use this for when implementing animation;
                             // for now, should be at end of path, if we bother placing it
    function drawSourcePath() {}
    function drawAxes() {}
      function drawThetaXaxis() {} // horizontal (x) axis
      function drawTaxis() {} // second horizontal (x) axis
      function drawThetaYaxis() {} // vertical (y) axis
      function drawAxisArrows() {}

    function drawUarrow() {} // for animation, pointless to implement before animation

  function convertThetaXtoXpixel() {}
  function convertTtoXpixel() {}
  function convertThetaYtoYPixel() {}
})();
  */

  // public properties to be stored in module object,
  // accessible via module object by code executed after this script
  return {
  };
})();
