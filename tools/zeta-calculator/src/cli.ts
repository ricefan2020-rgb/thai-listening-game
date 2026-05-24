import { findNontrivialZeros, formatComplex, getSpecialValues, renderStepsText, zeta } from './zeta'
import { formatIntegralValue, integrateZetaMagnitude } from './zetaIntegral'
import { analyzeMatrixEigenvalues } from './matrixEigen'
import { analyzeLocalEulerAtT } from './localEulerAtT'
import { analyzeVectorDifferences } from './vectorDifferencing'
import { analyzeFrequencyDotProducts } from './frequencyDotProduct'
import { verifyEulerProduct } from './eulerProduct'
import { analyzeTermFactorization, type SeriesKind } from './termFactorization'
import { C } from './complex'

const args = process.argv.slice(2)

if (args[0] === '--local-euler') {
  const re = Number(args[1] ?? 0.5)
  const t = Number(args[2] ?? 5)
  const primeCount = Math.min(500, Math.max(5, Number(args[3]) || 40))
  if (!Number.isFinite(re) || !Number.isFinite(t)) {
    console.error('Invalid input. Example: npx tsx tools/zeta-calculator/src/cli.ts --local-euler 0.5 5 40')
    process.exit(1)
  }
  const s = C.from(re, t)
  const result = analyzeLocalEulerAtT(s, primeCount)
  const last = result.steps[result.steps.length - 1]
  console.log(`s = ${formatComplex(s)}, t = ${t}`)
  console.log(`ζ(s) = ${formatComplex(result.zetaValue)}`)
  console.log(`∏(1-p^{-s})^{-1} ≈ ${formatComplex(last.cumEulerInverseProduct)}`)
  console.log(`|∏ Euler^{-1} - 1/ζ| = ${last.errorVsInvZeta.toExponential(6)}`)
  console.log(`|ζ·∏(1-p^{-s}) - 1| = ${last.errorZetaEuler.toExponential(6)}`)
  console.log(`|∏ p^{-s}| = ${last.cumPrimePowerProduct.abs().toExponential(6)} (not full Euler)`)
  console.log(`note: ${result.note}`)
  process.exit(0)
}

if (args[0] === '--eigen') {
  const sigma = Number(args[1] ?? 0.5)
  const tMin = Number(args[2] ?? 1)
  const tMax = Number(args[3] ?? 10)
  const size = Math.min(12, Math.max(3, Number(args[4]) || 10))
  const full = args[5] === 'full'
  if (!Number.isFinite(sigma) || !Number.isFinite(tMin) || !Number.isFinite(tMax) || tMax <= tMin) {
    console.error('Invalid input. Example: npx tsx tools/zeta-calculator/src/cli.ts --eigen 0.5 1 10 10')
    console.error('Add "full" as 6th arg to include prime-power matrix Q.')
    process.exit(1)
  }
  const result = analyzeMatrixEigenvalues({ sigma, tMin, tMax, size, simplified: !full })
  console.log(`σ=${sigma}, t∈[${tMin},${tMax}], N=${size}, primes=${result.primes.join(',')}`)
  console.log('\n--- term matrix A eigenvalues ---')
  for (const value of result.termEigenvalues) {
    console.log(`${formatComplex(value)}  |λ|=${value.abs().toExponential(6)}`)
  }
  console.log('\n--- prime slice P eigenvalues ---')
  for (const value of result.primeSliceEigenvalues) {
    console.log(`${formatComplex(value)}  |λ|=${value.abs().toExponential(6)}`)
  }
  console.log('\n--- Gram(A) eigenvalues ---')
  for (const value of result.termGramEigenvalues) {
    console.log(value.toExponential(6))
  }
  process.exit(0)
}

if (args[0] === '--integral') {
  const tMin = Number(args[1] ?? 0.5)
  const tMax = Number(args[2] ?? 50)
  const samples = Math.min(4000, Math.max(100, Number(args[3]) || 800))
  if (!Number.isFinite(tMin) || !Number.isFinite(tMax) || tMax <= tMin) {
    console.error('Invalid range. Example: npx tsx tools/zeta-calculator/src/cli.ts --integral 0.5 50 800')
    process.exit(1)
  }
  const result = integrateZetaMagnitude({ tMin, tMax, samples })
  console.log(`∫_{${tMin}}^{${tMax}} |ζ(1/2+it)| dt ≈ ${formatIntegralValue(result.integral)}`)
  console.log(`average |ζ| = ${formatIntegralValue(result.averageMagnitude)}`)
  console.log(`min |ζ| = ${result.minMagnitude.toExponential(6)} at t ≈ ${result.argMinT.toFixed(6)}`)
  console.log(`max |ζ| = ${result.maxMagnitude.toFixed(6)}`)
  console.log(`zeros in [${tMin}, ${tMax}]: ${result.zeroCount}`)
  console.log(`samples = ${result.sampleCount} (composite trapezoid)`)
  process.exit(0)
}

if (args[0] === '--zeros') {
  const count = Math.min(20, Math.max(1, Number(args[1]) || 10))
  const zeros = findNontrivialZeros(count)
  console.log(`First ${count} non-trivial zeros on Re(s)=1/2:\n`)
  for (const zero of zeros) {
    console.log(
      `#${zero.index}\tt=${zero.t.toFixed(8)}\ts=${formatComplex(zero.s)}\tZ(t)=${zero.z.toExponential(4)}\tζ(s)=${formatComplex(zero.zeta, 6)}`,
    )
  }
  process.exit(0)
}

if (args[0] === '--special') {
  for (const item of getSpecialValues()) {
    console.log(`${item.label}\t${item.exact}\tcomputed=${formatComplex(item.computed)}`)
  }
  process.exit(0)
}

if (args[0] === '--euler') {
  const re = Number(args[1] ?? 2)
  const im = Number(args[2] ?? 0)
  const primeCount = Math.min(500, Math.max(5, Number(args[3]) || 25))
  if (!Number.isFinite(re) || !Number.isFinite(im)) {
    console.error('Invalid input. Example: npx tsx tools/zeta-calculator/src/cli.ts --euler 2 0 50')
    process.exit(1)
  }
  const s = C.from(re, im)
  const result = verifyEulerProduct(s, primeCount)
  console.log(`s = ${formatComplex(s)}`)
  console.log(`ζ(s) = ${formatComplex(result.zetaValue)}`)
  console.log(`∏_{p≤P} (1-p^{-s}) = ${formatComplex(result.finalProduct)}`)
  console.log(`ζ·∏ = ${formatComplex(result.finalCheck)}`)
  console.log(`|ζ·∏ - 1| = ${result.errorFromOne.toExponential(6)}`)
  console.log(`note: ${result.note}`)
  const last = result.steps[result.steps.length - 1]
  if (last) {
    console.log(`last prime p=${last.prime}, |ζ·∏-1| after p=${last.errorFromOne.toExponential(6)}`)
  }
  process.exit(0)
}

if (args[0] === '--factor') {
  const re = Number(args[1] ?? 2)
  const im = Number(args[2] ?? 0)
  const termCount = Math.min(80, Math.max(3, Number(args[3]) || 24))
  const kind = (args[4] === 'zeta' ? 'zeta' : 'eta') as SeriesKind
  if (!Number.isFinite(re) || !Number.isFinite(im)) {
    console.error('Invalid input. Example: npx tsx tools/zeta-calculator/src/cli.ts --factor 2 0 24 eta')
    process.exit(1)
  }
  const s = C.from(re, im)
  const result = analyzeTermFactorization(s, termCount, kind)
  console.log(`s = ${formatComplex(s)}`)
  console.log(`series = ${kind}`)
  console.log(`N = ${result.termCount}`)
  for (const row of result.rows.slice(0, 12)) {
    console.log(
      `n=${row.n}\t${row.factorizationText}\tterm=${formatComplex(row.term, 6)}\terr=${row.productError.toExponential(2)}`,
    )
  }
  if (result.rows.length > 12) {
    console.log('…')
  }
  process.exit(0)
}

if (args[0] === '--diff') {
  const re = Number(args[1] ?? 2)
  const im = Number(args[2] ?? 0)
  const termCount = Math.min(120, Math.max(12, Number(args[3]) || 48))
  const maxDepth = Math.min(10, Math.max(2, Number(args[4]) || 6))
  if (!Number.isFinite(re) || !Number.isFinite(im)) {
    console.error('Invalid input. Example: npx tsx tools/zeta-calculator/src/cli.ts --diff 2 0 48 6')
    process.exit(1)
  }
  const s = C.from(re, im)
  const result = analyzeVectorDifferences(s, termCount, maxDepth)
  console.log(`s = ${formatComplex(s)}`)
  console.log(`series = ${result.seriesLabel}`)
  console.log(`pattern = ${result.pattern.found ? 'found' : 'not found'}`)
  console.log(`depth = ${result.pattern.depth}`)
  console.log(`target = ${result.pattern.target}`)
  console.log(`description = ${result.pattern.description}`)
  if (result.limitEstimate) {
    console.log(`partial sum S_N = ${formatComplex(result.limitEstimate)}`)
  }
  console.log('\n--- term layers ---')
  for (const layer of result.termLayers) {
    console.log(
      `[${layer.depth}] ${layer.label} mean|v|=${layer.stats.meanAbs.toPrecision(4)} CV=${layer.stats.cv.toPrecision(4)}`,
    )
  }
  console.log('\n--- partial sum layers ---')
  for (const layer of result.partialLayers) {
    console.log(
      `[${layer.depth}] ${layer.label} mean|v|=${layer.stats.meanAbs.toPrecision(4)} CV=${layer.stats.cv.toPrecision(4)}`,
    )
  }
  process.exit(0)
}

if (args[0] === '--dot') {
  const re = Number(args[1] ?? 2)
  const im = Number(args[2] ?? 0)
  const termCount = Math.min(120, Math.max(12, Number(args[3]) || 48))
  const maxDepth = Math.min(10, Math.max(2, Number(args[4]) || 6))
  if (!Number.isFinite(re) || !Number.isFinite(im)) {
    console.error('Invalid input. Example: npx tsx tools/zeta-calculator/src/cli.ts --dot 2 0 48 6')
    process.exit(1)
  }
  const s = C.from(re, im)
  const result = analyzeVectorDotProducts(s, termCount, maxDepth)
  console.log(`s = ${formatComplex(s)}`)
  console.log(`series = ${result.seriesLabel}`)
  console.log(`pattern = ${result.pattern.found ? 'found' : 'not found'}`)
  console.log(`depth = ${result.pattern.depth}`)
  console.log(`target = ${result.pattern.target}`)
  console.log(`description = ${result.pattern.description}`)
  if (result.limitEstimate) {
    console.log(`partial sum S_N = ${formatComplex(result.limitEstimate)}`)
  }
  console.log('\n--- a_n · S_n (tail) ---')
  for (const pair of result.termPartialDots.slice(-6)) {
    console.log(
      `n=${pair.index}\tdot=${pair.dot.toPrecision(4)}\tcos=${pair.cos?.toPrecision(4) ?? '—'}`,
    )
  }
  console.log('\n--- term dot layers ---')
  for (const layer of result.termDotLayers) {
    console.log(
      `[${layer.depth}] ${layer.label} mean dot=${layer.stats.meanDot.toPrecision(4)} alternating=${layer.stats.alternating}`,
    )
  }
  process.exit(0)
}

if (args[0] === '--freq-dot') {
  const re = Number(args[1] ?? 0.5)
  const im = Number(args[2] ?? 14.134)
  const termCount = Math.min(120, Math.max(12, Number(args[3]) || 48))
  if (!Number.isFinite(re) || !Number.isFinite(im)) {
    console.error('Invalid input. Example: npx tsx tools/zeta-calculator/src/cli.ts --freq-dot 0.5 14.134 48')
    process.exit(1)
  }
  const s = C.from(re, im)
  const result = analyzeFrequencyDotProducts(s, termCount)
  console.log(`s = ${formatComplex(s)}`)
  console.log(`t = Im(s) = ${result.tParameter}`)
  console.log(`pattern = ${result.pattern.found ? 'found' : 'not found'}`)
  console.log(`description = ${result.pattern.description}`)
  console.log(`mean phasor = ${formatComplex(result.coherence.meanPhasor)}`)
  console.log(`tail S·mu cos = ${result.coherence.tailMeanCos?.toPrecision(4) ?? '—'}`)
  console.log('\n--- prime spectrum (top 6) ---')
  for (const item of [...result.primeSpectrum].sort((a, b) => Math.abs(b.totalDot) - Math.abs(a.totalDot)).slice(0, 6)) {
    console.log(`p=${item.prime}\ttotalDot=${item.totalDot.toPrecision(4)}\tmeanCos=${item.meanCos?.toPrecision(4) ?? '—'}`)
  }
  console.log('\n--- samples (head/tail) ---')
  for (const sample of [...result.samples.slice(0, 4), ...result.samples.slice(-4)]) {
    console.log(
      `n=${sample.index}\tω=${sample.omega.toPrecision(4)}\tcosΔφ=${sample.adjacentPhasorCos?.toPrecision(4) ?? '—'}`,
    )
  }
  process.exit(0)
}

const re = Number(args[0] === '--steps' ? args[1] : args[0])
const im = Number(args[0] === '--steps' ? (args[2] ?? 0) : (args[1] ?? 0))
const showSteps = args[0] === '--steps'
if (!Number.isFinite(re) || !Number.isFinite(im)) {
  console.error('Invalid input. Example: npx tsx tools/zeta-calculator/src/cli.ts 2')
  console.error('Use --steps for detailed computation process.')
  process.exit(1)
}

const s = C.from(re, im)
const result = zeta(s)
console.log(`s = ${formatComplex(s)}`)
console.log(`ζ(s) = ${formatComplex(result.value)}`)
console.log(`|ζ(s)| = ${result.value.abs().toPrecision(10)}`)
console.log(`method = ${result.method}`)
if (result.note) {
  console.log(`note = ${result.note}`)
}
if (showSteps) {
  console.log('\n--- 演算過程 ---\n')
  console.log(renderStepsText(result.steps))
}
