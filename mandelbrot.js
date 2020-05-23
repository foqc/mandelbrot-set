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

let colors = new Array(250).fill(0).map((_, i) => i === 0 ? '#000' : `#${((1 << 24) * Math.random() | 0).toString(16)}`)

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
    const points = [[0, 0], [250, 255]]
    let color
    for (let i = 0; i <= 250; i++) {
        color = parseInt(lagrange(points[0], points[1], i))
        colors.push(rgbToHex(color, color, color))
    }

    let a = [[255,0,0],[255,6,0],[255,12,0],[255,18,0],[255,25,0],[255,31,0],[255,37,0],[255,43,0],[255,49,0],[255,55,0],[255,61,0],[255,68,0],[255,74,0],[255,80,0],[255,86,0],[255,92,0],[255,98,0],[255,104,0],[255,111,0],[255,117,0],[255,123,0],[255,129,0],[255,135,0],[255,141,0],[255,147,0],[255,154,0],[255,160,0],[255,166,0],[255,172,0],[255,178,0],[255,184,0],[255,190,0],[255,197,0],[255,203,0],[255,209,0],[255,215,0],[255,221,0],[255,227,0],[255,233,0],[255,240,0],[255,246,0],[255,252,0],[252,255,0],[246,255,0],[240,255,0],[233,255,0],[227,255,0],[221,255,0],[215,255,0],[209,255,0],[203,255,0],[197,255,0],[190,255,0],[184,255,0],[178,255,0],[172,255,0],[166,255,0],[160,255,0],[154,255,0],[147,255,0],[141,255,0],[135,255,0],[129,255,0],[123,255,0],[117,255,0],[111,255,0],[104,255,0],[98,255,0],[92,255,0],[86,255,0],[80,255,0],[74,255,0],[68,255,0],[61,255,0],[55,255,0],[49,255,0],[43,255,0],[37,255,0],[31,255,0],[25,255,0],[18,255,0],[12,255,0],[6,255,0],[0,255,0],[0,255,6],[0,255,12],[0,255,18],[0,255,25],[0,255,31],[0,255,37],[0,255,43],[0,255,49],[0,255,55],[0,255,61],[0,255,68],[0,255,74],[0,255,80],[0,255,86],[0,255,92],[0,255,98],[0,255,104],[0,255,111],[0,255,117],[0,255,123],[0,255,129],[0,255,135],[0,255,141],[0,255,147],[0,255,154],[0,255,160],[0,255,166],[0,255,172],[0,255,178],[0,255,184],[0,255,190],[0,255,197],[0,255,203],[0,255,209],[0,255,215],[0,255,221],[0,255,227],[0,255,233],[0,255,240],[0,255,246],[0,255,252],[0,252,255],[0,246,255],[0,240,255],[0,233,255],[0,227,255],[0,221,255],[0,215,255],[0,209,255],[0,203,255],[0,197,255],[0,190,255],[0,184,255],[0,178,255],[0,172,255],[0,166,255],[0,160,255],[0,154,255],[0,147,255],[0,141,255],[0,135,255],[0,129,255],[0,123,255],[0,117,255],[0,111,255],[0,104,255],[0,98,255],[0,92,255],[0,86,255],[0,80,255],[0,74,255],[0,68,255],[0,61,255],[0,55,255],[0,49,255],[0,43,255],[0,37,255],[0,31,255],[0,25,255],[0,18,255],[0,12,255],[0,6,255],[0,0,255],[6,0,255],[12,0,255],[18,0,255],[25,0,255],[31,0,255],[37,0,255],[43,0,255],[49,0,255],[55,0,255],[61,0,255],[68,0,255],[74,0,255],[80,0,255],[86,0,255],[92,0,255],[98,0,255],[104,0,255],[111,0,255],[117,0,255],[123,0,255],[129,0,255],[135,0,255],[141,0,255],[147,0,255],[154,0,255],[160,0,255],[166,0,255],[172,0,255],[178,0,255],[184,0,255],[190,0,255],[197,0,255],[203,0,255],[209,0,255],[215,0,255],[221,0,255],[227,0,255],[233,0,255],[240,0,255],[246,0,255],[252,0,255],[255,0,252],[255,0,246],[255,0,240],[255,0,233],[255,0,227],[255,0,221],[255,0,215],[255,0,209],[255,0,203],[255,0,197],[255,0,190],[255,0,184],[255,0,178],[255,0,172],[255,0,166],[255,0,160],[255,0,154],[255,0,147],[255,0,141],[255,0,135],[255,0,129],[255,0,123],[255,0,117],[255,0,111],[255,0,104],[255,0,98],[255,0,92],[255,0,86],[255,0,80],[255,0,74],[255,0,68],[255,0,61],[255,0,55],[255,0,49],[255,0,43],[255,0,37],[255,0,31],[255,0,25],[255,0,18],[255,0,12],[255,0,6],[255,0,0]]
    // a = a.map((x, i) => i === 0 ? '#000' : rgbToHex(x[0], x[1], x[2]))
    return colors
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