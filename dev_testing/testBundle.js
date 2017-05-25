(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var moduleResolver = require("../src/moduleResolver");


console.log(moduleResolver);


// var numeric = require("numeric");
var numeric = moduleResolver.doesModuleResolve("numeric");
console.log(numeric.add(3, 2));

},{"../src/moduleResolver":2}],2:[function(require,module,exports){
console.log("Executing moduleResolver.js");

function doesModuleResolve(modulePath) {

  var moduleResolves = true;
  try {
    var moduleToResolve = require.resolve(modulePath);
    console.log("Resolved module:" + moduleToResolve);
  }
  catch(ex) {
    if (ex instanceof Error && ex.code === "MODULE_NOT_FOUND") {
    }
    else {
      throw(ex);
    }
    moduleResolves = false;
  }

  return doesModuleResolve;
}

module.exports = {
  doesModuleResolve: doesModuleResolve,
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXZfdGVzdGluZy90ZXN0X21vZHVsZUxvYWRlci5qcyIsInNyYy9tb2R1bGVSZXNvbHZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBtb2R1bGVSZXNvbHZlciA9IHJlcXVpcmUoXCIuLi9zcmMvbW9kdWxlUmVzb2x2ZXJcIik7XHJcblxyXG5cclxuY29uc29sZS5sb2cobW9kdWxlUmVzb2x2ZXIpO1xyXG5cclxuXHJcbi8vIHZhciBudW1lcmljID0gcmVxdWlyZShcIm51bWVyaWNcIik7XHJcbnZhciBudW1lcmljID0gbW9kdWxlUmVzb2x2ZXIuZG9lc01vZHVsZVJlc29sdmUoXCJudW1lcmljXCIpO1xyXG5jb25zb2xlLmxvZyhudW1lcmljLmFkZCgzLCAyKSk7XHJcbiIsImNvbnNvbGUubG9nKFwiRXhlY3V0aW5nIG1vZHVsZVJlc29sdmVyLmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gZG9lc01vZHVsZVJlc29sdmUobW9kdWxlUGF0aCkge1xyXG5cclxuICB2YXIgbW9kdWxlUmVzb2x2ZXMgPSB0cnVlO1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgbW9kdWxlVG9SZXNvbHZlID0gcmVxdWlyZS5yZXNvbHZlKG1vZHVsZVBhdGgpO1xyXG4gICAgY29uc29sZS5sb2coXCJSZXNvbHZlZCBtb2R1bGU6XCIgKyBtb2R1bGVUb1Jlc29sdmUpO1xyXG4gIH1cclxuICBjYXRjaChleCkge1xyXG4gICAgaWYgKGV4IGluc3RhbmNlb2YgRXJyb3IgJiYgZXguY29kZSA9PT0gXCJNT0RVTEVfTk9UX0ZPVU5EXCIpIHtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aHJvdyhleCk7XHJcbiAgICB9XHJcbiAgICBtb2R1bGVSZXNvbHZlcyA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRvZXNNb2R1bGVSZXNvbHZlO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBkb2VzTW9kdWxlUmVzb2x2ZTogZG9lc01vZHVsZVJlc29sdmUsXHJcbn07XHJcbiJdfQ==
