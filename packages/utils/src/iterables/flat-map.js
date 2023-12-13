/**
 * @template T
 * @template U
 * @param {Iterable<T>} source
 * @param {function(T):Iterator<U>} transform
 * @return {Generator<U>}
 */
export function * flatMap (source, transform) {
  for (const element of source) {
    yield * transform(element)
  }
}
