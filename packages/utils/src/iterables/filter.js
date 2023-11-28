/**
 * @template T
 * @param {Iterable<T>} iterable
 * @param {Predicate<T>} predicate
 * @returns {Generator<T>}
 */
export function * filter (iterable, predicate) {
  for (const element of iterable) {
    if (predicate(element)) {
      yield element
    }
  }
}
