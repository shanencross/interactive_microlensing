module.exports = function almostEquals(a, b, epsilon=1e-12) {
  return (Math.abs(a - b) < epsilon);
}
