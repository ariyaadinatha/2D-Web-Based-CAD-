// Vertex shader program
const vsSource = `
  attribute vec4 a_position;
  attribute vec4 a_color;

  varying vec4 v_color;

  void main() {
      v_color = a_color;
      gl_Position = a_position;
  }
`;

// Fragment shader program
// ini buat ganti warna shapenya
const fsSource = `
  precision mediump float;

  varying vec4 v_color;

  void main(){
      gl_FragColor = v_color;
  }
`;

function renderCanvas(rObj = {
    gl : null,
    color: [],
    program: null,
    position: [],
    nDrawableObj: 0,
    beginIdx: [],
    numIdx: []
  }){
    console.log("si render: ", rObj)
    const gl = rObj.gl;
    gl.useProgram(rObj.program)
    gl.viewport(0,0, gl.canvas.width, gl.canvas.height)
  
    const posBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuff);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rObj.position), gl.STATIC_DRAW);
  
    const clrBuff = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, clrBuff)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rObj.color), gl.STATIC_DRAW);
  
    const possAttrLoc = gl.getAttribLocation(rObj.program, "a_position")
    gl.enableVertexAttribArray(possAttrLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuff);
    gl.vertexAttribPointer(possAttrLoc, 2, gl.FLOAT, false, 0, 0);
  
    const clrAttrLoc = gl.getAttribLocation(rObj.program, "a_color")
    gl.enableVertexAttribArray(clrAttrLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, clrBuff);
    gl.vertexAttribPointer(clrAttrLoc, 4, gl.FLOAT, false, 0, 0);
  
    for (let i = 0; i <= rObj.nDrawableObj; i++) {
      gl.drawArrays(gl.TRIANGLE_FAN, rObj.beginIdx[i], rObj.numIdx[i]);
    }
  }

  // Initialize a shader program, so WebGL knows how to draw our data
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }


  console.log(shaderProgram)
  return shaderProgram;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}