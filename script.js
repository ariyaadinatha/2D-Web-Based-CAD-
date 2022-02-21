let canvas = document.getElementById("canvas");
let canvasForm = document.getElementById("canvasForm");
var canvasContext = canvas.getContext("2d");
var firstLocation, lastLocation;

function getMouseCoordinate(canvas, e) {
    var canvasPosition = canvas.getBoundingClientRect();
    var canvasX = Math.round(e.clientX - canvasPosition.left);
    var canvasY = Math.round(e.clientY - canvasPosition.top);
    return {
      x: canvasX,
      y: canvasY
    };
}

function drawLine(canvasX, canvasY, canvasX2, canvasY2) {
    canvasContext.moveTo(canvasX, canvasY);
    canvasContext.lineTo(canvasX2, canvasY2);
    canvasContext.stroke();
}

function drawSquare(canvasX, canvasY, canvasX2, canvasY2) {
    canvasContext.beginPath();
    canvasContext.rect(canvasX, canvasY, canvasX2, canvasY2);
    canvasContext.stroke();
}

document.addEventListener('mousedown', function(e) {
    firstLocation = getMouseCoordinate(canvas, e);
    console.log(firstLocation)
});

document.addEventListener('mouseup', function(e) {
    lastLocation = getMouseCoordinate(canvas, e);
    console.log(lastLocation)

   // if garis
   // drawLine(firstLocation['x'], firstLocation['y'], lastLocation['x'], lastLocation['y'])
   
   // elif persegi
   // sideSquare = lastLocation['x'] - firstLocation['x']
   // drawSquare(firstLocation['x'], firstLocation['y'], sideSquare, sideSquare)

   // elif persgipanjang
   sideSquareX = lastLocation['x'] - firstLocation['x']
   sideSquareY = lastLocation['y'] - firstLocation['y']
   drawSquare(firstLocation['x'], firstLocation['y'], sideSquareX, sideSquareY)
});