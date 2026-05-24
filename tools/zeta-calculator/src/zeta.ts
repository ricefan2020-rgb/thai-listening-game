import { C } from './complex'
import { gamma } from './gamma'

export interface ZetaStep {
  title: string
  formula?: string
  lines: string[]
}

export interface ZetaResult {
  value: C
  method: string
  note?: string
  steps: ZetaStep[]
}

export interface ZetaZero {
  index: number
  t: number
  s: C
  z: number
  zeta: C
}

const SPECIAL_VALUES: Array<{ s: C; label: string; exact: string }> = [
  { s: C.from(2, 0), label: 'ζ(2)', exact: 'π²/6 ≈ 1.6449340668' },
  { s: C.from(4, 0), label: 'ζ(4)', exact: 'π⁴/90 ≈ 1.0823232337' },
  { s: C.from(6, 0), label: 'ζ(6)', exact: 'π⁶/945 ≈ 1.0173430620' },
  { s: C.from(-1, 0), label: 'ζ(-1)', exact: '-1/12 ≈ -0.0833333333' },
  { s: C.from(0, 0), label: 'ζ(0)', exact: '-1/2 = -0.5' },
  { s: C.from(0.5, 0), label: 'ζ(1/2)', exact: '≈ -1.4603545088' },
]

function chiFactorSteps(s: C): { value: C; lines: string[] } {
  const twoPowS = C.pow(2, s)
  const piPowSm1 = C.pow(Math.PI, s.sub(C.one()))
  const sinTerm = C.sin(C.from(Math.PI / 2, 0).mul(s))
  const gammaTerm = gamma(C.one().sub(s))
  const value = twoPowS.mul(piPowSm1).mul(sinTerm).mul(gammaTerm)
  return {
    value,
    lines: [
      `2^s = ${formatComplex(twoPowS)}`,
      `π^(s−1) = ${formatComplex(piPowSm1)}`,
      `sin(πs/2) = ${formatComplex(sinTerm)}`,
      `Γ(1−s) = ${formatComplex(gammaTerm)}`,
      `χ(s) = 2^s · π^(s−1) · sin(πs/2) · Γ(1−s) = ${formatComplex(value)}`,
    ],
  }
}

function sampleSeriesTerms(
  s: C,
  count: number,
  alternating: boolean,
): string[] {
  const lines: string[] = []
  for (let n = 1; n <= count; n += 1) {
    const term = C.pow(n, s.neg())
    const sign = alternating ? (n % 2 === 0 ? '−' : '+') : '+'
    lines.push(`${sign} ${n}^(${formatComplex(s.neg(), 4)}) = ${formatComplex(term, 6)}`)
  }
  return lines
}

function dirichletZetaDetailed(s: C, terms = 20000): { value: C; lines: string[] } {
  let sum = C.zero()
  for (let n = 1; n <= terms; n += 1) {
    sum = sum.add(C.pow(n, s.neg()))
  }

  const lines = [
    `取前 ${terms.toLocaleString()} 項求和`,
    ...sampleSeriesTerms(s, 5, false).map((line) => `  ${line}`),
    '  …',
    `部分和 S_N = ${formatComplex(sum)}`,
  ]

  if (s.re > 1) {
    const tail = C.pow(terms, C.one().sub(s)).div(s.sub(C.one()))
    sum = sum.add(tail)
    lines.push(
      `積分尾項 ≈ ∫_N^∞ x^(-s) dx = N^(1−s)/(s−1)`,
      `N = ${terms}，尾項 = ${formatComplex(tail)}`,
      `S_N + 尾項 = ${formatComplex(sum)}`,
    )
  }

  return { value: sum, lines }
}

function dirichletEtaDetailed(s: C, terms?: number): { value: C; termsUsed: number; lines: string[] } {
  const count = terms ?? Math.max(12000, Math.ceil(20 * Math.max(1, Math.abs(s.im))))
  let sum = C.zero()
  for (let n = 1; n <= count; n += 1) {
    const sign = n % 2 === 0 ? -1 : 1
    sum = sum.add(C.pow(n, s.neg()).mul(C.from(sign, 0)))
  }

  return {
    value: sum,
    termsUsed: count,
    lines: [
      `取前 ${count.toLocaleString()} 項求和`,
      ...sampleSeriesTerms(s, 5, true).map((line) => `  ${line}`),
      '  …',
      `η(s) = ${formatComplex(sum)}`,
    ],
  }
}

function zetaViaEtaDetailed(s: C): ZetaResult {
  if (Math.abs(s.re) < 1e-10 && Math.abs(s.im) < 1e-10) {
    return {
      value: C.from(-0.5, 0),
      method: '特殊值',
      note: 'ζ(0) = −1/2',
      steps: [
        {
          title: '特殊值',
          formula: 'ζ(0) = −1/2',
          lines: ['s = 0 時不直接使用 η 級數，採已知解析值。'],
        },
      ],
    }
  }

  const eta = dirichletEtaDetailed(s)
  const factor = C.one().sub(C.pow(2, C.one().sub(s)))
  const twoPow = C.pow(2, C.one().sub(s))

  if (factor.abs() < 1e-12) {
    return {
      value: C.from(Number.POSITIVE_INFINITY, Number.NaN),
      method: 'Dirichlet η',
      note: 's = 1 為簡單極點',
      steps: [
        {
          title: '極點',
          formula: 'ζ(s) = η(s) / (1 − 2^(1−s))',
          lines: [
            `1 − 2^(1−s) = ${formatComplex(factor)} ≈ 0`,
            '分母趨近 0，s = 1 為簡單極點。',
          ],
        },
      ],
    }
  }

  const value = eta.value.div(factor)
  return {
    value,
    method: 'Dirichlet η 級數',
    steps: [
      {
        title: 'Dirichlet η 級數',
        formula: 'η(s) = Σ_{n=1}^∞ (−1)^(n−1) n^(−s)',
        lines: eta.lines,
      },
      {
        title: 'η 與 ζ 的代數關係',
        formula: 'η(s) = (1 − 2^(1−s)) · ζ(s)',
        lines: [
          '把 ζ(s) = Σ n^(−s) 分成奇數項與偶數項：',
          '  Σ_{奇} n^(−s) = (1 − 2^(−s)) · ζ(s)',
          '  Σ_{偶} n^(−s) = 2^(−s) · ζ(s)',
          'η(s) = Σ_{奇} − Σ_{偶} = (1 − 2^(−s))ζ(s) − 2^(−s)ζ(s)',
          '     = (1 − 2·2^(−s))ζ(s) = (1 − 2^(1−s))ζ(s)',
          '因此 ζ(s) = η(s) / (1 − 2^(1−s))（s ≠ 1）',
        ],
      },
      {
        title: '代入數值',
        formula: 'ζ(s) = η(s) / (1 − 2^(1−s))',
        lines: [
          `2^(1−s) = ${formatComplex(twoPow)}`,
          `1 − 2^(1−s) = ${formatComplex(factor)}`,
          `ζ(s) = ${formatComplex(eta.value)} / ${formatComplex(factor)} = ${formatComplex(value)}`,
        ],
      },
    ],
  }
}

function zetaViaFunctionalEquationDetailed(s: C, depth: number): ZetaResult {
  const reflected = C.one().sub(s)
  const reflectedResult = zetaInternal(reflected, depth + 1)
  const chi = chiFactorSteps(s)
  const value = chi.value.mul(reflectedResult.value)

  return {
    value,
    method: '函數方程 ζ(s) = χ(s) ζ(1−s)',
    note: `由 ζ(${reflected.toString(4)}) 延拓`,
    steps: [
      {
        title: '函數方程',
        formula: 'ζ(s) = χ(s) · ζ(1−s)',
        lines: [
          `令 s' = 1 − s = ${formatComplex(reflected)}`,
          `先在 s' 上計算 ζ(s')，再乘上 χ(s)。`,
        ],
      },
      {
        title: '計算 ζ(1−s)',
        lines: [
          `方法：${reflectedResult.method}`,
          `ζ(1−s) = ${formatComplex(reflectedResult.value)}`,
          ...reflectedResult.steps.flatMap((step) => [
            `  [${step.title}]`,
            ...(step.formula ? [`    ${step.formula}`] : []),
            ...step.lines.map((line) => `    ${line}`),
          ]),
        ],
      },
      {
        title: '計算 χ(s)',
        formula: 'χ(s) = 2^s · π^(s−1) · sin(πs/2) · Γ(1−s)',
        lines: chi.lines,
      },
      {
        title: '合成結果',
        formula: 'ζ(s) = χ(s) · ζ(1−s)',
        lines: [
          `ζ(s) = ${formatComplex(chi.value)} × ${formatComplex(reflectedResult.value)} = ${formatComplex(value)}`,
        ],
      },
    ],
  }
}

function chooseMethodLine(s: C): string {
  if (Math.abs(s.re - 1) < 1e-10 && Math.abs(s.im) < 1e-10) {
    return 's = 1，為簡單極點'
  }
  if (Math.abs(s.re) < 1e-10 && Math.abs(s.im) < 1e-10) {
    return 's = 0，使用特殊值 ζ(0) = −1/2'
  }
  if (s.re > 1) {
    return 'Re(s) > 1，Dirichlet 級數直接收斂'
  }
  if (s.re >= 0.5) {
    return '0.5 ≤ Re(s) ≤ 1，使用 Dirichlet η 級數'
  }
  if (s.re < 0 && Math.abs(s.im) < 1e-10 && Math.abs(s.re - Math.round(s.re)) < 1e-10) {
    const n = -Math.round(s.re)
    if (n > 0 && n % 2 === 0) {
      return `s = ${s.toString(4)} 為平凡零點`
    }
  }
  return 'Re(s) < 0.5，使用函數方程解析延拓'
}

function zetaInternal(s: C, depth = 0): ZetaResult {
  const intro: ZetaStep = {
    title: '輸入與路徑',
    lines: [
      `s = ${formatComplex(s)}`,
      `Re(s) = ${s.re.toPrecision(10)}，Im(s) = ${s.im.toPrecision(10)}`,
      chooseMethodLine(s),
    ],
  }

  if (!s.isFinite()) {
    return {
      value: C.from(Number.NaN, Number.NaN),
      method: 'invalid input',
      steps: [intro],
    }
  }

  if (Math.abs(s.re - 1) < 1e-10 && Math.abs(s.im) < 1e-10) {
    return {
      value: C.from(Number.POSITIVE_INFINITY, Number.NaN),
      method: 'pole',
      note: 's = 1 為簡單極點',
      steps: [
        intro,
        {
          title: '極點',
          formula: 'lim_{s→1} (s−1)ζ(s) = 1',
          lines: ['s = 1 時 ζ(s) 發散，為簡單極點。'],
        },
      ],
    }
  }

  if (Math.abs(s.re) < 1e-10 && Math.abs(s.im) < 1e-10) {
    return {
      value: C.from(-0.5, 0),
      method: '特殊值',
      note: 'ζ(0) = −1/2',
      steps: [
        intro,
        {
          title: '特殊值',
          formula: 'ζ(0) = −1/2',
          lines: ['由函數方程極限或直接定義得到。'],
        },
      ],
    }
  }

  if (s.re > 1) {
    const detailed = dirichletZetaDetailed(s)
    return {
      value: detailed.value,
      method: 'Dirichlet 級數',
      steps: [
        intro,
        {
          title: 'Dirichlet 級數',
          formula: 'ζ(s) = Σ_{n=1}^∞ n^(−s)',
          lines: detailed.lines,
        },
        {
          title: '結果',
          lines: [`ζ(s) = ${formatComplex(detailed.value)}`],
        },
      ],
    }
  }

  if (s.re >= 0.5) {
    const etaResult = zetaViaEtaDetailed(s)
    return {
      ...etaResult,
      steps: [intro, ...etaResult.steps],
    }
  }

  if (s.re < 0 && Math.abs(s.im) < 1e-10 && Math.abs(s.re - Math.round(s.re)) < 1e-10) {
    const n = -Math.round(s.re)
    if (n > 0 && n % 2 === 0) {
      return {
        value: C.zero(),
        method: '平凡零點',
        note: `s = ${s.toString(4)} 為平凡零點`,
        steps: [
          intro,
          {
            title: '平凡零點',
            formula: 'ζ(−2n) = 0，n = 1, 2, 3, …',
            lines: [`s = ${s.toString(4)} 為負偶整數點，ζ(s) = 0。`],
          },
        ],
      }
    }
  }

  if (depth >= 4) {
    const reflected = C.one().sub(s)
    const reflectedResult = zetaViaEtaDetailed(reflected)
    return {
      value: reflectedResult.value,
      method: 'Dirichlet η 級數',
      note: '遞迴深度上限，改用 η 級數',
      steps: [intro, ...reflectedResult.steps],
    }
  }

  const functional = zetaViaFunctionalEquationDetailed(s, depth)
  return {
    ...functional,
    steps: [intro, ...functional.steps],
  }
}

/** Evaluate the Riemann zeta function at complex s. */
export function zeta(s: C): ZetaResult {
  return zetaInternal(s, 0)
}

export function riemannSiegelTheta(t: number): number {
  if (t <= 0) {
    return 0
  }
  return (
    (t / 2) * Math.log(t / (2 * Math.PI)) -
    t / 2 -
    Math.PI / 8 +
    1 / (48 * t) -
    7 / (5760 * t ** 3)
  )
}

/** Hardy's Z-function: real-valued with zeros matching ζ(1/2+it). */
export function riemannSiegelZ(t: number, terms?: number): number {
  if (t <= 0) {
    return 0
  }

  const theta = riemannSiegelTheta(t)
  const zetaValue = zetaOnCriticalLine(t, terms)
  return Math.cos(theta) * zetaValue.re - Math.sin(theta) * zetaValue.im
}

const KNOWN_ZERO_GUESSES = [
  14.134725142691079, 21.022039638771555, 25.010857580145688, 30.424876126125955,
  32.935061587739586, 37.586178158825671, 40.918719012147495, 43.327073280914999,
  48.005150881167699, 49.773832477672302, 52.97032147872599, 56.446247697063394,
  59.347044002602353, 60.83177852460981, 65.112544048081606, 67.079810529494173,
  69.546401711173979, 72.067157674481907, 75.704690699083933, 77.144840068874805,
]

function zetaOnCriticalLine(t: number, terms?: number): C {
  const s = C.from(0.5, t)
  const count = terms ?? Math.max(80000, Math.ceil(80 * Math.abs(t)))
  const etaVal = dirichletEtaDetailed(s, count).value
  const factor = C.one().sub(C.pow(2, C.from(0.5, 0)))
  return etaVal.div(factor)
}

function refineZeroNewton(tGuess: number): number {
  let t = tGuess
  const fastTerms = 25000
  for (let i = 0; i < 30; i += 1) {
    const z = riemannSiegelZ(t, fastTerms)
    if (Math.abs(z) < 1e-10) {
      return t
    }
    const dz = (riemannSiegelZ(t + 1e-6, fastTerms) - riemannSiegelZ(t - 1e-6, fastTerms)) / 2e-6
    if (Math.abs(dz) < 1e-14) {
      break
    }
    t -= z / dz
  }
  return t
}

/** Find the first n non-trivial zeros on Re(s)=1/2 using Hardy's Z-function. */
export function findNontrivialZeros(count: number): ZetaZero[] {
  const zeros: ZetaZero[] = []
  const limit = Math.min(count, 20)

  for (let i = 0; i < limit; i += 1) {
    const guess = KNOWN_ZERO_GUESSES[i] ?? estimateZeroGuess(i)
    const refined = refineZeroNewton(guess)
    const s = C.from(0.5, refined)
    zeros.push({
      index: i + 1,
      t: refined,
      s,
      z: riemannSiegelZ(refined),
      zeta: zetaOnCriticalLine(refined),
    })
  }

  return zeros
}

function estimateZeroGuess(index: number): number {
  const lastKnown = KNOWN_ZERO_GUESSES.at(-1) ?? 14.134725
  const spacing = (2 * Math.PI) / Math.log(lastKnown / (2 * Math.PI))
  return lastKnown + spacing * (index - KNOWN_ZERO_GUESSES.length + 1)
}

export function getSpecialValues(): Array<{
  label: string
  exact: string
  computed: C
}> {
  return SPECIAL_VALUES.map((item) => ({
    label: item.label,
    exact: item.exact,
    computed: zeta(item.s).value,
  }))
}

export function formatComplex(value: C, precision = 10): string {
  return value.toString(precision)
}

/** 输入框内显示用：全角数字/标点转半角，便于中文输入法。 */
export function normalizeScalarTyping(text: string): string {
  return text
    .replace(/[\uFF10-\uFF19]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xff10 + 0x30))
    .replace(/[\uFF0E\u3002]/g, '.')
    .replace(/，/g, ',')
    .replace(/\s+/g, '')
}

/** 解析实部/虚部输入，支持小数点与中文逗号。 */
export function parseScalarInput(text: string): number | null {
  const normalized = normalizeScalarTyping(text.trim()).replace(/,/g, '.')
  if (
    normalized === '' ||
    normalized === '-' ||
    normalized === '+' ||
    normalized === '.' ||
    normalized === '-.' ||
    /\.$/.test(normalized) ||
    /[eE]$/.test(normalized)
  ) {
    return null
  }
  const value = Number(normalized)
  if (!Number.isFinite(value)) {
    return null
  }
  return value
}

export function parseComplexInput(reText: string, imText: string): C | null {
  const re = parseScalarInput(reText)
  if (re === null) {
    return null
  }
  const imTrim = imText.trim()
  const im = imTrim === '' ? 0 : parseScalarInput(imText)
  if (im === null) {
    return null
  }
  return C.from(re, im)
}

export function renderStepsHtml(steps: ZetaStep[]): string {
  return steps
    .map(
      (step, index) => `
      <article class="step-card">
        <div class="step-index">${index + 1}</div>
        <div class="step-body">
          <h3>${step.title}</h3>
          ${step.formula ? `<p class="step-formula">${step.formula}</p>` : ''}
          <pre>${step.lines.join('\n')}</pre>
        </div>
      </article>
    `,
    )
    .join('')
}

export function renderStepsText(steps: ZetaStep[]): string {
  return steps
    .map((step, index) => {
      const header = `${index + 1}. ${step.title}`
      const formula = step.formula ? `\n   ${step.formula}` : ''
      const body = step.lines.map((line) => `   ${line}`).join('\n')
      return `${header}${formula}\n${body}`
    })
    .join('\n\n')
}
