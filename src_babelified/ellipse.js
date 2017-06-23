"use strict";

/** Ellipse.
  * Draw an ellipse (but don't actually perform the stroke or fill) on a
  * Canvas element.
  * Unlike the native JS ellipse ellipse function,
  * this is compatible with Firefox.
  * @module ellipse
  */

module.exports = function ellipse(context, xPos, yPos, xRadius, yRadius) {
  context.save();

  context.translate(xPos, yPos);
  context.scale(xRadius, yRadius);

  context.beginPath();
  context.arc(0, 0, 1, 0, Math.PI * 2, false);

  context.restore();
};