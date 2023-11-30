/**
 * @param {number} a
 * @param {number} b
 * @return {[number, number]}
 */
export function divmod (a, b) {
  return [Math.floor(a / b), a % b]
}
