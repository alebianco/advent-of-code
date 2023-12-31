/* eslint-disable no-labels */

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @return {Generator<T[]>}
 */
export function * powerSet (iterable) {
  const pool = Array.from(iterable)
  const n = pool.length
  const indices = new Uint32Array(n)
  for (let r = 0; r <= n; r++) {
    const result = Array(r)
    for (let i = 0; i < r; i++) {
      indices[i] = i
      result[i] = pool[i]
    }
    yield result
    while (true) {
      let i
      loop: {
        for (i = r - 1; i >= 0; i--) {
          if (indices[i] !== i + n - r) {
            break loop
          }
        }
        break
      }
      const result = Array(r)
      for (let j = 0; j < i; j++) {
        result[j] = pool[indices[j]]
      }
      let index = indices[i] += 1
      result[i] = pool[index]
      for (let j = i + 1; j < r; j++) {
        indices[j] = index += 1
        result[j] = pool[index]
      }
      yield result
    }
  }
}
