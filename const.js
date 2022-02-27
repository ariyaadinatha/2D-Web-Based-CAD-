let selectedColor = {r:hexToRgb(colorPicker()).r, g:hexToRgb(colorPicker()).g, b:hexToRgb(colorPicker()).b}
let onDrawClick = false;
let masterRenderPosition = []
let masterRenderColor = []
let shaderProgram = null
let initX;
let initY;
const canvas = document.querySelector('#canvas');
const gl = canvas.getContext('webgl');
var ph
const menubox = document.getElementById("menuopt")
document.getElementById("selectmode").checked=true;
let selectedMenu = "select"
var shapeFunc = ()=>{};
let tempPosition, tempColor
let objectCount = 0
let startPointObject = [0]
let numberVertecObject = [0]
let objType = [""]
let selectedObjectId = 0
const objEditForm = document.getElementById("objedit-form")
let onVertecClick = false
let selectedVertexIndex = 0
//objEditForm.hidden = true