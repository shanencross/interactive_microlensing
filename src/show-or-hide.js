/** Show/Hide finite source options module.
  * @module show-or-hide
  */

console.log("Executing show-or-hide.js")

var toggleLink;
var toggledElement;
var initialized = false;

function init() {
  toggleLink = document.getElementById("toggleLink");
  toggledElement = document.getElementById("toggledElement");
  if (typeof toggleLink !== "undefined" && toggleLink !== null &&
      typeof toggledElement !== "undefined" && toggledElement !== null) {
    toggleLink.addEventListener("click", toggle, false);
    initialized = true;
  }
}

function toggle() {
  if (initialized === false)
    init();

	if(toggledElement.style.display == "block") {
    		toggledElement.style.display = "none";
		toggleLink.innerHTML = "+" + toggleLink.innerHTML.slice(1, toggleLink.innerHTML.length);
  	}
	else {
		toggledElement.style.display = "block";
		toggleLink.innerHTML = "&minus;" + toggleLink.innerHTML.slice(1, toggleLink.innerHTML.length);
	}
}

module.exports = {
  init: init,
  toggle: toggle,
};
