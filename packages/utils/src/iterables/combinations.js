/* eslint-disable no-labels */

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @param {number} k
 * @return {Generator<T[]>}
 */
export function * combinations (iterable, k) {
  if (!Number.isInteger(k) || k < 0) {
    throw RangeError('k must be a non-negative integer')
  }
  const pool = Array.from(iterable)
  const n = pool.length
  if (k > n) {
    return
  }
  const indices = new Uint32Array(k).map((_, index) => index)
  yield pool.slice(0, k)
  while (true) {
    let i
    loop: {
      for (i = k - 1; i >= 0; i--) {
        if (indices[i] !== i + n - k) {
          break loop
        }
      }
      return
    }
    const result = Array(k)
    for (let j = 0; j < i; j++) {
      result[j] = pool[indices[j]]
    }
    let index = indices[i] += 1
    result[i] = pool[index]
    for (let j = i + 1; j < k; j++) {
      indices[j] = index += 1
      result[j] = pool[index]
    }
    yield result
  }
}

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @param {number} k
 * @return {Generator<T[]>}
 */
export function * combinationsWithReplacement (iterable, k) {
  if (!Number.isInteger(k) || k < 0) {
    throw RangeError('k must be a non-negative integer')
  }
  const pool = Array.from(iterable)
  const n = pool.length
  if (n === 0 && k > 0) {
    return
  }
  const indices = new Uint32Array(k)
  yield Array(k).fill(pool[0])
  while (true) {
    let i
    loop: {
      for (i = k - 1; i >= 0; i--) {
        if (indices[i] !== n - 1) {
          break loop
        }
      }
      return
    }
    const result = Array(k)
    for (let j = 0; j < i; j++) {
      result[j] = pool[indices[j]]
    }
    const index = indices[i] + 1
    const element = pool[index]
    for (let j = i; j < k; j++) {
      indices[j] = index
      result[j] = element
    }
    yield result
  }
}
