var moduleResolver = require("../src/moduleResolver");


console.log(moduleResolver);


// var numeric = require("numeric");
var numeric = moduleResolver.doesModuleResolve("numeric");
console.log(numeric.add(3, 2));
