importScripts('https://cdnjs.cloudflare.com/ajax/libs/mathjs/7.0.0/math.min.js');

math.config({ number: 'BigNumber', precision: 64 })

let WIDTH, HEIGHT, REAL_SET, IMAGINARY_SET, RS, IS
const MAX_ITERATION = 1000
onmessage = function (e) {
    const { isSettingUp } = e.data
    if (isSettingUp) {
        const { w, h, rs, is } = e.data
        REAL_SET = { start: math.bignumber(rs.start), end: math.bignumber(rs.end) }
        IMAGINARY_SET = { start: math.bignumber(is.start), end: math.bignumber(is.end) }
        RS = math.subtract(REAL_SET.end, REAL_SET.start)
        IS = math.subtract(IMAGINARY_SET.end, IMAGINARY_SET.start)
        WIDTH = math.bignumber(w)
        HEIGHT = math.bignumber(h)
    } else {
        const { row } = e.data
        const mandelbrotSets = []
        for (let col = 0; col < HEIGHT; col++)
            mandelbrotSets[col] = main(row, col)

        postMessage({ row, mandelbrotSets })
    }
}
const main = (i, j) => mandelbrot(calc(i, j))

const calc = (x, y) => {
    x = math.bignumber(x)
    y = math.bignumber(y)

    x = math.add(REAL_SET.start, math.multiply(RS, math.divide(x, WIDTH)))
    y = math.add(IMAGINARY_SET.start, math.multiply(IS, math.divide(y, HEIGHT)))

    return { x: Number(x), y: Number(y) }
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
        d = 0.5 * (Math.pow(z.x, 2) + Math.pow(z.y, 2))
        n += 1
    } while (d <= 2 && n < MAX_ITERATION)
    return [n, d <= 2]
}