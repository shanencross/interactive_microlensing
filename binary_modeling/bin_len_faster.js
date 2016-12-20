console.log("Executing bin_len_faster.js");

var bin_len_faster = (function() {
  
  function plot_binary(GM1=0.5, GM2=0.5, D=0.5, cof1=0.1, cof2=-0.5, 
                               minXLM=-3, maxXLM=3, NPN=40, debug=false) {
    console.time();
    // console.log("executing plot_binary function");
    // console.log(`${GM1}, ${GM2}, ${D}, ${cof1}, ${cof2}`)
    
    var scope = {GM1: GM1, GM2: GM2, D: D, cof1: cof1, cof2: cof2, 
                       minXLM:minXLM, maxXLM:maxXLM, NPN:NPN};
    
    // # Initialize arrays
    // # y,x coords of source and magnification ASA
    // # Define the number of points (NPN) to use for the trajectory
    // scope.NPN = 40;
    scope.XSA = new Array(scope.NPN).fill(0);
    scope.YSA = new Array(scope.NPN).fill(0);
    scope.ASA = new Array(scope.NPN).fill(0);
    
    // AIA = np.zeros(shape = (5, NPN))
    scope.AIA = [];
    for (var i=0; i<5; i++) {
      scope.AIA.push(new Array(scope.NPN).fill(0));
    }
    
    scope.GM2 = 1 - scope.GM1
    
    // # Evaluate the (linear) trajectory path
    // # NXS is the trajectory length (NPN points)
    scope.NXS = scope.NPN;
    // scope.XLM = 3;
    scope.XSC = numeric.linspace(scope.minXLM, scope.maxXLM, scope.NXS);
    scope.XSA = scope.XSC;
   
    // # Specify the trajectory
    scope.YSC = math.add(math.multiply(-scope.cof1, scope.XSC), scope.cof2)
    scope.YSA = scope.YSC;

    scope.NT = 1;
    scope.DT = 0.0;
    scope.RC = 0.0;
    scope.IT = 1;

    scope.T = scope.IT * scope.DT
    scope.XS = math.add(scope.XSC, math.multiply(scope.RC, math.cos(scope.T)))
    scope.YS = math.add(scope.YSC, math.multiply(scope.RC, math.sin(scope.T)));

    // # Evaluate the magnification
    // # Loop over source positions
    for (var IXS=0; IXS<scope.NXS; IXS++) {
      // # Calculate positions of images given a source position
      // console.log(`GM1: ${scope.GM1}`);
      // console.log(`GM2: ${scope.GM2}`);
      // console.log(`D: ${scope.D}`);
      // console.log(`XS[IXS]: ${scope.XS[IXS]}`);
      // console.log(`YS[IXS]: ${scope.YS[IXS]}`);
      
      scope.XS[IXS] = math.round(scope.XS[IXS], 12);
      scope.YS[IXS] = math.round(scope.YS[IXS], 12);
      // console.log(`rounded XS[IXS]: ${scope.XS[IXS]}`);
      // console.log(`rounded YS[IXS]: ${scope.YS[IXS]}`);


      
      scope.imageparms = bin_ima.bin_ima(scope.GM1, scope.GM2, scope.D, 
                                                         scope.XS[IXS], scope.YS[IXS]);
      scope.transposed_imageparms = math.transpose(scope.imageparms);

      var XI = scope.transposed_imageparms[0];                                                         
      var YI = scope.transposed_imageparms[1];
      var AI = scope.transposed_imageparms[2];
      var IMP = scope.transposed_imageparms[3];

      // console.log(`XI: ${XI}`);
      // console.log(`YI: ${YI}`);
      // console.log(`AI: ${AI}`);
      // console.log(`IMP: ${IMP}`);

      // console.log("---------------------------");
    
      // for (var i in scope.imageparms)
        // console.log(scope.imageparms[i]);
    
      for (var IM=0; IM<5; IM++) {
        scope.AIA[IM][IXS] = AI[IM];
        scope.ASA[IXS] = math.add(scope.ASA[IXS], math.multiply(IMP[IM], AI[IM]));
        // console.log(AI[IM]);
      }
                                                         
      // console.log(IXS); 
      
    // # Loop over all images
    }
    if (debug === true) {
      console.timeEnd();
      console.log('done');
    
      console.log("XSA:");
      for (var i in scope.XSA) {
        console.log(scope.XSA[i]);
      }
      
      console.log("");
      console.log("ASA:");
      for (var i in scope.ASA) {
        console.log(scope.ASA[i]);
      }
      
      return scope; // DEBUG: temp
    }
    else {
      return {
        normalizedPositions: scope.XSA,
        magnifs: scope.ASA,
      };
    }
  }
  
  return {
    plot_binary: plot_binary,
  };
})();