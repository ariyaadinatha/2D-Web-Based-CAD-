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

function showHelp() {
    const helpModule = `
    1. Pilih shape yang diinginkan
    2. Drag mouse untuk menggambar
    3. Pilih 'Select Mode'
    4. Click shape yang ingin diubah
    5. Geser untuk merubah ukuran / Pilih warna yang diinginkan
    `;
    alert(helpModule);
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function saveShape() {
    var shapeJSON = {
        masterRenderColorKey : masterRenderColor,
        masterRenderPositionKey : masterRenderPosition,
        objectCountKey : objectCount,
        startPointObjectKey : startPointObject,
        numberVertecObjectKey : numberVertecObject,
        objTypeKey : objType,
        selectedObjectIdKey : selectedObjectId
    }
    download(JSON.stringify(shapeJSON), 'shape.txt', 'text/plain');
}

var readFile = function() {
    var file = document.getElementById("inputFile").files[0]
    var reader = new FileReader();
    reader.onload = function(e){
        arrayShape = JSON.parse(e.target.result);
        console.log('obj', arrayShape);
        masterRenderColor = arrayShape['masterRenderColorKey']
        masterRenderPosition = arrayShape['masterRenderPositionKey']
        objectCount = parseInt(arrayShape['objectCountKey'])
        startPointObject = arrayShape['startPointObjectKey']
        numberVertecObject = arrayShape['numberVertecObjectKey']
        objType = arrayShape['objTypeKey']
        renderCanvas({
            gl: gl,
            color: arrayShape['masterRenderColorKey'],
            position: arrayShape['masterRenderPositionKey'],
            nDrawableObj: arrayShape['objectCountKey'],
            beginIdx: arrayShape['startPointObjectKey'],
            numIdx: arrayShape['numberVertecObjectKey'],
            program: shaderProgram
        })
    }
    
    reader.readAsText(file);
    if (!file) {
        alert('Cannot proceed empty file')
    }
}
