import { C } from './complex'

/** Real symmetric matrix eigenvalues (Jacobi), ascending order. */
export function symmetricEigenvalues(matrix: number[][], maxIter = 80): number[] {
  const n = matrix.length
  const a = matrix.map((row) => row.slice())

  for (let iter = 0; iter < maxIter; iter += 1) {
    let p = 0
    let q = 1
    let max = Math.abs(a[p][q])
    for (let row = 0; row < n; row += 1) {
      for (let col = row + 1; col < n; col += 1) {
        const value = Math.abs(a[row][col])
        if (value > max) {
          max = value
          p = row
          q = col
        }
      }
    }
    if (max < 1e-12) {
      break
    }

    const app = a[p][p]
    const aqq = a[q][q]
    const apq = a[p][q]
    const phi = 0.5 * Math.atan2(2 * apq, aqq - app)
    const c = Math.cos(phi)
    const s = Math.sin(phi)

    for (let row = 0; row < n; row += 1) {
      if (row === p || row === q) {
        continue
      }
      const aip = a[row][p]
      const aiq = a[row][q]
      a[row][p] = c * aip - s * aiq
      a[p][row] = a[row][p]
      a[row][q] = s * aip + c * aiq
      a[q][row] = a[row][q]
    }

    a[p][p] = c * c * app - 2 * s * c * apq + s * s * aqq
    a[q][q] = s * s * app + 2 * s * c * apq + c * c * aqq
    a[p][q] = 0
    a[q][p] = 0
  }

  const eigenvalues = Array.from({ length: n }, (_, index) => a[index][index])
  eigenvalues.sort((left, right) => left - right)
  return eigenvalues
}

function cloneMatrix(matrix: C[][]): C[][] {
  return matrix.map((row) => row.map((value) => C.from(value.re, value.im)))
}

function xIdentityMinusA(matrix: C[][], x: C): C[][] {
  return matrix.map((row, rowIndex) =>
    row.map((value, colIndex) => (rowIndex === colIndex ? x.sub(value) : value.neg())),
  )
}

function determinant(matrix: C[][]): C {
  const n = matrix.length
  const work = cloneMatrix(matrix)
  let det = C.one()
  let sign = 1

  for (let col = 0; col < n; col += 1) {
    let pivotRow = col
    let pivotAbs = work[col][col].abs()
    for (let row = col + 1; row < n; row += 1) {
      const abs = work[row][col].abs()
      if (abs > pivotAbs) {
        pivotAbs = abs
        pivotRow = row
      }
    }

    if (pivotAbs < 1e-14) {
      return C.zero()
    }

    if (pivotRow !== col) {
      ;[work[col], work[pivotRow]] = [work[pivotRow], work[col]]
      sign *= -1
    }

    const pivot = work[col][col]
    det = det.mul(pivot)

    for (let row = col + 1; row < n; row += 1) {
      const factor = work[row][col].div(pivot)
      if (factor.abs() < 1e-14) {
        continue
      }
      for (let inner = col; inner < n; inner += 1) {
        work[row][inner] = work[row][inner].sub(factor.mul(work[col][inner]))
      }
    }
  }

  return sign === 1 ? det : det.neg()
}

/** det(xI − A) sampled at n+1 points, then recovered as monic polynomial coefficients. */
function characteristicPolynomialCoefficients(matrix: C[][]): C[] {
  const n = matrix.length
  const sampleCount = n + 1
  const samples: C[] = []
  const values: C[] = []

  for (let index = 0; index < sampleCount; index += 1) {
    const angle = (2 * Math.PI * index) / sampleCount
    const x = C.from(Math.cos(angle) * 1.7, Math.sin(angle) * 1.7)
    samples.push(x)
    values.push(determinant(xIdentityMinusA(matrix, x)))
  }

  return solveMonicPolynomialFromSamples(samples, values)
}

function solveLinearSystem(matrix: C[][], rhs: C[]): C[] {
  const n = matrix.length
  const work = matrix.map((row) => row.slice())
  const vector = rhs.slice()

  for (let col = 0; col < n; col += 1) {
    let pivotRow = col
    let pivotAbs = work[col][col].abs()
    for (let row = col + 1; row < n; row += 1) {
      const abs = work[row][col].abs()
      if (abs > pivotAbs) {
        pivotAbs = abs
        pivotRow = row
      }
    }
    if (pivotAbs < 1e-14) {
      return vector
    }
    if (pivotRow !== col) {
      ;[work[col], work[pivotRow]] = [work[pivotRow], work[col]]
      ;[vector[col], vector[pivotRow]] = [vector[pivotRow], vector[col]]
    }

    const pivot = work[col][col]
    for (let row = col + 1; row < n; row += 1) {
      const factor = work[row][col].div(pivot)
      for (let inner = col; inner < n; inner += 1) {
        work[row][inner] = work[row][inner].sub(factor.mul(work[col][inner]))
      }
      vector[row] = vector[row].sub(factor.mul(vector[col]))
    }
  }

  const solution = Array.from({ length: n }, () => C.zero())
  for (let row = n - 1; row >= 0; row -= 1) {
    let sum = vector[row]
    for (let col = row + 1; col < n; col += 1) {
      sum = sum.sub(work[row][col].mul(solution[col]))
    }
    solution[row] = sum.div(work[row][row])
  }
  return solution
}

function solveMonicPolynomialFromSamples(samples: C[], values: C[]): C[] {
  const n = samples.length - 1
  const matrix: C[][] = []
  const rhs: C[] = []

  for (let index = 0; index < n; index += 1) {
    const x = samples[index]
    const row: C[] = []
    for (let power = n - 1; power >= 0; power -= 1) {
      row.push(x.pow(C.from(power, 0)))
    }
    matrix.push(row)
    rhs.push(values[index].sub(x.pow(C.from(n, 0))))
  }

  const lowerCoeffs = solveLinearSystem(matrix, rhs)
  return [C.one(), ...lowerCoeffs]
}

function evaluatePolynomial(coeffs: C[], z: C): C {
  let value = C.zero()
  for (const coefficient of coeffs) {
    value = value.mul(z).add(coefficient)
  }
  return value
}

/** Durand–Kerner roots of monic polynomial (complex). */
function durandKernerRoots(coeffs: C[], maxIter = 120): C[] {
  const degree = coeffs.length - 1
  const radius = 1 + coeffs.slice(1).reduce((max, coefficient) => Math.max(max, coefficient.abs()), 0)
  const roots = Array.from({ length: degree }, (_, index) => {
    const angle = (2 * Math.PI * index) / degree
    return C.from(radius * Math.cos(angle), radius * Math.sin(angle))
  })

  for (let iter = 0; iter < maxIter; iter += 1) {
    const next = roots.map((root) => root)
    let maxDelta = 0

    for (let index = 0; index < degree; index += 1) {
      const value = evaluatePolynomial(coeffs, roots[index])
      let denominator = C.one()
      for (let other = 0; other < degree; other += 1) {
        if (other === index) {
          continue
        }
        denominator = denominator.mul(roots[index].sub(roots[other]))
      }
      if (denominator.abs() < 1e-14) {
        continue
      }
      const correction = value.div(denominator)
      next[index] = roots[index].sub(correction)
      maxDelta = Math.max(maxDelta, correction.abs())
    }

    for (let index = 0; index < degree; index += 1) {
      roots[index] = next[index]
    }
    if (maxDelta < 1e-10) {
      break
    }
  }

  roots.sort((left, right) => right.abs() - left.abs())
  return roots
}

/** Complex eigenvalues via characteristic polynomial + Durand–Kerner (n ≤ ~16). */
export function complexEigenvalues(matrix: C[][]): C[] {
  const coeffs = characteristicPolynomialCoefficients(matrix)
  return durandKernerRoots(coeffs)
}

export function gramMatrix(matrix: C[][]): number[][] {
  const n = matrix.length
  const gram = Array.from({ length: n }, () => Array.from({ length: n }, () => 0))
  for (let row = 0; row < n; row += 1) {
    for (let col = row; col < n; col += 1) {
      let sum = 0
      for (let inner = 0; inner < matrix[row].length; inner += 1) {
        const a = matrix[row][inner]
        const b = matrix[col][inner]
        sum += a.re * b.re + a.im * b.im
      }
      gram[row][col] = sum
      gram[col][row] = sum
    }
  }
  return gram
}
