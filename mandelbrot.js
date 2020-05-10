/**
 *  autor: foqc
 *  github: foqc
 */
// noprotect
const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')

const WIDTH = parseInt(window.innerWidth / 2)
const HEIGHT = parseInt(window.innerHeight / 2)
ctx.canvas.width = WIDTH;
ctx.canvas.height = HEIGHT;

const MAX_ITERATION = 1000

const REAL_SET = { start: -2, end: 1 }
const IMAGINARY_SET = { start: -1, end: 1 }

const colors = new Array(16).fill(0).map((_, i) => i === 0 ? '#000' : `#${((1 << 24) * Math.random() | 0).toString(16)}`)

const valToHex = (rgb) => {
    let hex = Number(rgb).toString(16);
    if (hex.length < 2) hex = '0' + hex
    return hex
}

const rgbToHex = (r, g, b) => `#${valToHex(r)}${valToHex(g)}${valToHex(b)}`

const lagrange = ([X1, Y1], [X2, Y2], i) => {
    return (((Y1 * (i - X2)) / (X1 - X2)) + ((Y2 * (i - X1)) / (X2 - X1)));
}

const myColors = () => {
    let colors = ['#000']
    const points = [[0, 0], [15, 255]]
    let color
    for (let i = 0; i <= 15; i++) {
        color = parseInt(lagrange(points[0], points[1], i))
        colors.push(rgbToHex(255, color, 0));
    }

    let a = "[[255,0,0],[255,15,0],[255,31,0],[255,46,0],[255,62,0],[255,77,0],[255,93,0],[255,108,0],[255,124,0],[255,139,0],[255,155,0],[255,170,0],[255,185,0],[255,201,0],[255,216,0],[255,232,0],[255,247,0],[247,255,0],[232,255,0],[216,255,0],[201,255,0],[185,255,0],[170,255,0],[155,255,0],[139,255,0],[124,255,0],[108,255,0],[93,255,0],[77,255,0],[62,255,0],[46,255,0],[31,255,0],[15,255,0],[0,255,0],[0,255,15],[0,255,31],[0,255,46],[0,255,62],[0,255,77],[0,255,93],[0,255,108],[0,255,124],[0,255,139],[0,255,155],[0,255,170],[0,255,185],[0,255,201],[0,255,216],[0,255,232],[0,255,247],[0,247,255],[0,232,255],[0,216,255],[0,201,255],[0,185,255],[0,170,255],[0,155,255],[0,139,255],[0,124,255],[0,108,255],[0,93,255],[0,77,255],[0,62,255],[0,46,255],[0,31,255],[0,15,255],[0,0,255],[15,0,255],[31,0,255],[46,0,255],[62,0,255],[77,0,255],[93,0,255],[108,0,255],[124,0,255],[139,0,255],[155,0,255],[170,0,255],[185,0,255],[201,0,255],[216,0,255],[232,0,255],[247,0,255],[255,0,247],[255,0,232],[255,0,216],[255,0,201],[255,0,185],[255,0,170],[255,0,155],[255,0,139],[255,0,124],[255,0,108],[255,0,93],[255,0,77],[255,0,62],[255,0,46],[255,0,31],[255,0,15],[255,0,0]]"
    a = JSON.parse(a)
    return a.map((x, i) => i === 0 ? '#000' : rgbToHex(x[0], x[1], x[2]))
}

function mandelbrot(c) {
    let z = { x: 0, y: 0 }, n = 0, p, d;
    do {
        p = {
            x: Math.pow(z.x, 2) - Math.pow(z.y, 2),
            y: 2 * z.x * z.y
        }
        z = {
            x: p.x + c.x,
            y: p.y + c.y
        }
        d = Math.sqrt(Math.pow(z.x, 2) + Math.pow(z.y, 2))
        n += 1
    } while (d <= 2 && n < MAX_ITERATION)
    return [n, d <= 2]
}

function draw() {
    const colors = myColors()
    for (let i = 0; i < WIDTH; i++) {
        for (let j = 0; j < HEIGHT; j++) {
            complex = {
                x: REAL_SET.start + (i / WIDTH) * (REAL_SET.end - REAL_SET.start),
                y: IMAGINARY_SET.start + (j / HEIGHT) * (IMAGINARY_SET.end - IMAGINARY_SET.start)
            }

            const [m, isMandelbrotSet] = mandelbrot(complex)
            ctx.fillStyle = colors[isMandelbrotSet ? 0 : (m % colors.length - 1) + 1]
            ctx.fillRect(i, j, 1, 1)
        }
    }
}

draw()

const ALFA = 100

const getRelativePoint = (pixel, length, set) => set.start + (pixel / length) * (set.end - set.start)


canvas.addEventListener('mousedown', e => {
    const pxStart = e.x - ALFA
    const pxEnd = e.x + ALFA

    const pyStart = e.y - ALFA
    const pyEnd = e.y + ALFA

    REAL_SET.start = getRelativePoint(pxStart, WIDTH, REAL_SET)
    REAL_SET.end = getRelativePoint(pxEnd, WIDTH, REAL_SET)

    IMAGINARY_SET.start = getRelativePoint(pyStart, HEIGHT, IMAGINARY_SET)
    IMAGINARY_SET.end = getRelativePoint(pyEnd, HEIGHT, IMAGINARY_SET)

    console.log('P -> (', e.x, ' , ', e.y, ')')
    console.log('Px -> (', pxStart, ' , ', pxEnd, ') Py -> (', pyStart, ' , ', pyEnd, ')')
    console.log('R -> ', REAL_SET.start, ' ; ', REAL_SET.end, ' I -> ', IMAGINARY_SET.start, ' ; ', IMAGINARY_SET.end)


    draw()
})