/** Binary lens module.
  * Calculates binary image parameters for a range of source positions.
  *
  * @module bin-len-faster
  */

console.log("Executing bin_len_faster.js");
var _ =require("lodash");
var numeric = require("numeric");
var math = require("mathjs");

var bin_ima = require("./bin-ima.js")

var almostEquals = require("./utils.js").almostEquals;

/** plot_binary */
function plot_binary(GM1=0.5, GM2=0.5, D=0.5, cof1=0.1, cof2=-0.5,
                             minXLM=-3, maxXLM=3, NPN=40, NR=30000,
                             DR=0.0001, timeDebug=false) {

  // NPN: the number of points to use for the trajectory
  // timeDebug: timing debug flag -- if on, records execution time of function
  // and outputs to console

  if (timeDebug === true)
    console.time();

  // Initialize array
  var ASA = new Array(NPN).fill(0);

  /* adapted from Python code:
    AIA = np.zeros(shape = (5, NPN))
    var AIA = [];
    for (var i=0; i<5; i++) {
      AIA.push(new Array(NPN).fill(0));
    }
  */

  var XIA = [];
  for (var i=0; i<5; i++) {
    XIA.push(new Array(NPN));
  }
  var YIA = [];
  for (var i=0; i<5; i++) {
    YIA.push(new Array(NPN));
  }

  GM2 = 1 - GM1

  var causticAndCrit = findCausticAndCritCurves(GM1, GM2, D, NR, DR);

  // Evaluate the (linear) trajectory path
  // NXS is the trajectory length (NPN points)
  var NXS = NPN;
  var XSC = numeric.linspace(minXLM, maxXLM, NXS);
  // x coord of source and magnification ASA
  var XSA = XSC;

  // Specify the trajectory
  var YSC = math.add(math.multiply(-cof1, XSC), cof2)
  // y coords of source and magnification ASA
  var YSA = YSC;

  var NT = 1;
  var DT = 0.0;
  var RC = 0.0;
  var IT = 1;

  var T = IT * DT
  var XS = math.add(XSC, math.multiply(RC, math.cos(T)))
  var YS = math.add(YSC, math.multiply(RC, math.sin(T)));

  // Evaluate the magnification
  // Loop over source positions
  for (var IXS=0; IXS<NXS; IXS++) {
    // Calculate positions of images given a source position

    XS[IXS] = math.round(XS[IXS], 12);
    YS[IXS] = math.round(YS[IXS], 12);

    imageparms = bin_ima.bin_ima(GM1, GM2, D,
                                       XS[IXS], YS[IXS]);
    transposed_imageparms = math.transpose(imageparms);

    var XI = transposed_imageparms[0];
    var YI = transposed_imageparms[1];
    var AI = transposed_imageparms[2];
    var IMP = transposed_imageparms[3];

    // Loop over all images
    for (var IM=0; IM<5; IM++) {
      /*
      The python code does this, but not needed to get the results we want:
      AIA[IM][IXS] = AI[IM];
      */
      ASA[IXS] = math.add(ASA[IXS], math.multiply(IMP[IM], AI[IM]));

      XIA[IM][IXS] = XI[IM];
      YIA[IM][IXS] = YI[IM];
    }
  }

  var normalizedSourcePositions = {x: XSA, y: YSA};

  // XIA/YIA column: image number
  // XIA/YIA row: x index (ranges from 0 to NPN)
  var normalizedImagePositions = {x: XIA, y: YIA};

  if (timeDebug === true) {
    console.timeEnd();
    console.log('done');

    /*
    Optional output for timeDebug:
    console.log("XSA:");
    for (var i in XSA) {
      console.log(XSA[i]);
    }

    console.log("");
    console.log("ASA:");
    for (var i in ASA) {
      console.log(ASA[i]);
    }
    */
  }

  return {
    normalizedSourcePositions: normalizedSourcePositions,
    normalizedImagePositions: normalizedImagePositions,
    magnifs: ASA,
    causticAndCrit: causticAndCrit,
  };
}

/** findCausticAndCritCurves */
function findCausticAndCritCurves(GM1=0.5, GM2=0.5, D=0.5, NR=30000,
                                  DR=0.0001) {
  // NR (Default: 30000): Points to use to plot critical curves and caustics
  // DR (Default: 0.0001): Used to define the sampling density of the caustics

  var IP = -1;
  var D2 = D * D;
  var D4 = D2 * D2;

  // if NR is defined by DR isn't, set default NR based on NR value
  if ( NR !== undefined && NR!== null && NR !== NaN
    && (DR === undefined || DR === null || DR === NaN)) {
    DR = 3.0/NR;
  }

  // Estimate criticals and caustics
  // Perform repeat calculations with masses swapped over
  var critical_points_x1 = [];
  var critical_points_x2 = [];
  var critical_points_y1 = [];
  var critical_points_y2 = [];

  var caustic_points_x1 = [];
  var caustic_points_x2 = [];
  var caustic_points_y1 = [];
  var caustic_points_y2 = [];
  for (var IQ=0; IQ<2; IQ++) {
    var IR = _.range(1, NR);

    var R = numeric.mul(IR, DR);
    var R2 = numeric.mul(R, R);
    var R4 = numeric.mul(R2, R2);

    var GM1S = GM1 * GM1;
    var GM2S = GM2 * GM2;
    var GMXM = GM1 * GM2;
    var R2P = numeric.add(R2, 4 * D2);
    var R4M = numeric.sub(R4, GM2S);

    // Polynomial coeffs A, B, C
    // as described in Schneider & Weiss 1986 (eqn 9b)

    // Since these are arrays, calculations must use numeric package functions,
    // and so the equations are broken up into steps for readability.

    // The original coeff equation is commented at the top of each section,
    // and each step is commented with the part of the equation that it
    // corresponds to.

    // ```
    // A = 16 * D2 * R2 * (R4M - GMXM)
    // ```

    // 16 * D2 * R2
    var A_part1 = numeric.mul(16 * D2, R2)
    // ```
    // (R4M - GMXM)
    // ```
    var A_paren1 = numeric.sub(R4M, GMXM);
    // ```
    // A_part1 * A_paren1
    // ```
    var A = numeric.mul(A_part1, A_paren1);

    // ```
    // B = 8 * R * D * (GMXM * R2 - (R2 + 4 * D2) * R4M)
    // ```

    // ```
    // (R2 + 4 * D2)
    // ```
    var B_paren1 = numeric.add(R2, 4 * D2);

    // ```
    // GMXM * R2 - (B_paren1) * R4M
    // ```
    var B_paren2 = numeric.sub(numeric.mul(GMXM, R2),
                                 numeric.mul(B_paren1, R4M));
    // ```
    // 8 * R * D * (B_paren2)
    // ```
    var B = numeric.mul(8 * D,
                        numeric.mul(R,
                                    B_paren2));

    // ```
    //  C = (R2P * R2P) * R4M - GM1S * R4
    //      - 2 * GMXM * R2 * (R2 + 4 * D2)
    // ```

    // ```
    // (R2P * R2P)
    // ```
    var C_paren1 = numeric.mul(R2P, R2P);
    // ```
    // (R2 + 4 * D2)
    // ```
    var C_paren2 = numeric.add(R2, 4 * D2);
    // ```
    // (C_paren1) * R4M - GM1S * R4
    // ```
    var C_part1 = numeric.sub(numeric.mul(C_paren1, R4M),
                                numeric.mul(GM1S, R4));
    // ```
    // 2 * GMXM * R2 * (C_paren2)
    // ```
    var C_part2 = numeric.mul(2 * GMXM,
                              numeric.mul(R2,
                                          C_paren2));
    // ```
    // C_part1 - C_part2
    // ```
    var C = numeric.sub(C_part1, C_part2);

    // Python code modifies C again after this:
    // ```
    // C = C + 16 * GM1 * GM2 * D2 * R2
    // ```

    // ```
    // 16 * GM1 * GM2 * D2 * R2
    // ```
    var C_product = numeric.mul(16 * D2 * GM1 * GM2, R2);

    // ```
    // C + C_product
    // ```
    C = numeric.add(C, C_product);

    // Calculate the determinant DT
    // ```
    // DT = B * B - 4 * A * C
    // ```
    var DT = numeric.sub(numeric.mul(B,
                                     B),
                         numeric.mul(4,
                                     numeric.mul(A,
                                                 C)));

    // When the determinant is >= 0 calculate the values of cos(theta) C1, C2
    // Modify relevant arrays accordingly
    var DTge0 = [];
    var DTge0_sqrt = [];
    var DTge0_neg_sqrt = [];
    var R_DTgt0 = [];
    var R2_DTgt0 = [];
    var B_DTgt0 = [];
    var A_DTgt0 = [];
    for (var i=0; i<DT.length; i++) {
      if (DT[i] >= 0 || almostEquals(DT[i], 0) === true) {
        DTge0.push(DT[i]);
        var DT_element_sqrt = Math.sqrt(DT[i]);
        DTge0_sqrt.push(DT_element_sqrt);
        DTge0_neg_sqrt.push(-DT_element_sqrt);
        R_DTgt0.push(R[i]);
        R2_DTgt0.push(R2[i]);
        B_DTgt0.push(B[i]);
        A_DTgt0.push(A[i]);
      }
    }

    // Evaluate C1, C2
    var C_denominator = numeric.mul(2, A_DTgt0);
    var C1_numerator = numeric.sub(DTge0_sqrt, B_DTgt0)
    var C2_numerator = numeric.sub(DTge0_neg_sqrt, B_DTgt0);
    //
    var C1 = numeric.div(C1_numerator, C_denominator);
    var C2 = numeric.div(C2_numerator, C_denominator);


    // When abs(C1) or abs(C2) are <=1 append point to critical and caustic curves
    // Isolate the indexes of where the absolute values of C1 and C2 are <= 1
    var idxC1le1 = [];
    var idxC2le1 = [];

    for (var i=0; i<C1.length; i++) {
      if (Math.abs(C1[i]) <= 1 || almostEquals(C1[i], 1) === true) {
        idxC1le1.push(i);
      }

      if (Math.abs(C2[i]) <= 1 || almostEquals(C2[i], 1) === true) {
        idxC2le1.push(i);
      }
    }

    // Set up subsamples from relevant arrays
    // Debug: optimize by setting array length from start?
    var Rmod2_C1 = [];
    var R2mod2_C1 = [];
    var C1le1 = [];
    for (var i=0; i<idxC1le1.length; i++) {
      var index = idxC1le1[i];
      Rmod2_C1.push(R_DTgt0[index]);
      R2mod2_C1.push(R2_DTgt0[index]);
      C1le1.push(C1[index]);
    }

    var Rmod2_C2 = [];
    var R2mod2_C2 = [];
    var C2le1 = [];
    for (var i=0; i<idxC2le1.length; i++) {
      var index = idxC2le1[i];
      Rmod2_C2.push(R_DTgt0[index]);
      R2mod2_C2.push(R2_DTgt0[index]);
      C2le1.push(C2[index]);
    }

    var X1 = numeric.mul(Rmod2_C1, C1le1);
    var X2 = numeric.mul(Rmod2_C2, C2le1);

    var S1_paren = numeric.sub(1, numeric.mul(C1le1, C1le1));
    var S1 = numeric.sqrt(S1_paren);

    var S2_paren = numeric.sub(1, numeric.mul(C2le1, C2le1));
    var S2 = numeric.sqrt(S2_paren);

    var Y1 = numeric.mul(Rmod2_C1, S1);
    var Y2 = numeric.mul(Rmod2_C2, S2);

    var X_C1 = numeric.sub(X1, D);
    var X_C2 = numeric.sub(X2, D);

    var Y_C1 = Y1;
    var Y_C2 = Y2;

    // Append to critical points
    var PXCRIT_C1 = numeric.mul(IP, X_C1);
    var PYCRIT_C1 = numeric.mul(IP, Y_C1);

    var PXCRIT_C2 = numeric.mul(IP, X_C2);
    var PYCRIT_C2 = numeric.mul(IP, Y_C2);

    // index where points transition
    // from C1 points to C2 points;
    // a gap we should jump over if connecting points with lines
    // when drawing
    var C1_C2_transitionIndex = PXCRIT_C1.length;

    critical_points_x1 = critical_points_x1.concat(PXCRIT_C1);
    critical_points_x1 = critical_points_x1.concat(PXCRIT_C2);

    critical_points_x2 = critical_points_x2.concat(PXCRIT_C1);
    critical_points_x2 = critical_points_x2.concat(PXCRIT_C2);

    critical_points_y1 = critical_points_y1.concat(PYCRIT_C1);
    critical_points_y1 = critical_points_y1.concat(PYCRIT_C2);

    critical_points_y2 = critical_points_y2.concat(numeric.neg(PYCRIT_C1));
    critical_points_y2 = critical_points_y2.concat(numeric.neg(PYCRIT_C2));

    // Set up arrays to use for mapping to caustics
    var RD2_C1 = numeric.add(R2mod2_C1, 4 * D2);
    var RD2_C2 = numeric.add(R2mod2_C2, 4 * D2);

    var UP1_C1 = numeric.sub(X1, 2 * D);
    var UP1_C2 = numeric.sub(X2, 2 * D);

    var UP2_C1 = X1;
    var UP2_C2 = X2;

    var DN1_C1 = numeric.sub(RD2_C1, numeric.mul(4 * D, X1));
    var DN1_C2 = numeric.sub(RD2_C2, numeric.mul(4 * D, X2));

    var DN2_C1 = R2mod2_C1;
    var DN2_C2 = R2mod2_C2;

    // Map critical curves to caustics
    var XC_C1_part1 = numeric.mul(GM1, numeric.div(UP1_C1, DN1_C1));
    var XC_C1_part2 = numeric.mul(GM2, numeric.div(UP2_C1, DN2_C1));
    var XC_C1 = numeric.sub(numeric.sub(X1, XC_C1_part1), XC_C1_part2);

    var XC_C2_part1 = numeric.mul(GM1, numeric.div(UP1_C2, DN1_C2));
    var XC_C2_part2 = numeric.mul(GM2, numeric.div(UP2_C2, DN2_C2));
    var XC_C2 = numeric.sub(numeric.sub(X2, XC_C2_part1), XC_C2_part2);

    var XC_C1 = numeric.sub(XC_C1, D);
    var XC_C2 = numeric.sub(XC_C2, D);

    var YC_C1_part1 = numeric.div(GM1, DN1_C1);
    var YC_C1_part2 = numeric.div(GM2, DN2_C1);
    var YC_C1_part3 = numeric.sub(1.0, YC_C1_part1);
    var YC_C1_part4 = numeric.sub(YC_C1_part3, YC_C1_part2);
    var YC_C1 = numeric.mul(Y1, YC_C1_part4);

    var YC_C2_part1 = numeric.div(GM1, DN1_C2);
    var YC_C2_part2 = numeric.div(GM2, DN2_C2);
    var YC_C2_part3 = numeric.sub(1.0, YC_C2_part1);
    var YC_C2_part4 = numeric.sub(YC_C2_part3, YC_C2_part2);
    var YC_C2 = numeric.mul(Y2, YC_C2_part4);

    var PXCAUS_C1 = numeric.mul(IP, XC_C1);
    var PXCAUS_C2 = numeric.mul(IP, XC_C2);

    var PYCAUS_C1 = numeric.mul(IP, YC_C1);
    var PYCAUS_C2 = numeric.mul(IP, YC_C2);

    caustic_points_x1 = caustic_points_x1.concat(PXCAUS_C1);
    caustic_points_x1 = caustic_points_x1.concat(PXCAUS_C2);

    caustic_points_x2 = caustic_points_x2.concat(PXCAUS_C1);
    caustic_points_x2 = caustic_points_x2.concat(PXCAUS_C2);

    caustic_points_y1 = caustic_points_y1.concat(PYCAUS_C1);
    caustic_points_y1 = caustic_points_y1.concat(PYCAUS_C2);

    caustic_points_y2 = caustic_points_y2.concat(numeric.neg(PYCAUS_C1));
    caustic_points_y2 = caustic_points_y2.concat(numeric.neg(PYCAUS_C2));

    // Swap the masses and repeat the calculation
    var GM0 = GM1;
    GM1 = GM2;
    GM2 = GM0;
    IP = -IP;
  }

  var caustic = {
    x1: caustic_points_x1,
    x2: caustic_points_x2,
    y1: caustic_points_y1,
    y2: caustic_points_y2,
    transitionIndex: C1_C2_transitionIndex,
  };

  var crit = {
    x1: critical_points_x1,
    x2: critical_points_x2,
    y1: critical_points_y1,
    y2: critical_points_y2,
    transitionIndex: C1_C2_transitionIndex,
  };

  var causticAndCritCurves = {
    caustic: caustic,
    crit: crit,
  };

  return causticAndCritCurves;
}

module.exports = {
  plot_binary: plot_binary,
};
