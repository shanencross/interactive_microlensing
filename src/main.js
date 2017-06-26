/** Main module.
  * Main module for interactive microlensing simulator.
  *
  * @module main
  */

var showOrHideModule = require("./show-or-hide.js");
var eventModule = require("./fspl-microlensing-event.js");
var lensPlaneModule = require("./fspl-microlensing-event-lens-plane.js");
var animationModule = require("./fspl-microlensing-event-animation.js");

/** init */
function init() {
  showOrHideModule.init();

  // modules must be initialized in specific order
  eventModule.init();
  lensPlaneModule.init();
  animationModule.init();
}

window.onload = init;
