/**
 *  autor: foqc
 *  github: foqc
 */
// noprotect
var canvas = document.getElementById('myCanvas')
var ctx = canvas.getContext('2d')
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const MAX_ITERATION = 80
const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight

const REAL_SET = { start: -2, end: 1 }
const IMAGINARY_SET = { start: -1, end: 1 }

const colors = new Array(16).fill(0).map((_, i) => i === 0 ? '#000' : `#${((1 << 24) * Math.random() | 0).toString(16)}`)

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
