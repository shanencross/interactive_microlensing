/** Main module.
  * Main module for interactive microlensing simulator.
  *
  * @module main
  */
// lets polyfill function work in I.E. after being babelified
require("babel-polyfill");
window.alert('i');
var eventModule = require("./psbl-microlensing-event.js");
var lensPlaneModule = require("./psbl-microlensing-event-lens-plane.js");
var animationModule = require("./psbl-microlensing-event-animation.js");

/** init */
function init() {
  // modules must be initialized in specific order
  eventModule.init();
  lensPlaneModule.init();
  animationModule.init();
}

window.onload = init;
