let objSide, startPoint, type
function objectEditorHandler(){
    document.getElementById("editsize").hidden = false
    document.getElementById("editcolor").hidden = false
    if(selectedObjectId <=0){
        document.getElementById("editsize").hidden = true
        document.getElementById("editcolor").hidden = true
        return
    }
    objSide = numberVertecObject[selectedObjectId]
    startPoint = startPointObject[selectedObjectId]
    type = objType[selectedObjectId]
    document.getElementById("editcolor").addEventListener('change', handleColorChange)


    //Setup for slider first
    const slider = document.getElementById("editsize")
    let lg
    if(type == "persegi"){
        lg = getRectLength()
        slider.value = lg*100
    }else if(type=="garis"){
        lg = getRectWidth()
        slider.value = lg*100
    }

    //Slider On change
    slider.addEventListener('change', (e)=>{
        if(type == "persegi"){
            resizeSquare(e.target.value)
        }else if(type=="garis"){
            resizeLine(e.target.value, lg*100)
        }
    })
}

function handleColorChange(e){
    const glConvention = (n) => (((n-255)/255)+1)
    const rgb = hexToRgb(e.target.value)
    const basecolornew = [glConvention(rgb.r), glConvention(rgb.g), glConvention(rgb.b), 1]
    let colornew = []
    for(let i=0; i<objSide; i++){
        colornew = colornew.concat(basecolornew)
    }

    let prec = 0
    for(let j=startPoint * 4; j<(startPoint*4)+(objSide*4); j++){
            masterRenderColor[j] = colornew[prec]
            prec++
    }
    
    renderCanvas({
        gl: gl,
        color: masterRenderColor,
        position: masterRenderPosition,
        nDrawableObj: objectCount,
        beginIdx: startPointObject,
        numIdx: numberVertecObject,
        program: shaderProgram
    })
}

function getObjectVector(){
    const v = []
    const vx = []
    const vy = []
    for(let j=startPoint * 2; j<(startPoint*2)+(objSide*2); j++){
        if(j%2==0){
            vx.push(masterRenderPosition[j])
        }else{
            vy.push(masterRenderPosition[j])
        } 
        v.push(masterRenderPosition[j])
    }
    return {
        v: v,
        vx: vx,
        vy: vy
    }
}

function getRectLength(){
    const vdata = getObjectVector()
    const length = Math.sqrt(
        ((vdata.vx[1] - vdata.vx[0])*(vdata.vx[1] - vdata.vx[0]))
        +
        ((vdata.vy[1] - vdata.vy[0])*(vdata.vy[1] - vdata.vy[0]))
        )
    return length
}

function getRectWidth(){
    const vdata = getObjectVector()
    const width = Math.sqrt(
        ((vdata.vx[2] - vdata.vx[1])*(vdata.vx[2] - vdata.vx[1]))
        +
        ((vdata.vy[2] - vdata.vy[1])*(vdata.vy[2] - vdata.vy[1]))
        )
    return width
}

function resizeSquare(val){
    const vdata = getObjectVector()
    const actVal = parseInt(val)/200
    const middlePoint = [
        (vdata.vx[0] + vdata.vx[2])/2,
        (vdata.vy[0] + vdata.vy[2])/2
    ]
    const newVector = [
        middlePoint[0] - actVal, middlePoint[1] + actVal,
        middlePoint[0] + actVal, middlePoint[1] + actVal,
        middlePoint[0] + actVal, middlePoint[1] - actVal,
        middlePoint[0] - actVal, middlePoint[1] - actVal,
    ]
    let prec=0
    for(let j=startPoint * 2; j<(startPoint*2)+(objSide*2); j++){
        masterRenderPosition[j] = newVector[prec]
        prec++
    }

    renderCanvas({
        gl: gl,
        color: masterRenderColor,
        position: masterRenderPosition,
        nDrawableObj: objectCount,
        beginIdx: startPointObject,
        numIdx: numberVertecObject,
        program: shaderProgram
    })
}

function resizeLine(val,val0){
    const vdata = getObjectVector()
    const actVal = parseInt(val)/200
    const middlePoint = [
        (vdata.vx[0] + vdata.vx[1])/2,
        (vdata.vy[0] + vdata.vy[1])/2
    ]
    const teta = Math.atan2(vdata.vy[0]-middlePoint[1], vdata.vx[0] - middlePoint[0])
    console.log(teta)
    let newVector
    const newStartPoint = {
        x: middlePoint[0] + (Math.sin(teta)*actVal),
        y: middlePoint[1] - (Math.cos(teta)*actVal)
    }
    const newEndPoint = {
        x: middlePoint[0] - (Math.sin(teta )*actVal),
        y: middlePoint[1] + (Math.cos(teta )*actVal)
    }
    newVector = createLine(newStartPoint, newEndPoint)
    console.log("newvector", newVector)
    let prec=0
    for(let j=startPoint * 2; j<(startPoint*2)+(objSide*2); j++){
        masterRenderPosition[j] = newVector[prec]
        prec++
    }

    renderCanvas({
        gl: gl,
        color: masterRenderColor,
        position: masterRenderPosition,
        nDrawableObj: objectCount,
        beginIdx: startPointObject,
        numIdx: numberVertecObject,
        program: shaderProgram
    })
}