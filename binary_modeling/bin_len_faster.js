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

  return {
    plot_binary: plot_binary,
  };
})();
