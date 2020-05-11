importScripts('node_modules/big.js/big.min.js');

let WIDTH, HEIGHT, REAL_SET, IMAGINARY_SET
const MAX_ITERATION = 1000
onmessage = function (e) {
    const { w, h, rs, is, i, j, isSettingUp, pxStart, pxEnd, pyStart, pyEnd, isResizing } = e.data
    if (isSettingUp) {
        WIDTH = w
        HEIGHT = h
        REAL_SET = { start: new Big(rs.start), end: new Big(rs.end) }
        IMAGINARY_SET = { start: new Big(is.start), end: new Big(is.end) }
    } else {
        if (isResizing) {
            REAL_SET.start = getRelativePoint(pxStart, WIDTH, REAL_SET)
            REAL_SET.end = getRelativePoint(pxEnd, WIDTH, REAL_SET)

            IMAGINARY_SET.start = getRelativePoint(pyStart, HEIGHT, IMAGINARY_SET)
            IMAGINARY_SET.end = getRelativePoint(pyEnd, HEIGHT, IMAGINARY_SET)

        } else
            postMessage({ mandelbrot: main(i, j), x: i, y: j })
    }
}
const main = (i, j) => mandelbrot(calc(i, j))

const calc = (i, j) => {
    i = new Big(i)
    j = new Big(j)
    w = new Big(WIDTH)
    h = new Big(HEIGHT)

    x = REAL_SET.start.plus(i.div(w).times(REAL_SET.end.minus(REAL_SET.start)))
    y = IMAGINARY_SET.start.plus(j.div(h).times(IMAGINARY_SET.end.minus(IMAGINARY_SET.start)))

    return { x: new Number(x), y: new Number(y) }
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

const getRelativePoint = (pixel, length, set) => {
    p = new Big(pixel)
    l = new Big(length)

    pl = p.div(l)
    es = set.end.minus(set.start)

    t0 = pl.times(es)
    t = set.start.plus(t0)

    return t
}