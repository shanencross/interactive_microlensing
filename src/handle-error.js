/** Error handler module.
  * Handles exceptions.
  *
  * Needed to handle exceptions raised when trying to load
  * a module that is not present.
  *
  * @module handle-error
  */

console.log("Executing handle-error.js");

/** handle */
module.exports = function handleError(ex) {
  if (ex instanceof Error && ex.code === "MODULE_NOT_FOUND") {
    console.log(ex.stack);
  }
  else {
    throw(ex);
  }
}
