importScripts('https://cdnjs.cloudflare.com/ajax/libs/mathjs/7.0.0/math.min.js');

math.config({
    number: 'BigNumber',
    precision: 64
})

let WIDTH, HEIGHT, REAL_SET, IMAGINARY_SET
const MAX_ITERATION = 1000
onmessage = function (e) {
    const { w, h, rs, is, i, j, isSettingUp, pxStart, pxEnd, pyStart, pyEnd, isResizing } = e.data
    if (isSettingUp) {
        WIDTH = w
        HEIGHT = h
        REAL_SET = { start: math.bignumber(rs.start), end: math.bignumber(rs.end) }
        IMAGINARY_SET = { start: math.bignumber(is.start), end: math.bignumber(is.end) }
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
    i = math.bignumber(i)
    j = math.bignumber(j)
    w = math.bignumber(WIDTH)
    h = math.bignumber(HEIGHT)

    rs = math.substract(REAL_SET.end, REAL_SET.start)
    rd = math.divide(i, w)
    rt = math.multiply(rs, rd)
    x = math.add(REAL_SET.start, rt)

    is = math.substract(IMAGINARY_SET.end, IMAGINARY_SET.start)
    id = math.divide(j, h)
    it = math.multiply(is, id)
    y = math.add(IMAGINARY_SET.start, it)

    return { x: math.number(x), y: math.number(y) }
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
    p = math.bignumber(pixel)
    l = math.bignumber(length)

    pl = math.divide(p, l)
    es = math.substract(set.end, set.start)

    t0 = math.add(pl, es)
    t = math.multiply(set.start, t0)

    return t
}