/**
 * @template T
 * @template U
 * @param {Iterable<T>} source
 * @param {function(U, T):U} reducer
 * @param {U} [initialValue]
 * @return {U}
 */
export function reduce (source, reducer, initialValue = undefined) {
  let result = initialValue
  for (const element of source) {
    if (result === undefined) {
      result = element
    } else {
      result = reducer(result, element)
    }
  }
  return result
}
