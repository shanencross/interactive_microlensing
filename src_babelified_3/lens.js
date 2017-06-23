/** Module containing Lens class
  * Class represents lens object, including pixel location and radius, and
  * ring radius
  * @module Lens
  */

/**Lens class
  * Represents lens object, including pixel location and radius, and ring radius
  * @class Lens
  */

function Lens(xPixelScale, yPixelScale, thetaXtoPixel, thetaYtoPixel, xPos, yPos, pixelRadius, color, outlineWidth, outlineColor, ringRadius_mas, ringColor, ringWidth, dashedRingLength, dashedRingSpacing) {
  this.updatePos = function (xPos, yPos) {
    this.pos = {
      x: xPos,
      y: yPos
    };

    this.pixelPos = {
      x: thetaXtoPixel(xPos),
      y: thetaYtoPixel(yPos)
    };
  };

  this.updatePos(xPos, yPos);

  this.pixelRadius = pixelRadius;

  this.color = color;
  this.outlineWidth = outlineWidth;
  this.outlineColor = outlineColor;

  this.ring = {
    radius: ringRadius_mas,

    pixelRadius: {
      x: xPixelScale * ringRadius_mas,
      y: yPixelScale * ringRadius_mas
    },
    color: ringColor,
    width: ringWidth,
    dashedLength: dashedRingLength,
    dashedSpacing: dashedRingSpacing
  };
}

module.exports = Lens;