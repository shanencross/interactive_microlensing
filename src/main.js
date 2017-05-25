// console.log = function() {} // uncomment this to disable all console.log messages

var eventModule = require("./PSPL_binary_microlensing_event.js")
var lensPlaneModule = require("./PSPL_binary_microlensing_event_lens_plane.js");
var animationModule = require("./PSPL_binary_microlensing_event_animation.js");

function init() {
  // modules must be initialized in specific order
  eventModule.init();
  lensPlaneModule.init();
  animationModule.init();
}

// window.onload = init;
init();
