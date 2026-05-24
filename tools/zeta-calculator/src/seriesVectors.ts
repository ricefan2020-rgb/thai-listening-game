import { C } from './complex'

export interface VectorSample {
  index: number
  value: C
}

export function buildEtaTerms(s: C, count: number): VectorSample[] {
  const terms: VectorSample[] = []
  for (let n = 1; n <= count; n += 1) {
    const sign = n % 2 === 0 ? -1 : 1
    terms.push({
      index: n,
      value: C.pow(n, s.neg()).mul(C.from(sign, 0)),
    })
  }
  return terms
}

export function buildPartialSums(terms: VectorSample[]): VectorSample[] {
  let running = C.zero()
  return terms.map((term) => {
    running = running.add(term.value)
    return { index: term.index, value: running }
  })
}

export function deltaLayer(samples: VectorSample[]): VectorSample[] {
  const next: VectorSample[] = []
  for (let index = 0; index < samples.length - 1; index += 1) {
    next.push({
      index: samples[index + 1].index,
      value: samples[index + 1].value.sub(samples[index].value),
    })
  }
  return next
}

export function buildVectorLayers(base: VectorSample[], maxDepth: number): VectorSample[][] {
  const layers: VectorSample[][] = [base]
  let current = base
  for (let depth = 1; depth <= maxDepth && current.length > 1; depth += 1) {
    current = deltaLayer(current)
    layers.push(current)
  }
  return layers
}
