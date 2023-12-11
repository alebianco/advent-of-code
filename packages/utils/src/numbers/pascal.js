import { HashMap } from '../collections/index.js'

const PASCAL = new HashMap([], ([n, k]) => `${n},${k}`)

/**
 * @param {number} row
 * @param {number} term
 * @return {number}
 */
export function pascal (row, term) {
  if (term > row) {
    return 0
  }

  if (term === 0 || term === row) {
    return 1
  }

  let value = PASCAL.get([row, term])
  if (value == null) {
    value = pascal(row - 1, term - 1) + pascal(row - 1, term)
    PASCAL.set([row, term], value)
  }
  return value
}

/**
 *
 * @param {number} row
 * @return {number[]}
 */
export function pascalRow (row) {
  const list = []
  for (let term = 0; term <= row; term++) {
    list.push(pascal(row, term))
  }
  return list
}
