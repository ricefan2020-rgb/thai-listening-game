import {
  buildCriticalLineSeries,
  buildMagnitudeSeries,
  buildRealAxisSeries,
  buildZeroMarkers,
  downloadCanvasPng,
  drawPlotToCanvas,
  drawPhaseAngleToCanvas,
  drawFrequencyToCanvas,
  drawPhaseSigmaSweepToCanvas,
  drawSpiralToCanvas,
} from './plots'
import { kpiCard } from './analysisLayout'
import {
  drawZetaMagnitudeAreaToCanvas,
  formatIntegralValue,
  type ZetaMagnitudeIntegralResult,
} from './zetaIntegral'
import {
  findNontrivialZeros,
  formatComplex,
  getSpecialValues,
  normalizeScalarTyping,
  parseComplexInput,
  renderStepsHtml,
  zeta,
} from './zeta'

import {
  analyzeVectorDifferences,
  renderVectorDiffHtml,
} from './vectorDifferencing'
import {
  analyzeVectorDotProducts,
  renderVectorDotHtml,
} from './vectorDotProduct'

import {
  analyzeFrequencyDotProducts,
  renderFrequencyDotHtml,
} from './frequencyDotProduct'
import {
  analyzeLocalEulerAtT,
  drawLocalEulerChart,
  renderLocalEulerAtTHtml,
} from './localEulerAtT'
import {
  analyzeTermFactorization,
  renderTermFactorizationHtml,
  type SeriesKind,
} from './termFactorization'
import { analyzeMatrixEigenvalues, renderMatrixEigenHtml } from './matrixEigen'

type Tab = 'evaluate' | 'euler' | 'factor' | 'zeros' | 'special' | 'charts' | 'eigen' | 'diff'
type VectorMode = 'diff' | 'dot' | 'freq-dot' | 'all'

const tabs: Array<{ id: Tab; label: string }> = [
  { id: 'evaluate', label: '計算 ζ(s)' },
  { id: 'euler', label: 'Euler 乘积' },
  { id: 'factor', label: '項分解' },
  { id: 'zeros', label: '非平凡零點' },
  { id: 'special', label: '特殊值' },
  { id: 'charts', label: '圖表' },
  { id: 'eigen', label: '矩陣 λ' },
  { id: 'diff', label: '向量分析' },
]

function syncSInputsFrom(sourceRe: string, sourceIm: string): void {
  const pairs: Array<[string, string]> = [
    ['#real-part', '#imag-part'],
    ['#euler-real-part', '#euler-imag-part'],
    ['#factor-real-part', '#factor-imag-part'],
    ['#diff-real-part', '#diff-imag-part'],
  ]
  for (const [reSel, imSel] of pairs) {
    const re = document.querySelector<HTMLInputElement>(reSel)
    const im = document.querySelector<HTMLInputElement>(imSel)
    if (re) {
      re.value = sourceRe
    }
    if (im) {
      im.value = sourceIm
    }
  }
  const eigenRe = document.querySelector<HTMLInputElement>('#eigen-real-part')
  if (eigenRe) {
    eigenRe.value = sourceRe
  }
}

function setActiveTab(tab: Tab): void {
  document.querySelectorAll<HTMLElement>('[data-tab-panel]').forEach((panel) => {
    panel.hidden = panel.dataset.tabPanel !== tab
  })
  document.querySelectorAll<HTMLButtonElement>('[data-tab-button]').forEach((button) => {
    const active = button.dataset.tabButton === tab
    button.classList.toggle('tab-active', active)
    button.setAttribute('aria-selected', String(active))
    if (active) {
      button.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    }
  })
}

function readVisibleScalarInputs(): { re: string; im: string } {
  const panel = document.querySelector<HTMLElement>('[data-tab-panel]:not([hidden])')
  const re =
    panel?.querySelector<HTMLInputElement>('[id$="-real-part"]')?.value ??
    document.querySelector<HTMLInputElement>('#real-part')?.value ??
    '2'
  const im =
    panel?.querySelector<HTMLInputElement>('[id$="-imag-part"]')?.value ??
    document.querySelector<HTMLInputElement>('#imag-part')?.value ??
    '0'
  return { re, im }
}

function activateTab(tab: Tab): void {
  const { re, im } = readVisibleScalarInputs()
  setActiveTab(tab)
  syncSInputsFrom(re, im)

  if (tab === 'special') {
    renderSpecial()
  }
  if (tab === 'charts') {
    renderCharts()
  }
  if (tab === 'euler') {
    renderEuler()
  }
  if (tab === 'factor') {
    renderFactor()
  }
  if (tab === 'diff') {
    renderDiff()
  }
  if (tab === 'eigen') {
    renderEigen()
  }
}

function isEigenSimplified(): boolean {
  return document.querySelector<HTMLInputElement>('#eigen-simplified')?.checked ?? true
}

function updateEigenSubmitLabel(): void {
  const button = document.querySelector<HTMLButtonElement>('#eigen-submit')
  if (!button) {
    return
  }
  button.textContent = isEigenSimplified()
    ? '計算 A 與 P 特徵值'
    : '計算 A、P、Q 三種矩陣特徵值'
}

function renderEigen(): void {
  const reInput = document.querySelector<HTMLInputElement>('#eigen-real-part')
  const tMinInput = document.querySelector<HTMLInputElement>('#eigen-t-min')
  const tMaxInput = document.querySelector<HTMLInputElement>('#eigen-t-max')
  const sizeInput = document.querySelector<HTMLInputElement>('#eigen-size')
  const output = document.querySelector<HTMLElement>('#eigen-output')
  if (!reInput || !tMinInput || !tMaxInput || !sizeInput || !output) {
    return
  }

  const simplified = isEigenSimplified()
  updateEigenSubmitLabel()

  const sigma = Number(normalizeScalarTyping(reInput.value))
  const tMin = Number(tMinInput.value)
  const tMax = Number(tMaxInput.value)
  const size = Math.min(12, Math.max(3, Number(sizeInput.value) || 10))
  if (!Number.isFinite(sigma) || !Number.isFinite(tMin) || !Number.isFinite(tMax) || tMax <= tMin) {
    output.innerHTML = '<p class="note">請輸入有效的 Re(s) 與 t 區間（t 上限 &gt; 下限）。</p>'
    return
  }

  sizeInput.value = String(size)
  const result = analyzeMatrixEigenvalues({ sigma, tMin, tMax, size, simplified })
  output.innerHTML = renderMatrixEigenHtml(result, simplified)
}

function resolveInitialTab(): Tab {
  const fromQuery = new URLSearchParams(window.location.search).get('tab')
  if (fromQuery && tabs.some(({ id }) => id === fromQuery)) {
    return fromQuery as Tab
  }
  const fromHash = window.location.hash.replace(/^#/, '')
  if (fromHash && tabs.some(({ id }) => id === fromHash)) {
    return fromHash as Tab
  }
  return 'eigen'
}

function renderDiff(): void {
  const reInput = document.querySelector<HTMLInputElement>('#diff-real-part')
  const imInput = document.querySelector<HTMLInputElement>('#diff-imag-part')
  const termInput = document.querySelector<HTMLInputElement>('#diff-term-count')
  const depthInput = document.querySelector<HTMLInputElement>('#diff-max-depth')
  const modeInput = document.querySelector<HTMLSelectElement>('#diff-mode')
  const output = document.querySelector<HTMLElement>('#diff-output')
  if (!reInput || !imInput || !termInput || !depthInput || !modeInput || !output) {
    return
  }

  const s = parseComplexInput(reInput.value, imInput.value)
  if (!s) {
    output.innerHTML = '<p class="error">請輸入有效的數字。</p>'
    return
  }

  const termCount = Math.min(120, Math.max(12, Number(termInput.value) || 48))
  const maxDepth = Math.min(10, Math.max(2, Number(depthInput.value) || 6))
  const mode = (modeInput.value as VectorMode) || 'all'
  termInput.value = String(termCount)
  depthInput.value = String(maxDepth)

  const sections: string[] = []
  if (mode === 'diff' || mode === 'all') {
    sections.push(renderVectorDiffHtml(analyzeVectorDifferences(s, termCount, maxDepth)))
  }
  if (mode === 'dot' || mode === 'all') {
    sections.push(renderVectorDotHtml(analyzeVectorDotProducts(s, termCount, maxDepth)))
  }
  if (mode === 'freq-dot' || mode === 'all') {
    sections.push(renderFrequencyDotHtml(analyzeFrequencyDotProducts(s, termCount)))
  }
  output.innerHTML = `<div class="output-stack">${sections.join('')}</div>`
}

function renderEuler(): void {
  const reInput = document.querySelector<HTMLInputElement>('#euler-real-part')
  const imInput = document.querySelector<HTMLInputElement>('#euler-imag-part')
  const primeInput = document.querySelector<HTMLInputElement>('#euler-prime-count')
  const output = document.querySelector<HTMLElement>('#euler-output')
  if (!reInput || !imInput || !primeInput || !output) {
    return
  }

  const s = parseComplexInput(reInput.value, imInput.value)
  if (!s) {
    output.innerHTML = '<p class="error">請輸入有效的數字。</p>'
    return
  }

  const primeCount = Math.min(500, Math.max(5, Number(primeInput.value) || 25))
  primeInput.value = String(primeCount)

  const localResult = analyzeLocalEulerAtT(s, primeCount)
  output.innerHTML = `<div class="output-stack">${renderLocalEulerAtTHtml(localResult)}</div>`

  requestAnimationFrame(() => {
    const canvas = document.querySelector<HTMLCanvasElement>('#local-euler-chart')
    if (canvas) {
      drawLocalEulerChart(canvas, localResult)
    }
  })
}

function renderFactor(): void {
  const reInput = document.querySelector<HTMLInputElement>('#factor-real-part')
  const imInput = document.querySelector<HTMLInputElement>('#factor-imag-part')
  const termInput = document.querySelector<HTMLInputElement>('#factor-term-count')
  const kindInput = document.querySelector<HTMLSelectElement>('#factor-series')
  const output = document.querySelector<HTMLElement>('#factor-output')
  if (!reInput || !imInput || !termInput || !kindInput || !output) {
    return
  }

  const s = parseComplexInput(reInput.value, imInput.value)
  if (!s) {
    output.innerHTML = '<p class="error">請輸入有效的數字。</p>'
    return
  }

  const termCount = Math.min(80, Math.max(3, Number(termInput.value) || 24))
  const seriesKind = (kindInput.value as SeriesKind) || 'eta'
  termInput.value = String(termCount)

  const result = analyzeTermFactorization(s, termCount, seriesKind)
  output.innerHTML = `<div class="output-stack">${renderTermFactorizationHtml(result)}</div>`
}

function renderEvaluate(): void {
  const reInput = document.querySelector<HTMLInputElement>('#real-part')
  const imInput = document.querySelector<HTMLInputElement>('#imag-part')
  const output = document.querySelector<HTMLElement>('#evaluate-output')
  if (!reInput || !imInput || !output) {
    return
  }

  const s = parseComplexInput(reInput.value, imInput.value)
  if (!s) {
    output.innerHTML = '<p class="error">請輸入有效的數字。</p>'
    return
  }

  const result = zeta(s)
  const abs = result.value.abs()
  output.innerHTML = `
    <div class="evaluate-output">
    <div class="result-grid">
      <div class="result-card">
        <span class="label">輸入 s</span>
        <strong>${formatComplex(s)}</strong>
      </div>
      <div class="result-card">
        <span class="label">ζ(s)</span>
        <strong>${formatComplex(result.value)}</strong>
      </div>
      <div class="result-card">
        <span class="label">|ζ(s)|</span>
        <strong>${abs.toPrecision(10)}</strong>
      </div>
      <div class="result-card">
        <span class="label">演算法</span>
        <strong>${result.method}</strong>
      </div>
    </div>
    ${result.note ? `<p class="note">${result.note}</p>` : ''}
    <section class="steps-panel">
      <h2>演算過程</h2>
      ${renderStepsHtml(result.steps)}
    </section>
    </div>
  `
}

function renderZeros(): void {
  const countInput = document.querySelector<HTMLInputElement>('#zero-count')
  const output = document.querySelector<HTMLElement>('#zeros-output')
  if (!countInput || !output) {
    return
  }

  const count = Math.min(20, Math.max(1, Number(countInput.value) || 10))
  countInput.value = String(count)
  const zeros = findNontrivialZeros(count)

  output.innerHTML = `
    <p class="note">在臨界線 Re(s)=1/2 上，利用 Riemann–Siegel Z 函數搜尋前 ${count} 個非平凡零點。</p>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>t</th>
            <th>s = 1/2 + it</th>
            <th>Z(t)</th>
            <th>ζ(s)</th>
          </tr>
        </thead>
        <tbody>
          ${zeros
            .map(
              (zero) => `
            <tr>
              <td>${zero.index}</td>
              <td>${zero.t.toFixed(8)}</td>
              <td>${formatComplex(zero.s)}</td>
              <td>${zero.z.toExponential(4)}</td>
              <td>${formatComplex(zero.zeta, 6)}</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `
}

function renderSpecial(): void {
  const output = document.querySelector<HTMLElement>('#special-output')
  if (!output) {
    return
  }

  const values = getSpecialValues()
  output.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>點</th>
            <th>精確值</th>
            <th>計算值</th>
          </tr>
        </thead>
        <tbody>
          ${values
            .map(
              (item) => `
            <tr>
              <td>${item.label}</td>
              <td>${item.exact}</td>
              <td>${formatComplex(item.computed)}</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `
}

function wireFactorPresets(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-factor-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      const reInput = document.querySelector<HTMLInputElement>('#factor-real-part')
      const imInput = document.querySelector<HTMLInputElement>('#factor-imag-part')
      if (!reInput || !imInput) {
        return
      }
      reInput.value = button.dataset.re ?? '2'
      imInput.value = button.dataset.im ?? '0'
      renderFactor()
    })
  })
}

function wireEulerPresets(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-euler-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      const reInput = document.querySelector<HTMLInputElement>('#euler-real-part')
      const imInput = document.querySelector<HTMLInputElement>('#euler-imag-part')
      if (!reInput || !imInput) {
        return
      }
      reInput.value = button.dataset.re ?? '2'
      imInput.value = button.dataset.im ?? '0'
      renderEuler()
    })
  })
}

function wireDiffPresets(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-diff-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      const reInput = document.querySelector<HTMLInputElement>('#diff-real-part')
      const imInput = document.querySelector<HTMLInputElement>('#diff-imag-part')
      if (!reInput || !imInput) {
        return
      }
      reInput.value = button.dataset.re ?? '2'
      imInput.value = button.dataset.im ?? '0'
      renderDiff()
    })
  })
}

function wirePresets(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      const reInput = document.querySelector<HTMLInputElement>('#real-part')
      const imInput = document.querySelector<HTMLInputElement>('#imag-part')
      if (!reInput || !imInput) {
        return
      }
      reInput.value = button.dataset.re ?? '2'
      imInput.value = button.dataset.im ?? '0'
      renderEvaluate()
    })
  })
}

function getChartRangeOptions(): { tMax: number; zeroCount: number } {
  const tMaxInput = document.querySelector<HTMLInputElement>('#spiral-t-max')
  const zeroInput = document.querySelector<HTMLInputElement>('#spiral-zero-count')
  return {
    tMax: Math.min(200, Math.max(1, Number(tMaxInput?.value) || 50)),
    zeroCount: Math.min(20, Math.max(1, Number(zeroInput?.value) || 10)),
  }
}

function getSpiralChartOptions() {
  const range = getChartRangeOptions()
  const sigmaInput = document.querySelector<HTMLInputElement>('#spiral-sigma')
  const tMinInput = document.querySelector<HTMLInputElement>('#spiral-t-min')
  const sigma = Number(normalizeScalarTyping(sigmaInput?.value ?? '0.5'))
  const tMin = Math.max(0, Number(tMinInput?.value) || 0.5)
  const tMax = Math.max(tMin + 0.1, range.tMax)
  return {
    sigma: Number.isFinite(sigma) ? sigma : 0.5,
    tMin,
    tMax,
    samples: 320,
    zeroCount: range.zeroCount,
  }
}

function usesChartRangeControls(plotType: string): boolean {
  return (
    plotType === 'spiral' ||
    plotType === 'phase' ||
    plotType === 'phase-sweep' ||
    plotType === 'frequency'
  )
}

function usesSigmaSweepControls(plotType: string): boolean {
  return plotType === 'phase-sweep'
}

function usesIntegralControls(plotType: string): boolean {
  return plotType === 'magnitude-area'
}

function getIntegralRangeOptions(): { tMin: number; tMax: number; samples: number } {
  const tMinInput = document.querySelector<HTMLInputElement>('#integral-t-min')
  const tMaxInput = document.querySelector<HTMLInputElement>('#integral-t-max')
  const samplesInput = document.querySelector<HTMLInputElement>('#integral-samples')
  const tMin = Math.max(0, Number(tMinInput?.value) || 0.5)
  const tMax = Math.max(tMin + 0.1, Number(tMaxInput?.value) || 50)
  const samples = Math.min(4000, Math.max(100, Number(samplesInput?.value) || 800))
  return { tMin, tMax, samples }
}

function renderIntegralKpis(result: ZetaMagnitudeIntegralResult): void {
  const panel = document.querySelector<HTMLElement>('#integral-result')
  if (!panel) {
    return
  }
  const span = result.tMax - result.tMin
  panel.innerHTML = [
    kpiCard('∫ |ζ| dt', formatIntegralValue(result.integral)),
    kpiCard('區間長度 Δt', span.toFixed(4)),
    kpiCard('平均 |ζ|', formatIntegralValue(result.averageMagnitude)),
    kpiCard('min |ζ|', result.minMagnitude.toExponential(4)),
    kpiCard('min 所在 t', result.argMinT.toFixed(4)),
    kpiCard('區間內零點數', String(result.zeroCount)),
  ].join('')
}

function renderCharts(): void {
  const plotSelect = document.querySelector<HTMLSelectElement>('#plot-type')
  const canvas = document.querySelector<HTMLCanvasElement>('#plot-canvas')
  const rangeControls = document.querySelector<HTMLElement>('#spiral-controls')
  if (!plotSelect || !canvas) {
    return
  }

  const plotType = plotSelect.value
  const integralControls = document.querySelector<HTMLElement>('#integral-controls')
  const integralResult = document.querySelector<HTMLElement>('#integral-result')
  rangeControls?.toggleAttribute('hidden', !usesChartRangeControls(plotType))
  document
    .querySelector('#spiral-sigma-wrap')
    ?.toggleAttribute('hidden', !usesSigmaSweepControls(plotType))
  document
    .querySelector('#spiral-t-min-wrap')
    ?.toggleAttribute('hidden', !usesSigmaSweepControls(plotType))
  integralControls?.toggleAttribute('hidden', !usesIntegralControls(plotType))
  integralResult?.toggleAttribute('hidden', !usesIntegralControls(plotType))

  const spiralLikeOptions = getSpiralChartOptions()

  if (plotType === 'spiral') {
    drawSpiralToCanvas(canvas, spiralLikeOptions)
    return
  }

  if (plotType === 'phase') {
    drawPhaseAngleToCanvas(canvas, spiralLikeOptions)
    return
  }

  if (plotType === 'frequency') {
    drawFrequencyToCanvas(canvas, spiralLikeOptions)
    return
  }

  if (plotType === 'phase-sweep') {
    drawPhaseSigmaSweepToCanvas(canvas, spiralLikeOptions)
    return
  }

  if (plotType === 'magnitude-area') {
    const integralOptions = getIntegralRangeOptions()
    const result = drawZetaMagnitudeAreaToCanvas(canvas, integralOptions)
    renderIntegralKpis(result)
    return
  }

  const specs = {
    critical: {
      title: 'Hardy Z(t) on the critical line',
      subtitle: 'Zeros occur where Z(t) = 0',
      xLabel: 't',
      yLabel: 'Z(t)',
      series: [buildCriticalLineSeries(50, 420)],
      markers: buildZeroMarkers(10),
    },
    real: {
      title: 'Riemann ζ(s) on the real axis',
      subtitle: 'Pole at s = 1 omitted',
      xLabel: 's (real)',
      yLabel: 'ζ(s)',
      series: [buildRealAxisSeries(-4, 6, 520)],
    },
    magnitude: {
      title: 'log10 |ζ(1/2 + it)|',
      subtitle: 'Deep dips near non-trivial zeros',
      xLabel: 't',
      yLabel: 'log10 |ζ(1/2 + it)|',
      series: [buildMagnitudeSeries(50, 420)],
      markers: buildZeroMarkers(10),
    },
  } as const

  const spec = specs[plotType as keyof typeof specs] ?? specs.critical
  drawPlotToCanvas(canvas, spec)
}

function wireCharts(): void {
  document.querySelector('#plot-type')?.addEventListener('change', renderCharts)
  document.querySelector('#spiral-controls')?.addEventListener('input', renderCharts)
  document.querySelector('#integral-controls')?.addEventListener('input', renderCharts)
  document.querySelector('#download-png')?.addEventListener('click', () => {
    const canvas = document.querySelector<HTMLCanvasElement>('#plot-canvas')
    const plotType = document.querySelector<HTMLSelectElement>('#plot-type')?.value ?? 'critical'
    if (!canvas) {
      return
    }
    downloadCanvasPng(canvas, `zeta-${plotType}.png`)
  })
}

function wireScalarInputs(): void {
  document.querySelectorAll<HTMLInputElement>('.scalar-input').forEach((input) => {
    input.setAttribute('lang', 'en')
    input.setAttribute('spellcheck', 'false')
    input.addEventListener('input', () => {
      const normalized = normalizeScalarTyping(input.value)
      if (normalized === input.value) {
        return
      }
      const cursor = input.selectionStart
      input.value = normalized
      if (cursor !== null) {
        const nextPos = Math.min(cursor, normalized.length)
        input.setSelectionRange(nextPos, nextPos)
      }
    })
  })
}

function wireQuickNav(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-goto-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      const tab = button.dataset.gotoTab as Tab | undefined
      if (tab) {
        activateTab(tab)
      }
    })
  })
}

function init(): void {
  tabs.forEach(({ id, label }) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.dataset.tabButton = id
    button.textContent = label
    button.addEventListener('click', () => {
      activateTab(id)
    })
    document.querySelector('#tab-list')?.append(button)
  })

  wireScalarInputs()
  wireQuickNav()
  wirePresets()
  wireEulerPresets()
  wireFactorPresets()
  wireDiffPresets()
  wireCharts()
  renderEvaluate()
  renderSpecial()

  document.querySelector('#evaluate-form')?.addEventListener('submit', (event) => {
    event.preventDefault()
    renderEvaluate()
  })

  document.querySelector('#zeros-form')?.addEventListener('submit', (event) => {
    event.preventDefault()
    renderZeros()
  })

  document.querySelector('#diff-form')?.addEventListener('submit', (event) => {
    event.preventDefault()
    renderDiff()
  })

  document.querySelector('#euler-form')?.addEventListener('submit', (event) => {
    event.preventDefault()
    renderEuler()
  })

  document.querySelector('#factor-form')?.addEventListener('submit', (event) => {
    event.preventDefault()
    renderFactor()
  })

  document.querySelector('#eigen-form')?.addEventListener('submit', (event) => {
    event.preventDefault()
    renderEigen()
  })
  document.querySelector('#eigen-simplified')?.addEventListener('change', () => {
    updateEigenSubmitLabel()
    renderEigen()
  })

  renderZeros()
  activateTab(resolveInitialTab())
}

init()
