import { C } from './complex'
import { findNontrivialZeros, zeta } from './zeta'

export interface ZetaMagnitudeIntegralOptions {
  tMin?: number
  tMax?: number
  samples?: number
}

export interface ZetaMagnitudeIntegralResult {
  tMin: number
  tMax: number
  integral: number
  averageMagnitude: number
  minMagnitude: number
  maxMagnitude: number
  argMinT: number
  sampleCount: number
  zeroCount: number
  points: Array<{ t: number; magnitude: number }>
}

export function zetaCriticalMagnitude(t: number): number {
  return zeta(C.from(0.5, t)).value.abs()
}

export function integrateZetaMagnitude(
  options: ZetaMagnitudeIntegralOptions = {},
): ZetaMagnitudeIntegralResult {
  const tMin = options.tMin ?? 0.5
  const tMax = options.tMax ?? 50
  const samples = Math.max(32, options.samples ?? 800)
  const step = (tMax - tMin) / (samples - 1)
  const points: Array<{ t: number; magnitude: number }> = []

  let integral = 0
  let minMagnitude = Number.POSITIVE_INFINITY
  let maxMagnitude = 0
  let argMinT = tMin

  for (let index = 0; index < samples; index += 1) {
    const t = tMin + step * index
    const magnitude = zetaCriticalMagnitude(t)
    points.push({ t, magnitude })
    if (magnitude < minMagnitude) {
      minMagnitude = magnitude
      argMinT = t
    }
    maxMagnitude = Math.max(maxMagnitude, magnitude)
  }

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1]
    const current = points[index]
    const deltaT = current.t - previous.t
    integral += 0.5 * (previous.magnitude + current.magnitude) * deltaT
  }

  const span = Math.max(tMax - tMin, 1e-12)
  const zeros = findNontrivialZeros(30).filter((zero) => zero.t >= tMin && zero.t <= tMax)

  return {
    tMin,
    tMax,
    integral,
    averageMagnitude: integral / span,
    minMagnitude,
    maxMagnitude,
    argMinT,
    sampleCount: samples,
    zeroCount: zeros.length,
    points,
  }
}

export function formatIntegralValue(value: number): string {
  if (!Number.isFinite(value)) {
    return '—'
  }
  if (Math.abs(value) >= 1e6 || (Math.abs(value) > 0 && Math.abs(value) < 1e-5)) {
    return value.toExponential(6)
  }
  return value.toFixed(6)
}

export function drawZetaMagnitudeAreaToCanvas(
  canvas: HTMLCanvasElement,
  options: ZetaMagnitudeIntegralOptions = {},
): ZetaMagnitudeIntegralResult {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return integrateZetaMagnitude(options)
  }

  const width = canvas.width
  const height = canvas.height
  const padding = { left: 72, right: 28, top: 88, bottom: 56 }
  const plotWidth = width - padding.left - padding.right
  const plotHeight = height - padding.top - padding.bottom
  const result = integrateZetaMagnitude(options)
  const { points, tMin, tMax } = result

  const magnitudes = points.map((point) => point.magnitude)
  let yMax = Math.max(...magnitudes, 0.5)
  yMax = Math.ceil(yMax * 1.12 * 10) / 10

  const toX = (t: number) => padding.left + ((t - tMin) / (tMax - tMin)) * plotWidth
  const toY = (magnitude: number) => padding.top + plotHeight - (magnitude / yMax) * plotHeight

  const zeros = findNontrivialZeros(30).filter((zero) => zero.t >= tMin && zero.t <= tMax)

  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = '#0f1117'
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = '#f4f1ea'
  ctx.font = '600 22px "Space Grotesk", sans-serif'
  ctx.fillText('|ζ(1/2 + it)| 與 t 軸下面積', padding.left, 34)
  ctx.fillStyle = '#a7b0c0'
  ctx.font = '13px "Space Grotesk", sans-serif'
  ctx.fillText(
    `∫_{${tMin.toFixed(2)}}^{${tMax.toFixed(2)}} |ζ(1/2+it)| dt ≈ ${formatIntegralValue(result.integral)}（梯形法，${result.sampleCount} 點）`,
    padding.left,
    58,
  )

  ctx.strokeStyle = '#2d3444'
  ctx.lineWidth = 1
  for (let tick = 0; tick <= 4; tick += 1) {
    const y = padding.top + (plotHeight * tick) / 4
    ctx.beginPath()
    ctx.moveTo(padding.left, y)
    ctx.lineTo(padding.left + plotWidth, y)
    ctx.stroke()
  }

  ctx.strokeStyle = '#6f7888'
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.moveTo(padding.left, padding.top + plotHeight)
  ctx.lineTo(padding.left + plotWidth, padding.top + plotHeight)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(padding.left, padding.top)
  ctx.lineTo(padding.left, padding.top + plotHeight)
  ctx.stroke()

  ctx.fillStyle = 'rgba(126, 182, 255, 0.22)'
  ctx.beginPath()
  ctx.moveTo(toX(points[0].t), padding.top + plotHeight)
  for (const point of points) {
    ctx.lineTo(toX(point.t), toY(point.magnitude))
  }
  ctx.lineTo(toX(points[points.length - 1].t), padding.top + plotHeight)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = '#7eb6ff'
  ctx.lineWidth = 2.2
  ctx.beginPath()
  ctx.moveTo(toX(points[0].t), toY(points[0].magnitude))
  for (let index = 1; index < points.length; index += 1) {
    ctx.lineTo(toX(points[index].t), toY(points[index].magnitude))
  }
  ctx.stroke()

  for (const zero of zeros) {
    const x = toX(zero.t)
    ctx.strokeStyle = 'rgba(212, 165, 116, 0.55)'
    ctx.setLineDash([4, 5])
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x, padding.top)
    ctx.lineTo(x, padding.top + plotHeight)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = '#d4a574'
    ctx.beginPath()
    ctx.arc(x, toY(0), 4, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.fillStyle = '#f4a3a3'
  const minX = toX(result.argMinT)
  const minY = toY(result.minMagnitude)
  ctx.beginPath()
  ctx.arc(minX, minY, 5, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#a7b0c0'
  ctx.font = '12px "Space Grotesk", sans-serif'
  ctx.fillText(`min |ζ|≈${result.minMagnitude.toExponential(3)} @ t≈${result.argMinT.toFixed(2)}`, minX + 8, minY - 8)

  ctx.fillStyle = '#8b93a3'
  ctx.font = '12px "Space Grotesk", sans-serif'
  ctx.fillText('t', padding.left + plotWidth / 2 - 6, height - 18)
  ctx.save()
  ctx.translate(18, padding.top + plotHeight / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText('|ζ|', 0, 0)
  ctx.restore()

  for (let tick = 0; tick <= 4; tick += 1) {
    const t = tMin + ((tMax - tMin) * tick) / 4
    const x = toX(t)
    ctx.fillStyle = '#8b93a3'
    ctx.textAlign = 'center'
    ctx.fillText(t.toFixed(1), x, height - 34)
    ctx.textAlign = 'left'
  }

  for (let tick = 0; tick <= 4; tick += 1) {
    const magnitude = (yMax * tick) / 4
    ctx.fillStyle = '#8b93a3'
    ctx.textAlign = 'right'
    ctx.fillText(magnitude.toFixed(2), padding.left - 10, toY(magnitude) + 4)
    ctx.textAlign = 'left'
  }

  return result
}
