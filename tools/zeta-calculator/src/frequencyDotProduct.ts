import { C } from './complex'
import { formatComplex } from './zeta'
import { kpiCard, wrapAnalysisCard } from './analysisLayout'
import { dotR2, cosineSimilarity } from './vectorDotProduct'
import { buildEtaTerms, buildPartialSums, type VectorSample } from './seriesVectors'
import {
  REFERENCE_PRIMES,
  etaTermPhase,
  primeFactors,
  termAngularFrequency,
  unitPhasor,
} from './frequencyUtils'

export interface PrimeFrequencyDot {
  prime: number
  exponent: number
  omega: number
  reference: C
  dot: number
  cos: number | null
}

export interface FrequencyDotSample {
  index: number
  value: C
  omega: number
  phase: number
  magnitude: number
  /** 与自身相位方向的点积（= |a_n|）。 */
  selfPhasorDot: number
  /** 相邻相位单位向量点积 cos(φ_{n+1} − φ_n)。 */
  adjacentPhasorCos: number | null
  /** 相位差 Δφ 与频率差 ω_{n+1}−ω_n 的比值（理想常数为 Im(s)）。 */
  deltaPhase: number | null
  primeDots: PrimeFrequencyDot[]
}

export interface FrequencyCoherence {
  meanPhasor: C
  meanPhasorMagnitude: number
  partialDots: Array<{ index: number; dot: number; cos: number | null }>
  tailMeanCos: number | null
}

export interface FrequencyDotPattern {
  found: boolean
  description: string
}

export interface FrequencyDotResult {
  s: C
  seriesLabel: string
  tParameter: number
  samples: FrequencyDotSample[]
  coherence: FrequencyCoherence
  primeSpectrum: Array<{ prime: number; totalDot: number; meanCos: number | null }>
  pattern: FrequencyDotPattern
  limitEstimate: C | null
}

function primeFrequencyDots(
  term: C,
  n: number,
  t: number,
): PrimeFrequencyDot[] {
  const factors = primeFactors(n)
  const factorMap = new Map(factors.map((item) => [item.prime, item.exponent]))

  return REFERENCE_PRIMES.filter((prime) => prime <= n).map((prime) => {
    const omega = Math.log(prime)
    const reference = unitPhasor(-t * omega)
    return {
      prime,
      exponent: factorMap.get(prime) ?? 0,
      omega,
      reference,
      dot: dotR2(term, reference),
      cos: cosineSimilarity(term, reference),
    }
  })
}

function buildSamples(s: C, terms: VectorSample[]): FrequencyDotSample[] {
  const t = s.im
  return terms.map((sample, index) => {
    const phase = etaTermPhase(s, sample.index)
    const magnitude = sample.value.abs()
    const selfPhasorDot = dotR2(sample.value, unitPhasor(phase))
    const next = terms[index + 1]
    let adjacentPhasorCos: number | null = null
    let deltaPhase: number | null = null
    if (next) {
      const phaseNext = etaTermPhase(s, next.index)
      adjacentPhasorCos = Math.cos(phaseNext - phase)
      deltaPhase = phaseNext - phase
    }

    return {
      index: sample.index,
      value: sample.value,
      omega: termAngularFrequency(sample.index, s),
      phase,
      magnitude,
      selfPhasorDot,
      adjacentPhasorCos,
      deltaPhase,
      primeDots: primeFrequencyDots(sample.value, sample.index, t),
    }
  })
}

function buildCoherence(partialSums: VectorSample[], samples: FrequencyDotSample[]): FrequencyCoherence {
  const usable = samples.filter((sample) => sample.magnitude > 1e-14)
  let meanPhasor = C.zero()
  for (const sample of usable) {
    meanPhasor = meanPhasor.add(unitPhasor(sample.phase))
  }
  if (usable.length > 0) {
    meanPhasor = meanPhasor.div(C.from(usable.length, 0))
  }
  const meanPhasorMagnitude = meanPhasor.abs()

  const partialDots = partialSums.map((partial, index) => ({
    index: partial.index,
    dot: dotR2(partial.value, meanPhasor),
    cos: meanPhasorMagnitude > 1e-14 ? cosineSimilarity(partial.value, meanPhasor) : null,
  }))

  const tail = partialDots.slice(-Math.min(8, partialDots.length))
  const tailCos = tail.map((item) => item.cos).filter((value): value is number => value !== null)
  const tailMeanCos =
    tailCos.length > 0 ? tailCos.reduce((sum, value) => sum + value, 0) / tailCos.length : null

  return { meanPhasor, meanPhasorMagnitude, partialDots, tailMeanCos }
}

function buildPrimeSpectrum(samples: FrequencyDotSample[]): Array<{
  prime: number
  totalDot: number
  meanCos: number | null
}> {
  return REFERENCE_PRIMES.map((prime) => {
    const dots = samples.map((sample) => sample.primeDots.find((item) => item.prime === prime)).filter(Boolean) as PrimeFrequencyDot[]
    const totalDot = dots.reduce((sum, item) => sum + item.dot, 0)
    const cosValues = dots.map((item) => item.cos).filter((value): value is number => value !== null)
    const meanCos =
      cosValues.length > 0 ? cosValues.reduce((sum, value) => sum + value, 0) / cosValues.length : null
    return { prime, totalDot, meanCos }
  })
}

function detectFrequencyDotPattern(
  s: C,
  samples: FrequencyDotSample[],
  coherence: FrequencyCoherence,
): FrequencyDotPattern {
  if (Math.abs(s.im) < 1e-10) {
    return {
      found: true,
      description: 'Im(s)=0：无相位旋转，频率点积退化为实轴投影；相邻 cos(Δφ) 在 ±1 间交替（η 符号）。',
    }
  }

  const deltas = samples
    .map((sample) => sample.deltaPhase)
    .filter((value): value is number => value !== null)
  const meanDelta =
    deltas.length > 0 ? deltas.reduce((sum, value) => sum + value, 0) / deltas.length : 0
  const expectedDelta = -s.im * Math.log(2)
  const deltaError = Math.abs(meanDelta - expectedDelta)

  const adjCos = samples
    .map((sample) => sample.adjacentPhasorCos)
    .filter((value): value is number => value !== null)
  const adjMean = adjCos.length > 0 ? adjCos.reduce((sum, value) => sum + value, 0) / adjCos.length : 0

  if (deltaError < Math.abs(expectedDelta) * 0.15 && Math.abs(s.im) > 0.1) {
    return {
      found: true,
      description: `相邻相位差 Δφ ≈ ${meanDelta.toFixed(4)} ≈ −Im(s)·log(n+1/n)，与频率 ω=log n 一致（mean cos(Δφ)≈${adjMean.toFixed(3)}）。`,
    }
  }

  if (coherence.tailMeanCos !== null && coherence.tailMeanCos > 0.7) {
    return {
      found: true,
      description: `部分和 S_n 与平均相位方向 ê 高度同向（尾部 cos≈${coherence.tailMeanCos.toFixed(3)}），频率分量相干叠加。`,
    }
  }

  const topPrime = buildPrimeSpectrum(samples)
    .filter((item) => item.totalDot !== 0)
    .sort((a, b) => Math.abs(b.totalDot) - Math.abs(a.totalDot))[0]

  if (topPrime && Math.abs(topPrime.totalDot) > 0.01) {
    return {
      found: true,
      description: `素数频率通道中 p=${topPrime.prime} 的总投影最强（Σ a_n·ê(log p)≈${topPrime.totalDot.toFixed(4)}）。`,
    }
  }

  return {
    found: false,
    description: '频率点积未出现单一主导规律；可增大项数或调整 Im(s) 观察 ω=log n 旋转。',
  }
}

export function analyzeFrequencyDotProducts(s: C, termCount = 48): FrequencyDotResult {
  const terms = buildEtaTerms(s, termCount)
  const partialSums = buildPartialSums(terms)
  const samples = buildSamples(s, terms)
  const coherence = buildCoherence(partialSums, samples)
  const primeSpectrum = buildPrimeSpectrum(samples)
  const pattern = detectFrequencyDotPattern(s, samples, coherence)
  const limitEstimate = partialSums.length > 0 ? partialSums[partialSums.length - 1].value : null

  return {
    s,
    seriesLabel: 'Dirichlet η 项 a_n = (−1)^{n−1} n^{−s}',
    tParameter: s.im,
    samples,
    coherence,
    primeSpectrum,
    pattern,
    limitEstimate,
  }
}

function renderSampleBlock(sample: FrequencyDotSample): string {
  const primeHits = sample.primeDots
    .filter((item) => item.exponent > 0)
    .map((item) => `p=${item.prime}^${item.exponent} dot=${item.dot.toPrecision(3)}`)
    .join(', ')

  return `n=${String(sample.index).padStart(2)}  ω=${sample.omega.toPrecision(4)}  φ=${sample.phase.toPrecision(4)}  |a|=${sample.magnitude.toPrecision(4)}  cos Δφ=${sample.adjacentPhasorCos?.toPrecision(4) ?? '—'}${primeHits ? `  [${primeHits}]` : ''}`
}

export function renderFrequencyDotHtml(result: FrequencyDotResult): string {
  const head = result.samples.slice(0, 6)
  const tail = result.samples.slice(-4)
  const sampleLines = head.map((sample) => renderSampleBlock(sample))
  if (result.samples.length > 10) {
    sampleLines.push('  …')
    tail.forEach((sample) => sampleLines.push(renderSampleBlock(sample)))
  }

  const partialTail = result.coherence.partialDots.slice(-6)
  const partialLines = partialTail.map(
    (item) =>
      `n=${String(item.index).padStart(2)}  S_n·μ̂=${item.dot.toPrecision(4)}  cos=${item.cos?.toPrecision(4) ?? '—'}`,
  )

  const spectrumLines = result.primeSpectrum
    .slice(0, 12)
    .map(
      (item) =>
        `p=${String(item.prime).padStart(2)}  ω=log p=${Math.log(item.prime).toFixed(4)}  Σ a_n·ê=${item.totalDot.toPrecision(4)}  mean cos=${item.meanCos?.toPrecision(4) ?? '—'}`,
    )

  return wrapAnalysisCard({
    title: '频率 × 点积',
    tag: 'ω',
    lead: `φ_n ≈ −Im(s)·log n，ω_n = |Im(s)|·log n；t = ${result.tParameter.toPrecision(4)}。`,
    kpis: [
      kpiCard('规律', result.pattern.found ? '已识别' : '未识别'),
      kpiCard('平均相位 μ̂', formatComplex(result.coherence.meanPhasor, 6)),
      kpiCard('尾部 cos', result.coherence.tailMeanCos?.toPrecision(4) ?? '—'),
      kpiCard('S_N', result.limitEstimate ? formatComplex(result.limitEstimate) : '—'),
    ].join(''),
    pattern: result.pattern.description,
    sections: [
      {
        title: '逐项 ω_n、cos(Δφ)、素数因子',
        html: `<pre class="code-block">${sampleLines.join('\n')}</pre>`,
        open: true,
      },
      {
        title: '部分和 × 平均相位 μ̂',
        html: `<pre class="code-block">${partialLines.join('\n')}</pre>`,
      },
      {
        title: '素数频率谱 Σ a_n · ê(−t·log p)',
        html: `<pre class="code-block">${spectrumLines.join('\n')}</pre>`,
      },
    ],
    footnote: '与图表「相位→频率」一致：ω = dφ/dt = log n；log n = Σ e_i log p_i。',
  })
}
