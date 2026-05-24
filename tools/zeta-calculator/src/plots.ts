import { C } from './complex'
import { findNontrivialZeros, riemannSiegelTheta, riemannSiegelZ, zeta } from './zeta'

export interface CriticalSpiralPoint {
  t: number
  re: number
  im: number
}

export interface SpiralPlotOptions {
  sigma?: number
  tMin?: number
  tMax?: number
  samples?: number
  zeroCount?: number
}

export interface PlotPoint {
  x: number
  y: number
}

export interface PlotSeries {
  label: string
  color: string
  points: PlotPoint[]
}

export interface PlotSpec {
  title: string
  subtitle?: string
  xLabel: string
  yLabel: string
  width?: number
  height?: number
  series: PlotSeries[]
  markers?: Array<{ x: number; y: number; label?: string }>
}

function sampleRange(min: number, max: number, count: number): number[] {
  const step = (max - min) / (count - 1)
  return Array.from({ length: count }, (_, index) => min + step * index)
}

export function buildCriticalLineSeries(tMax = 50, samples = 400): PlotSeries {
  const xs = sampleRange(0.5, tMax, samples)
  const points = xs.map((t) => ({
    x: t,
    y: riemannSiegelZ(t, 12000),
  }))
  return {
    label: 'Z(t)',
    color: '#d4a574',
    points,
  }
}

export function buildRealAxisSeries(sMin = -4, sMax = 6, samples = 500): PlotSeries {
  const xs = sampleRange(sMin, sMax, samples)
  const points: PlotPoint[] = []
  for (const s of xs) {
    if (Math.abs(s - 1) < 0.04) {
      continue
    }
    points.push({
      x: s,
      y: zeta(C.from(s, 0)).value.re,
    })
  }
  return {
    label: 'Re ζ(s)',
    color: '#8fd4a0',
    points,
  }
}

export function buildMagnitudeSeries(tMax = 50, samples = 400): PlotSeries {
  const xs = sampleRange(0.5, tMax, samples)
  const points = xs.map((t) => {
    const value = zeta(C.from(0.5, t)).value
    return {
      x: t,
      y: Math.log10(Math.max(value.abs(), 1e-12)),
    }
  })
  return {
    label: 'log10 |ζ(1/2+it)|',
    color: '#7eb6ff',
    points,
  }
}

export function buildZeroMarkers(count = 10): Array<{ x: number; y: number; label?: string }> {
  return findNontrivialZeros(count).map((zero) => ({
    x: zero.t,
    y: 0,
    label: `#${zero.index}`,
  }))
}

function zetaAlongLine(sigma: number, t: number): C {
  if (Math.abs(sigma - 0.5) < 1e-9) {
    return zetaCriticalFast(t)
  }
  return zeta(C.from(sigma, t)).value
}

function zetaCriticalFast(t: number): C {
  const s = C.from(0.5, t)
  const terms = Math.min(18000, Math.max(6000, Math.ceil(35 * Math.abs(t))))
  let sum = C.zero()
  for (let n = 1; n <= terms; n += 1) {
    const sign = n % 2 === 0 ? -1 : 1
    sum = sum.add(C.pow(n, s.neg()).mul(C.from(sign, 0)))
  }
  const factor = C.one().sub(C.pow(2, C.from(0.5, 0)))
  return sum.div(factor)
}

export function buildCriticalLineSpiral(options: SpiralPlotOptions = {}): CriticalSpiralPoint[] {
  const sigma = options.sigma ?? 0.5
  const tMin = options.tMin ?? 0.5
  const tMax = options.tMax ?? 50
  const samples = options.samples ?? 280
  const step = (tMax - tMin) / (samples - 1)
  const points: CriticalSpiralPoint[] = []

  for (let index = 0; index < samples; index += 1) {
    const t = tMin + step * index
    const value = zetaAlongLine(sigma, t)
    points.push({ t, re: value.re, im: value.im })
  }

  return points
}

export function drawSpiralToCanvas(canvas: HTMLCanvasElement, options: SpiralPlotOptions = {}): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }

  const width = canvas.width
  const height = canvas.height
  const padding = 64
  const plotSize = Math.min(width, height) - padding * 2
  const centerX = width / 2
  const centerY = height / 2
  const points = buildCriticalLineSpiral(options)
  const zeroCount = options.zeroCount ?? 10
  const zeros = findNontrivialZeros(zeroCount)

  const values = points.flatMap((point) => [point.re, point.im])
  for (const zero of zeros) {
    values.push(zero.zeta.re, zero.zeta.im)
  }

  let bound = Math.max(...values.map(Math.abs), 0.5)
  bound = Math.ceil(bound * 1.15 * 10) / 10

  const toX = (re: number) => centerX + (re / bound) * (plotSize / 2)
  const toY = (im: number) => centerY - (im / bound) * (plotSize / 2)

  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = '#0f1117'
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = '#f4f1ea'
  ctx.font = '600 24px "Space Grotesk", sans-serif'
  ctx.fillText('臨界線螺旋圖 ζ(1/2 + it)', padding, 34)
  ctx.fillStyle = '#a7b0c0'
  ctx.font = '14px "Space Grotesk", sans-serif'
  ctx.fillText('曲線為 t 增大時 ζ 在複平面上的軌跡；過原點即非平凡零點', padding, 58)

  ctx.strokeStyle = '#2d3444'
  ctx.lineWidth = 1
  for (let index = -3; index <= 3; index += 1) {
    if (index === 0) {
      continue
    }
    const x = toX(index * bound / 3)
    const y = toY(index * bound / 3)
    ctx.beginPath()
    ctx.moveTo(x, centerY - plotSize / 2)
    ctx.lineTo(x, centerY + plotSize / 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(centerX - plotSize / 2, y)
    ctx.lineTo(centerX + plotSize / 2, y)
    ctx.stroke()
  }

  ctx.strokeStyle = '#6f7888'
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(centerX - plotSize / 2, centerY)
  ctx.lineTo(centerX + plotSize / 2, centerY)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(centerX, centerY - plotSize / 2)
  ctx.lineTo(centerX, centerY + plotSize / 2)
  ctx.stroke()

  ctx.strokeStyle = 'rgba(212, 165, 116, 0.25)'
  ctx.setLineDash([4, 6])
  ctx.beginPath()
  ctx.arc(centerX, centerY, (plotSize / 2) * Math.min(1, 1 / bound), 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = '#d4a574'
  ctx.beginPath()
  ctx.arc(centerX, centerY, 4, 0, Math.PI * 2)
  ctx.fill()

  for (let index = 1; index < points.length; index += 1) {
    const prev = points[index - 1]
    const current = points[index]
    const ratio = index / (points.length - 1)
    const r = Math.round(212 + ratio * (126 - 212))
    const g = Math.round(165 + ratio * (200 - 165))
    const b = Math.round(116 + ratio * (255 - 116))
    ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(toX(prev.re), toY(prev.im))
    ctx.lineTo(toX(current.re), toY(current.im))
    ctx.stroke()
  }

  for (const zero of zeros) {
    if (zero.t > (options.tMax ?? 50)) {
      continue
    }
    const x = toX(zero.zeta.re)
    const y = toY(zero.zeta.im)
    ctx.fillStyle = '#f0c995'
    ctx.beginPath()
    ctx.arc(x, y, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#0f1117'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fillStyle = '#f0c995'
    ctx.font = '11px "IBM Plex Mono", monospace'
    ctx.fillText(`#${zero.index}`, x + 8, y - 8)
  }

  ctx.fillStyle = '#a7b0c0'
  ctx.font = '13px "IBM Plex Mono", monospace'
  ctx.fillText('Re ζ(s)', width / 2, height - 18)
  ctx.save()
  ctx.translate(18, height / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText('Im ζ(s)', 0, 0)
  ctx.restore()

  ctx.fillStyle = '#7eb6ff'
  ctx.font = '12px "IBM Plex Mono", monospace'
  ctx.fillText(`t: ${options.tMin ?? 0.5} → ${options.tMax ?? 50}`, padding, height - 18)
  ctx.fillText(`±${bound.toFixed(1)}`, width - padding - 40, centerY - plotSize / 2 - 8)
}

export interface PhasePoint {
  t: number
  phase: number
  magnitude: number
  siegelTheta: number
}

function unwrapPhases(phases: number[]): number[] {
  if (phases.length === 0) {
    return []
  }
  const unwrapped = [phases[0]]
  for (let index = 1; index < phases.length; index += 1) {
    let delta = phases[index] - phases[index - 1]
    while (delta > Math.PI) {
      delta -= 2 * Math.PI
    }
    while (delta < -Math.PI) {
      delta += 2 * Math.PI
    }
    unwrapped.push(unwrapped[index - 1] + delta)
  }
  return unwrapped
}

export function buildPhasePoints(options: SpiralPlotOptions = {}): PhasePoint[] {
  return buildCriticalLineSpiral(options).map((point) => {
    const magnitude = Math.hypot(point.re, point.im)
    return {
      t: point.t,
      phase: Math.atan2(point.im, point.re),
      magnitude,
      siegelTheta: riemannSiegelTheta(point.t),
    }
  })
}

/** Phase angle view: unit-circle rotation trail + arg ζ(t) vs t. */
export function drawPhaseAngleToCanvas(canvas: HTMLCanvasElement, options: SpiralPlotOptions = {}): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }

  const width = canvas.width
  const height = canvas.height
  const padding = 56
  const points = buildPhasePoints(options)
  const zeros = findNontrivialZeros(options.zeroCount ?? 10)
  const tMax = options.tMax ?? 50

  const unwrappedPhase = unwrapPhases(points.map((point) => point.phase))
  const alignedTheta = unwrapPhases(points.map((point) => -point.siegelTheta))

  const leftWidth = Math.floor(width * 0.42)
  const rightLeft = leftWidth + padding
  const rightWidth = width - rightLeft - padding
  const circleSize = Math.min(leftWidth - padding * 2, height - padding * 2 - 40)
  const circleX = padding + (leftWidth - padding) / 2
  const circleY = height / 2 + 10
  const circleR = circleSize / 2

  const graphTop = padding + 36
  const graphBottom = height - padding
  const graphHeight = graphBottom - graphTop
  const tMin = options.tMin ?? 0.5

  const phaseMin = Math.min(...unwrappedPhase, ...alignedTheta)
  const phaseMax = Math.max(...unwrappedPhase, ...alignedTheta)
  const phasePad = (phaseMax - phaseMin) * 0.08 || 0.5

  const toGraphX = (t: number) => rightLeft + ((t - tMin) / (tMax - tMin)) * rightWidth
  const toGraphY = (radians: number) =>
    graphBottom - ((radians - (phaseMin - phasePad)) / (phaseMax - phaseMin + 2 * phasePad)) * graphHeight

  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = '#0f1117'
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = '#f4f1ea'
  ctx.font = '600 22px "Space Grotesk", sans-serif'
  ctx.fillText('相位角視圖 arg ζ(1/2 + it)', padding, 30)
  ctx.fillStyle = '#a7b0c0'
  ctx.font = '13px "Space Grotesk", sans-serif'
  ctx.fillText('左：單位圓上的旋轉方向 e^{iφ}；右：φ(t) 隨 t 變化（零點時 |ζ|→0，角度無定義）', padding, 52)

  ctx.strokeStyle = '#6f7888'
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.arc(circleX, circleY, circleR, 0, Math.PI * 2)
  ctx.stroke()

  ctx.strokeStyle = '#2d3444'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(circleX - circleR, circleY)
  ctx.lineTo(circleX + circleR, circleY)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(circleX, circleY - circleR)
  ctx.lineTo(circleX, circleY + circleR)
  ctx.stroke()

  ctx.fillStyle = '#a7b0c0'
  ctx.font = '11px "IBM Plex Mono", monospace'
  ctx.fillText('Re', circleX + circleR + 6, circleY + 4)
  ctx.fillText('Im', circleX - 8, circleY - circleR - 6)

  for (let index = 1; index < points.length; index += 1) {
    const prev = points[index - 1]
    const current = points[index]
    if (prev.magnitude < 0.08 || current.magnitude < 0.08) {
      continue
    }
    const ratio = index / (points.length - 1)
    const r = Math.round(212 + ratio * (126 - 212))
    const g = Math.round(165 + ratio * (200 - 165))
    const b = Math.round(116 + ratio * (255 - 116))
    ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`
    ctx.lineWidth = 1.8
    ctx.beginPath()
    ctx.moveTo(circleX + circleR * Math.cos(prev.phase), circleY - circleR * Math.sin(prev.phase))
    ctx.lineTo(circleX + circleR * Math.cos(current.phase), circleY - circleR * Math.sin(current.phase))
    ctx.stroke()
  }

  for (const point of points) {
    if (point.magnitude < 0.08) {
      continue
    }
    const x = circleX + circleR * Math.cos(point.phase)
    const y = circleY - circleR * Math.sin(point.phase)
    ctx.fillStyle = 'rgba(126, 182, 255, 0.35)'
    ctx.beginPath()
    ctx.arc(x, y, 2.2, 0, Math.PI * 2)
    ctx.fill()
  }

  const tip = points[points.length - 1]
  if (tip.magnitude >= 0.08) {
    const tipX = circleX + circleR * Math.cos(tip.phase)
    const tipY = circleY - circleR * Math.sin(tip.phase)
    ctx.strokeStyle = '#f0c995'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(circleX, circleY)
    ctx.lineTo(tipX, tipY)
    ctx.stroke()
    ctx.fillStyle = '#f0c995'
    ctx.beginPath()
    ctx.arc(tipX, tipY, 5, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.fillStyle = '#a7b0c0'
  ctx.font = '12px "Space Grotesk", sans-serif'
  ctx.fillText('單位圓：arg ζ', circleX - 42, graphTop - 12)

  ctx.strokeStyle = '#2d3444'
  for (let index = 0; index <= 5; index += 1) {
    const y = graphTop + (graphHeight * index) / 5
    ctx.beginPath()
    ctx.moveTo(rightLeft, y)
    ctx.lineTo(width - padding, y)
    ctx.stroke()
  }

  ctx.strokeStyle = '#6f7888'
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(rightLeft, graphBottom)
  ctx.lineTo(width - padding, graphBottom)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(rightLeft, graphTop)
  ctx.lineTo(rightLeft, graphBottom)
  ctx.stroke()

  ctx.strokeStyle = '#8fd4a0'
  ctx.lineWidth = 2.2
  ctx.beginPath()
  let started = false
  for (let index = 0; index < points.length; index += 1) {
    if (points[index].magnitude < 0.05) {
      started = false
      continue
    }
    const x = toGraphX(points[index].t)
    const y = toGraphY(unwrappedPhase[index])
    if (!started) {
      ctx.moveTo(x, y)
      started = true
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.stroke()

  ctx.strokeStyle = '#7eb6ff'
  ctx.setLineDash([6, 5])
  ctx.lineWidth = 1.8
  ctx.beginPath()
  points.forEach((point, index) => {
    const x = toGraphX(point.t)
    const y = toGraphY(alignedTheta[index])
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.stroke()
  ctx.setLineDash([])

  for (const zero of zeros) {
    if (zero.t > tMax) {
      continue
    }
    const x = toGraphX(zero.t)
    ctx.strokeStyle = 'rgba(240, 201, 149, 0.55)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x, graphTop)
    ctx.lineTo(x, graphBottom)
    ctx.stroke()
    ctx.fillStyle = '#f0c995'
    ctx.font = '10px "IBM Plex Mono", monospace'
    ctx.fillText(`#${zero.index}`, x + 3, graphTop + 12)
  }

  ctx.fillStyle = '#8fd4a0'
  ctx.font = '12px "IBM Plex Mono", monospace'
  ctx.fillText('arg ζ (解纏繞)', rightLeft + 8, graphTop + 14)
  ctx.fillStyle = '#7eb6ff'
  ctx.fillText('−θ(t) Riemann–Siegel', rightLeft + 130, graphTop + 14)

  ctx.fillStyle = '#a7b0c0'
  ctx.fillText('t', (rightLeft + width - padding) / 2, height - 16)
  ctx.save()
  ctx.translate(rightLeft - 14, (graphTop + graphBottom) / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText('弧度', 0, 0)
  ctx.restore()

  ctx.fillStyle = '#d4a574'
  ctx.font = '11px "IBM Plex Mono", monospace'
  const deg = ((tip.phase * 180) / Math.PI).toFixed(1)
  ctx.fillText(`當前 φ ≈ ${deg}°`, circleX - 52, circleY + circleR + 24)
  ctx.fillText(`Hardy: e^{iθ}ζ 為實數 ⇒ arg ζ ≡ −θ (mod π)`, padding, height - 16)
}

export interface PhaseSweepPoint {
  t: number
  phase: number
  phaseUnwrapped: number
  magnitude: number
  omega: number | null
  termPhaseSlope: number
}

/** Build arg ζ(σ+it) along t with numerical ω = dφ/dt. */
export function buildPhaseSweepPoints(options: SpiralPlotOptions = {}): PhaseSweepPoint[] {
  const sigma = options.sigma ?? 0.5
  const spiral = buildCriticalLineSpiral({ ...options, sigma })
  const rawPhases = spiral.map((point) => Math.atan2(point.im, point.re))
  const unwrapped = unwrapPhases(rawPhases)
  const points: PhaseSweepPoint[] = []

  for (let index = 0; index < spiral.length; index += 1) {
    const { t, re, im } = spiral[index]
    const magnitude = Math.hypot(re, im)
    let omega: number | null = null
    if (index > 0 && index < spiral.length - 1) {
      const dt = spiral[index + 1].t - spiral[index - 1].t
      omega = magnitude >= 0.03 ? (unwrapped[index + 1] - unwrapped[index - 1]) / dt : null
    }
    points.push({
      t,
      phase: rawPhases[index],
      phaseUnwrapped: unwrapped[index],
      magnitude,
      omega,
      termPhaseSlope: -t * Math.log(2),
    })
  }

  return points
}

/** Fixed σ, sweep t: phase vs t and |ζ|, ω = dφ/dt (links Im(s) size to rotation speed). */
export function drawPhaseSigmaSweepToCanvas(
  canvas: HTMLCanvasElement,
  options: SpiralPlotOptions = {},
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }

  const sigma = options.sigma ?? 0.5
  const tMin = options.tMin ?? 0.5
  const tMax = options.tMax ?? 50
  const points = buildPhaseSweepPoints(options)
  if (points.length < 2) {
    return
  }

  const width = canvas.width
  const height = canvas.height
  const pad = { left: 58, right: 58, top: 72, bottom: 48 }
  const splitY = Math.floor(height * 0.56)
  const top = { ...pad, bottom: height - (height - splitY) - 12 }
  const bottom = { left: pad.left, right: pad.right, top: splitY + 28, bottom: height - pad.bottom }

  const topW = width - top.left - top.right
  const topH = splitY - top.top - 8
  const botW = width - bottom.left - bottom.right
  const botH = height - bottom.top - bottom.bottom

  const phaseDeg = points.map((point) => (point.phaseUnwrapped * 180) / Math.PI)
  const phaseMin = Math.min(...phaseDeg)
  const phaseMax = Math.max(...phaseDeg)
  const phasePad = (phaseMax - phaseMin) * 0.06 || 10

  const logMag = points.map((point) => Math.log10(Math.max(point.magnitude, 1e-12)))
  const logMin = Math.min(...logMag)
  const logMax = Math.max(...logMag)

  const omegas = points.map((point) => point.omega).filter((value): value is number => value !== null)
  const omegaMin = omegas.length > 0 ? Math.min(...omegas) : 0
  const omegaMax = omegas.length > 0 ? Math.max(...omegas) : 1
  const omegaPad = (omegaMax - omegaMin) * 0.08 || 0.5

  const toTopX = (t: number) => top.left + ((t - tMin) / (tMax - tMin)) * topW
  const toTopY = (deg: number) =>
    top.top + topH - ((deg - (phaseMin - phasePad)) / (phaseMax - phaseMin + 2 * phasePad)) * topH
  const toBotX = (t: number) => bottom.left + ((t - tMin) / (tMax - tMin)) * botW
  const toLogY = (value: number) =>
    bottom.top + botH - ((value - logMin) / (logMax - logMin || 1)) * botH
  const toOmegaY = (omega: number) =>
    bottom.top + botH - ((omega - (omegaMin - omegaPad)) / (omegaMax - omegaMin + 2 * omegaPad)) * botH

  const onCriticalLine = Math.abs(sigma - 0.5) < 0.01
  const zeros = onCriticalLine ? findNontrivialZeros(options.zeroCount ?? 10) : []

  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = '#0f1117'
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = '#f4f1ea'
  ctx.font = '600 20px "Space Grotesk", sans-serif'
  ctx.fillText(`固定 σ=${sigma.toFixed(3)}：相位與 t（Im(s) 大小）`, pad.left, 28)
  ctx.fillStyle = '#a7b0c0'
  ctx.font = '13px "Space Grotesk", sans-serif'
  ctx.fillText(
    '上：arg ζ(σ+it) 展开；下：|ζ|（蓝）与 ω=dφ/dt（金）。t 越大，项 n^{-s} 相位 -t ln n 转得越快。',
    pad.left,
    50,
  )

  ctx.strokeStyle = '#2d3444'
  ctx.lineWidth = 1
  for (let tick = 0; tick <= 4; tick += 1) {
    const y = top.top + (topH * tick) / 4
    ctx.beginPath()
    ctx.moveTo(top.left, y)
    ctx.lineTo(top.left + topW, y)
    ctx.stroke()
  }

  ctx.strokeStyle = '#7eb6ff'
  ctx.lineWidth = 2.2
  ctx.beginPath()
  points.forEach((point, index) => {
    const x = toTopX(point.t)
    const y = toTopY((point.phaseUnwrapped * 180) / Math.PI)
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.stroke()

  if (onCriticalLine) {
    ctx.strokeStyle = 'rgba(212, 165, 116, 0.45)'
    ctx.setLineDash([4, 5])
    for (const zero of zeros) {
      if (zero.t < tMin || zero.t > tMax) {
        continue
      }
      const x = toTopX(zero.t)
      ctx.beginPath()
      ctx.moveTo(x, top.top)
      ctx.lineTo(x, top.top + topH)
      ctx.stroke()
    }
    ctx.setLineDash([])
  }

  ctx.fillStyle = '#8b93a3'
  ctx.font = '11px "Space Grotesk", sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('φ (度)', top.left - 8, top.top + 12)
  ctx.textAlign = 'left'

  ctx.fillStyle = '#a7b0c0'
  ctx.font = '600 14px "Space Grotesk", sans-serif'
  ctx.fillText('下：模长与相位转速', bottom.left, bottom.top - 10)

  ctx.strokeStyle = '#7eb6ff'
  ctx.lineWidth = 1.8
  ctx.beginPath()
  points.forEach((point, index) => {
    const x = toBotX(point.t)
    const y = toLogY(Math.log10(Math.max(point.magnitude, 1e-12)))
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.stroke()

  ctx.strokeStyle = '#d4a574'
  ctx.lineWidth = 1.8
  ctx.beginPath()
  let started = false
  for (const point of points) {
    if (point.omega === null) {
      started = false
      continue
    }
    const x = toBotX(point.t)
    const y = toOmegaY(point.omega)
    if (!started) {
      ctx.moveTo(x, y)
      started = true
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.stroke()

  ctx.strokeStyle = 'rgba(143, 212, 160, 0.35)'
  ctx.setLineDash([3, 5])
  ctx.lineWidth = 1
  ctx.beginPath()
  points.forEach((point, index) => {
    const x = toBotX(point.t)
    const y = toOmegaY(-point.termPhaseSlope)
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = '#7eb6ff'
  ctx.font = '11px "Space Grotesk", sans-serif'
  ctx.fillText('log₁₀|ζ|', bottom.left, bottom.top + 14)
  ctx.fillStyle = '#d4a574'
  ctx.fillText('ω=dφ/dt', bottom.left + 72, bottom.top + 14)
  ctx.fillStyle = '#8fd4a0'
  ctx.fillText('参考 −t ln 2（n=2 项相位斜率）', bottom.left + 160, bottom.top + 14)

  ctx.fillStyle = '#8b93a3'
  ctx.textAlign = 'center'
  ctx.fillText('t = Im(s)', bottom.left + botW / 2, height - 18)
  ctx.textAlign = 'left'
}

export interface FrequencyPoint {
  t: number
  omegaZeta: number | null
  omegaTheta: number
  magnitude: number
}

const PRIME_FREQUENCIES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]

/** Instantaneous angular frequency ω = dφ/dt from unwrapped arg ζ. */
export function buildFrequencyPoints(options: SpiralPlotOptions = {}): FrequencyPoint[] {
  const points = buildPhasePoints(options)
  const unwrapped = unwrapPhases(points.map((point) => point.phase))
  const output: FrequencyPoint[] = []

  for (let index = 0; index < points.length; index += 1) {
    const current = points[index]
    if (index === 0 || index === points.length - 1) {
      output.push({
        t: current.t,
        omegaZeta: null,
        omegaTheta:
          index === 0
            ? (points[1].siegelTheta - points[0].siegelTheta) / (points[1].t - points[0].t)
            : (points[index].siegelTheta - points[index - 1].siegelTheta) /
              (points[index].t - points[index - 1].t),
        magnitude: current.magnitude,
      })
      continue
    }

    const dt = points[index + 1].t - points[index - 1].t
    const omegaZeta =
      current.magnitude >= 0.05 ? (unwrapped[index + 1] - unwrapped[index - 1]) / dt : null
    const omegaTheta = (points[index + 1].siegelTheta - points[index - 1].siegelTheta) / dt

    output.push({
      t: current.t,
      omegaZeta,
      omegaTheta,
      magnitude: current.magnitude,
    })
  }

  return output
}

export function primeAngularFrequency(p: number): number {
  return Math.log(p)
}

export function primeCycleFrequency(p: number): number {
  return Math.log(p) / (2 * Math.PI)
}

export function phaseToAngularFrequencyForTerm(n: number): number {
  return Math.log(n)
}

/** Frequency view: ω = dφ/dt and prime spectrum log p. */
export function drawFrequencyToCanvas(canvas: HTMLCanvasElement, options: SpiralPlotOptions = {}): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }

  const width = canvas.width
  const height = canvas.height
  const padding = 56
  const tMax = options.tMax ?? 50
  const tMin = options.tMin ?? 0.5
  const freqPoints = buildFrequencyPoints(options)
  const zeros = findNontrivialZeros(options.zeroCount ?? 10)

  const leftWidth = Math.floor(width * 0.38)
  const rightLeft = leftWidth + padding
  const rightWidth = width - rightLeft - padding
  const spectrumTop = padding + 36
  const spectrumBottom = height - padding - 8
  const spectrumHeight = spectrumBottom - spectrumTop
  const barAreaLeft = padding + 8
  const barAreaWidth = leftWidth - padding - 16

  const graphTop = padding + 36
  const graphBottom = height - padding
  const graphHeight = graphBottom - graphTop

  const omegaValues = freqPoints
    .flatMap((point) => [point.omegaZeta, point.omegaTheta])
    .filter((value): value is number => value !== null && Number.isFinite(value))
  const omegaMin = Math.min(...omegaValues, 0)
  const omegaMax = Math.max(...omegaValues, Math.log(2))
  const omegaPad = (omegaMax - omegaMin) * 0.08 || 0.2

  const toGraphX = (t: number) => rightLeft + ((t - tMin) / (tMax - tMin)) * rightWidth
  const toGraphY = (omega: number) =>
    graphBottom - ((omega - (omegaMin - omegaPad)) / (omegaMax - omegaMin + 2 * omegaPad)) * graphHeight

  const maxPrimeFreq = Math.log(PRIME_FREQUENCIES[PRIME_FREQUENCIES.length - 1])

  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = '#0f1117'
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = '#f4f1ea'
  ctx.font = '600 22px "Space Grotesk", sans-serif'
  ctx.fillText('相位 → 頻率  ω = dφ/dt', padding, 30)
  ctx.fillStyle = '#a7b0c0'
  ctx.font = '13px "Space Grotesk", sans-serif'
  ctx.fillText('單項 n^{−s}：φ=−t log n ⇒ ω=log n；右圖為 arg ζ 的瞬時角頻率', padding, 52)

  ctx.fillStyle = '#a7b0c0'
  ctx.font = '12px "Space Grotesk", sans-serif'
  ctx.fillText('素數本征頻率 ω_p = log p', barAreaLeft, spectrumTop - 10)

  PRIME_FREQUENCIES.forEach((prime, index) => {
    const omega = primeAngularFrequency(prime)
    const cycles = primeCycleFrequency(prime)
    const barHeight = (omega / maxPrimeFreq) * (spectrumHeight - 24)
    const barWidth = Math.max(10, barAreaWidth / PRIME_FREQUENCIES.length - 4)
    const x = barAreaLeft + index * (barWidth + 4)
    const y = spectrumBottom - barHeight

    ctx.fillStyle = index % 2 === 0 ? '#d4a574' : '#8fd4a0'
    ctx.fillRect(x, y, barWidth, barHeight)

    ctx.fillStyle = '#a7b0c0'
    ctx.font = '9px "IBM Plex Mono", monospace'
    ctx.fillText(String(prime), x + 2, spectrumBottom + 12)
    if (index < 8) {
      ctx.fillText(cycles.toFixed(2), x, y - 4)
    }
  })

  ctx.fillStyle = '#7eb6ff'
  ctx.font = '10px "IBM Plex Mono", monospace'
  ctx.fillText('f_p=ω_p/2π (周/t)', barAreaLeft, spectrumTop + 14)

  ctx.strokeStyle = '#2d3444'
  for (let index = 0; index <= 4; index += 1) {
    const y = graphTop + (graphHeight * index) / 4
    ctx.beginPath()
    ctx.moveTo(rightLeft, y)
    ctx.lineTo(width - padding, y)
    ctx.stroke()
  }

  ctx.strokeStyle = '#6f7888'
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(rightLeft, graphBottom)
  ctx.lineTo(width - padding, graphBottom)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(rightLeft, graphTop)
  ctx.lineTo(rightLeft, graphBottom)
  ctx.stroke()

  ctx.strokeStyle = '#8fd4a0'
  ctx.lineWidth = 2.2
  ctx.beginPath()
  let started = false
  for (const point of freqPoints) {
    if (point.omegaZeta === null) {
      started = false
      continue
    }
    const x = toGraphX(point.t)
    const y = toGraphY(point.omegaZeta)
    if (!started) {
      ctx.moveTo(x, y)
      started = true
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.stroke()

  ctx.strokeStyle = '#7eb6ff'
  ctx.setLineDash([6, 5])
  ctx.lineWidth = 1.8
  ctx.beginPath()
  freqPoints.forEach((point, index) => {
    const x = toGraphX(point.t)
    const y = toGraphY(point.omegaTheta)
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.stroke()
  ctx.setLineDash([])

  for (const prime of PRIME_FREQUENCIES.slice(0, 8)) {
    const y = toGraphY(primeAngularFrequency(prime))
    ctx.strokeStyle = 'rgba(212, 165, 116, 0.18)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(rightLeft, y)
    ctx.lineTo(width - padding, y)
    ctx.stroke()
  }

  for (const zero of zeros) {
    if (zero.t > tMax) {
      continue
    }
    const x = toGraphX(zero.t)
    ctx.strokeStyle = 'rgba(240, 201, 149, 0.55)'
    ctx.beginPath()
    ctx.moveTo(x, graphTop)
    ctx.lineTo(x, graphBottom)
    ctx.stroke()
  }

  ctx.fillStyle = '#8fd4a0'
  ctx.font = '12px "IBM Plex Mono", monospace'
  ctx.fillText('ω_ζ = d(arg ζ)/dt', rightLeft + 8, graphTop + 14)
  ctx.fillStyle = '#7eb6ff'
  ctx.fillText('ω_θ = dθ/dt', rightLeft + 150, graphTop + 14)
  ctx.fillStyle = '#d4a574'
  ctx.fillText('參考線 ω=log p', rightLeft + 280, graphTop + 14)

  ctx.fillStyle = '#a7b0c0'
  ctx.fillText('t (= Im s)', (rightLeft + width - padding) / 2, height - 16)
  ctx.save()
  ctx.translate(rightLeft - 14, (graphTop + graphBottom) / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText('角頻率 ω (弧度/t)', 0, 0)
  ctx.restore()

  ctx.fillStyle = '#d4a574'
  ctx.font = '11px "IBM Plex Mono", monospace'
  ctx.fillText('φ=−t log n  →  ω=dφ/dt=log n  →  f=log n/(2π)', padding, height - 16)
}

export function renderCriticalLineSpiralSvg(options: SpiralPlotOptions = {}): string {
  const width = 960
  const height = 520
  const padding = 64
  const plotSize = Math.min(width, height) - padding * 2
  const centerX = width / 2
  const centerY = height / 2
  const points = buildCriticalLineSpiral(options)
  const zeros = findNontrivialZeros(options.zeroCount ?? 10)

  const values = points.flatMap((point) => [point.re, point.im])
  let bound = Math.max(...values.map(Math.abs), 0.5)
  bound = Math.ceil(bound * 1.15 * 10) / 10

  const toX = (re: number) => centerX + (re / bound) * (plotSize / 2)
  const toY = (im: number) => centerY - (im / bound) * (plotSize / 2)

  const path = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${toX(point.re).toFixed(2)} ${toY(point.im).toFixed(2)}`)
    .join(' ')

  const zeroMarkers = zeros
    .filter((zero) => zero.t <= (options.tMax ?? 50))
    .map(
      (zero) => `
      <circle cx="${toX(zero.zeta.re)}" cy="${toY(zero.zeta.im)}" r="6" fill="#f0c995" />
      <text x="${toX(zero.zeta.re) + 8}" y="${toY(zero.zeta.im) - 8}" fill="#f0c995" font-size="11">#${zero.index}</text>
    `,
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#0f1117" />
  <text x="${padding}" y="34" fill="#f4f1ea" font-size="24" font-family="Space Grotesk, sans-serif">臨界線螺旋圖 ζ(1/2 + it)</text>
  <text x="${padding}" y="58" fill="#a7b0c0" font-size="14" font-family="Space Grotesk, sans-serif">t 增大時 ζ 在複平面繞行；過原點為非平凡零點</text>
  <line x1="${centerX - plotSize / 2}" y1="${centerY}" x2="${centerX + plotSize / 2}" y2="${centerY}" stroke="#6f7888" stroke-width="1.2" />
  <line x1="${centerX}" y1="${centerY - plotSize / 2}" x2="${centerX}" y2="${centerY + plotSize / 2}" stroke="#6f7888" stroke-width="1.2" />
  <circle cx="${centerX}" cy="${centerY}" r="${(plotSize / 2) * Math.min(1, 1 / bound)}" fill="none" stroke="rgba(212,165,116,0.25)" stroke-dasharray="4 6" />
  <circle cx="${centerX}" cy="${centerY}" r="4" fill="#d4a574" />
  <path d="${path}" fill="none" stroke="#d4a574" stroke-width="2.2" />
  ${zeroMarkers}
  <text x="${width / 2}" y="${height - 16}" fill="#a7b0c0" font-size="13" text-anchor="middle">Re ζ(s)</text>
  <text x="18" y="${height / 2}" fill="#a7b0c0" font-size="13" transform="rotate(-90 18 ${height / 2})" text-anchor="middle">Im ζ(s)</text>
</svg>`
}

function scale(value: number, min: number, max: number, size: number, padding: number): number {
  if (max === min) {
    return padding + size / 2
  }
  return padding + ((value - min) / (max - min)) * size
}

function pathFromPoints(
  points: PlotPoint[],
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  width: number,
  height: number,
  padding: number,
): string {
  return points
    .map((point, index) => {
      const x = scale(point.x, xMin, xMax, width - padding * 2, padding)
      const y = height - padding - scale(point.y, yMin, yMax, height - padding * 2, padding)
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

export function renderPlotSvg(spec: PlotSpec): string {
  const width = spec.width ?? 960
  const height = spec.height ?? 520
  const padding = 56
  const allPoints = spec.series.flatMap((series) => series.points)
  const markerYs = spec.markers?.map((marker) => marker.y) ?? []
  const xMin = Math.min(...allPoints.map((point) => point.x), ...(spec.markers?.map((m) => m.x) ?? []))
  const xMax = Math.max(...allPoints.map((point) => point.x), ...(spec.markers?.map((m) => m.x) ?? []))
  const yMin = Math.min(...allPoints.map((point) => point.y), ...markerYs) * 1.08
  const yMax = Math.max(...allPoints.map((point) => point.y), ...markerYs) * 1.08
  const zeroY = height - padding - scale(0, yMin, yMax, height - padding * 2, padding)

  const gridLines = Array.from({ length: 6 }, (_, index) => {
    const yValue = yMin + ((yMax - yMin) * index) / 5
    const y = height - padding - scale(yValue, yMin, yMax, height - padding * 2, padding)
    return `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="#2d3444" stroke-width="1" />`
  }).join('')

  const paths = spec.series
    .map(
      (series) => `
      <path
        d="${pathFromPoints(series.points, xMin, xMax, yMin, yMax, width, height, padding)}"
        fill="none"
        stroke="${series.color}"
        stroke-width="2.2"
      />
      <text x="${width - padding - 8}" y="${padding + 18 + spec.series.indexOf(series) * 18}" fill="${series.color}" font-size="13" text-anchor="end">${series.label}</text>
    `,
    )
    .join('')

  const markers = (spec.markers ?? [])
    .map((marker) => {
      const x = scale(marker.x, xMin, xMax, width - padding * 2, padding)
      return `
        <circle cx="${x}" cy="${zeroY}" r="4.5" fill="#f0c995" />
        ${
          marker.label
            ? `<text x="${x}" y="${zeroY - 10}" fill="#f0c995" font-size="11" text-anchor="middle">${marker.label}</text>`
            : ''
        }
      `
    })
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#0f1117" />
  <text x="${padding}" y="34" fill="#f4f1ea" font-size="24" font-family="Space Grotesk, sans-serif">${spec.title}</text>
  ${
    spec.subtitle
      ? `<text x="${padding}" y="58" fill="#a7b0c0" font-size="14" font-family="Space Grotesk, sans-serif">${spec.subtitle}</text>`
      : ''
  }
  ${gridLines}
  <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#6f7888" stroke-width="1.2" />
  <line x1="${padding}" y1="${padding + 20}" x2="${padding}" y2="${height - padding}" stroke="#6f7888" stroke-width="1.2" />
  <line x1="${padding}" y1="${zeroY}" x2="${width - padding}" y2="${zeroY}" stroke="#d4a574" stroke-width="1" stroke-dasharray="5 6" opacity="0.55" />
  ${paths}
  ${markers}
  <text x="${width / 2}" y="${height - 16}" fill="#a7b0c0" font-size="13" text-anchor="middle">${spec.xLabel}</text>
  <text x="18" y="${height / 2}" fill="#a7b0c0" font-size="13" transform="rotate(-90 18 ${height / 2})" text-anchor="middle">${spec.yLabel}</text>
</svg>`
}

export function renderCriticalLinePlot(): string {
  return renderPlotSvg({
    title: 'Hardy Z(t) on the critical line',
    subtitle: 'Zeros occur where Z(t) = 0, equivalently ζ(1/2 + it) = 0',
    xLabel: 't',
    yLabel: 'Z(t)',
    series: [buildCriticalLineSeries(50, 420)],
    markers: buildZeroMarkers(10),
  })
}

export function renderRealAxisPlot(): string {
  return renderPlotSvg({
    title: 'Riemann ζ(s) on the real axis',
    subtitle: 'Pole at s = 1 omitted; special values include ζ(0) = −1/2 and ζ(2) = π²/6',
    xLabel: 's (real)',
    yLabel: 'ζ(s)',
    series: [buildRealAxisSeries(-4, 6, 520)],
  })
}

export function renderMagnitudePlot(): string {
  return renderPlotSvg({
    title: 'log10 |ζ(1/2 + it)|',
    subtitle: 'Deep dips near non-trivial zeros on the critical line',
    xLabel: 't',
    yLabel: 'log10 |ζ(1/2 + it)|',
    series: [buildMagnitudeSeries(50, 420)],
    markers: buildZeroMarkers(10),
  })
}

export function drawPlotToCanvas(canvas: HTMLCanvasElement, spec: PlotSpec): void {
  const svg = renderPlotSvg({ ...spec, width: canvas.width, height: canvas.height })
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const image = new Image()
  image.onload = () => {
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      URL.revokeObjectURL(url)
      return
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(image, 0, 0)
    URL.revokeObjectURL(url)
  }
  image.src = url
}

export function downloadCanvasPng(canvas: HTMLCanvasElement, filename: string): void {
  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL('image/png')
  link.click()
}
