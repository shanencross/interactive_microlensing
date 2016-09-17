var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var centerX = canvas.width/2;
var centerY = canvas.height/2;

/*
k = 4*G/c**2
D_rel = 1/(1/D_l - 1/D_s)
pi_rel = 1/D_rel
theta_E = sqrt(k*mass*pi_rel)

t_E = theta_E / mu_rel

time_term = (t - t_max)/t_E
u = sqrt(u_0**2 + time_term**2)
magnif(u) = (u**2 + 2)/(u * sqrt(u**2 + 4))


OK let's say t_E=10 days, t_max = 15 days, u_0 = 0.1

so we get time_term from t_max and t_E and t
then we get u from time_term and u_0
then we get magnif from u

Also, there are 30 days per x_pixel (0 to 30)
and 4 magnification units per y_pixel (0 to 4)
*/

var t_E = 10;
var t_max = 15;
var u_0 = 0.1;

var day_width = 30;
var magnif_height = 10;
var xPixelScale = canvas.width/day_width; // pixels per day
var yPixelScale = canvas.height/magnif_height; // pixels per magnif unit
var initialT = 0;
var dt = 0.1;

window.onload = initialize();

function initialize() {
  initializePlot();
  plotLightcurve();
}

function initializePlot() {
  // fill in background
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // draw vertical lines
  for (var xPlotDay = 0; xPlotDay < day_width; xPlotDay++) {
    var xPlotPixel = xPlotDay * xPixelScale;
    context.beginPath();
    context.moveTo(xPlotPixel, 0)
    context.lineTo(xPlotPixel, canvas.height);
    context.strokeStyle = "black";
    context.stroke();
  }

  //draw horizontal lines;
  for (var yPlotMagnif = 0; yPlotMagnif < magnif_height; yPlotMagnif++) {
    var yPlotPixel = yPlotMagnif * yPixelScale;
    context.beginPath();
    context.moveTo(0, yPlotPixel);
    context.lineTo(canvas.width, yPlotPixel);
    context.strokeStyle = "black";
    context.stroke();
  }
}

function plotLightcurve() {
  var prevTday = initialT;
  var prevMagnif = get_magnif(initialT);

  for (var tDay=initialT + dt; tDay <= day_width; tDay += dt) {
    var magnif = get_magnif(tDay);

    var tPixel = tDay * xPixelScale;
    var prevTpixel = prevTday * xPixelScale;

    var magnifPixel = canvas.height - magnif * yPixelScale;
    var prevMagnifPixel = canvas.height - prevMagnif * yPixelScale;

    context.beginPath();
    context.moveTo(prevTpixel, prevMagnifPixel);
    context.lineTo(tPixel, magnifPixel);
    context.lineWidth = 2;
    context.strokeStyle = "blue";
    context.stroke();

    prevTday = tDay;
    prevMagnif = magnif;
  }
}
magnif_max = get_magnif(t_max);
//console.log(magnif_max);

function get_time_term(t) {
  time_term = (t - t_max)/t_E;
  return time_term;
}

function get_u(time_term) {
  u = Math.sqrt(u_0*u_0 + time_term*time_term)
  return u;
}

function get_magnif_from_u(u) {
  var magnif_numerator = u*u + 2;
  var magnif_denominator = u * Math.sqrt(u * u + 4);
  magnif = magnif_numerator / magnif_denominator;
  return magnif;
}

function get_magnif(t) {
  var time_term = get_time_term(t);
  var u = get_u(time_term);
  var magnif = get_magnif_from_u(u);
  return magnif;
}
