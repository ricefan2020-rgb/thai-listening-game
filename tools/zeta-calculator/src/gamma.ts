import { C } from './complex'

/** Lanczos approximation for the complex Gamma function. */
export function gamma(z: C): C {
  if (z.re <= 0 && Math.abs(z.im) < 1e-10 && Math.abs(z.re - Math.round(z.re)) < 1e-10) {
    return C.from(Number.NaN, Number.NaN)
  }

  const g = 7
  const p = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.984369578019571e-6,
    1.505632735149311e-7,
  ]

  if (z.re < 0.5) {
    return C.from(Math.PI, 0).div(C.sin(C.from(Math.PI, 0).mul(z)).mul(gamma(C.from(1, 0).sub(z))))
  }

  const zMinusOne = z.sub(C.from(1, 0))
  let x = C.from(p[0], 0)
  for (let i = 1; i < p.length; i += 1) {
    x = x.add(C.from(p[i], 0).div(zMinusOne.add(C.from(i, 0))))
  }

  const t = zMinusOne.add(C.from(g + 0.5, 0))
  const sqrtTwoPi = Math.sqrt(2 * Math.PI)
  return C.from(sqrtTwoPi, 0).mul(t.pow(zMinusOne.add(C.from(0.5, 0)))).mul(t.neg().exp()).mul(x)
}
