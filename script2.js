/* eslint no-console:0 consistent-return:0 */
"use strict";

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

function main() {
  // Get A WebGL context
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
      alert("")
    return;
  }

  // Get the strings for our GLSL shaders
  var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
  var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

  // create GLSL shaders, upload the GLSL source, compile the shaders
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

 
}

class Aplikasi{

  color = []
  appProgram = null
  gl = null
  canvas = null
  constructor(){

  }

  resizeCanvas(canva){
    const displayWidth = canva.clientWidth;
    const displayHeight = canva.clientHeight;
    if (canva.width !== displayWidth || canva.height !== displayHeight) {
        canva.width = displayWidth;
        canva.height = displayHeight;
    }
    return canva
  }

  renderer(){
    if(!this.gl || !this.appProgram) return
    let converColor = color.map(c=>((c-255)/255)+1)
    this.gl.useProgram(this.appProgram)
    this.resizeCanvas(this.canvas)
    this.gl.viewport(0,0, this.gl.canvas.width, this.gl.canvas.height)

    var posBuff = this.gl.createBuffer()
    this.gl.bindBuffer(gl.ARRAY_BUFFER, posBuff)
    this.gl.bufferData(g)
    
  }
}

main();
