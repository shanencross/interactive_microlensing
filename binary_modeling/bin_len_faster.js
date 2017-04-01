console.log("Executing bin_len_faster.js");

var bin_len_faster = (function() {

  function plot_binary(GM1=0.5, GM2=0.5, D=0.5, cof1=0.1, cof2=-0.5,
                               minXLM=-3, maxXLM=3, NPN=40, debug=false) {
    if (debug === true)
      console.time();
    // console.log("executing plot_binary function");
    // console.log(`${GM1}, ${GM2}, ${D}, ${cof1}, ${cof2}`)

    // var scope = {GM1: GM1, GM2: GM2, D: D, cof1: cof1, cof2: cof2,
    //                    minXLM:minXLM, maxXLM:maxXLM, NPN:NPN};

    // # Initialize arrays
    // # y,x coords of source and magnification ASA
    // # Define the number of points (NPN) to use for the trajectory
    // NPN = 40;
    // var XSA = new Array(NPN).fill(0);
    // var YSA = new Array(NPN).fill(0);
    var ASA = new Array(NPN).fill(0);

    // adapted from python: AIA = np.zeros(shape = (5, NPN))
    // var AIA = [];
    // for (var i=0; i<5; i++) {
    //   AIA.push(new Array(NPN).fill(0));
    // }

    var XIA = [];
    for (var i=0; i<5; i++) {
      XIA.push(new Array(NPN));
    }
    var YIA = [];
    for (var i=0; i<5; i++) {
      YIA.push(new Array(NPN));
    }

    GM2 = 1 - GM1

    console.time();
    // findCausticsAndCritCurves(GM1, GM2, D);
    findCausticsAndCritCurves_numeric(GM1, GM2, D);
    console.timeEnd();
    //
    // console.time();
    // // findCausticsAndCritCurves(GM1, GM2, D);
    // findCausticsAndCritCurves_numeric(GM1, GM2, D);
    // console.timeEnd();
    //
    // console.time();
    // // findCausticsAndCritCurves(GM1, GM2, D);
    // findCausticsAndCritCurves_numeric(GM1, GM2, D);
    // console.timeEnd();

    // # Evaluate the (linear) trajectory path
    // # NXS is the trajectory length (NPN points)
    var NXS = NPN;
    // XLM = 3;
    var XSC = numeric.linspace(minXLM, maxXLM, NXS);
    var XSA = XSC;

    // # Specify the trajectory
    var YSC = math.add(math.multiply(-cof1, XSC), cof2)
    var YSA = YSC;

    var NT = 1;
    var DT = 0.0;
    var RC = 0.0;
    var IT = 1;

    var T = IT * DT
    var XS = math.add(XSC, math.multiply(RC, math.cos(T)))
    var YS = math.add(YSC, math.multiply(RC, math.sin(T)));

    // # Evaluate the magnification
    // # Loop over source positions
    for (var IXS=0; IXS<NXS; IXS++) {
      // # Calculate positions of images given a source position
      // console.log(`GM1: ${GM1}`);
      // console.log(`GM2: ${GM2}`);
      // console.log(`D: ${D}`);
      // console.log(`XS[IXS]: ${XS[IXS]}`);
      // console.log(`YS[IXS]: ${YS[IXS]}`);

      XS[IXS] = math.round(XS[IXS], 12);
      YS[IXS] = math.round(YS[IXS], 12);
      // console.log(`rounded XS[IXS]: ${XS[IXS]}`);
      // console.log(`rounded YS[IXS]: ${YS[IXS]}`);



      imageparms = bin_ima.bin_ima(GM1, GM2, D,
                                         XS[IXS], YS[IXS]);
      transposed_imageparms = math.transpose(imageparms);

      var XI = transposed_imageparms[0];
      var YI = transposed_imageparms[1];
      var AI = transposed_imageparms[2];
      var IMP = transposed_imageparms[3];

      // console.log(`XI: ${XI}`);
      // console.log(`YI: ${YI}`);
      // console.log(`AI: ${AI}`);
      // console.log(`IMP: ${IMP}`);

      // console.log("---------------------------");

      // for (var i in imageparms)
        // console.log(imageparms[i]);

      // # Loop over all images
      for (var IM=0; IM<5; IM++) {
        // AIA[IM][IXS] = AI[IM];
        ASA[IXS] = math.add(ASA[IXS], math.multiply(IMP[IM], AI[IM]));

        XIA[IM][IXS] = XI[IM];
        YIA[IM][IXS] = YI[IM];
      }
    }

    var normalizedSourcePositions = {x: XSA, y: YSA};

    // XIA/YIA column: image number
    // XIA/YIA row: x index (ranges from 0 to NPN)
    var normalizedImagePositions = {x: XIA, y: YIA};

    if (debug === true) {
      console.timeEnd();
      console.log('done');

      /*console.log("XSA:");
      for (var i in XSA) {
        console.log(XSA[i]);
      }

      console.log("");
      console.log("ASA:");
      for (var i in ASA) {
        console.log(ASA[i]);
      }*/

      // return scope; // DEBUG: temp
    }
    else {
      return {
        normalizedSourcePositions: normalizedSourcePositions,
        normalizedImagePositions: normalizedImagePositions,
        magnifs: ASA,
      };
    }
  }


  function findCausticsAndCritCurves_numeric(GM1=0.5, GM2=0.5, D=0.5) {
    var IP = -1;
    var D2 = D * D;
    var D4 = D2 * D2;

    var NR = 300000; // # Points to use to plot critical curves and caustics
    var DR = 0.00001; // # Used to define the sampling density of the caustics

    // # Estimate criticals and caustics
    // # Perform repeat calculations with masses swapped over

    for (var IQ=0; IQ<2; IQ++) {
      var IR = _.range(1, NR);
      // var IR = Array(NR).fill().map((e,i)=>i+1);

      var R = numeric.mul(IR, DR);
      var R2 = numeric.mul(R, R);
      var R4 = numeric.mul(R2, R2);

      var GM1S = GM1 * GM1;
      var GM2S = GM2 * GM2;
      var GMXM = GM1 * GM2;
      var R2P = numeric.add(R2, 4 * D2);
      var R4M = numeric.sub(R4, GM2S);

      // A = 16 * D2 * R2 * (R4M - GMXM)
      // 16 * D2 * R2
      var A_part1 = numeric.mul(16 * D2, R2)
      // (R4M - GMXM)
      var A_paren1 = numeric.sub(R4M, GMXM);
      // A_part1 * A_paren1
      var A = numeric.mul(A_part1, A_paren1);

      // 8 * R * D * (GMXM * R2 - (R2 + 4 * D2) * R4M)
      // (R2 + 4 * D2)
      var B_paren1 = numeric.add(R2, 4 * D2);

      // GMXM * R2 - (B_paren1) * R4M
      var B_paren2 = numeric.sub(numeric.mul(GMXM, R2),
                                   numeric.mul(B_paren1, R4M));
      // 8 * R * D * (B_paren2)
      var B = numeric.mul(8 * D,
                          numeric.mul(R,
                                      B_paren2));

      //  C = (R2P * R2P) * R4M - GM1S * R4
      //      - 2 * GMXM * R2 * (R2 + 4 * D2)

      // (R2P * R2P)
      var C_paren1 = numeric.mul(R2P, R2P);
      // (R2 + 4 * D2)
      var C_paren2 = numeric.add(R2, 4 * D2);
      // (C_paren1) * R4M - GM1S * R4
      var C_part1 = numeric.sub(numeric.mul(C_paren1, R4M),
                                  numeric.mul(GM1S, R4));
      // 2 * GMXM * R2 * (C_paren2)
      var C_part2 = numeric.mul(2 * GMXM,
                                numeric.mul(R2,
                                            C_paren2));
      // C_part1 - C_part2
      var C = numeric.sub(C_part1, C_part2);

      // C = C + 16 * GM1 * GM2 * D2 * R2
      // 16 * GM1 * GM2 * D2 * R2
      var C_product = numeric.mul(16 * D2 * GM1 * GM2, R2);
      // C + C_product
      C = numeric.add(C, C_product);

      // DT = B * B - 4 * A * C
      var DT = numeric.sub(numeric.mul(B,
                                       B),
                           numeric.mul(4,
                                       numeric.mul(A,
                                                   C)));

    }
  }

  function findCausticsAndCritCurves(GM1=0.5, GM2=0.5, D=0.5) {
    var IP = -1;
    var D2 = D * D;
    var D4 = D2 * D2;

    var NR = 300000 // # Points to use to plot critical curves and caustics
    var DR = 0.00001 // # Used to define the sampling density of the caustics

    // # Estimate criticals and caustics
    // # Perform repeat calculations with masses swapped over

    for (var IQ=0; IQ<2; IQ++) {
      var IR = math.range(1, NR); // 1D matrix
      // var IR = _.range(1, NR);
      // console.log(IR);

      // # Define some variables that are used repeatedly
      var R = math.dotMultiply(IR, DR); // 1D matrix
      var R2 = math.dotMultiply(R, R); // 1D matrix
      var R4 = math.dotMultiply(R2, R2); // 1D matrix

      var GM1S = GM1 * GM1; // Number
      var GM2S = GM2 * GM2; // Number
      var GMXM = GM1 * GM2; // Number

      var R2P = math.add(R2, 4 * D2); // 1D Matrix
      var R4M = math.subtract(R4, GM2S); // 1D Matrix

      var chainDebugFlag = true; // for testing mathJS chaining efficiency

      // # Polynomial coeffs A, B, C
      // # as described in Schneider & Weiss 1986 (eqn 9b)

      // A = 16 * D2 * R2 * (R4M - GMXM)
      // (R4M - GMXM)
      // console.time();

      if (chainDebugFlag === true) {
        var A = math.chain(16 * D2)
                     .dotMultiply(R2)
                     .dotMultiply(math.subtract(R4M, GMXM))
                     .done();
      }

      else {
        var A_paren = math.subtract(R4M, GMXM) // 1D Matrix
        // 16 * D2
        var A_part1 = numeric.mul(16, D2); // Number
        // A_part1 * R2
        var A_part2 = numeric.mul(A_part1, R2); // 1D matrix
        // A_part2 * (A_paren)
        var A = math.dotMultiply(A_part2, A_paren);
      }
      // console.timeEnd();

      // 8 * R * D * (GMXM * R2 - (R2 + 4 * D2) * R4M)
      // (R2 + 4 * D2)
      var B_paren1 = math.add(R2, 4 * D2);

      // GMXM * R2 - (B_paren1) * R4M
      var B_paren2 = math.subtract(math.dotMultiply(GMXM, R2),
                                   math.dotMultiply(B_paren1, R4M));
      // 8 * R * D * (B_paren2)
      var B = math.dotMultiply(8 * D,
                               math.dotMultiply(R,
                                                B_paren2));

      //  C = (R2P * R2P) * R4M - GM1S * R4
      //      - 2 * GMXM * R2 * (R2 + 4 * D2)

      // (R2P * R2P)
      var C_paren1 = math.dotMultiply(R2P, R2P);
      // (R2 + 4 * D2)
      var C_paren2 = math.add(R2, 4 * D2);
      // (C_paren1) * R4M - GM1S * R4
      var C_part1 = math.subtract(math.dotMultiply(C_paren1, R4M),
                                  math.dotMultiply(GM1S, R4));
      // 2 * GMXM * R2 * (C_paren2)
      var C_part2 = math.dotMultiply(2 * GMXM,
                                     math.dotMultiply(R2,
                                                      C_paren2));
      // C_part1 - C_part2
      var C = math.subtract(C_part1, C_part2);

      // C = C + 16 * GM1 * GM2 * D2 * R2
      // 16 * GM1 * GM2 * D2 * R2
      var C_product = math.dotMultiply(16 * GM1 * GM2 * D2,  R2);
      // C + C_product
      C = math.add(C, C_product);

      // DT = B * B - 4 * A * C
      var DT = math.subtract(math.dotMultiply(B, B),
                             math.chain(4)
                             .dotMultiply(A)
                             .dotMultiply(C)
                             .done());

      // # When the determinant is >= 0 calculate the values of cos(theta) C1, C2
      // var DTge0 = math.filter(DT, x => (x >= 0) );
      // // # Modify relevant arrays accordingly
      // var R_DTgt0 = math.filter(DT, x => (x >= 0) );



    }

  }

  return {
    plot_binary: plot_binary,
    findCausticsAndCritCurves: findCausticsAndCritCurves,
  };
})();
