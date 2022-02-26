const rectangelCoor = [
  1.0,  1.0,
  -1.0,  1.0,
  1.0, -1.0,
  -1.0, -1.0,
];

// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context

// initBuffers
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple two-dimensional square.

function initBuffers(gl, positions) {

  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(positions),
                gl.STATIC_DRAW);

  return {
    position: positionBuffer,
  };
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, buffers, x, y) {
  gl.clearColor(1.0, 1.0, 1.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = vec4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();
  console.log(modelViewMatrix);

  // Now move the drawing position a bit to where we want to
  // start drawing the square.
  // posisi dari objek
  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [x, y, -20.0]);  // amount to translate


  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

function mouseUpListener(e){
  var pos = getMouseCoordinate(canvas, e);
  const x = pos.x / gl.canvas.width  *  2 - 1;
  const y = pos.y / gl.canvas.height * -2 + 1;

  if(onDrawClick){
    const savedshape = {"garis":{}, "persegi":{}, "persegipanjang":{}}
    const n = parseInt(document.getElementById("poligonSide").value)
    masterRenderPosition= [...tempPosition]
    masterRenderColor= [...tempColor]
    tempColor=[]
    tempPosition=[]
    objectCount++;
    objType.push(selectedMenu)
    if(objectCount==1) {startPointObject.push(0)}
    else {
      if(objType[objectCount-1]!="poligon"){
        startPointObject.push(startPointObject[startPointObject.length-1]+4)
      }else{
        startPointObject.push(
          startPointObject[startPointObject.length-1] + 
          numberVertecObject[numberVertecObject.length-1])
      }
    }
    if(Object.keys(savedshape).includes(selectedMenu)){
      numberVertecObject.push(4)
    }else if(selectedMenu == "poligon"){
      numberVertecObject.push(n)
    }
  }

  onDrawClick = false
}

function mouseDownListener(e){
  var pos = getMouseCoordinate(canvas, e);
  initX = pos.x / gl.canvas.width  *  2 - 1;
  initY = pos.y / gl.canvas.height * -2 + 1;    
  // console.log(x, y);

  // tempPosition = [...masterRenderPosition]
  // tempColor = [...masterRenderColor]

  const shapeOpt = {
    "garis":createLine, 
    "persegi":createSquare, 
    "persegipanjang":createRectangle,
    "poligon" : createPolygon
  }
  if(Object.keys(shapeOpt).includes(selectedMenu)){
    onDrawClick = true
    shapeFunc = shapeOpt[selectedMenu]
  }
}

function mouseMoveListener(e){
  var pos = getMouseCoordinate(canvas, e);
  const x = pos.x / gl.canvas.width  *  2 - 1;
  const y = pos.y / gl.canvas.height * -2 + 1;
  if(onDrawClick){
    const isPoligon = selectedMenu == "poligon"
    let nPoligon = parseInt(document.getElementById("poligonSide").value)
    console.log(x,y)
    const lineVertex = shapeFunc({x:initX,y:initY},{x:x,y:y})
    tempPosition = [...masterRenderPosition].concat(lineVertex)
    const gw = gantiWarna()
    if(selectedMenu!="poligon"){
      tempColor = [...masterRenderColor].concat([
        gw.r,gw.g,gw.b,1,
        gw.r,gw.g,gw.b,1,
        gw.r,gw.g,gw.b,1,
        gw.r,gw.g,gw.b,1,
      ])
    }else{
      let tColor = []
      const n = parseInt(document.getElementById("poligonSide").value)
      for(let i=0;i<n;i++){
        tColor = tColor.concat([gw.r,gw.g,gw.b,1])
      }
      tempColor = [...masterRenderColor].concat(tColor)
    }
    //clearCanvas(gl, shaderProgram);
    const sip = objType[objectCount]=="poligon"
    const prevNPolygon = numberVertecObject[numberVertecObject.length-1]
    let bIdx = [...startPointObject, startPointObject.length>1 ? startPointObject[startPointObject.length-1]+(sip?prevNPolygon:4) : 0]
    const nIdx = [...numberVertecObject, isPoligon ? nPoligon : 4]
    renderCanvas({
      gl: gl,
      color: tempColor,
      position: tempPosition,
      nDrawableObj: objectCount+1,
      beginIdx: bIdx,
      numIdx: nIdx,
      program: shaderProgram
    })
  }

  if(e.target !== canvas){
    onDrawClick = false
  }
}

function mouseClickListener(e){
    if(selectedMenu=="select"){
      selectedObjectId = selectTools(e)
      const textObjectId = document.getElementById("text-objid")
      const textObjectType = document.getElementById("text-objtype")
      if(selectedObjectId > 0){
        textObjectId.textContent = "Object dengan ID: "+selectedObjectId
        textObjectType.hidden = false
        textObjectType.textContent = objType[selectedObjectId]
      }else{
        textObjectId.textContent = "No Object selected!"
        textObjectType.hidden = true
      }
      objectEditorHandler()
    }
}

function polygon(vectors){

  return true
}

function mainApp() {
  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }
  tempPosition = [...masterRenderPosition]
  tempColor = [...masterRenderColor]
  //Inisialisasi awal sharder
  shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  gl.clearColor(0,0,0,0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.useProgram(shaderProgram)
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  //Event listener reader for mouse
  canvas.addEventListener('mousedown', mouseDownListener);

  canvas.addEventListener('mouseup', mouseUpListener);

  canvas.addEventListener('click', mouseClickListener);

  document.addEventListener("mousemove", mouseMoveListener)

  menubox.addEventListener("click", function(e){
    radios = document.getElementsByName("shape")
    var isPoligon = selectedMenu == "poligon"
    for (const radio of radios){
      if(radio.checked){
        selectedMenu = radio.value
      }
    }

    if(!isPoligon && selectedMenu == "poligon"){
      document.getElementById("poligonSide").value = 5
    }

    if(selectedMenu == "select" && objectCount>0){
      objEditForm.hidden = false
    }else{
      objEditForm.hidden = true
      selectedObjectId = 0
    }
  })

  canvas.addEventListener('dblclick', (e)=>{
    
  })

  document.getElementById("resetcanvas").addEventListener('click', (e)=>{
    clearCanvasCling()
  })
  
  // Collect all the info needed to use the shader program.
  // Look up which attribute our shader program is using
  // for aVertexPosition and look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  
}

mainApp();