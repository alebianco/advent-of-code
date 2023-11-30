/**
 * @template T
 * @param {Iterable<T>} iterable
 * @return {Generator<T>}
 */
export function * cycle (iterable) {
  const saved = []
  for (const element of iterable) {
    yield element
    saved.push(element)
  }

  if (saved.length > 0) {
    while (true) {
      yield * saved
    }
  }
}
