var logger = require("./logger.js")

var myLogger = new logger();
var myLogger2 = new logger();

myLogger.log("hello world");
myLogger2.log("what's up everyone")

myLogger.isLoggerOn = false;
myLogger.isLoggerOn = true;

myLogger.log("hello world #2");
myLogger2.log("what's up everyone #2")
