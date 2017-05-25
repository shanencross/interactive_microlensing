console.log("Executing errorHandler.js");

function handle(ex) {
  if (ex instanceof Error && ex.code === "MODULE_NOT_FOUND") {
    console.log(ex.toString());
  }
  else {
    throw(ex);
  }
}

module.exports = {
  handle: handle,
};
