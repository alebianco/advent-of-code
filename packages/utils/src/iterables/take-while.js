/**
 * @template T
 * @param {Iterable<T>} iterable
 * @param {Predicate<T>} [predicate]
 * @returns {Generator<T>}
 */
export function * takeWhile (iterable, predicate = Boolean) {
  for (const element of iterable) {
    if (predicate(element)) {
      yield element
    } else {
      break
    }
  }
}
