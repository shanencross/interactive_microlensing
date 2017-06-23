"use strict";

/** Almost Equals.
  * Function that checks if two numbers are almost equal.
  * @module almost-equals
  */

module.exports = function almostEquals(a, b) {
  var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1e-12;

  return Math.abs(a - b) < epsilon;
};