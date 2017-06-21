/** Logger module.
  * Used to output messages to console. Can be turned on/off.
  *
  * @module logger
  */

/** logger class
  * @class
  */
function logger() {
  this.isLoggerOn = true;
}

logger.prototype.log = function(text) {
  if (this.isLoggerOn === true) {
    console.log(text);
  }
}

module.exports = logger;
