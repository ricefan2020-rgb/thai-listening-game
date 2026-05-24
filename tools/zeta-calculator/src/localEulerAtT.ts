import { C } from './complex'
import { formatComplex, zeta } from './zeta'
import { kpiCard, wrapAnalysisCard } from './analysisLayout'

const PRIME_CACHE: number[] = []

function ensurePrimes(count: number): number[] {
  if (PRIME_CACHE.length >= count) {
    return PRIME_CACHE.slice(0, count)
  }
  let candidate = PRIME_CACHE.length > 0 ? PRIME_CACHE[PRIME_CACHE.length - 1] + 1 : 2
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

export interface LocalEulerStep {
  index: number
  prime: number
  primeToMinusS: C
  cumPrimePowerProduct: C
  eulerFactorInverse: C
  cumEulerInverseProduct: C
  cumEulerProduct: C
  errorZetaEuler: number
  errorVsInvZeta: number
}

export interface LocalEulerAtTResult {
  s: C
  t: number
  zetaValue: C
  invZeta: C | null
  primeCount: number
  steps: LocalEulerStep[]
  note: string
}

export function analyzeLocalEulerAtT(s: C, primeCount = 25): LocalEulerAtTResult {
  const primes = ensurePrimes(Math.min(500, Math.max(3, primeCount)))
  const zetaValue = zeta(s).value
  const invZeta = zetaValue.abs() > 1e-14 ? C.one().div(zetaValue) : null

  let cumPrimePower = C.one()
  let cumEulerInverse = C.one()
  let cumEuler = C.one()
  const steps: LocalEulerStep[] = []

  for (let index = 0; index < primes.length; index += 1) {
    const prime = primes[index]
    const primeToMinusS = C.pow(prime, s.neg())
    const oneMinusP = C.one().sub(primeToMinusS)
    const eulerFactorInverse = oneMinusP.abs() > 1e-14 ? C.one().div(oneMinusP) : C.from(Number.NaN, Number.NaN)

    cumPrimePower = cumPrimePower.mul(primeToMinusS)
    cumEulerInverse = cumEulerInverse.mul(eulerFactorInverse)
    cumEuler = cumEuler.mul(oneMinusP)

    const zetaTimesEuler = zetaValue.mul(cumEuler)
    const errorZetaEuler = zetaTimesEuler.sub(C.one()).abs()
    const errorVsInvZeta =
      invZeta !== null ? cumEulerInverse.sub(invZeta).abs() : Number.POSITIVE_INFINITY

    steps.push({
      index: index + 1,
      prime,
      primeToMinusS,
      cumPrimePowerProduct: cumPrimePower,
      eulerFactorInverse,
      cumEulerInverseProduct: cumEulerInverse,
      cumEulerProduct: cumEuler,
      errorZetaEuler,
      errorVsInvZeta,
    })
  }

  let note = ''
  if (s.re > 1) {
    note =
      'Re(s)>1：∏_{p≤P}(1−p^{−s})^{−1} 應逼近 1/ζ(s)；|ζ·∏(1−p^{−s})−1| 應隨 P 增大而下降。∏ p^{−s} 只是每個 Euler 因子的首項，不是完整局部 Euler。'
  } else if (s.re > 0) {
    note =
      '0<Re(s)≤1：ζ 用解析延拓；截斷 Euler 僅作示意。∏ p^{−s} 與真實 Euler 乘積差得更遠。'
  } else {
    note = 'Re(s)≤0：截斷乘積與 ζ 的關係僅供直觀，不代表收斂域內的嚴格逼近。'
  }

  return {
    s,
    t: s.im,
    zetaValue,
    invZeta,
    primeCount: primes.length,
    steps,
    note,
  }
}

function renderStepTable(steps: LocalEulerStep[]): string {
  const header =
    '  #     p      |p^{-s}|     |∏p^{-s}|   |∏(1-p^{-s})^{-1}|  |1/ζ−∏Euler^{-1}|  |ζ·∏(1-p^{-s})−1|'
  const rows = steps.map((step) => {
    const invErr =
      step.errorVsInvZeta < Number.POSITIVE_INFINITY
        ? step.errorVsInvZeta.toExponential(2)
        : '—'
    return `${String(step.index).padStart(3)}  ${String(step.prime).padStart(5)}  ${step.primeToMinusS.abs().toExponential(3).padStart(10)}  ${step.cumPrimePowerProduct.abs().toExponential(3).padStart(11)}  ${step.cumEulerInverseProduct.abs().toExponential(3).padStart(18)}  ${invErr.padStart(16)}  ${step.errorZetaEuler.toExponential(2).padStart(16)}`
  })

  if (steps.length > 18) {
    return [header, ...rows.slice(0, 9), '  …', ...rows.slice(-5)].join('\n')
  }
  return [header, ...rows].join('\n')
}

export function drawLocalEulerChart(canvas: HTMLCanvasElement, result: LocalEulerAtTResult): void {
  const ctx = canvas.getContext('2d')
  if (!ctx || result.steps.length === 0) {
    return
  }

  const width = canvas.width
  const height = canvas.height
  const pad = { left: 56, right: 24, top: 36, bottom: 44 }
  const plotW = width - pad.left - pad.right
  const plotH = height - pad.top - pad.bottom
  const steps = result.steps

  const eulerErrors = steps.map((step) => Math.max(step.errorZetaEuler, 1e-16))
  const invErrors = steps.map((step) =>
    step.errorVsInvZeta < Number.POSITIVE_INFINITY ? Math.max(step.errorVsInvZeta, 1e-16) : 1e-16,
  )
  const yMax = Math.max(...eulerErrors, ...invErrors, 1e-6)
  const yMin = Math.min(...eulerErrors, ...invErrors)
  const logMax = Math.log10(yMax)
  const logMin = Math.min(-14, Math.log10(yMin))

  const toX = (index: number) => pad.left + (index / (steps.length - 1 || 1)) * plotW
  const toY = (error: number) => {
    const logY = Math.log10(Math.max(error, 1e-16))
    return pad.top + plotH - ((logY - logMin) / (logMax - logMin)) * plotH
  }

  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = '#0f1117'
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = '#f4f1ea'
  ctx.font = '600 16px "Space Grotesk", sans-serif'
  ctx.fillText(`固定 t=${result.t.toFixed(4)}：截斷 Euler 如何逼近（log₁₀ 誤差）`, pad.left, 24)

  ctx.strokeStyle = '#2d3444'
  for (let tick = 0; tick <= 4; tick += 1) {
    const y = pad.top + (plotH * tick) / 4
    ctx.beginPath()
    ctx.moveTo(pad.left, y)
    ctx.lineTo(pad.left + plotW, y)
    ctx.stroke()
    const logVal = logMax - ((logMax - logMin) * tick) / 4
    ctx.fillStyle = '#8b93a3'
    ctx.font = '11px "Space Grotesk", sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(logVal.toFixed(1), pad.left - 8, y + 4)
    ctx.textAlign = 'left'
  }

  const drawSeries = (values: number[], color: string, label: string) => {
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    values.forEach((value, index) => {
      const x = toX(index)
      const y = toY(value)
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()
    ctx.fillStyle = color
    ctx.font = '12px "Space Grotesk", sans-serif'
    const lastX = toX(values.length - 1)
    const lastY = toY(values[values.length - 1])
    ctx.fillText(label, lastX - 120, lastY - 8)
  }

  drawSeries(eulerErrors, '#7eb6ff', '|ζ·∏(1−p^{-s})−1|')
  drawSeries(invErrors, '#d4a574', '|∏(1−p^{-s})^{-1} − 1/ζ|')

  ctx.fillStyle = '#8b93a3'
  ctx.fillText('素数個數 P', pad.left + plotW / 2 - 24, height - 12)
}

export function renderLocalEulerAtTHtml(result: LocalEulerAtTResult): string {
  const last = result.steps[result.steps.length - 1]
  const chartId = 'local-euler-chart'

  return wrapAnalysisCard({
    title: `固定 t：前 P 個素數因子與局部 Euler`,
    tag: 'p',
    lead: `s = ${formatComplex(result.s)}，虛部 t = ${result.t.toFixed(4)} 固定。逐個乘上素數 p 的貢獻，看何時接近 ζ(s) 的 Euler 乘積形式。`,
    kpis: [
      kpiCard('ζ(s)', formatComplex(result.zetaValue, 8)),
      kpiCard('1/ζ(s)', result.invZeta ? formatComplex(result.invZeta, 8) : '—'),
      kpiCard('∏(1−p^{-s})^{-1}', formatComplex(last.cumEulerInverseProduct, 8)),
      kpiCard('|ζ·∏(1−p^{-s})−1|', last.errorZetaEuler.toExponential(4)),
    ].join(''),
    pattern: result.note,
    sections: [
      {
        title: '誤差隨素數個數 P',
        html: `<div class="chart-frame"><canvas id="${chartId}" width="920" height="280"></canvas></div>
          <p class="note">藍線：ζ 與 ∏(1−p^{−s}) 是否趨近 1。金線：∏(1−p^{−s})^{-1} 是否趨近 1/ζ。</p>`,
        open: true,
      },
      {
        title: '兩種乘積（不要混淆）',
        html: `<ul class="note-list">
          <li><strong>∏ p^{−s}</strong>（表中 |∏p^{-s}|）：把每個素數的單項 p^{−s} 相乘，<em>不是</em> Euler 乘積。</li>
          <li><strong>∏ (1−p^{−s})^{-1}</strong>：真正的局部 Euler；等於 ∏(1 + p^{-s} + p^{-2s} + ⋯)。</li>
          <li>每個 (1−p^{−s})^{-1} 展開後，<strong>首項</strong>才是 1+p^{-s}+…；單獨的 p^{-s} 只對應展開裡的一階片段。</li>
        </ul>`,
        open: true,
      },
      {
        title: `逐素數表（前 ${result.primeCount} 個）`,
        html: `<pre class="code-block">${renderStepTable(result.steps)}</pre>`,
      },
    ],
    footnote: '增大 P 時，在 Re(s)>1 區域藍線、金線應向下。臨界線 Re(s)=1/2 上為解析延拓示意。',
  })
}
