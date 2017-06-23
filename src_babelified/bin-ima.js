"use strict";

/** Binary image modules.
  * Calculates binary image parameters for a particular source position.
  *
  * @module bin-ima
  */

console.log("Executing bin_ima.js");
var math = require("mathjs");
var cpoly = require("poly-roots");

var almostEquals = require("./utils.js").almostEquals;

/** bin_ima */
function bin_ima() {
  var GM1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;
  var GM2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;
  var D = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;
  var XS = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var YS = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var timeDebug = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

  if (timeDebug === true) console.time();

  // GM1 = mass of object 1 (as a % of total mass) e.g. 0.1

  // GM2 = mass of object 2 (as a % of total mass) e.g  0.9

  // D = half binary separation (between components) in Einstein radii

  // XS, YS = x,y coordinates of the source (in x/R_E, y/R_E)

  // XI, YI, AI = image coordinates (x,y) and magnification for
  // each of the five (max) images

  // Complex coefficients ZC of the 5th order polynomial
  var ZC = new Array(6).fill(0);

  // Image parity
  var IP = new Array(5).fill(0);

  var EP = 1e-02; // 1e-03

  // Set up parameters for the calculation of the coefficients

  // half sum of masses
  var HSM = math.multiply(math.add(GM1, GM2), 1 / 2.0);
  // half difference of masses
  var HDM = math.multiply(math.subtract(GM2, GM1), 1 / 2.0);

  var HSDM = math.multiply(HSM, HDM);
  var HSSM = math.multiply(HSM, HSM);
  var HDDM = math.multiply(HDM, HDM);
  var Z1 = math.complex(math.multiply(-1, D), 0.0);
  var Z2 = math.complex(D, 0.0);
  var Z1C = math.complex(math.multiply(-1, D), 0.0);
  var Z2C = math.complex(D, 0.0);

  // Source location in complex notation
  var ZS = math.complex(XS, YS);
  var AS = math.abs(ZS);
  var ZSC = math.complex(XS, math.multiply(-1, YS));
  var ZSS = math.multiply(ZS, ZSC);

  // Complex coefficients

  // ----------------------------------------------------------------------------------

  //------- Caclulating ZC[0] ----------

  // ```
  // Z1 * Z1 * (4 * HDDM * ZS + Z1 * (4 * HSDM + 4 * HDM * ZSS + Z1 * (2 * HSM * ZSC + ZSS * ZSC - Z1 * (2 * HDM + Z1 * ZS) ) ) )
  // ```

  // ```
  // (2 * HDM + Z1 * ZS)
  // ```
  var ZC_0_paren1 = math.add(math.multiply(2, HDM), math.multiply(Z1, ZS));

  // ```
  // (2 * HSM * ZSC + ZSS * ZSC - Z1 * (ZC_0_paren1) )
  // ```
  var ZC_0_paren2 = math.subtract(math.add(math.multiply(math.multiply(2, HSM), ZSC), math.multiply(ZSS, ZSC)), math.multiply(Z1, ZC_0_paren1));

  // ```
  // (4 * HSDM + 4 * HDM * ZSS + Z1 * (ZC_0_paren2) )
  // ```
  var ZC_0_paren3 = math.add(math.add(math.multiply(4, HSDM), math.multiply(4, math.multiply(HDM, ZSS))), math.multiply(Z1, ZC_0_paren2));

  // ```
  // 4 * HDDM * ZS + Z1 * (ZC_0_paren3) )
  // ```
  var ZC_0_paren4 = math.add(math.multiply(4, math.multiply(HDDM, ZS)), math.multiply(Z1, ZC_0_paren3));

  // ```
  // Z1 * Z1 * (ZC_0_paren4)
  // ```
  ZC[0] = math.multiply(Z1, math.multiply(Z1, ZC_0_paren4));

  // ----------------------------------------------------------------------------------

  // ------- Caclulating ZC[1] ---------

  // ```
  // ZC_1 = -Z1 * (8 * HSDM * ZS + Z1 * (4 * HDDM + 4 * HSSM + 4 * HSM * ZSS + Z1 * (4 * HDM * ZSC + Z1 * (ZSC * ZSC - Z1 * Z1) ) ) )
  // ```

  // ```
  // ZSC * ZSC - Z1 * Z1
  // ```
  var ZC_1_paren1 = math.subtract(math.multiply(ZSC, ZSC), math.multiply(Z1, Z1));

  // ```
  // 4 * HDM * ZSC + Z1 * (ZC_1_paren1)
  // ```
  var ZC_1_paren2 = math.add(math.multiply(4, math.multiply(HDM, ZSC)), math.multiply(Z1, ZC_1_paren1));

  // ```
  // 4 * HDDM + 4 * HSSM + 4 * HSM * ZSS + Z1 * (ZC_1_paren2)
  // ```
  var ZC_1_paren3 = math.add(math.add(math.add(math.multiply(4, HDDM), math.multiply(4, HSSM)), math.multiply(4, math.multiply(HSM, ZSS))), math.multiply(Z1, ZC_1_paren2));

  // ```
  // 8 * HSDM * ZS + Z1 * (ZC_1_paren3)
  // ```
  var ZC_1_paren4 = math.add(math.multiply(8, math.multiply(HSDM, ZS)), math.multiply(Z1, ZC_1_paren3));

  // ```
  //-Z1 * (ZC_1_paren4)
  // ```
  ZC[1] = math.multiply(-1, math.multiply(Z1, ZC_1_paren4));

  // ----------------------------------------------------------------------------------

  // ------- Caclulating ZC[2] ---------

  // ```
  // ZC_2 = 4 * HSSM * ZS + Z1 * (4 * HSDM - 4 * HDM * ZSS + Z1 * (-2 * ZSS * ZSC + Z1 * (4 * HDM + 2 * ZS * Z1 ) ) )
  // ```

  // ```
  // 4 * HDM + 2 * ZS * Z1
  // ```
  var ZC_2_paren1 = math.add(math.multiply(4, HDM), math.multiply(2, math.multiply(ZS, Z1)));

  // ```
  // -2 * ZSS * ZSC + Z1 * (ZC_2_paren1)
  // ```
  var ZC_2_paren2 = math.add(math.multiply(-2, math.multiply(ZSS, ZSC)), math.multiply(Z1, ZC_2_paren1));

  // ```
  //  4 * HSDM - 4 * HDM * ZSS + Z1 * (ZC_2_paren2)
  // ```
  var ZC_2_paren3 = math.add(math.subtract(math.multiply(4, HSDM), math.multiply(4, math.multiply(HDM, ZSS))), math.multiply(Z1, ZC_2_paren2));

  // ```
  // 4 * HSSM * ZS + Z1 * (ZC_2_paren3)
  // ```
  ZC[2] = math.add(math.multiply(4, math.multiply(HSSM, ZS)), math.multiply(Z1, ZC_2_paren3));

  // ----------------------------------------------------------------------------------

  // ------- Caclulating ZC[3] ---------

  // ```
  // ZC_3 = 4 * HSM * ZSS + Z1 * (4 * HDM * ZSC + Z1 * (2 * ZSC * ZSC - 2 * Z1 * Z1) )
  // ```

  // ```
  // 2 * ZSC * ZSC - 2 * Z1 * Z1
  // ```
  var ZC_3_paren1 = math.subtract(math.multiply(2, math.multiply(ZSC, ZSC)), math.multiply(2, math.multiply(Z1, Z1)));

  // ```
  // 4 * HDM * ZSC + Z1 * (ZC_3_paren1)
  // ```
  var ZC_3_paren2 = math.add(math.multiply(4, math.multiply(HDM, ZSC)), math.multiply(Z1, ZC_3_paren1));

  // ```
  // 4 * HSM * ZSS + Z1 * (ZC_3_paren2)
  // ```
  ZC[3] = math.add(math.multiply(4, math.multiply(HSM, ZSS)), math.multiply(Z1, ZC_3_paren2));

  // ----------------------------------------------------------------------------------

  //------- Caclulating ZC[4] ---------

  // ```
  // ZC_4 = ZSC * (ZSS -2 * HSM) - Z1 * (2 * HDM + ZS * Z1)
  // ```

  // ```
  // ZSS -2 * HSM
  // ```
  var ZC_4_paren1 = math.subtract(ZSS, math.multiply(2, HSM));

  // ```
  // 2 * HDM + ZS * Z1
  // ```
  var ZC_4_paren2 = math.add(math.multiply(2, HDM), math.multiply(ZS, Z1));

  // ```
  //ZSC * (ZC_4_paren1) - Z1 * (ZC_4_paren2)
  // ```
  ZC[4] = math.subtract(math.multiply(ZSC, ZC_4_paren1), math.multiply(Z1, ZC_4_paren2));

  // ----------------------------------------------------------------------------------

  //------- Caclulating ZC[5] ---------
  // ZC[5] = math.eval("Z1 * Z1 - ZSC * ZSC", scope);

  // Z1 * Z1 - ZSC * ZSC
  ZC[5] = math.subtract(math.multiply(Z1, Z1), math.multiply(ZSC, ZSC));

  // ----------------------------------------------------------------------------------

  // Number of possible solutions
  var M = 5;

  // Find roots of the polynomial

  var ZC_real = [];
  var ZC_imag = [];
  for (var i in ZC) {
    ZC_real.push(math.complex(ZC[i]).re);
    ZC_imag.push(math.complex(ZC[i]).im);
  }

  var ZC_real_reverse = ZC_real.slice().reverse();
  var ZC_imag_reverse = ZC_imag.slice().reverse();
  var ZC_roots = cpoly(ZC_real_reverse, ZC_imag_reverse);

  var ZI = [];
  for (var i = 0; i < ZC_roots[0].length; i++) {
    if (almostEquals(0, ZC_roots[0][i]) === true) ZC_roots[0][i] = 0;
    if (almostEquals(0, ZC_roots[1][i]) === true) ZC_roots[1][i] = 0;

    ZI.push(math.complex(ZC_roots[0][i], ZC_roots[1][i]));
  }

  /* Testing ZI:
  ZI = [ math.complex(-1.11803399e+00, -8.26372302e-20),
                        math.complex(-1.38344197e-16, 8.66025404e-01),
                        math.complex(0.00000000e+00, 0.00000000e+00),
                        math.complex(8.12052344e-17, -8.66025404e-01),
                        math.complex(1.11803399e+00, -2.22044605e-16)]
  */
  var SA = 0.0;

  /* Testing result:
  result = [[0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]];
  */

  var resultColumns = [];

  var XI = math.re(ZI);
  // result_0
  resultColumns.push(XI);
  var YI = math.im(ZI);
  // result_1
  resultColumns.push(YI);

  var ZR = ZI;

  // ----------------------------------------------------------------------------------

  // ------- Caclulating ZP ---------

  // WARNING: Code should NOT actually calculate this.

  // Python code does this, but we don't need to to get results we want.

  // ZP calculation flag should be set to false for our purposes.

  // If you want to test this or calculate ZP for some reason,
  // set this flag to true.
  var doZPcalculation = false;
  if (doZPcalculation === true) {
    // ```
    // ZP = ZC[0] + ZR * (ZC[1] + ZR * (ZC[2] + ZR * (ZC[3] + ZR * (ZC[4] + ZR * ZC[5]) ) ) )
    // ```

    // ```
    // ZC[4] + ZR * ZC[5]
    // ```
    var ZP_paren1 = math.add(ZC[4], math.multiply(ZR, ZC[5]));

    // ```
    // ZC[3] + ZR * (ZR_paren1)
    // ```
    var ZP_paren2 = math.add(ZC[3], math.multiply(ZR, ZP_paren1));

    // ```
    // ZC[2] + ZR * (ZR_paren2)
    // ```
    var ZP_paren3 = math.add(ZC[2], math.multiply(ZR, ZP_paren2));

    // ```
    // ZC[1] + ZR * (ZR_paren3)
    // ```
    var ZP_paren4 = math.add(ZC[1], math.multiply(ZR, ZP_paren3));

    // ```
    // ZC[0] + ZR * (ZR_paren4)
    // ```
    var ZP = math.add(ZC[0], math.multiply(ZR, ZP_paren4));
    // ----------------------------------------------------------------------------------
  }

  // Image positions, complex notation
  var ZIC = math.conj(ZI);

  var ZDC1 = math.subtract(ZIC, Z1C);

  var ZDC2 = math.subtract(ZIC, Z2C);

  var ZB_term1 = math.multiply(GM1, math.dotPow(ZDC1, -1)); // GM1/ZDC1
  var ZB_term2 = math.multiply(GM2, math.dotPow(ZDC2, -1)); // GM2/ZDC2
  var ZB = math.add(ZB_term1, ZB_term2); // GM1/ZDC1 + GM2/ZDC2

  var ZE = math.subtract(ZI, ZB);
  var AE = math.abs(ZE);
  var ZD_term1 = math.multiply(GM1, math.dotPow(ZDC1, -2)); // GM1/(ZDC1*ZDC1)
  var ZD_term2 = math.multiply(GM2, math.dotPow(ZDC2, -2)); // GM2/(ZDC2*ZDC2)
  var ZD = math.add(ZD_term1, ZD_term2); // GM1/(ZDC1*ZDC1) + GM2/(ZDC2*ZDC2)

  var CJ = math.abs(math.dotPow(ZD, 2)); // abs(ZD*ZD)
  var VJ = math.subtract(1, CJ);
  var AJ = math.dotPow(VJ, -1); // 1/VJ
  var AI = AJ;
  // result_2
  resultColumns.push(AI);
  SA = math.add(SA, AJ);

  for (var i = 0; i < M; i++) {

    var firstComparison = compareComplexNumToZero(AJ[i]);
    var secondComparison = compareComplexNumToZero(math.subtract(math.abs(math.subtract(ZE[i], ZS)), EP));

    // case #1
    // ```
    // if (AJ[I] < 0 and not np.abs(ZE[I] - ZS) - EP > 0):
    // ```
    if (firstComparison === -1 && secondComparison < 1) {
      IP[i] = -1;
    }

    // case #2
    // ```
    // if (AJ[I] == 0 and np.abs(ZE[I] - ZS) - EP > 0):
    // ```
    if (firstComparison === 0 && secondComparison === 1) {
      IP[i] = 0;
    }

    // case #3
    // ```
    // if (AJ[I] > 0 and not np.abs(ZE[I] - ZS) - EP > 0):
    // ```
    if (firstComparison === 1 && secondComparison < 1) {
      IP[i] = 1;
    }
  }
  /*
  // DEBUG: This doesn't appear to be needed, though I'm not entirely sure?
  IP = math.complex(IP);
  */
  // result_3
  resultColumns.push(IP);

  var results = math.transpose(resultColumns);

  if (timeDebug === true) console.timeEnd();

  return results;
}

/** compareComplexNumToZero */
function compareComplexNumToZero(num) {
  // if num "almost equals" 0: returns 0
  // else if num > 0: returns 1
  // else if num < 0: returns -1
  var complexNum = math.complex(num);

  // if real component is ~=0, use only imaginary component for comparison --
  // if real component is nonzero, use only the real component for comparison
  if (almostEquals(complexNum.re, 0) === true) {
    var comparisonNum = complexNum.im;
  } else {
    var comparisonNum = complexNum.re;
  }

  if (almostEquals(comparisonNum, 0) === true) {
    return 0;
  } else if (comparisonNum > 0) return 1;else if (comparisonNum < 0) return -1;else console.log("ERROR: comparisonNum is: " + comparisonNum);
}

module.exports = {
  bin_ima: bin_ima,
  almostEquals: almostEquals,
  compareComplexNumToZero: compareComplexNumToZero
};
