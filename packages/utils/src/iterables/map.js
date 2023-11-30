/**
 * @template T
 * @template U
 * @param {Iterable<T>} source
 * @param {function(T):U} transform
 * @return {Generator<U>}
 */
export function * map (source, transform) {
  for (const element of source) {
    yield transform(element)
  }
}
