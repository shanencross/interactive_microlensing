/** Finite Source module.
  * Handles calculations of finite source effects.
  *
  * @module fspl-microlensing-event-finite-source
  */

console.log("Executing fspl-microlensing-event-finite-source.js");

var everpolate = require("everpolate");

var eventModule = require("./fspl-microlensing-event.js");
var lensPlaneModule = require("./fspl-microlensing-event-lens-plane.js");
var tableModule = require("./fspl-microlensing-event-finite-source-table.js");

var smallB0array = [];
var largeB0array = [];

/** getFiniteSourceFactor */
function getFiniteSourceFactor(u) {
  var sourceRadius = lensPlaneModule.sourceRadius;
  var thetaE_mas = eventModule.thetaE_mas;
  var table = tableModule.table;

  var rhoNormalized = sourceRadius / thetaE_mas;

  var z = u/rhoNormalized;

  var zColumn = table.z;
  var B0column = table.B0;

  var B0 = everpolate.linear(z, zColumn, B0column);
  // var B0 = interpolateFromTables(z, zColumn, B0column)

  if (typeof this.printedOnce === "undefined" || this.printedOnce === false ||
      (z > 1.01 && z < 1.02)) {
    console.log(`finite source z: ${z}`);
    console.log(`finite source factor: ${B0}`);
    this.printedOnce = true;
  }

  if (B0 > 1.00001251)
    largeB0array.push(B0);
  else if (B0 < 0.00200000)
    smallB0array.push(B0);

  return B0
}


module.exports = {
  getFiniteSourceFactor: getFiniteSourceFactor,
  get largeB0array() { return largeB0array; },
  get smallB0array() { return smallB0array; },
};
