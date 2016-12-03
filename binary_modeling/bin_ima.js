console.log("Executing bin_ima.js");

bin_ima = (function() {
  function bin_ima(GM1=0.5, GM2=0.5, D=0.5, XS=0, YS=0) {
    console.log("Executing bin_ima function");
    
    var scope = {GM1: GM1, GM2: GM2, D: D, XS: XS, YS: YS,};
    scope.ZC = math.zeros(6);
    scope.ZIC = math.zeros(5);
    scope.IP = math.zeros(5);
    // console.log(ZC.toString());
    
    scope.EP = 1e-02;
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

    var ZC_0 = math.eval("Z1 * Z1 * (4 * HDDM * ZS + Z1 * (4 * HSDM + 4 * HDM * ZSS + Z1 * \
                         (2 * HSM * ZSC + ZSS * ZSC - Z1 * (2 * HDM + Z1 * ZS) ) ) )", scope);
                          
    var ZC_1 = math.eval("-Z1 * (8 * HSDM * ZS + Z1 * (4 * HDDM + 4 * HSSM + 4 * HSM * ZSS + Z1 * \
                          (4 * HDM * ZSC + Z1 * (ZSC * ZSC - Z1 * Z1) ) ) )", scope);
    
    var ZC_2 = math.eval("4 * HSSM * ZS + Z1 * (4 * HSDM - 4 * HDM * ZSS + Z1 * \
                          (-2 * ZSS * ZSC + Z1 * (4 * HDM + 2 * ZS * Z1 ) ) )", scope);
    
    var ZC_3 = math.eval("4 * HSM * ZSS + Z1 * (4 * HDM * ZSC + Z1 * (2 * ZSC * ZSC - 2 * Z1 * Z1) )", scope);
    
    var ZC_4 = math.eval("ZSC * (ZSS -2 * HSM) - Z1 * (2 * HDM + ZS * Z1)", scope);
    
    var ZC_5 = math.eval("Z1 * Z1 - ZSC * ZSC", scope);
                          
    scope.ZC.subset(math.index(0), ZC_0);
    scope.ZC.subset(math.index(1), ZC_1);
    scope.ZC.subset(math.index(2), ZC_2);
    scope.ZC.subset(math.index(3), ZC_3);
    scope.ZC.subset(math.index(4), ZC_4);
    scope.ZC.subset(math.index(5), ZC_5);

   // ----------------------------------------------------------------------------------
   scope.M = 5                     // Number of possible solutions
   // scope.ZI = poly.polyroots(ZC)   // Find roots of the polynomial
   scope.ZI = math.zeros(5); // DEBUG: temp

   scope.SA = 0.0;
   
   scope.result = math.zeros(5,4);
   
   // XI = ZI.real // can't do this with js libraries, so we do below instead
   var ZI_real = [];
   scope.ZI.forEach(function(value, index, matrix) {
     ZI_real.push(math.complex(value).re)
   });
   scope.XI = ZI_real;
   console.log(scope.XI);
   
   // result[:,0] = XI
   // YI = ZI.imag
   // result[:,1] = YI
   // ZR = ZI
   // ZP = ZC[0] + ZR * (ZC[1] + ZR * (ZC[2] + ZR * (ZC[3] + \
        // ZR * (ZC[4] + ZR * ZC[5]) ) ) )
   // ZIC = XI + 1j * -YI
   // ZDC1 = ZIC - Z1C
   // ZDC2 = ZIC - Z2C
   // ZB = GM1/ZDC1 + GM2/ZDC2
   // ZE = ZI - ZB
   // AE = np.abs(ZE)
   // ZD = GM1/(ZDC1 * ZDC1) + GM2/(ZDC2 * ZDC2)
   // CJ = np.abs(ZD * ZD)
   // VJ = 1.0 - CJ
   // AJ = 1.0/VJ
   // AI = AJ
   
    return scope; // DEBUG: temp
  }
  
  var scope = bin_ima();
  
  return {
    bin_ima: bin_ima,
    scope: scope,
  };
})();