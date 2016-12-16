console.log("Executing bin_ima.js");

var bin_ima = (function() {
  function bin_ima(GM1=0.5, GM2=0.5, D=0.5, XS=0, YS=0) {
    timeDebug = false;
    // console.log("Executing bin_ima function");
    if (timeDebug === true)
      console.time();
    // GM1 = mass of object 1 (as a % of total mass) e.g. 0.1
    // GM2 = mass of object 2 (as a % of total mass) e.g  0.9
    // D = half binary separation (between components) in Einstein radii
    // XS, YS = x,y coordinates of the source (in x/R_E, y/R_E)
    var scope = {GM1: GM1, GM2: GM2, D: D, XS: XS, YS: YS,};


    // XI, YI, AI = image coordinates (x,y) and magnification for
    // each of the five (max) images

    // Complex coefficients ZC of the 5th order polynomial
    scope.ZC = new Array(6).fill(0);
    // Image positions, complex notation
    scope.ZIC = new Array(5).fill(0);
    // Image parity
    scope.IP = new Array(5).fill(0);

    scope.EP = 1e-02; // 1e-03
    // Set up parameters for the calculation of the coefficients
    scope.HSM = math.eval("(GM1 + GM2)/2.0", scope);    // half sum of masses
    scope.HDM = math.eval("(GM2 - GM1)/2.0", scope);     // half difference of masses
    scope.HSDM = math.multiply(scope.HSM, scope.HDM);
    scope.HSSM = math.multiply(scope.HSM, scope.HSM);
    scope.HDDM = math.multiply(scope.HDM, scope.HDM);
    scope.Z1 = math.complex(math.multiply(-1,scope.D), 0.0);
    scope.Z2 = math.complex(scope.D, 0.0);
    scope.Z1C = math.complex(math.multiply(-1, scope.D), 0.0);
    scope.Z2C = math.complex(scope.D, 0.0);

    // Source location in complex notation
    scope.ZS = math.complex(scope.XS, scope.YS);
    scope.AS = math.abs(scope.ZS);
    scope.ZSC = math.complex(scope.XS, math.multiply(-1, scope.YS));
    scope.ZSS = math.multiply(scope.ZS, scope.ZSC);

    // console.log("");
    // for (var i in scope) {
    // console.log(`${i}: ${scope[i]}`);
    // }

    // console.time();
    // Complex coefficients
    // ----------------------------------------------------------------------------------
    scope.ZC[0] = math.eval("Z1 * Z1 * (4 * HDDM * ZS + Z1 * (4 * HSDM + 4 * HDM * ZSS + Z1 * \
                       (2 * HSM * ZSC + ZSS * ZSC - Z1 * (2 * HDM + Z1 * ZS) ) ) )", scope);
                        
    scope.ZC[1] = math.eval("-Z1 * (8 * HSDM * ZS + Z1 * (4 * HDDM + 4 * HSSM + 4 * HSM * ZSS + Z1 * \
                        (4 * HDM * ZSC + Z1 * (ZSC * ZSC - Z1 * Z1) ) ) )", scope);

    scope.ZC[2] = math.eval("4 * HSSM * ZS + Z1 * (4 * HSDM - 4 * HDM * ZSS + Z1 * \
                        (-2 * ZSS * ZSC + Z1 * (4 * HDM + 2 * ZS * Z1 ) ) )", scope);

    scope.ZC[3] = math.eval("4 * HSM * ZSS + Z1 * (4 * HDM * ZSC + Z1 * (2 * ZSC * ZSC - 2 * Z1 * Z1) )", scope);

    scope.ZC[4] = math.eval("ZSC * (ZSS -2 * HSM) - Z1 * (2 * HDM + ZS * Z1)", scope);

    // console.time();
    scope.ZC[5] = math.eval("Z1 * Z1 - ZSC * ZSC", scope);
    // scope.ZC[5] = math.subtract(math.multiply(scope.Z1, scope.Z1), math.multiply(scope.ZSC, scope.ZSC));
    // scope.ZC[5] = -0.5 * -3;
    // console.timeEnd();
    // console.log(scope.Z1.toString() + ", " + scope.ZSC.toString());
    // console.log(scope.ZC[5]);

    // for (var i=0; i<6; i++)
    // console.log(`ZC[${i}]: ${scope.ZC[i]}`);

    // ----------------------------------------------------------------------------------
    scope.M = 5                     // Number of possible solutions
    // scope.ZI = poly.polyroots(ZC)   // Find roots of the polynomial
    // scope.ZI = new Array(5).fill(0); // DEBUG: temp
    
    // DEBUG: temp test
     
    var ZC_real = [];
    var ZC_imag = [];
    for (var i in scope.ZC) {
      ZC_real.push(math.complex(scope.ZC[i]).re);
      ZC_imag.push(math.complex(scope.ZC[i]).im);
    }
    
    // console.time();
    // var ZC_roots = findRoots(ZC_real, ZC_imag);
    ZC_real_reverse = ZC_real.slice().reverse();
    ZC_imag_reverse = ZC_imag.slice().reverse();
    var ZC_roots = cpoly(ZC_real_reverse, ZC_imag_reverse);
    // console.timeEnd();
    
    scope.ZI = [];
    for (var i=0; i<ZC_roots[0].length; i++) {
      if (almostEquals(0, ZC_roots[0][i]) === true)
        ZC_roots[0][i] = 0;
      if (almostEquals(0, ZC_roots[1][i]) === true)
        ZC_roots[1][i] = 0;
      
    scope.ZI.push(math.complex(ZC_roots[0][i], ZC_roots[1][i]));
    }
    
    // scope.ZI = [ math.complex(-1.11803399e+00, -8.26372302e-20),  
                          // math.complex(-1.38344197e-16, 8.66025404e-01),
                          // math.complex(0.00000000e+00, 0.00000000e+00), 
                          // math.complex(8.12052344e-17, -8.66025404e-01),
                          // math.complex(1.11803399e+00, -2.22044605e-16)]

    scope.SA = 0.0;
   
    // scope.result = [[0, 0, 0, 0],
                          // [0, 0, 0, 0],
                          // [0, 0, 0, 0],
                          // [0, 0, 0, 0],
                          // [0, 0, 0, 0]];
             
   
    scope.resultColumns = [];
   
    scope.XI = math.re(scope.ZI);
    scope.resultColumns.push(scope.XI); // result_0
    scope.YI = math.im(scope.ZI);
    scope.resultColumns.push(scope.YI); // result_1
   
    scope.ZR = scope.ZI;
    // return {ZR: scope.ZR, ZC: scope.ZC};
    // mathjs eval syntax has one-based numbering, so array indicies increment by one
    scope.ZP = math.eval("ZC[0+1] + ZR * (ZC[1+1] + ZR * (ZC[2+1] + ZR * (ZC[3+1] + \
                                    ZR * (ZC[4+1] + ZR * ZC[5+1]) ) ) )", {ZR: math.matrix(scope.ZR), 
                                                                                           ZC: math.matrix(scope.ZC)}).toArray();
                                   
    scope.ZIC = math.conj(scope.ZI); // 
   
    scope.ZDC1 = math.subtract(scope.ZIC, scope.Z1C);
   
    scope.ZDC2 = math.subtract(scope.ZIC, scope.Z2C);
   
    var ZB_term1 = math.multiply(scope.GM1, math.dotPow(scope.ZDC1, -1)); // GM1/ZDC1
    var ZB_term2 = math.multiply(scope.GM2, math.dotPow(scope.ZDC2, -1)); // GM2/ZDC2
    scope.ZB = math.add(ZB_term1, ZB_term2); // GM1/ZDC1 + GM2/ZDC2
   
    scope.ZE = math.subtract(scope.ZI, scope.ZB)
    scope.AE = math.abs(scope.ZE);
    var ZD_term1 = math.multiply(scope.GM1, math.dotPow(scope.ZDC1, -2)); // GM1/(ZDC1*ZDC1)
    var ZD_term2 = math.multiply(scope.GM2, math.dotPow(scope.ZDC2, -2)); // GM2/(ZDC2*ZDC2)
    scope.ZD = math.add(ZD_term1, ZD_term2); // GM1/(ZDC1*ZDC1) + GM2/(ZDC2*ZDC2)

    scope.CJ = math.abs(math.dotPow(scope.ZD, 2)); // abs(ZD*ZD)
    scope.VJ = math.subtract(1, scope.CJ);
    scope.AJ = math.dotPow(scope.VJ, -1); // 1/VJ
    scope.AI = scope.AJ;
    scope.resultColumns.push(scope.AI); // result_2
    scope.SA = math.add(scope.SA, scope.AJ);

    for (var i=0; i<scope.M; i++) {

      var firstComparison = compareComplexNumToZero(scope.AJ[i]);
      var secondComparison = compareComplexNumToZero(math.subtract(math.abs(math.subtract(scope.ZE[i], scope.ZS)), scope.EP));
      
      // console.log(`first comparison: ${firstComparison}`);
      // console.log(`second comparison: ${secondComparison}`);
      // case #1
      // if (AJ[I] < 0 and not np.abs(ZE[I] - ZS) - EP > 0):
      if (firstComparison === -1 && secondComparison < 1) {
        // console.log("adding -1 to IP");
        scope.IP[i] = -1;
      }
      
      // case #2
      // if (AJ[I] == 0 and np.abs(ZE[I] - ZS) - EP > 0):
      if (firstComparison === 0 && secondComparison === 1) {
        // console.log("adding 0 to IP");
        scope.IP[i] = 0;
      }
      
      // case #3
      // if (AJ[I] > 0 and not np.abs(ZE[I] - ZS) - EP > 0):
      if (firstComparison === 1 && secondComparison < 1) {
        // console.log("adding +1 to IP");
        scope.IP[i] = 1;
      }
    }
    // scope.IP = math.complex(scope.IP); // DEBUG: temp? maybe not needed or not best way?
    scope.resultColumns.push(scope.IP); // result_3
    
    scope.results = math.transpose(scope.resultColumns);
   
    if (timeDebug === true)
      console.timeEnd();
    // return scope; // DEBUG: temp
    return scope.results;
  }
  
  function almostEquals(a, b, epsilon=1e-12) {
    return (Math.abs(a - b) < epsilon);
  }
  
  function compareComplexNumToZero(num) {
    var complexNum = math.complex(num);
    
    // if real component is ~=0, use only imaginary component for comparison --
    // if real component is nonzero, use only the real component for comparison
      
    if (almostEquals(complexNum.re, 0) === true) {
      var comparisonNum = complexNum.im;
    }
    else {
      var comparisonNum = complexNum.re;
    }
    
    // console.log(`comparisonNum is: ${comparisonNum}`);
    
    if (almostEquals(comparisonNum, 0) === true) {
      return 0;
    }
    else if (comparisonNum > 0)
      return 1;
    else if (comparisonNum < 0)
      return -1;
   else
     console.log(`ERROR: comparisonNum is: ${comparisonNum}`);
  }
  
    
  // var scope = bin_ima(); // debug
  
  return {
    bin_ima: bin_ima,
    // scope: scope, // debug
    almostEquals: almostEquals,
    compareComplexNumToZero: compareComplexNumToZero,
  };
  
})();