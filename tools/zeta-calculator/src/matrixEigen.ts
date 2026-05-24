import { C } from './complex'
import { complexEigenvalues, gramMatrix, symmetricEigenvalues } from './eigen'
import { kpiCard, wrapAnalysisCard } from './analysisLayout'
import { formatComplex } from './zeta'

export interface MatrixEigenOptions {
  sigma?: number
  tMin?: number
  tMax?: number
  size?: number
  /** 仅计算并展示项矩阵 A 与素数切片 P */
  simplified?: boolean
}

export interface MatrixEigenResult {
  sigma: number
  tValues: number[]
  primes: number[]
  termMatrix: C[][]
  primeSliceMatrix: C[][]
  primePowerMatrix: C[][]
  termEigenvalues: C[]
  primeSliceEigenvalues: C[]
  primePowerEigenvalues: C[]
  termGramEigenvalues: number[]
  primeSliceGramEigenvalues: number[]
  primePowerGramEigenvalues: number[]
}

function firstPrimes(count: number): number[] {
  const primes: number[] = []
  let candidate = 2
  while (primes.length < count) {
    let composite = false
    for (const prime of primes) {
      if (prime * prime > candidate) {
        break
      }
      if (candidate % prime === 0) {
        composite = true
        break
      }
    }
    if (!composite) {
      primes.push(candidate)
    }
    candidate += 1
  }
  return primes
}

function etaTerm(n: number, s: C): C {
  const sign = n % 2 === 0 ? -1 : 1
  return C.pow(n, s.neg()).mul(C.from(sign, 0))
}

function sAt(sigma: number, t: number): C {
  return C.from(sigma, t)
}

export function analyzeMatrixEigenvalues(options: MatrixEigenOptions = {}): MatrixEigenResult {
  const sigma = options.sigma ?? 0.5
  const size = Math.min(12, Math.max(3, options.size ?? 10))
  const tMin = options.tMin ?? 1
  const tMax = options.tMax ?? 10
  const step = size === 1 ? 0 : (tMax - tMin) / (size - 1)
  const tValues = Array.from({ length: size }, (_, index) =>
    size === 1 ? tMin : tMin + step * index,
  )
  const primes = firstPrimes(size)

  const simplified = options.simplified ?? true
  const termMatrix: C[][] = []
  const primeSliceMatrix: C[][] = []
  const primePowerMatrix: C[][] = []

  for (let row = 0; row < size; row += 1) {
    const sRow = sAt(sigma, tValues[row])
    const termRow: C[] = []
    const primeRow: C[] = []
    for (let col = 0; col < size; col += 1) {
      termRow.push(etaTerm(col + 1, sRow))
      primeRow.push(C.pow(primes[col], sRow.neg()))
    }
    termMatrix.push(termRow)
    primeSliceMatrix.push(primeRow)
  }

  if (!simplified) {
    for (let row = 0; row < size; row += 1) {
      const rowValues: C[] = []
      for (let col = 0; col < size; col += 1) {
        const sCol = sAt(sigma, tValues[col])
        rowValues.push(C.pow(primes[row], sCol.neg().mul(C.from(col + 1, 0))))
      }
      primePowerMatrix.push(rowValues)
    }
  }

  return {
    sigma,
    tValues,
    primes,
    termMatrix,
    primeSliceMatrix,
    primePowerMatrix,
    termEigenvalues: complexEigenvalues(termMatrix),
    primeSliceEigenvalues: complexEigenvalues(primeSliceMatrix),
    primePowerEigenvalues: simplified ? [] : complexEigenvalues(primePowerMatrix),
    termGramEigenvalues: symmetricEigenvalues(gramMatrix(termMatrix)).reverse(),
    primeSliceGramEigenvalues: symmetricEigenvalues(gramMatrix(primeSliceMatrix)).reverse(),
    primePowerGramEigenvalues: simplified ? [] : symmetricEigenvalues(gramMatrix(primePowerMatrix)).reverse(),
  }
}

function formatEigenList(values: C[]): string {
  return values
    .map((value, index) => {
      const magnitude = value.abs()
      return `${index + 1}. ${formatComplex(value, 6)}  |λ|=${magnitude.toExponential(4)}`
    })
    .join('\n')
}

function formatRealEigenList(values: number[]): string {
  return values
    .map((value, index) => `${index + 1}. ${value.toExponential(6)}`)
    .join('\n')
}

function renderMatrixPreview(matrix: C[][], rowLabels: string[], colLabels: string[]): string {
  const head = colLabels.map((label) => label.padStart(8)).join('')
  const lines = [head]
  for (let row = 0; row < matrix.length; row += 1) {
    const cells = matrix[row]
      .map((value) => formatComplex(value, 3).padStart(8))
      .join('')
    lines.push(`${rowLabels[row].padEnd(4)}${cells}`)
  }
  return `<pre class="code-block">${lines.join('\n')}</pre>`
}

export function renderMatrixEigenHtml(result: MatrixEigenResult, simplified = true): string {
  const tLabels = result.tValues.map((t) => `t=${t.toFixed(2)}`)
  const nLabels = Array.from({ length: result.tValues.length }, (_, index) => `n=${index + 1}`)
  const pLabels = result.primes.map((prime) => `p=${prime}`)

  const comparisonRows = `
        <tr>
          <td>项矩阵 A</td>
          <td>行=虚部 t，列=前 N 个 η 项 a_n</td>
          <td>${result.termEigenvalues[0]?.abs().toExponential(4) ?? '—'}</td>
          <td>${result.termGramEigenvalues[0]?.toExponential(4) ?? '—'}</td>
        </tr>
        <tr>
          <td>素数切片 P</td>
          <td>行= t，列=前 N 个素数；元 p^{-s(t)}（Euler 局部因子）</td>
          <td>${result.primeSliceEigenvalues[0]?.abs().toExponential(4) ?? '—'}</td>
          <td>${result.primeSliceGramEigenvalues[0]?.toExponential(4) ?? '—'}</td>
        </tr>
        ${
          simplified
            ? ''
            : `<tr>
          <td>素数幂 Q</td>
          <td>行=素数 p_i，列=幂 j；元 p_i^{-j·s(t_j)}</td>
          <td>${result.primePowerEigenvalues[0]?.abs().toExponential(4) ?? '—'}</td>
          <td>${result.primePowerGramEigenvalues[0]?.toExponential(4) ?? '—'}</td>
        </tr>`
        }`

  const comparison = `
    <table class="data-table">
      <thead>
        <tr>
          <th>矩阵</th>
          <th>含义</th>
          <th>最大 |λ|</th>
          <th>最大 Gram 特征值</th>
        </tr>
      </thead>
      <tbody>${comparisonRows}</tbody>
    </table>
  `

  const sections = [
    {
      title: simplified ? 'A 与 P 对比' : '三种矩阵对比',
      html: comparison,
      open: true,
    },
    {
      title: '项矩阵 A_{t,n} = (−1)^{n−1} n^{−s(t)}',
      html: `${renderMatrixPreview(result.termMatrix, tLabels, nLabels)}
          <p class="note">特征值（|λ| 降序）</p>
          <pre class="code-block">${formatEigenList(result.termEigenvalues)}</pre>
          <p class="note">Gram G=AA*（降序，实数）</p>
          <pre class="code-block">${formatRealEigenList(result.termGramEigenvalues)}</pre>`,
    },
    {
      title: '素数切片 P_{t,p} = p^{−s(t)}',
      html: `${renderMatrixPreview(result.primeSliceMatrix, tLabels, pLabels)}
          <p class="note">特征值（|λ| 降序）</p>
          <pre class="code-block">${formatEigenList(result.primeSliceEigenvalues)}</pre>
          <p class="note">Gram G=PP*（降序，实数）</p>
          <pre class="code-block">${formatRealEigenList(result.primeSliceGramEigenvalues)}</pre>`,
    },
  ]

  if (!simplified) {
    sections.push({
      title: '素数幂 Q_{p,j} = p^{−j·s(t_j)}',
      html: `${renderMatrixPreview(result.primePowerMatrix, pLabels, tLabels.map((label) => label.replace('t=', 'j=')))}
          <p class="note">特征值（|λ| 降序）</p>
          <pre class="code-block">${formatEigenList(result.primePowerEigenvalues)}</pre>
          <p class="note">Gram G=QQ*（降序，实数）</p>
          <pre class="code-block">${formatRealEigenList(result.primePowerGramEigenvalues)}</pre>`,
    })
  }

  sections.push({
    title: '和素数怎么读这些数',
    html: `<ul class="note-list">
          <li><strong>A</strong>：按 n 截断 η；合成数 n=6=2·3 把多个素数幂揉进同一列。</li>
          <li><strong>P</strong>：按素数 p 切片，元为 Euler 因子 p^{-s}；与「Euler 乘积」页同一语言。</li>
          ${
            simplified
              ? ''
              : '<li><strong>Q</strong>：素数塔 p^{-js}，与「项分解」页同一语言。</li>'
          }
          <li>λ 不是素数编号；大 |λ| / 大 Gram 值只表示截断子空间里的主导方向。</li>
        </ul>`,
    open: true,
  })

  return wrapAnalysisCard({
    title: simplified ? '矩阵特征值：A（项）vs P（素数）' : '矩阵特征值：项 vs 素数（含 Q）',
    tag: 'λ',
    lead: `固定 Re(s)=${result.sigma}，Im(s) 取 t=${result.tValues[0].toFixed(2)}…${result.tValues[result.tValues.length - 1].toFixed(2)}（${result.tValues.length} 点）。${
      simplified
        ? '简化模式只对比 η 前 N 项矩阵 A 与素数局部因子矩阵 P。'
        : '完整模式含素数幂矩阵 Q。'
    }`,
    kpis: [
      kpiCard('σ = Re(s)', String(result.sigma)),
      kpiCard('维度', `${result.tValues.length}×${result.tValues.length}`),
      kpiCard('素数列', result.primes.join(', ')),
      kpiCard('模式', simplified ? 'A vs P' : 'A + P + Q'),
    ].join(''),
    pattern:
      'A 用加法语言（级数项）；P 用乘法语言（每个素数一列）。比较两者的 λ 与 Gram，可看「按 n」与「按 p」截断时几何结构的差异。',
    sections,
    footnote: simplified
      ? '勾选「显示素数幂 Q」可展开第三矩阵。链接 ?tab=evaluate 可回到 ζ 计算。'
      : '取消简化可显示 Q。数值：特征多项式插值 + Durand–Kerner；Gram 用 Jacobi。',
  })
}
