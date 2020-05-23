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
let worker
const REAL_SET = { start: -2, end: 1 }
const IMAGINARY_SET = { start: -1, end: 1 }
let RS = math.subtract(REAL_SET.end, REAL_SET.start)
const TASKS = []
math.config({
    number: 'BigNumber',
    precision: 64
})

let colors = new Array(16).fill(0).map((_, i) => i === 0 ? '#000' : `#${((1 << 24) * Math.random() | 0).toString(16)}`)

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
    for (let i = 0; i <= 15; i++) {
        color = parseInt(lagrange(points[0], points[1], i))
        colors.push(rgbToHex(color, color, color))
    }

    let a = "[[255,0,0],[255,15,0],[255,31,0],[255,46,0],[255,62,0],[255,77,0],[255,93,0],[255,108,0],[255,124,0],[255,139,0],[255,155,0],[255,170,0],[255,185,0],[255,201,0],[255,216,0],[255,232,0],[255,247,0],[247,255,0],[232,255,0],[216,255,0],[201,255,0],[185,255,0],[170,255,0],[155,255,0],[139,255,0],[124,255,0],[108,255,0],[93,255,0],[77,255,0],[62,255,0],[46,255,0],[31,255,0],[15,255,0],[0,255,0],[0,255,15],[0,255,31],[0,255,46],[0,255,62],[0,255,77],[0,255,93],[0,255,108],[0,255,124],[0,255,139],[0,255,155],[0,255,170],[0,255,185],[0,255,201],[0,255,216],[0,255,232],[0,255,247],[0,247,255],[0,232,255],[0,216,255],[0,201,255],[0,185,255],[0,170,255],[0,155,255],[0,139,255],[0,124,255],[0,108,255],[0,93,255],[0,77,255],[0,62,255],[0,46,255],[0,31,255],[0,15,255],[0,0,255],[15,0,255],[31,0,255],[46,0,255],[62,0,255],[77,0,255],[93,0,255],[108,0,255],[124,0,255],[139,0,255],[155,0,255],[170,0,255],[185,0,255],[201,0,255],[216,0,255],[232,0,255],[247,0,255],[255,0,247],[255,0,232],[255,0,216],[255,0,201],[255,0,185],[255,0,170],[255,0,155],[255,0,139],[255,0,124],[255,0,108],[255,0,93],[255,0,77],[255,0,62],[255,0,46],[255,0,31],[255,0,15],[255,0,0]]"
    a = JSON.parse(a).map((x, i) => i === 0 ? '#000' : rgbToHex(x[0], x[1], x[2]))
    return a
}

function start() {
    for (let row = 0; row < WIDTH; row++) {
        TASKS[row] = { row }
    }
    const task = TASKS.shift()
    worker.postMessage({ row: task.row })
}

function draw(res) {
    if (TASKS.length > 0) {
        const task = TASKS.shift()
        worker.postMessage({ row: task.row })
    }

    const { row, mandelbrotSets } = res.data;
    for (let i = 0; i < HEIGHT; i++) {
        const [m, isMandelbrotSet] = mandelbrotSets[i]
        ctx.fillStyle = colors[isMandelbrotSet ? 0 : (m % colors.length - 1) + 1]
        ctx.fillRect(row, i, 1, 1)
    }
}

function init() {
    if (worker) worker.terminate()
    worker = new Worker('worker.js')
    worker.postMessage({ w: WIDTH, h: HEIGHT, rs: REAL_SET, is: IMAGINARY_SET, isSettingUp: true })
    start()
    colors = myColors()
    worker.onmessage = draw
}

init()

const ALFA = 80
const BETA = 60

canvas.addEventListener('dblclick', e => {
    worker.terminate()
    const pxStart = e.x - ALFA
    const pxEnd = e.x + ALFA

    const pyStart = e.y - BETA
    const pyEnd = e.y + BETA

    res = getRelativePoint(pxStart, WIDTH, REAL_SET)
    ree = getRelativePoint(pxEnd, WIDTH, REAL_SET)

    ims = getRelativePoint(pyStart, HEIGHT, IMAGINARY_SET)
    ime = getRelativePoint(pyEnd, HEIGHT, IMAGINARY_SET)
    
    REAL_SET.start = res
    REAL_SET.end = ree
    IMAGINARY_SET.start = ims
    IMAGINARY_SET.end = ime
    console.log('R -> ', REAL_SET.start, '  ', REAL_SET.end, ' I -> ', IMAGINARY_SET.start, '  ', IMAGINARY_SET.end)

    init()
})

const getRelativePoint = (pixel, l, set) => {
    p = math.bignumber(pixel)
    l = math.bignumber(l)

    pl = math.divide(p, l)
    es = math.subtract(math.bignumber(set.end), math.bignumber(set.start))

    t0 = math.multiply(pl, es)
    t = math.add(math.bignumber(set.start), t0)

    return Number(t) //((p/l) * (set.end - set.start)) + set.start
}