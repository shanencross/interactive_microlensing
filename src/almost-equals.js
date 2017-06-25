/** Almost Equals.
  * Function that checks if two numbers are almost equal.
  * @module almost-equals
  */

module.exports = function almostEquals(a, b, epsilon=1e-12) {
  return (Math.abs(a - b) < epsilon);
}
