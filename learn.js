/*=================================================SETUP SECTION=========================================================*/
let canvas = document.getElementById("canvas")
let gl = canvas.getContext("webgl");
if (!gl) {
   console.error("Your browser not support WebGL!")
}

let shapes = []
let newShape;
let selectedShape = document.querySelector('input[name="shape"]:checked');

let vertexShaderSource = `
// an attribute will receive data from a buffer
  attribute vec2 a_position;

  uniform vec2 u_resolution;
 
  // all shaders have a main function
  void main() {
 
    // convert the position from pixels to 0.0 to 1.0
    vec2 zeroToOne = a_position / u_resolution;
 
    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;
 
    // convert from 0->2 to -1->+1 (clip space)
    vec2 clipSpace = zeroToTwo - 1.0;
 
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

  }
`

let fragmentShaderSource = `
// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision mediump float;

void main() {
  // gl_FragColor is a special variable a fragment shader
  // is responsible for setting
  gl_FragColor = vec4(1, 0, 0.5, 0.5); // return reddish-purple
}
`

let onClick = false;
let xStart = 0;
let yStart = 0;
let xMove = 0;
let yMove = 0;

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
   
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
   
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function getMousePosition(canvas, event){
  let rectangle = canvas.getBoundingClientRect()
  return {
    x: Math.round(event.clientX - rectangle.left),
    y: Math.round(event.clientY - rectangle.top)
  }
}

function drawSceneV1(positions){
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  let program = createProgram(gl, vertexShader, fragmentShader)

  let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  let resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  
  let positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  /*=================================================RENDER SECTION=========================================================*/
  
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Init attribute location
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset)

  // set the resolution
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  var primitiveType = gl.TRIANGLE_STRIP;
  var offset = 0;
  var count = 6;
  gl.drawArrays(primitiveType, offset, count);
}

canvas.addEventListener("mousedown", (event) => {

  let mousePosition = getMousePosition(canvas, event)
  xStart = mousePosition.x > mousePosition.y ? mousePosition.y : mousePosition.x;
  yStart = mousePosition.x > mousePosition.y ? mousePosition.y : mousePosition.x;
  xMove = mousePosition.x > mousePosition.y ? mousePosition.y : mousePosition.x;
  yMove = mousePosition.x > mousePosition.y ? mousePosition.y : mousePosition.x;

  // three 2d points
  let positions = [
    xStart, yStart,
    xMove, yStart,
    xStart, yMove,
    xStart, yMove,
    xMove, yStart,
    xMove, yMove,
  ];
  newShape = new Shape();
  newShape.positions = positions;

  shapes.push(newShape);
  for (let shape in shapes){
    drawSceneV1(shape.positions);
  }
  console.log(shapes);

  onClick = true;
})

canvas.addEventListener("mousemove", (event) => {
  if (onClick){
    // three 2d points
    let positions = [
      xStart, yStart,
      xMove, yStart,
      xStart, yMove,
      xStart, yMove,
      xMove, yStart,
      xMove, yMove,
    ];

    shapes.pop();
    newShape.positions = positions;
    shapes.push(newShape);

    for (let shape in shapes){
      drawSceneV1(shape.positions);
    }
    console.log(shapes);
    
    let newMousePosition = getMousePosition(canvas, event)
    xMove = newMousePosition.x > newMousePosition.y ? newMousePosition.y : newMousePosition.x;
    yMove = newMousePosition.x > newMousePosition.y ? newMousePosition.y : newMousePosition.x;
    // console.log(xStart, xMove, yStart, yMove)
  }
})

canvas.addEventListener("mouseup", (event) => {
  if (onClick){
    // three 2d points
    let positions = [
      xStart, yStart,
      xMove, yStart,
      xStart, yMove,
      xStart, yMove,
      xMove, yStart,
      xMove, yMove,
    ];

    shapes.pop();
    newShape.positions = positions;
    shapes.push(newShape);

    for (let shape in shapes){
      drawSceneV1(shape.positions);
    }
    console.log(shapes);

    xStart = xMove = yStart = yMove = 0;
    onClick=false;
  }
})