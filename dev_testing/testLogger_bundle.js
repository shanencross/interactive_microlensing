(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
var logger = require("./logger.js")

var myLogger = new logger();
var myLogger2 = new logger();

myLogger.log("hello world");
myLogger2.log("what's up everyone")

myLogger.isLoggerOn = false;
myLogger.isLoggerOn = true;

myLogger.log("hello world #2");
myLogger2.log("what's up everyone #2")

},{"./logger.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsb2dnZXIuanMiLCJ0ZXN0TG9nZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKiBMb2dnZXIgbW9kdWxlLlxyXG4gICogVXNlZCB0byBvdXRwdXQgbWVzc2FnZXMgdG8gY29uc29sZS4gQ2FuIGJlIHR1cm5lZCBvbi9vZmYuXHJcbiAgKlxyXG4gICogQG1vZHVsZSBsb2dnZXJcclxuICAqL1xyXG5cclxuLyoqIGxvZ2dlciBjbGFzc1xyXG4gICogQGNsYXNzXHJcbiAgKi9cclxuZnVuY3Rpb24gbG9nZ2VyKCkge1xyXG4gIHRoaXMuaXNMb2dnZXJPbiA9IHRydWU7XHJcbn1cclxuXHJcbmxvZ2dlci5wcm90b3R5cGUubG9nID0gZnVuY3Rpb24odGV4dCkge1xyXG4gIGlmICh0aGlzLmlzTG9nZ2VyT24gPT09IHRydWUpIHtcclxuICAgIGNvbnNvbGUubG9nKHRleHQpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsb2dnZXI7XHJcbiIsInZhciBsb2dnZXIgPSByZXF1aXJlKFwiLi9sb2dnZXIuanNcIilcclxuXHJcbnZhciBteUxvZ2dlciA9IG5ldyBsb2dnZXIoKTtcclxudmFyIG15TG9nZ2VyMiA9IG5ldyBsb2dnZXIoKTtcclxuXHJcbm15TG9nZ2VyLmxvZyhcImhlbGxvIHdvcmxkXCIpO1xyXG5teUxvZ2dlcjIubG9nKFwid2hhdCdzIHVwIGV2ZXJ5b25lXCIpXHJcblxyXG5teUxvZ2dlci5pc0xvZ2dlck9uID0gZmFsc2U7XHJcbm15TG9nZ2VyLmlzTG9nZ2VyT24gPSB0cnVlO1xyXG5cclxubXlMb2dnZXIubG9nKFwiaGVsbG8gd29ybGQgIzJcIik7XHJcbm15TG9nZ2VyMi5sb2coXCJ3aGF0J3MgdXAgZXZlcnlvbmUgIzJcIilcclxuIl19
