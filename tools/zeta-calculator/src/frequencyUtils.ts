import { C } from './complex'

/** 单项 n^{−s} 对 Im(s) 的角频率：φ = −Im(s) log n ⇒ ω_n = |Im(s)| log n。 */
export function termAngularFrequency(n: number, s: C): number {
  return Math.abs(s.im) * Math.log(n)
}

/** 单项 n^{−s}（含 η 符号）的辐角。 */
export function etaTermPhase(s: C, n: number): number {
  const sign = n % 2 === 0 ? -1 : 1
  return C.pow(n, s.neg())
    .mul(C.from(sign, 0))
    .arg()
}

export function unitPhasor(phi: number): C {
  return C.from(Math.cos(phi), Math.sin(phi))
}

export function primeFactors(n: number): Array<{ prime: number; exponent: number }> {
  if (n < 2) {
    return []
  }
  const factors: Array<{ prime: number; exponent: number }> = []
  let value = n
  for (let prime = 2; prime * prime <= value; prime += 1) {
    if (value % prime !== 0) {
      continue
    }
    let exponent = 0
    while (value % prime === 0) {
      value /= prime
      exponent += 1
    }
    factors.push({ prime, exponent })
  }
  if (value > 1) {
    factors.push({ prime: value, exponent: 1 })
  }
  return factors
}

export const REFERENCE_PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
