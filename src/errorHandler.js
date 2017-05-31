/** Error handler module.
  * Handles exceptions.
  *
  * Needed to handle exceptions raised when trying to load
  * a module that is not present.
  *
  * @module errorHandler
  */

console.log("Executing errorHandler.js");

/** handle */
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
