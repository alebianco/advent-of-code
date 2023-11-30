/**
 * @template T
 * @param {Iterable<T>} [obj]
 * @return {boolean}
 */
export function isIterable (obj) {
  if (obj) {
    return obj[Symbol.iterator] !== undefined
  }
  return false
}
