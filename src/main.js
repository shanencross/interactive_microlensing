/** Main module.
  * Main module for interactive microlensing simulator.
  *
  * @module main
  */
// console.log = function() {} // uncomment this to disable all console.log messages

var eventModule = require("./PSBL_microlensing_event.js")
var lensPlaneModule = require("./PSBL_microlensing_event_lens_plane.js");
var animationModule = require("./PSBL_microlensing_event_animation.js");

/** init */
function init() {
  // modules must be initialized in specific order
  eventModule.init();
  lensPlaneModule.init();
  animationModule.init();
}

window.onload = init;
