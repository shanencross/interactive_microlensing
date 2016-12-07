console.log("Executing bin_len_faster.js");

bin_len_faster = (function() {
  
  var GM1 = 0.1;
  var GM2 = 20;
  var D = 0.5;
  var cof1 = 0.1;
  var cof2 = -0.5;
  
  function plot_binary(GM1, GM2, D, cof1, cof2) {
    console.log("executing plot_binary function");
    console.log(`${GM1}, ${GM2}, ${D}, ${cof1}, ${cof2}`)
  }
  
  return {
    plot_binary: plot_binary,
  };
})();