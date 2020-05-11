/**
 *  autor: foqc
 *  github: foqc
 */
// noprotect
const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')

const WIDTH = 800
const HEIGHT = 600
ctx.canvas.width = WIDTH
ctx.canvas.height = HEIGHT

const REAL_SET = { start: -2, end: 1 }
const IMAGINARY_SET = { start: -1, end: 1 }

const colors = new Array(16).fill(0).map((_, i) => i === 0 ? '#000' : `#${((1 << 24) * Math.random() | 0).toString(16)}`)

const valToHex = (rgb) => {
    let hex = Number(rgb).toString(16)
    if (hex.length < 2) hex = '0' + hex
    return hex
}

const rgbToHex = (r, g, b) => `#${valToHex(r)}${valToHex(g)}${valToHex(b)}`

const lagrange = ([X1, Y1], [X2, Y2], i) => {
    return (((Y1 * (i - X2)) / (X1 - X2)) + ((Y2 * (i - X1)) / (X2 - X1)))
}

const myColors = () => {
    let colors = ['#000']
    const points = [[0, 0], [15, 255]]
    let color
    for (let i = 0 i <= 15 i++) {
        color = parseInt(lagrange(points[0], points[1], i))
        colors.push(rgbToHex(color, color, color))
    }

    let a = "[[255,0,0],[255,15,0],[255,31,0],[255,46,0],[255,62,0],[255,77,0],[255,93,0],[255,108,0],[255,124,0],[255,139,0],[255,155,0],[255,170,0],[255,185,0],[255,201,0],[255,216,0],[255,232,0],[255,247,0],[247,255,0],[232,255,0],[216,255,0],[201,255,0],[185,255,0],[170,255,0],[155,255,0],[139,255,0],[124,255,0],[108,255,0],[93,255,0],[77,255,0],[62,255,0],[46,255,0],[31,255,0],[15,255,0],[0,255,0],[0,255,15],[0,255,31],[0,255,46],[0,255,62],[0,255,77],[0,255,93],[0,255,108],[0,255,124],[0,255,139],[0,255,155],[0,255,170],[0,255,185],[0,255,201],[0,255,216],[0,255,232],[0,255,247],[0,247,255],[0,232,255],[0,216,255],[0,201,255],[0,185,255],[0,170,255],[0,155,255],[0,139,255],[0,124,255],[0,108,255],[0,93,255],[0,77,255],[0,62,255],[0,46,255],[0,31,255],[0,15,255],[0,0,255],[15,0,255],[31,0,255],[46,0,255],[62,0,255],[77,0,255],[93,0,255],[108,0,255],[124,0,255],[139,0,255],[155,0,255],[170,0,255],[185,0,255],[201,0,255],[216,0,255],[232,0,255],[247,0,255],[255,0,247],[255,0,232],[255,0,216],[255,0,201],[255,0,185],[255,0,170],[255,0,155],[255,0,139],[255,0,124],[255,0,108],[255,0,93],[255,0,77],[255,0,62],[255,0,46],[255,0,31],[255,0,15],[255,0,0]]"
    a = JSON.parse(a).map((x, i) => i === 0 ? '#000' : rgbToHex(x[0], x[1], x[2]))
    return a
}

const WORKERS = 1
const myWorkers = new Array(WORKERS).fill(0).map(_ => new Worker('worker.js'))
myWorkers.forEach(x => x.postMessage({ w: WIDTH, h: HEIGHT, rs: REAL_SET, is: IMAGINARY_SET, isSettingUp: true }))

function draw() {
    const p = parseInt(HEIGHT / WORKERS)
    let k = 0, l = 0
    const colors = myColors()
    for (let i = 0 i < WIDTH i++) {
        k = 0
        for (let j = 0 j < HEIGHT j++, l++) {
            myWorkers[k].postMessage({ i, j })
            myWorkers[k].onmessage = e => {
                const { mandelbrot, x, y } = e.data
                const [m, isMandelbrotSet] = mandelbrot
                ctx.fillStyle = colors[isMandelbrotSet ? 0 : (m % colors.length - 1) + 1]
                ctx.fillRect(x, y, 1, 1)
            }
            if (l === p) {
                k = k < WORKERS - 1 ? k + 1 : 0
                l = 0
            }
        }
    }
}

draw()

const ALFA = 100

canvas.addEventListener('dblclick', e => {
    const pxStart = e.x - ALFA
    const pxEnd = e.x + ALFA

    const pyStart = e.y - ALFA
    const pyEnd = e.y + ALFA

    myWorkers.map(x => x.postMessage({ pxStart, pxEnd, pyStart, pyEnd, isResizing: true }))
    console.log('R -> ', REAL_SET.start, '  ', REAL_SET.end, ' I -> ', IMAGINARY_SET.start, '  ', IMAGINARY_SET.end)


    draw()
})

const terminate = () => {
    myWorkers.map(x => x.terminate())
}

function createMouse(element) {
    var mouse = {
        x: 0,
        y: 0,
        button1: false,
        button2: false,
        button3: false,
        over: false,
    }
    function mouseEvent(event) {
        var bounds = element.getBoundingClientRect()

        // NOTE getting the border should not be done like this as
        // it will not work in all cases. 
        var border = Number(element.style.border.split("px")[0])

        mouse.x = event.pageX - bounds.left - scrollX - border
        mouse.y = event.pageY - bounds.top - scrollY - border
        if (event.type === "mousedown") {
            mouse["button" + event.which] = true
        } else if (event.type === "mouseup") {
            mouse["button" + event.which] = false
        } else if (event.type === "mouseover") {
            mouse.over = true
        } else if (event.type === "mouseout") {
            mouse.over = false
            mouse.button1 = false  // turn of buttons to prevent them locking
            mouse.button2 = false
            mouse.button3 = false
        }
        event.preventDefault() // stops default mouse behaviour.
    }
    var events = "mousemove,mousedown,mouseup,mouseout,mouseover".split(',')
    events.forEach(eventType => element.addEventListener(eventType, mouseEvent))
    mouse.remove = function () {
        events.forEach(eventType => element.removeEventListener(eventType, mouseEvent))
    }
    return mouse
}
var drag = {
    x: 0,
    y: 0,
    x1: 0,
    y1: 0,
    dragging: false,
    top: 0,
    left: 0,
    width: 0,
    height: 0,
}
var mouse = createMouse(canvas)
function update() {
    // ctx.clearRect(drag.left,  drag.top, drag.width, drag.height)
    if (mouse.button1) {  // is button down
        if (!drag.dragging) { // is dragging
            drag.x = mouse.x
            drag.y = mouse.y
            drag.dragging = true
        }
        drag.x1 = mouse.x
        drag.y1 = mouse.y
        drag.top = Math.min(drag.y, drag.y1)
        drag.left = Math.min(drag.x, drag.x1)
        drag.width = Math.abs(drag.x - drag.x1)
        drag.height = Math.abs(drag.y - drag.y1)
    } else {
        if (drag.dragging) {
            console.log('is up ', drag)
            myWorkers.map(x => x.postMessage({ pxStart: drag.left, pxEnd: drag.width, pyStart: drag.top, pyEnd: drag.height, isResizing: true }))
            draw()
            drag.dragging = false
        }
    }

    if (drag.dragging) {
        ctx.strokeRect(drag.left, drag.top, drag.width, drag.height)
    }
    requestAnimationFrame(update)
}
requestAnimationFrame(update)


// const letters = [['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']]
// const width = 3;
// const maxIndex = letters.length * width

// for(let i = 0; i < maxIndex; i++) {
//     let row = parseInt(i / width); // determines row
//     let column = i % width; // determines column

//     console.log("Value["+letters[row][column]+"] Row["+row+"] Column["+column+"]");
// }