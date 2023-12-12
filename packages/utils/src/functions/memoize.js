/**
 * @template T
 * @template R
 * @param {function(...T[]):R } method
 * @return {function(...T[]):R}
 */
export function memoize (method) {
  const stored = new Map()
  return (...args) => {
    const key = JSON.stringify(args)
    if (stored.has(key)) {
      return stored.get(key)
    }
    const result = method(...args)
    stored.set(key, result)
    return result
  }
}
