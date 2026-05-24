import { C } from './complex'
import { formatComplex } from './zeta'
import {
  buildEtaTerms,
  buildPartialSums,
  deltaLayer,
  type VectorSample,
} from './seriesVectors'
import { kpiCard, wrapAnalysisCard } from './analysisLayout'

export type { VectorSample } from './seriesVectors'

export interface DiffLayerStats {
  meanAbs: number
  stdAbs: number
  cv: number
  ratioMean: number | null
}

export interface DiffLayer {
  depth: number
  label: string
  samples: VectorSample[]
  stats: DiffLayerStats
}

export interface DiffPattern {
  found: boolean
  depth: number
  target: 'terms' | 'partial'
  description: string
}

export interface VectorDiffResult {
  s: C
  seriesLabel: string
  terms: VectorSample[]
  partialSums: VectorSample[]
  termLayers: DiffLayer[]
  partialLayers: DiffLayer[]
  pattern: DiffPattern
  limitEstimate: C | null
}

function layerStats(samples: VectorSample[]): DiffLayerStats {
  if (samples.length === 0) {
    return { meanAbs: 0, stdAbs: 0, cv: Number.POSITIVE_INFINITY, ratioMean: null }
  }

  const magnitudes = samples.map((sample) => sample.value.abs())
  const meanAbs = magnitudes.reduce((sum, value) => sum + value, 0) / magnitudes.length
  const variance =
    magnitudes.reduce((sum, value) => sum + (value - meanAbs) ** 2, 0) / magnitudes.length
  const stdAbs = Math.sqrt(variance)
  const cv = meanAbs > 1e-14 ? stdAbs / meanAbs : Number.POSITIVE_INFINITY

  const ratios: number[] = []
  for (let index = 0; index < magnitudes.length - 1; index += 1) {
    if (magnitudes[index] > 1e-14) {
      ratios.push(magnitudes[index + 1] / magnitudes[index])
    }
  }
  const ratioMean =
    ratios.length > 0 ? ratios.reduce((sum, value) => sum + value, 0) / ratios.length : null

  return { meanAbs, stdAbs, cv, ratioMean }
}

function buildLayers(base: VectorSample[], maxDepth: number, prefix: string): DiffLayer[] {
  const layers: DiffLayer[] = [
    {
      depth: 0,
      label: `${prefix}（原序列 v_n）`,
      samples: base,
      stats: layerStats(base),
    },
  ]

  let current = base
  for (let depth = 1; depth <= maxDepth && current.length > 1; depth += 1) {
    current = deltaLayer(current)
    layers.push({
      depth,
      label: `${prefix} 第 ${depth} 阶差分 Δ${depth}v`,
      samples: current,
      stats: layerStats(current),
    })
  }

  return layers
}

function detectPattern(
  termLayers: DiffLayer[],
  partialLayers: DiffLayer[],
  s: C,
): DiffPattern {
  const cvThreshold = 0.22
  let best: DiffPattern = {
    found: false,
    depth: 0,
    target: 'terms',
    description: '在设定阶数内未发现稳定的简单差分规律（复振荡项通常需要很多阶或级数加速）。',
  }
  let bestCv = Number.POSITIVE_INFINITY

  for (const target of ['partial', 'terms'] as const) {
    const layers = target === 'partial' ? partialLayers : termLayers
    for (const layer of layers) {
      if (layer.depth === 0) {
        continue
      }
      const tail = layer.samples.slice(-Math.min(12, layer.samples.length))
      const tailStats = layerStats(tail)
      if (tailStats.cv < bestCv) {
        bestCv = tailStats.cv
      }

      if (tailStats.cv < cvThreshold) {
        if (target === 'partial' && layer.depth === 1) {
          return {
            found: true,
            depth: layer.depth,
            target,
            description: `部分和的一阶差分 |ΔS_n| 在尾部变小且相对均匀（CV≈${tailStats.cv.toFixed(3)}），级数正在收敛到极限。`,
          }
        }

        if (layer.stats.ratioMean !== null && layer.stats.ratioMean > 0 && layer.stats.ratioMean < 1) {
          return {
            found: true,
            depth: layer.depth,
            target,
            description: `第 ${layer.depth} 阶差分幅度近似几何衰减，相邻比约 ${layer.stats.ratioMean.toFixed(4)}（CV≈${tailStats.cv.toFixed(3)}）。`,
          }
        }

        return {
          found: true,
          depth: layer.depth,
          target,
          description: `第 ${layer.depth} 阶差分在尾部趋于稳定（CV≈${tailStats.cv.toFixed(3)}）。`,
        }
      }
    }
  }

  if (s.im === 0 && s.re > 0 && termLayers.length > 2) {
    const second = termLayers[2]
    if (second && second.stats.cv < 0.35) {
      return {
        found: true,
        depth: 2,
        target: 'terms',
        description: `实轴正部：二阶差分较稳定，符合绝对/条件收敛级数的多项式型差分结构。`,
      }
    }
  }

  if (bestCv < Number.POSITIVE_INFINITY) {
    best.description += ` 最接近稳定的层 CV≈${bestCv.toFixed(3)}。`
  }

  return best
}

export function analyzeVectorDifferences(
  s: C,
  termCount = 48,
  maxDepth = 6,
): VectorDiffResult {
  const terms = buildEtaTerms(s, termCount)
  const partialSums = buildPartialSums(terms)
  const termLayers = buildLayers(terms, maxDepth, '项向量 a_n')
  const partialLayers = buildLayers(partialSums, maxDepth, '部分和 S_n')
  const pattern = detectPattern(termLayers, partialLayers, s)

  const limitEstimate = partialSums.length > 0 ? partialSums[partialSums.length - 1].value : null

  return {
    s,
    seriesLabel: 'Dirichlet η 项 a_n = (−1)^{n−1} n^{−s}',
    terms,
    partialSums,
    termLayers,
    partialLayers,
    pattern,
    limitEstimate,
  }
}

function renderSampleRow(sample: VectorSample, depth: number): string {
  const deltaLabel = depth === 0 ? 'v' : `Δ${depth}`
  return `n=${String(sample.index).padStart(2)}  ${deltaLabel}=${formatComplex(sample.value, 6)}  |${deltaLabel}|=${sample.value.abs().toPrecision(4)}`
}

function renderLayerBlock(layer: DiffLayer, showCount: number): string {
  const head = layer.samples.slice(0, Math.min(6, layer.samples.length))
  const tail = layer.samples.slice(-Math.min(4, Math.max(0, layer.samples.length - 6)))
  const lines = head.map((sample) => renderSampleRow(sample, layer.depth))
  if (tail.length > 0 && layer.samples.length > 10) {
    lines.push('  …')
    tail.forEach((sample) => lines.push(renderSampleRow(sample, layer.depth)))
  }

  return `
    <article class="step-card">
      <div class="step-index">${layer.depth}</div>
      <div class="step-body">
        <h3>${layer.label}</h3>
        <p class="step-formula">mean|Δ|=${layer.stats.meanAbs.toPrecision(4)}，CV=${layer.stats.cv.toPrecision(4)}${
          layer.stats.ratioMean !== null ? `，相邻比≈${layer.stats.ratioMean.toPrecision(4)}` : ''
        }</p>
        <pre>${lines.join('\n')}</pre>
      </div>
    </article>
  `
}

export function renderVectorDiffHtml(result: VectorDiffResult): string {
  const termBlocks = result.termLayers.map((layer) => renderLayerBlock(layer, 6)).join('')
  const partialBlocks = result.partialLayers.map((layer) => renderLayerBlock(layer, 6)).join('')

  return wrapAnalysisCard({
    title: '向量差分',
    tag: 'Δ',
    lead: `把每一项看成复平面向量 v_n，逐阶计算 Δv_n = v_{n+1} − v_n。${result.seriesLabel}`,
    kpis: [
      kpiCard('规律', result.pattern.found ? '已识别' : '未识别'),
      kpiCard('最佳阶数', result.pattern.depth > 0 ? `第 ${result.pattern.depth} 阶` : '—'),
      kpiCard('对象', result.pattern.target === 'partial' ? '部分和 S_n' : '项 a_n'),
      kpiCard('S_N', result.limitEstimate ? formatComplex(result.limitEstimate) : '—'),
    ].join(''),
    pattern: result.pattern.description,
    sections: [
      { title: '项向量 a_n 差分塔', html: termBlocks, open: true },
      { title: '部分和 S_n 差分塔', html: partialBlocks },
    ],
    footnote: '一阶差分 ΔS_n = a_{n+1}；部分和一阶差分 → 0 表示收敛。',
  })
}
