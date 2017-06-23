"use strict";

/** Main module.
  * Main module for interactive microlensing simulator.
  *
  * @module main
  */

// set flag to true to disable all console output for performance
var disableConsole = false;

if (disableConsole === true) console.log = function () {};

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