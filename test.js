var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

context.beginPath();
context.arc(canvas.width/2, canvas.height/2, 5, 0, 2*Math.PI);

context.fillStyle = "blue";
context.fill();
