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
  // add event listener to show/hide link for finite source options
  showOrHideModule.init();

  // these modules must be initialized in specific order
  eventModule.init();
  lensPlaneModule.init();
  animationModule.init();
}

window.onload = init;
