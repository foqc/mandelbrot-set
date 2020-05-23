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
let REAL_SET = { start: -2, end: 1 }
let IMAGINARY_SET = { start: -1, end: 1 }
const TASKS = []
const ZOOM_FACTOR = 0.1

math.config({ number: 'BigNumber', precision: 64 })

const lagrange = ([X1, Y1], [X2, Y2], x) => (((Y1 * (x - X2)) / (X1 - X2)) + ((Y2 * (x - X1)) / (X2 - X1)))

const myColors = () => {
    // rgb(255, 0, 0)
    //rgb(255, 255, 0)
    // rgb(0, 255, 0)
    // rgb(0,255,255)
    // rgb(0, 0, 255)
    // rgb(255, 0, 255)
    const colors = []
    let r = 0, g = 0, b = 0
    for (let k = 0; k < 250; k++) {
        if (k <= 42) {//red to yellow => rgb(255, 0, 0) rgb(255, 255, 0) 
            r = 255
            g = parseInt(lagrange([1, 0], [42, 255], k))
            b = 0
        }
        else if (k <= 84) {//yellow to green => rgb(255, 255, 0) rgb(0, 255, 0)
            r = parseInt(lagrange([43, 255], [84, 0], k))
            g = 255
            b = 0
        } else if (k <= 126) {//green to blue => rgb(0, 255, 0) rgb(0,255,255)
            r = 0
            g = 255
            b = parseInt(lagrange([85, 0], [126, 255], k))
        } else if (k <= 168) {//green to blue => rgb(0,255,255) rgb(0, 0, 255)
            r = 0
            g = parseInt(lagrange([127, 255], [168, 0], k))
            b = 255
        } else if (k <= 210) {//blue to red => rgb(0, 0, 255) rgb(255, 0, 255)
            r = parseInt(lagrange([169, 0], [210, 255], k))
            g = 0
            b = 255
        } else if (k < 250) {//blue to red => rgb(255, 0, 255) rgb(255, 0, 0)
            r = 255
            g = 0
            b = parseInt(lagrange([211, 255], [249, 0], k))
        }
        colors.push([r, g, b])
    }
    return colors
}

function start() {
    for (let row = 0; row < WIDTH; row++) TASKS[row] = row
    worker.postMessage({ row: TASKS.shift() })
}

function draw(res) {
    if (TASKS.length > 0)
        worker.postMessage({ row: TASKS.shift() })

    const { row, mandelbrotSets } = res.data
    for (let i = 0; i < HEIGHT; i++) {
        const [m, isMandelbrotSet] = mandelbrotSets[i]
        c = isMandelbrotSet ? [0, 0, 0] : colors[m % (colors.length - 1)]
        ctx.fillStyle = `rgb(${c[0]}, ${c[1]}, ${c[2]})`
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
// const range = parseInt(250 / 6)

canvas.addEventListener('dblclick', e => {
    const zfw = (WIDTH * ZOOM_FACTOR)
    const zfh = (HEIGHT * ZOOM_FACTOR)

    REAL_SET = {
        start: getRelativePoint(e.x - zfw, WIDTH, REAL_SET),
        end: getRelativePoint(e.x + zfw, WIDTH, REAL_SET)
    }
    IMAGINARY_SET = {
        start: getRelativePoint(e.y - zfh, HEIGHT, IMAGINARY_SET),
        end: getRelativePoint(e.y + zfh, HEIGHT, IMAGINARY_SET)
    }

    init()
})

const getRelativePoint = (pixel, l, set) => {
    p = math.bignumber(pixel)
    l = math.bignumber(l)

    pl = math.divide(p, l)
    es = math.subtract(math.bignumber(set.end), math.bignumber(set.start))

    t0 = math.multiply(pl, es)
    t = math.add(math.bignumber(set.start), t0)

    return Number(t)
}