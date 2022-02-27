function createLine(start = {x:0,y:0},end = {x:0,y:0}){
    const w = 0.003
    const teta = (Math.PI/2) - Math.atan2(
      end.y - start.y,
      end.x - start.x
    )
    const dx = Math.cos(teta) *w;
    const dy = Math.sin(teta) *w;
    const vertexNode = []
    for(let i=0;i<8;i++){
      let a,b
      a = i<4?start[i%2==0 ? "x" : "y"]:end[i%2==0 ? "x" : "y"]
      b = i%2==0 ? dx : dy
      if(i==1||i==2||i==4||i==7){
        vertexNode.push(a+b)
      }else{vertexNode.push(a-b)}
    }
    return vertexNode
}

function createSquare(start = {x:0,y:0},end = {x:0,y:0}){
    const vertexNode = [start.x,start.y]
    const jarakStartEnd = Math.max(Math.abs(end.x-start.x), Math.abs(end.y-start.y))
    let coor
    const addArr = [
        jarakStartEnd * (end.x<start.x ? -1 : 1),
        jarakStartEnd * (end.y<start.y ? -1 : 1)
    ]
    
    for(let i=0;i<6;i++){
        coor = start[i%2==0?"x":"y"]
        if(i==1||i==4){
            vertexNode.push(coor)
        }else{
            vertexNode.push(coor + addArr[i%2])
        }
    }
    return vertexNode
}

function createRectangle(start = {x:0,y:0},end = {x:0,y:0}){
    const vertexNode = [start.x,start.y]
    const jarak = [Math.abs(end.x-start.x),Math.abs(end.y-start.y)]
    let coor
    const addArr = [
        jarak[0] * (end.x<start.x ? -1 : 1),
        jarak[1] * (end.y<start.y ? -1 : 1)
    ]
    
    for(let i=0;i<6;i++){
        coor = start[i%2==0?"x":"y"]
        if(i==1||i==4){
            vertexNode.push(coor)
        }else{
            vertexNode.push(coor + addArr[i%2])
        }
    }
    return vertexNode
}

function createPolygon(start = {x:0,y:0},end = {x:0,y:0}){
    const vertek = []
    try{
        const d = Math.max(Math.abs(end.x-start.x), Math.abs(end.y-start.y))
        const n = parseInt(document.getElementById("poligonSide").value)
        let x = start.x + d * round(Math.sin(Math.PI/n))
        let y = start.y - d * round(Math.cos(Math.PI/n))
        vertek.push(x)
        vertek.push(y)
        
        let tx, ty
        for(let i=0;i<n-1;i++){
            tx = x - start.x
            ty = y - start.y
            x = (tx * round(Math.cos(2*Math.PI/n)) - ty * round(Math.sin(2*Math.PI/n))) + start.x
            y = (tx * round(Math.sin(2*Math.PI/n)) + ty * round(Math.cos(2*Math.PI/n))) + start.y
            vertek.push(x)
            vertek.push(y)
        }

    }catch(e){
        console.error(e)
    }

    return vertek

}

function clearCanvasCling(){
    masterRenderColor = []
    masterRenderPosition = []
    objectCount = 0
    startPointObject = [0]
    numberVertecObject = [0]
    objType = [""]
    selectedObjectId = 0
    shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    gl.clearColor(0,0,0,0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(shaderProgram)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    clearCanvas(gl, shaderProgram);
}