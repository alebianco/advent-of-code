/**
 * @template T
 * @param {Iterable<T>} iterable where to take the values from
 * @param {function(value:T):void} action a function to execute for each value
 */
export function forEach (iterable, action) {
  for (const element of iterable) {
    action(element)
  }
}
