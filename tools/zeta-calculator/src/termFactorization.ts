import { C } from './complex'
import { formatComplex } from './zeta'
import { kpiCard, wrapAnalysisCard } from './analysisLayout'
import { primeFactors } from './frequencyUtils'

export type SeriesKind = 'zeta' | 'eta'

export interface LocalPrimeFactor {
  prime: number
  exponent: number
  localFactor: C
}

export interface TermFactorRow {
  n: number
  sign: number
  factors: LocalPrimeFactor[]
  factorizationText: string
  localProductText: string
  term: C
  localProduct: C
  productError: number
}

export interface PrimeUsageStat {
  prime: number
  timesInRange: number
  maxExponent: number
}

export interface TermFactorizationResult {
  s: C
  seriesKind: SeriesKind
  termCount: number
  rows: TermFactorRow[]
  primeStats: PrimeUsageStat[]
  note: string
}

function buildTerm(s: C, n: number, kind: SeriesKind): { term: C; sign: number } {
  const sign = kind === 'eta' ? (n % 2 === 0 ? -1 : 1) : 1
  const magnitude = C.pow(n, s.neg())
  const term = magnitude.mul(C.from(sign, 0))
  return { term, sign }
}

function formatFactorization(factors: LocalPrimeFactor[]): string {
  if (factors.length === 0) {
    return '1'
  }
  return factors.map((item) => `${item.prime}^{${item.exponent}}`).join('·')
}

function formatLocalProduct(factors: LocalPrimeFactor[], s: C): string {
  if (factors.length === 0) {
    return '1'
  }
  return factors.map((item) => `${item.prime}^{−${item.exponent}·s}`).join('·')
}

export function analyzeTermFactorization(
  s: C,
  termCount = 24,
  seriesKind: SeriesKind = 'eta',
): TermFactorizationResult {
  const count = Math.min(80, Math.max(3, termCount))
  const rows: TermFactorRow[] = []
  const primeUsage = new Map<number, { count: number; maxExp: number }>()

  for (let n = 1; n <= count; n += 1) {
    const rawFactors = primeFactors(n)
    const factors: LocalPrimeFactor[] = rawFactors.map((item) => ({
      prime: item.prime,
      exponent: item.exponent,
      localFactor: C.pow(item.prime, s.neg().mul(C.from(item.exponent, 0))),
    }))

    let localProduct = C.one()
    for (const factor of factors) {
      localProduct = localProduct.mul(factor.localFactor)
      const usage = primeUsage.get(factor.prime) ?? { count: 0, maxExp: 0 }
      usage.count += 1
      usage.maxExp = Math.max(usage.maxExp, factor.exponent)
      primeUsage.set(factor.prime, usage)
    }

    const { term, sign } = buildTerm(s, n, seriesKind)
    const signedLocal = localProduct.mul(C.from(sign, 0))
    const productError = signedLocal.sub(term).abs()

    rows.push({
      n,
      sign,
      factors,
      factorizationText: formatFactorization(factors),
      localProductText: formatLocalProduct(factors, s),
      term,
      localProduct: signedLocal,
      productError,
    })
  }

  const primeStats = [...primeUsage.entries()]
    .map(([prime, usage]) => ({
      prime,
      timesInRange: usage.count,
      maxExponent: usage.maxExp,
    }))
    .sort((a, b) => a.prime - b.prime)

  let note = 'n^{−s} = ∏_{p|n} p^{−v_p(n)·s}；η 项再乘 (−1)^{n−1}。局部因子乘积应等于该项。'
  if (seriesKind === 'zeta' && s.re <= 1) {
    note += ' Re(s)≤1 时 ζ 级数需解析延拓，此处仅展示代数分解。'
  }

  return {
    s,
    seriesKind,
    termCount: count,
    rows,
    primeStats,
    note,
  }
}

function renderTermRows(rows: TermFactorRow[], seriesKind: SeriesKind): string {
  const signLabel = seriesKind === 'eta' ? ' (−1)^{n−1}' : ''
  const row = (item: TermFactorRow) => {
    const signStr = item.sign < 0 ? '−' : '+'
    return [
      `n=${String(item.n).padStart(2)}  n=${item.factorizationText}`,
      `     ${signStr} ${item.localProductText}${signLabel}  →  term=${formatComplex(item.term, 6)}`,
      `     check |∏_local − term|=${item.productError.toExponential(2)}`,
    ].join('\n')
  }

  if (rows.length <= 14) {
    return rows.map(row).join('\n\n')
  }
  return [...rows.slice(0, 7).map(row), '  …', ...rows.slice(-5).map(row)].join('\n\n')
}

function renderPrimeStats(stats: PrimeUsageStat[]): string {
  return stats
    .slice(0, 20)
    .map(
      (item) =>
        `p=${String(item.prime).padStart(3)}  出现 ${String(item.timesInRange).padStart(2)} 次  max v_p=${item.maxExponent}`,
    )
    .join('\n')
}

export function renderTermFactorizationHtml(result: TermFactorizationResult): string {
  const seriesName =
    result.seriesKind === 'eta'
      ? 'η 项 a_n = (−1)^{n−1} n^{−s}'
      : 'ζ 项 n^{−s}'

  const maxError = Math.max(...result.rows.map((row) => row.productError))

  return wrapAnalysisCard({
    title: '逐项素数分解',
    tag: 'n',
    lead: `${seriesName}：把每个 n 拆成 ∏ p^{v_p(n)}，对应局部因子 ∏ p^{−v_p(n)·s}。`,
    kpis: [
      kpiCard('s', formatComplex(result.s, 6)),
      kpiCard('项数 N', String(result.termCount)),
      kpiCard('涉及素数', String(result.primeStats.length)),
      kpiCard('max 分解误差', maxError.toExponential(2)),
    ].join(''),
    pattern: result.note,
    sections: [
      {
        title: '逐项分解表',
        html: `<pre class="code-block">${renderTermRows(result.rows, result.seriesKind)}</pre>`,
        open: true,
      },
      {
        title: `范围内素数使用统计（n ≤ ${result.termCount}）`,
        html: `<pre class="code-block">${renderPrimeStats(result.primeStats)}</pre>`,
      },
      {
        title: '与 Euler 乘积的关系',
        html: `<p class="note" style="margin:0">全体级数：ζ(s)=∑_n n^{−s}；每个 n 的局部因子乘起来就是 n^{−s}。Euler 乘积 ∏_p (1−p^{−s})^{-1} 则是按<strong>素数</strong>而非按 n 重组——同一套素数，两种索引。</p>`,
      },
    ],
    footnote: '增大 N 可看更多合数的混合频率；临界线附近请配合「Euler 乘积」「频率×点积」页。',
  })
}
