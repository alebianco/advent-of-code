/**
 * @template T
 * @param {Iterable<T>} iterable
 * @return {T[]}
 */
export function toArray (iterable) {
  return Array.from(iterable)
}
