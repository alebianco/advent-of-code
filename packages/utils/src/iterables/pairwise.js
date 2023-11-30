/**
 * @template T
 * @param {Iterable<T>} iterable
 * @return {Generator<[T, T]>}
 */
export function * pairwise (iterable) {
  let previous = null
  for (const current of iterable) {
    if (previous == null) {
      previous = current
    } else {
      yield [previous, current]
      previous = current
    }
  }
}
