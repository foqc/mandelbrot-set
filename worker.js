importScripts('https://cdnjs.cloudflare.com/ajax/libs/mathjs/7.0.0/math.min.js');

math.config({ number: 'BigNumber', precision: 64 })

let WIDTH, HEIGHT, REAL_SET, IMAGINARY_SET, END_START_RL, END_START_IM
const MAX_ITERATION = 1000

onmessage = (e) => {
    const { isSettingUp } = e.data
    if (isSettingUp) {
        const { w, h, realSet, imaginarySet } = e.data

        REAL_SET = { start: math.bignumber(realSet.start), end: math.bignumber(realSet.end) }
        IMAGINARY_SET = { start: math.bignumber(imaginarySet.start), end: math.bignumber(imaginarySet.end) }

        END_START_RL = math.subtract(REAL_SET.end, REAL_SET.start)
        END_START_IM = math.subtract(IMAGINARY_SET.end, IMAGINARY_SET.start)

        WIDTH = math.bignumber(w)
        HEIGHT = math.bignumber(h)
    } else {
        const { row } = e.data
        const mandelbrotSets = []
        for (let col = 0; col < HEIGHT; col++)
            mandelbrotSets[col] = calculate(row, col)

        postMessage({ row, mandelbrotSets })
    }
}
const calculate = (i, j) => mandelbrot(calc(i, j))

const calc = (x, y) => {
    x = math.bignumber(x)
    y = math.bignumber(y)

    x = math.add(REAL_SET.start, math.multiply(END_START_RL, math.divide(x, WIDTH)))
    y = math.add(IMAGINARY_SET.start, math.multiply(END_START_IM, math.divide(y, HEIGHT)))

    return { x: Number(x), y: Number(y) }
}

const mandelbrot = (c) => {
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