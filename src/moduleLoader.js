console.log("Executing moduleLoader.js");

function tryToLoad(modulePath) {
  try {
    var moduleToLoad = require(modulePath);
  }
  catch(ex) {
    if (ex instanceof Error && ex.code === "MODULE_NOT_FOUND") {
      console.log(`Module ${modulePath} not found!`);
    }
    else {
      throw(ex);
    }
    var moduleToLoad = null;
  }

  return moduleToLoad;
}

module.exports = {
  tryToLoad: tryToLoad,
};
