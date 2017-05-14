console.log("Executing binary_translation.js");

var binary_translation_bin_ima = (function() {
  // var GM1 = 0.1;
  // var GM2 = 20;
  // var D = 0.5;
  // var cof1 = 0.1;
  // var cof2 = -0.5;

  // var GM1 = 0.5;
  // var GM2 = 0.5;
  // var D = 0.5;
  // var XS = 0;
  // var YS = 0;

  var GM1 = 0.1;
  var GM2 = 0.9;
  var D = 0.5;
  var XS = -3;
  var YS = 0.2;

  // var GM1 = 0.5;
  // var GM2 = 0.5;
  // var D = 0.6;
  // var XS = 0;
  // var YS = 0;

  console.log(`GM1: ${GM1}`);
  console.log(`GM2: ${GM2}`);
  console.log(`D: ${D}`);
  // console.log(`cof1: ${cof1}`);
  // console.log(`cof1: ${cof2}`);
  console.log(`XS: ${XS}`);
  console.log(`YS: ${YS}`);

  var timeDebug = true;

  var scope = bin_ima.bin_ima(GM1, GM2, D, XS, YS, timeDebug);
  var scope2 = bin_ima.bin_ima(GM1*1.1, GM2*1.1, D*1.1, XS*1.1, YS*1.1, timeDebug);
  var scope3 = bin_ima.bin_ima(GM1*1.2, GM2*1.2, D*1.2, XS*1.2, YS*1.2, timeDebug);
  var scope4 = bin_ima.bin_ima(GM1*1.3, GM2*1.3, D*1.3, XS*1.3, YS*1.3, timeDebug);
  // var scope2 = bin_ima.bin_ima(GM1, GM2, D, XS, YS, timeDebug);
  // var scope3 = bin_ima.bin_ima(GM1, GM2, D, XS, YS, timeDebug);
  // var scope4 = bin_ima.bin_ima(GM1, GM2, D, XS, YS, timeDebug);
  // var scope5 = bin_ima.bin_ima(GM1, GM2, D, XS, YS, timeDebug);
  // var scope6 = bin_ima.bin_ima(GM1, GM2, D, XS, YS, timeDebug);
  // var scope7 = bin_ima.bin_ima(GM1, GM2, D, XS, YS, timeDebug);
  // var scope8 = bin_ima.bin_ima(GM1, GM2, D, XS, YS);
  // var scope9 = bin_ima.bin_ima(GM1, GM2, D, XS, YS);
  // var scope10 = bin_ima.bin_ima(GM1, GM2, D, XS, YS);
  // var scope11 = bin_ima.bin_ima(GM1, GM2, D, XS, YS);
  // var scope12 = bin_ima.bin_ima(GM1, GM2, D, XS, YS);
  // var scope13 = bin_ima.bin_ima(GM1, GM2, D, XS, YS);
  // var scope14 = bin_ima.bin_ima(GM1, GM2, D, XS, YS);
  // var scope15 = bin_ima.bin_ima(GM1, GM2, D, XS, YS);
  // var scope16 = bin_ima.bin_ima(GM1, GM2, D, XS, YS);
  // var scope17 = bin_ima.bin_ima(GM1, GM2, D, XS, YS);
  // var scope = bin_len_faster.plot_binary(GM1, GM2, D, cof1, cof2);

  for (var i=0; i<scope.length; i++) {
    console.log(`${i}: ${scope[i]}`);
  }

  return {
    scope: scope,
  };
})();
