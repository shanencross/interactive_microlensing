// NOTE: Watch out for close-to-zero values that should be zero,
// like ~e-16 and ~e-17.

// Also watch out for floating point rounding differences between methods,
// like -1.9999999999999991 vs. -2.

var cpolyFlag = true;
if (cpolyFlag) {
  // from scijs/polyroots: https://github.com/scijs/poly-roots/
  console.log("scijs/poly-roots cpoly method");
  var roots = cpoly;

  // Roots of x^2 + 2x - 3:
  // var r1 = roots([1,2,-3]);
  // var r1 = roots([1, 2, 10]);
  // var r1 = roots([1, 0, 0, 0, 0, 32])
  
  // Roots of (x - 1) + (2x - 2)i = (1 + 2i)*x  + (-1 - 2i)
  // var r1 = roots([1, -1], [2, -2])

  // Roots of z^3 - (4 + i)z^2 + (1 + i)z + (6 + 2i):
  // var r2 = roots([1,-4,1,6],[0,-1,1,2]);
  
  // Roots of 32*x^5 + 10*x^4 + 3*x^1 + 2
  // var t0 = window.performance.now()
  console.time("cpoly time");
  var r3 = roots([32, 10, 5, 4, 3, 2]);
  console.timeEnd("cpoly time");
  // var t1 = window.performance.now()
  // var t = t1 - t0;
  // console.log(`time elapsed (cpoly): ${t} ms`);

  console.log("r3 length: " + r3.length);

  for (var i=0; i< r3[0].length; i++) {
    // console.log("i: " + i);
    // console.log(r3[i]);
    console.log(r3[0][i] + " + " + r3[1][i] + "*i");
  }
}

// from roots.js: https://github.com/scijs/durand-kerner
// NOTE: There order of the roots in the output array is randomized

console.log("durand-kerner roots.js method")
// var roots = findRoots([1, 1, -1])
// var t0 = window.performance.now();
console.time("durand-kerner time");
var r4 = findRoots([2, 3, 4, 5, 10, 32]);
// r4 = math.transpose(r4);
// r4.sort();
console.timeEnd("durand-kerner time");
// var t1 = window.performance.now();
// var t = t1-t0;
// console.log(`time elapsed (durand-kerner): ${t} ms`);
// var r4 = findRoots([10, 2, 1])

// Now:
//      r4[0] = real part of roots
//      r4[1] = imaginary part of roots

console.log("r4 length: " + r4.length);
for(var i=0; i<r4.length; i++) {
  // console.log(r4[i])
  console.log(r4[0][i] + " + " + r4[1][i] + "*i");
}

// console.log("companion roots method");
// var r5 = findRoots([2, 3, 4, 5, 10, 32]);


/*
// from: https://rosettacode.org/wiki/Roots_of_a_function#JavaScript
var poly = (x => x*x*x*x*x - x*x*x*x - x + 1);

function sign(x) {
  return (x < 0.0) ? -1 : (x > 0.0) ? 1 : 0;
}

function printRoots(f, lowerBound, upperBound, step) {
  var  x = lowerBound, ox = x,
  y = f(x), oy = y,
  s = sign(y), os = s;
  console.log("hello computer");

  for (; x <= upperBound ; x += step) {
    s = sign(y = f(x));
    if (s == 0) {
      console.log(x);
    }
    else if (s != os) {
      var dx = x - ox;
      var dy = y - oy;
      var cx = x - dx * (y / dy);
      console.log("~" + cx);
    }
    ox = x; oy = y; os = s;
  }
}
printRoots(poly, -99, 99, 0.002);
*/