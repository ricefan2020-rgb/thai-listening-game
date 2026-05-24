import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  renderCriticalLinePlot,
  renderCriticalLineSpiralSvg,
  renderMagnitudePlot,
  renderRealAxisPlot,
} from './plots.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputDir = path.join(__dirname, '..', 'images')

mkdirSync(outputDir, { recursive: true })

const files = [
  ['zeta-critical-line.svg', renderCriticalLinePlot()],
  ['zeta-critical-spiral.svg', renderCriticalLineSpiralSvg({ tMax: 50, zeroCount: 10 })],
  ['zeta-real-axis.svg', renderRealAxisPlot()],
  ['zeta-magnitude.svg', renderMagnitudePlot()],
]

for (const [name, svg] of files) {
  writeFileSync(path.join(outputDir, name), svg, 'utf8')
  console.log(`Wrote ${path.join('tools/zeta-calculator/images', name)}`)
}
