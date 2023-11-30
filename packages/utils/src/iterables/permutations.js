/* eslint-disable no-labels */

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @param {number} [k]
 * @return {Generator<T[]>}
 */
export function * permutations (iterable, k) {
  const pool = Array.from(iterable)
  const n = pool.length
  if (k === undefined) {
    k = n
  } else if (!Number.isInteger(k) || k < 0) {
    throw RangeError('k must be a non-negative integer')
  } else if (k > n) {
    return
  }
  const cycles = Array(k).fill(0).map((_, index) => n - index)
  const indices = new Uint32Array(n).map((_, index) => index)
  yield pool.slice(0, k)
  while (true) {
    loop: {
      for (let i = k - 1; i >= 0; i--) {
        cycles[i] -= 1
        if (cycles[i] === 0) {
          let index = indices[i]
          for (let j = n - 1; j >= i; j--) {
            const temp = index
            index = indices[j]
            indices[j] = temp
          }
          cycles[i] = n - i
        } else {
          const j = n - cycles[i]
          const temp = indices[i]
          indices[i] = indices[j]
          indices[j] = temp
          const result = Array(k)
          for (i = 0; i < k; i++) {
            result[i] = pool[indices[i]]
          }
          yield result
          break loop
        }
      }
      return
    }
  }
}

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @param {number} [k]
 * @return {Generator<T[]>}
 */
export function * permutationsWithReplacement (iterable, k) {
  const pool = Array.from(iterable)
  const n = pool.length
  if (k === undefined) {
    k = n
  } else if (!Number.isInteger(k) || k < 0) {
    throw RangeError('k must be a non-negative integer')
  }
  if (k === 0) {
    yield []
    return
  }
  if (n === 0 && k > 0) {
    return
  }
  const indices = new Uint32Array(k)
  yield Array(k).fill(pool[0])
  while (true) {
    let i
    loop: {
      for (i = k - 1; i >= 0; i--) {
        if (indices[i] === n - 1) {
          continue
        }
        const result = Array(k)
        for (let j = 0; j < i; j++) {
          result[j] = pool[indices[j]]
        }
        const index = indices[i] += 1
        result[i] = pool[index]
        for (let j = i + 1; j < k; j++) {
          indices[j] = 0
          result[j] = pool[0]
        }
        yield result
        break loop
      }
      return
    }
  }
}
