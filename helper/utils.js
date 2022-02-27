function getMouseCoordinate(canvas, e) {
    var canvasPosition = canvas.getBoundingClientRect();
    var canvasX = Math.round(e.clientX - canvasPosition.left);
    var canvasY = Math.round(e.clientY - canvasPosition.top);
    return {
      x: canvasX,
      y: canvasY
    };
}

function hexToRgb(hex) {
var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: 1
} : null;
}

function colorPicker(){
picker = document.getElementById("selektor-warna");
return picker.value
}


function gantiWarna(){
    const glConvention = (n) => (((n-255)/255)+1)

rgb = hexToRgb(colorPicker());
selectedColor.r = rgb.r;
selectedColor.g = rgb.g;
selectedColor.b = rgb.b;
// console.log("rgb",rgb)
return {
    r:glConvention(rgb.r),
    g:glConvention(rgb.g),
    b:glConvention(rgb.b)
}
}



function clearCanvas(gl, program){
    renderCanvas({
        gl: gl,
        color: [],
        position: [],
        nDrawableObj: -1,
        beginIdx: [,0],
        numIdx: [,4],
        program: program
      })
}


function round(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}