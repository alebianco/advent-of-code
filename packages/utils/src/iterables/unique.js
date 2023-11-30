/**
 * @template T
 * @param {Iterable<T>} iterable
 * @param {function(T):string} [hasher]
 * @return {Generator<T[]>}
 */
export function * unique (iterable, hasher) {
  const seen = new Set()
  for (const element of iterable) {
    const value = hasher ? hasher(element) : element
    if (!seen.has(value)) {
      seen.add(value)
      yield element
    }
  }
}
