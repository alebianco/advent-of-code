/* eslint-disable no-labels */

/**
 * @template T
 * @param {...T[]} iterables
 * @return {Generator<T[]>}
 */
export function * cartesian (...iterables) {
  const pools = iterables.map((iterable) => [...iterable])
  const n = pools.length
  if (n === 0) {
    yield []
    return
  }
  if (pools.some((pool) => pool.length === 0)) {
    return
  }
  const indices = new Uint32Array(n)
  yield pools.map((pool) => pool[0])
  while (true) {
    loop: {
      for (let i = n - 1; i >= 0; i--) {
        if (indices[i] === pools[i].length - 1) {
          continue
        }
        const result = Array(n)
        for (let j = 0; j < i; j++) {
          result[j] = pools[j][indices[j]]
        }
        const index = indices[i] += 1
        result[i] = pools[i][index]
        for (let j = i + 1; j < n; j++) {
          indices[j] = 0
          result[j] = pools[j][0]
        }
        yield result
        break loop
      }
      return
    }
  }
}
