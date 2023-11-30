/**
 * @template T
 * @param {Iterable<T>} iterable
 * @param {number} limit
 * @return {Generator<T>}
 */
export function * take (iterable, limit) {
  let count = 0
  for (const element of iterable) {
    if (count++ >= limit) {
      break
    }
    yield element
  }
}

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @return {T}
 */
export function first (iterable) {
  return take(iterable, 1).next().value
}
