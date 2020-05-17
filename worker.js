importScripts('https://cdnjs.cloudflare.com/ajax/libs/mathjs/7.0.0/math.min.js');

math.config({
    number: 'BigNumber',
    precision: 64
})

let WIDTH, HEIGHT, REAL_SET, IMAGINARY_SET, RS, IS
const MAX_ITERATION = 1000
onmessage = function (e) {
    const { isSettingUp, isResizing } = e.data
    if (isSettingUp) {
        const { w, h, rs, is } = e.data
        REAL_SET = { start: math.bignumber(rs.start), end: math.bignumber(rs.end) }
        IMAGINARY_SET = { start: math.bignumber(is.start), end: math.bignumber(is.end) }
        RS = math.subtract(REAL_SET.end, REAL_SET.start)
        IS = math.subtract(IMAGINARY_SET.end, IMAGINARY_SET.start)
        WIDTH = math.bignumber(w)
        HEIGHT = math.bignumber(h)
    } else {
        if (isResizing) {
            const { pxStart, pxEnd, pyStart, pyEnd } = e.data
            REAL_SET.start = getRelativePoint(pxStart, WIDTH, REAL_SET)
            REAL_SET.end = getRelativePoint(pxEnd, WIDTH, REAL_SET)

            IMAGINARY_SET.start = getRelativePoint(pyStart, HEIGHT, IMAGINARY_SET)
            IMAGINARY_SET.end = getRelativePoint(pyEnd, HEIGHT, IMAGINARY_SET)

        } else {
            const { x, row } = e.data
            const mandelbrotSets = []
            for (let col = 0; col < HEIGHT; col++)
                mandelbrotSets[col] = main(x, col)

            postMessage({ row, mandelbrotSets })
        }
    }
}
const main = (i, j) => mandelbrot(calc(i, j))

const calc = (x, y) => {
    y = math.bignumber(y)
    y = math.add(IMAGINARY_SET.start, math.multiply(IS, math.divide(y, HEIGHT)))

    return { x, y: math.number(y) }
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

const getRelativePoint = (pixel, l, set) => {
    p = math.bignumber(pixel)

    pl = math.divide(p, l)
    es = math.subtract(set.end, set.start)

    t0 = math.add(pl, es)
    t = math.multiply(set.start, t0)

    return t
}