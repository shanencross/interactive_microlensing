console.log("Executing binary_translation.js");

var binary_translation = (function() {
  var GM1 = 0.2;
  var GM2 = 20;
  var D = 0.5;
  var cof1 = 0.1;
  var cof2 = -0.5;
  var minXLM = -3; // lower x limit
  var maxXLM = 3; // upper x limit
  var NPN = 4000; // number of points

  // var GM1 = 0.5;
  // var GM2 = 0.5;
  // var D = 0.5;
  // var XS = 0;
  // var YS = 0;

  // var GM1 = 0.5;
  // var GM2 = 0.5;
  // var D = 0.5;
  // var XS = -3;
  // var YS = 0.2;

  // var GM1 = 0.5;
  // var GM2 = 0.5;
  // var D = 0.6;
  // var XS = 0;
  // var YS = 0;

  console.log(`GM1: ${GM1}`);
  console.log(`GM2: ${GM2}`);
  console.log(`D: ${D}`);
  console.log(`cof1: ${cof1}`);
  console.log(`cof2: ${cof2}`);
  console.log(`minXLM: ${minXLM}`);
  console.log(`maxXLM: ${maxXLM}`);
  console.log(`NPN: ${NPN}`);
  // console.log(`XS: ${XS}`);
  // console.log(`YS: ${YS}`);

  // var scope = bin_ima.bin_ima(GM1, GM2, D, XS, YS);
  var scope = bin_len_faster.plot_binary(GM1, GM2, D, cof1, cof2,
                                         minXLM, maxXLM, NPN, debug=true);
  // var scope = bin_len_faster.plot_binary(GM1, GM2, D, cof1, cof2,
  //                                       minXLM, maxXLM, NPN, debug=true);
  // var scope = bin_len_faster.plot_binary(GM1*1.1, GM2, D*1.5, cof1, cof2,
  //                                      minXLM, maxXLM, NPN, debug=true);

  for (var i=0; i<scope.length; i++) {
    console.log(`${i}: ${scope[i]}`);
  }

  return {
    scope: scope,
  };
})();
