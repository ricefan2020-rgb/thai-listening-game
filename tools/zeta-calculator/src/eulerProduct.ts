import { C } from './complex'
import { formatComplex, zeta } from './zeta'
import { kpiCard, wrapAnalysisCard } from './analysisLayout'

export interface EulerPrimeStep {
  index: number
  prime: number
  factor: C
  partialProduct: C
  zetaTimesProduct: C
  errorFromOne: number
}

export interface EulerProductResult {
  s: C
  zetaValue: C
  primeCount: number
  steps: EulerPrimeStep[]
  finalProduct: C
  finalCheck: C
  errorFromOne: number
  convergentRegion: boolean
  note: string
}

const PRIME_CACHE: number[] = []

function ensurePrimes(count: number): number[] {
  if (PRIME_CACHE.length >= count) {
    return PRIME_CACHE.slice(0, count)
  }

  const start = PRIME_CACHE.length > 0 ? PRIME_CACHE[PRIME_CACHE.length - 1] + 1 : 2
  let candidate = start
  while (PRIME_CACHE.length < count) {
    let composite = false
    for (const prime of PRIME_CACHE) {
      if (prime * prime > candidate) {
        break
      }
      if (candidate % prime === 0) {
        composite = true
        break
      }
    }
    if (!composite) {
      PRIME_CACHE.push(candidate)
    }
    candidate += candidate === 2 ? 1 : 2
  }

  return PRIME_CACHE.slice(0, count)
}

function factorOneMinusPToMinusS(s: C, prime: number): C {
  const term = C.pow(prime, s.neg())
  return C.one().sub(term)
}

export function verifyEulerProduct(s: C, primeCount = 25): EulerProductResult {
  const primes = ensurePrimes(Math.min(500, Math.max(3, primeCount)))
  const zetaResult = zeta(s)
  const zetaValue = zetaResult.value

  let partialProduct = C.one()
  const steps: EulerPrimeStep[] = []

  for (let index = 0; index < primes.length; index += 1) {
    const prime = primes[index]
    const factor = factorOneMinusPToMinusS(s, prime)
    partialProduct = partialProduct.mul(factor)
    const zetaTimesProduct = zetaValue.mul(partialProduct)
    const errorFromOne = zetaTimesProduct.sub(C.one()).abs()

    steps.push({
      index: index + 1,
      prime,
      factor,
      partialProduct,
      zetaTimesProduct,
      errorFromOne,
    })
  }

  const finalProduct = partialProduct
  const finalCheck = zetaValue.mul(finalProduct)
  const errorFromOne = finalCheck.sub(C.one()).abs()
  const convergentRegion = s.re > 1

  let note = ''
  if (convergentRegion) {
    note = `Re(s) > 1：Euler 乘积绝对收敛，ζ(s)·∏_{p≤P}(1−p^{−s}) 应随 P 增大趋近 1。`
  } else if (s.re <= 1 && s.re > 0) {
    note = `0 < Re(s) ≤ 1：级数条件收敛，截断 Euler 乘积仅作示意；严格恒等式在 Re(s) > 1 成立。`
  } else {
    note = `Re(s) ≤ 0：使用解析延拓的 ζ(s)；截断乘积与 1 的偏差可能很大，不代表 Euler 乘积在原收敛域外的行为。`
  }

  return {
    s,
    zetaValue,
    primeCount: primes.length,
    steps,
    finalProduct,
    finalCheck,
    errorFromOne,
    convergentRegion,
    note,
  }
}

function renderStepRows(steps: EulerPrimeStep[]): string {
  const row = (step: EulerPrimeStep) =>
    `p=${String(step.prime).padStart(3)}  (1−p^{−s})=${formatComplex(step.factor, 5)}  |ζ·∏−1|=${step.errorFromOne.toExponential(3)}`

  if (steps.length <= 16) {
    return steps.map(row).join('\n')
  }
  return [...steps.slice(0, 8).map(row), '  …', ...steps.slice(-4).map(row)].join('\n')
}

export function renderEulerProductHtml(result: EulerProductResult): string {
  const invZeta = result.zetaValue.abs() > 1e-14 ? C.one().div(result.zetaValue) : null
  const productVsInv =
    invZeta !== null ? result.finalProduct.sub(invZeta).abs() : Number.POSITIVE_INFINITY

  return wrapAnalysisCard({
    title: 'Euler 乘积验证',
    tag: '∏',
    lead: 'ζ(s)·∏_p (1−p^{−s}) = 1（Re(s) > 1）。下表用前 P 个素数检验截断乘积。',
    kpis: [
      kpiCard('ζ(s)', formatComplex(result.zetaValue, 8)),
      kpiCard('∏(1−p^{−s})', formatComplex(result.finalProduct, 8)),
      kpiCard('ζ·∏', formatComplex(result.finalCheck, 8)),
      kpiCard('|ζ·∏ − 1|', result.errorFromOne.toExponential(4)),
    ].join(''),
    pattern: result.note,
    sections: [
      {
        title: `逐素数累积（共 ${result.primeCount} 个）`,
        html: `<pre class="code-block">${renderStepRows(result.steps)}</pre>`,
        open: true,
      },
      {
        title: '与 1/ζ(s) 对比',
        html: `<pre class="code-block">∏_p (1−p^{−s}) = ${formatComplex(result.finalProduct, 10)}
1/ζ(s)           = ${invZeta ? formatComplex(invZeta, 10) : '—'}
|∏ − 1/ζ|       = ${productVsInv < Number.POSITIVE_INFINITY ? productVsInv.toExponential(4) : '—'}</pre>`,
      },
    ],
    footnote:
      '恒等式来自 ζ(s) = ∏_p (1−p^{−s})^{-1}。增大素数个数 P 可在 Re(s)>1 时减小 |ζ·∏−1|。',
  })
}
