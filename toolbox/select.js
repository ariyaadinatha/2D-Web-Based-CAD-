function selectTools(e){
    var pos = getMouseCoordinate(canvas, e);
    const x = pos.x / gl.canvas.width  *  2 - 1;
    const y = pos.y / gl.canvas.height * -2 + 1;
    let prec = 0
    for(let i=1; i<=objectCount; i++){
        const xv = []
        const yv = []
        const v = []
        for(let j=startPointObject[i]*2;j<(startPointObject[i]*2)+(numberVertecObject[i]*2); j++){
            if(j%2==0){xv.push(masterRenderPosition[j])}
            else{yv.push(masterRenderPosition[j])}
            v.push(masterRenderPosition[j])
        }
        console.log("xv: ", xv)
        console.log("yv: ", yv)
        console.log("v: ", v)
        if(objType[i]==="poligon"){
            const lp = luasPoligon(numberVertecObject[i], v)
            const cply = checkPointPolygon(x,y,xv, yv)
            console.log("luas poligon ", lp, cply)
            if(isAreaEqual(lp, cply)){
                return i
            }
        }else{
            const luas = luasPPanjang(
                {x:xv[0],y:yv[0]}, {x:xv[1],y:yv[1]}, {x:xv[2],y:yv[2]}, {x:xv[3],y:yv[3]}
            )
            const ldot = checkPointNoPolygon(x,y,{x:xv[0],y:yv[0]}, {x:xv[1],y:yv[1]}, {x:xv[2],y:yv[2]}, {x:xv[3],y:yv[3]})
            console.log("lwass ", luas, ldot)
            if(isAreaEqual(luas, ldot)){
                return i
            }
        }
    }
    return 0
}

function luasPPanjang(p1={x:0,y:0}, p2={x:0,y:0}, p3={x:0,y:0}, p4={x:0,y:0}){
    const a = luasSegitgaSembarang(p1,p2,p3)
    const b = luasSegitgaSembarang(p4,p3,p2)
    return a+b
}

function isAreaEqual(a1, a2){
    const err = 100 - ((a1>a2? a2/a1:a1/a2)*100)
    console.log("mbekk ",err)
    return err < 1.5
}

function checkPointNoPolygon(x,y,p1={x:0,y:0}, p2={x:0,y:0}, p3={x:0,y:0}, p4={x:0,y:0}){
    const a = luasSegitgaSembarang({x:x,y:y},{x:p1.x,y:p1.y},{x:p2.x,y:p2.y})
    const b = luasSegitgaSembarang({x:p1.x,y:p1.y},{x:x,y:y},{x:p4.x,y:p4.y})
    const c = luasSegitgaSembarang({x:p3.x,y:p3.y},{x:p4.x,y:p4.y}, {x:x,y:y})
    const d = luasSegitgaSembarang({x:x,y:y},{x:p2.x,y:p2.y},{x:p3.x,y:p3.y})
    console.log("partial segpoint ", a, b, c, d)
    return a+b+c+d
}

function checkPointPolygon(x,y, vx = [], vy = []){
    let luass = 0
    if(vx.length != vy.length){
        return -1
    }
    for(let i=0; i<vx.length-1; i++){
        luass += luasSegitgaSembarang({x:x,y:y},{x:vx[i],y:vy[i]},{x:vx[i+1],y:vy[i+1]})
    }
    luass += luasSegitgaSembarang({x:x,y:y},{x:vx[0],y:vy[0]},{x:vx[vx.length-1],y:vy[vy.length-1]})

    return luass
}

function luasSegitgaSembarang(p1={x:0,y:0}, p2={x:0,y:0}, p3={x:0,y:0}){
    const a = Math.sqrt(((p2.y - p1.y)*(p2.y - p1.y))+((p2.x - p1.x)*(p2.x - p1.x)))
    const b = Math.sqrt(((p3.y - p2.y)*(p3.y - p2.y))+((p3.x - p2.x)*(p3.x - p2.x)))
    const c = Math.sqrt(((p3.y - p1.y)*(p3.y - p1.y))+((p3.x - p1.x)*(p3.x - p1.x)))
    const s = (a+b+c)/2
    return Math.sqrt(s*(s-a)*(s-b)*(s-c))
}

function luasPoligon(n=0,vertexs=[]){
    const vx = []
    const vy = []
    vertexs.forEach((v,i)=>{
        if(i%2==0){
            vx.push(v)
        }else{
            vy.push(v)
        }
    })
    let totalArea = 0
    for(let i=1; i<vx.length-1; i++){
        totalArea = totalArea + luasSegitgaSembarang(
            {x: vx[0], y:vy[0]},
            {x: vx[i], y:vy[i]},
            {x: vx[i+1], y:vy[i+1]}
        )
    }
    return totalArea
}