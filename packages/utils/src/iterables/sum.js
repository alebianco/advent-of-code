/**
 * @template T
 * @template U
 * @param {Iterable<T>} iterable
 * @param {U} [initialValue=0]
 * @param {function(T):U} [transform]
 * @return {U}
 */
export function sum (iterable, initialValue = 0, transform = undefined) {
  let sum = initialValue ?? null
  for (const element of iterable) {
    const value = transform != null ? transform(element) : element
    if (sum == null) {
      sum = value
    } else {
      sum += value
    }
  }
  return sum
}
