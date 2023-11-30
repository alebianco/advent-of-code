/**
 * @param {string} value
 * @return {number}
 */
export function bin2Dec (value) {
  return parseInt(value, 2)
}

/**
 * @param {number} value
 * @return {string}
 */
export function dec2bin (value) {
  return (value >>> 0).toString(2)
}
