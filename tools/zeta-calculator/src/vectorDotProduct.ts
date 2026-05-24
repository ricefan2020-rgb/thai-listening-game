import { C } from './complex'
import { formatComplex } from './zeta'
import {
  buildEtaTerms,
  buildPartialSums,
  buildVectorLayers,
  type VectorSample,
} from './seriesVectors'
import { kpiCard, wrapAnalysisCard } from './analysisLayout'

/** 把复数当作 ℝ² 向量时的欧氏点积。 */
export function dotR2(a: C, b: C): number {
  return a.re * b.re + a.im * b.im
}

export function cosineSimilarity(a: C, b: C): number | null {
  const denom = a.abs() * b.abs()
  if (denom < 1e-14) {
    return null
  }
  return dotR2(a, b) / denom
}

export interface ConsecutiveDot {
  index: number
  left: C
  right: C
  dot: number
  cos: number | null
}

export interface DotLayerStats {
  meanDot: number
  meanAbsCos: number | null
  cosCv: number | null
  alternating: boolean
}

export interface DotLayer {
  depth: number
  label: string
  pairs: ConsecutiveDot[]
  stats: DotLayerStats
}

export interface ReferenceProjection {
  label: string
  reference: C
  samples: Array<{ index: number; dot: number; cos: number | null }>
  tailMeanDot: number
}

export interface DotPattern {
  found: boolean
  depth: number
  target: 'terms' | 'partial'
  description: string
}

export interface VectorDotResult {
  s: C
  seriesLabel: string
  termDotLayers: DotLayer[]
  partialDotLayers: DotLayer[]
  termPartialDots: ConsecutiveDot[]
  referenceProjections: ReferenceProjection[]
  pattern: DotPattern
  limitEstimate: C | null
}

function consecutiveDots(samples: VectorSample[]): ConsecutiveDot[] {
  const pairs: ConsecutiveDot[] = []
  for (let index = 0; index < samples.length - 1; index += 1) {
    const left = samples[index].value
    const right = samples[index + 1].value
    pairs.push({
      index: samples[index + 1].index,
      left,
      right,
      dot: dotR2(left, right),
      cos: cosineSimilarity(left, right),
    })
  }
  return pairs
}

function dotLayerStats(pairs: ConsecutiveDot[]): DotLayerStats {
  if (pairs.length === 0) {
    return { meanDot: 0, meanAbsCos: null, cosCv: null, alternating: false }
  }

  const dots = pairs.map((pair) => pair.dot)
  const meanDot = dots.reduce((sum, value) => sum + value, 0) / dots.length

  const cosValues = pairs.map((pair) => pair.cos).filter((value): value is number => value !== null)
  if (cosValues.length === 0) {
    return { meanDot, meanAbsCos: null, cosCv: null, alternating: false }
  }

  const meanCos = cosValues.reduce((sum, value) => sum + value, 0) / cosValues.length
  const meanAbsCos = cosValues.reduce((sum, value) => sum + Math.abs(value), 0) / cosValues.length
  const cosVariance =
    cosValues.reduce((sum, value) => sum + (value - meanCos) ** 2, 0) / cosValues.length
  const cosStd = Math.sqrt(cosVariance)
  const cosCv = Math.abs(meanCos) > 1e-6 ? cosStd / Math.abs(meanCos) : cosStd

  const tail = cosValues.slice(-Math.min(8, cosValues.length))
  const alternating =
    tail.length >= 4 &&
    tail.every((value) => value < -0.3) &&
    meanCos < -0.5

  return { meanDot, meanAbsCos, cosCv, alternating }
}

function buildDotLayers(
  baseLayers: VectorSample[][],
  prefix: string,
): DotLayer[] {
  return baseLayers.map((layer, depth) => {
    const pairs = consecutiveDots(layer)
  const depthLabel =
      depth === 0
        ? `${prefix} 相邻点积 v_n · v_{n+1}`
        : `${prefix} 第 ${depth} 阶差分相邻点积 Δ${depth}v_n · Δ${depth}v_{n+1}`

    return {
      depth,
      label: depthLabel,
      pairs,
      stats: dotLayerStats(pairs),
    }
  })
}

function buildTermPartialDots(terms: VectorSample[], partialSums: VectorSample[]): ConsecutiveDot[] {
  const pairs: ConsecutiveDot[] = []
  for (let index = 0; index < terms.length; index += 1) {
    const term = terms[index].value
    const partial = partialSums[index].value
    pairs.push({
      index: terms[index].index,
      left: term,
      right: partial,
      dot: dotR2(term, partial),
      cos: cosineSimilarity(term, partial),
    })
  }
  return pairs
}

function unitVector(value: C): C | null {
  const magnitude = value.abs()
  if (magnitude < 1e-14) {
    return null
  }
  return C.from(value.re / magnitude, value.im / magnitude)
}

function buildReferenceProjections(
  terms: VectorSample[],
  partialSums: VectorSample[],
): ReferenceProjection[] {
  const lastPartial = partialSums[partialSums.length - 1]?.value ?? C.zero()
  const firstTerm = terms[0]?.value ?? C.one()
  const references: Array<{ label: string; reference: C | null }> = [
    { label: '实轴 ê_x = (1, 0)', reference: C.one() },
    { label: '虚轴 ê_y = (0, 1)', reference: C.from(0, 1) },
    { label: '首项方向 â_1/|a_1|', reference: unitVector(firstTerm) },
    { label: '部分和方向 Ŝ_N/|S_N|', reference: unitVector(lastPartial) },
  ]

  return references
    .filter((item): item is { label: string; reference: C } => item.reference !== null)
    .map(({ label, reference }) => {
      const samples = terms.map((term) => ({
        index: term.index,
        dot: dotR2(term.value, reference),
        cos: cosineSimilarity(term.value, reference),
      }))
      const tail = samples.slice(-Math.min(8, samples.length))
      const tailMeanDot = tail.reduce((sum, sample) => sum + sample.dot, 0) / tail.length
      return { label, reference, samples, tailMeanDot }
    })
}

function detectDotPattern(
  termLayers: DotLayer[],
  partialLayers: DotLayer[],
  termPartialDots: ConsecutiveDot[],
): DotPattern {
  const cosCvThreshold = 0.25
  let best: DotPattern = {
    found: false,
    depth: 0,
    target: 'terms',
    description:
      '相邻点积 / 夹角余弦在设定阶数内未呈现简单稳定规律（复振荡项的相位每步都在变）。',
  }
  let bestCv = Number.POSITIVE_INFINITY

  for (const target of ['partial', 'terms'] as const) {
    const layers = target === 'partial' ? partialLayers : termLayers
    for (const layer of layers) {
      if (layer.stats.cosCv !== null && layer.stats.cosCv < bestCv) {
        bestCv = layer.stats.cosCv
      }

      if (layer.stats.alternating) {
        return {
          found: true,
          depth: layer.depth,
          target,
          description: `第 ${layer.depth} 层相邻向量几乎反向（cos θ 尾部 < −0.3），符合 η 级数 (−1)^{n−1} 的符号交替。`,
        }
      }

      if (layer.stats.cosCv !== null && layer.stats.cosCv < cosCvThreshold) {
        const meanCos =
          layer.pairs
            .map((pair) => pair.cos)
            .filter((value): value is number => value !== null)
            .reduce((sum, value, _, arr) => sum + value / arr.length, 0) ?? 0

        if (target === 'partial' && layer.depth === 0 && meanCos > 0.85) {
          return {
            found: true,
            depth: layer.depth,
            target,
            description: `部分和轨迹相邻切向高度同向（cos θ≈${meanCos.toFixed(3)}），路径平滑收敛。`,
          }
        }

        return {
          found: true,
          depth: layer.depth,
          target,
          description: `第 ${layer.depth} 层相邻夹角余弦稳定（CV≈${layer.stats.cosCv.toFixed(3)}，mean cos≈${meanCos.toFixed(3)}）。`,
        }
      }
    }
  }

  const tailPartial = termPartialDots.slice(-Math.min(8, termPartialDots.length))
  const shrinking =
    tailPartial.length >= 4 &&
    tailPartial.every((pair, index, arr) => index === 0 || Math.abs(pair.dot) <= Math.abs(arr[index - 1].dot) * 1.05)
  if (shrinking && tailPartial[tailPartial.length - 1].dot < tailPartial[0].dot * 0.5) {
    return {
      found: true,
      depth: 0,
      target: 'terms',
      description: 'a_n · S_n 在尾部递减：新项与当前部分和的「同向贡献」变小，级数趋于饱和。',
    }
  }

  if (bestCv < Number.POSITIVE_INFINITY) {
    best.description += ` 最接近稳定的 cos CV≈${bestCv.toFixed(3)}。`
  }

  return best
}

export function analyzeVectorDotProducts(
  s: C,
  termCount = 48,
  maxDepth = 6,
): VectorDotResult {
  const terms = buildEtaTerms(s, termCount)
  const partialSums = buildPartialSums(terms)
  const termVectorLayers = buildVectorLayers(terms, maxDepth)
  const partialVectorLayers = buildVectorLayers(partialSums, maxDepth)
  const termDotLayers = buildDotLayers(termVectorLayers, '项 a_n')
  const partialDotLayers = buildDotLayers(partialVectorLayers, '部分和 S_n')
  const termPartialDots = buildTermPartialDots(terms, partialSums)
  const referenceProjections = buildReferenceProjections(terms, partialSums)
  const pattern = detectDotPattern(termDotLayers, partialDotLayers, termPartialDots)
  const limitEstimate = partialSums.length > 0 ? partialSums[partialSums.length - 1].value : null

  return {
    s,
    seriesLabel: 'Dirichlet η 项 a_n = (−1)^{n−1} n^{−s}',
    termDotLayers,
    partialDotLayers,
    termPartialDots,
    referenceProjections,
    pattern,
    limitEstimate,
  }
}

function renderDotPairRow(pair: ConsecutiveDot, leftLabel: string, rightLabel: string): string {
  const cosText = pair.cos === null ? '—' : pair.cos.toPrecision(4)
  return `n=${String(pair.index).padStart(2)}  ${leftLabel}·${rightLabel}=${pair.dot.toPrecision(4)}  cos θ=${cosText}`
}

function renderDotLayerBlock(layer: DotLayer): string {
  const head = layer.pairs.slice(0, Math.min(6, layer.pairs.length))
  const tail = layer.pairs.slice(-Math.min(4, Math.max(0, layer.pairs.length - 6)))
  const lines = head.map((pair) => renderDotPairRow(pair, 'v', 'v'))
  if (tail.length > 0 && layer.pairs.length > 10) {
    lines.push('  …')
    tail.forEach((pair) => lines.push(renderDotPairRow(pair, 'v', 'v')))
  }

  const statsLine = [
    `mean dot=${layer.stats.meanDot.toPrecision(4)}`,
    layer.stats.meanAbsCos !== null ? `mean|cos|=${layer.stats.meanAbsCos.toPrecision(4)}` : null,
    layer.stats.cosCv !== null ? `cos CV=${layer.stats.cosCv.toPrecision(4)}` : null,
    layer.stats.alternating ? '符号交替' : null,
  ]
    .filter(Boolean)
    .join('，')

  return `
    <article class="step-card">
      <div class="step-index">${layer.depth}</div>
      <div class="step-body">
        <h3>${layer.label}</h3>
        <p class="step-formula">${statsLine}</p>
        <pre>${lines.join('\n')}</pre>
      </div>
    </article>
  `
}

function renderReferenceBlock(projection: ReferenceProjection): string {
  const head = projection.samples.slice(0, 6)
  const tail = projection.samples.slice(-4)
  const lines = head.map(
    (sample) =>
      `n=${String(sample.index).padStart(2)}  a_n·r=${sample.dot.toPrecision(4)}  cos=${sample.cos?.toPrecision(4) ?? '—'}`,
  )
  if (projection.samples.length > 10) {
    lines.push('  …')
    tail.forEach((sample) =>
      lines.push(
        `n=${String(sample.index).padStart(2)}  a_n·r=${sample.dot.toPrecision(4)}  cos=${sample.cos?.toPrecision(4) ?? '—'}`,
      ),
    )
  }

  return `
    <article class="step-card">
      <div class="step-index">r</div>
      <div class="step-body">
        <h3>${projection.label}</h3>
        <p class="step-formula">r=${formatComplex(projection.reference, 6)}，尾部 mean dot=${projection.tailMeanDot.toPrecision(4)}</p>
        <pre>${lines.join('\n')}</pre>
      </div>
    </article>
  `
}

export function renderVectorDotHtml(result: VectorDotResult): string {
  const termBlocks = result.termDotLayers.map((layer) => renderDotLayerBlock(layer)).join('')
  const partialBlocks = result.partialDotLayers.map((layer) => renderDotLayerBlock(layer)).join('')
  const refBlocks = result.referenceProjections.map((projection) => renderReferenceBlock(projection)).join('')

  const termPartialHead = result.termPartialDots.slice(0, 6)
  const termPartialTail = result.termPartialDots.slice(-4)
  const termPartialLines = termPartialHead.map((pair) => renderDotPairRow(pair, 'a', 'S'))
  if (result.termPartialDots.length > 10) {
    termPartialLines.push('  …')
    termPartialTail.forEach((pair) => termPartialLines.push(renderDotPairRow(pair, 'a', 'S')))
  }

  return wrapAnalysisCard({
    title: '向量点积',
    tag: '·',
    lead: 'ℝ² 点积 v·w 与 cos θ；相邻项、差分塔、参考方向与 a_n·S_n。',
    kpis: [
      kpiCard('规律', result.pattern.found ? '已识别' : '未识别'),
      kpiCard('最佳层', result.pattern.depth >= 0 ? `第 ${result.pattern.depth} 层` : '—'),
      kpiCard('对象', result.pattern.target === 'partial' ? '部分和 S_n' : '项 a_n'),
      kpiCard('S_N', result.limitEstimate ? formatComplex(result.limitEstimate) : '—'),
    ].join(''),
    pattern: result.pattern.description,
    sections: [
      {
        title: 'a_n · S_n（同向贡献）',
        html: `<pre class="code-block">${termPartialLines.join('\n')}</pre>`,
        open: true,
      },
      { title: '参考方向 a_n · r', html: refBlocks },
      { title: '项 a_n 相邻点积塔', html: termBlocks },
      { title: '部分和 S_n 相邻点积塔', html: partialBlocks },
    ],
    footnote: 'cos θ ≈ −1：η 交替；a_n·S_n 变小：级数趋于饱和。',
  })
}
