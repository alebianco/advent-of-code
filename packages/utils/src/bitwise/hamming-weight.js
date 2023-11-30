/**
 * fast function to compute the Hamming weight of a 32-bit unsigned integer
 * @param {number} v
 * @return {number}
 */
export function hammingWeight (v) {
  v -= (v >>> 1) & 0x55555555 // works with signed or unsigned shifts
  v = (v & 0x33333333) + ((v >>> 2) & 0x33333333)
  return (((v + (v >>> 4)) & 0xf0f0f0f) * 0x1010101) >>> 24
}

/**
 * fast function to compute the Hamming weight of four 32-bit unsigned integers
 * @param {number} v1
 * @param {number} v2
 * @param {number} v3
 * @param {number} v4
 * @return {number}
 */
export function hammingWeight4 (v1, v2, v3, v4) {
  v1 -= (v1 >>> 1) & 0x55555555 // works with signed or unsigned shifts
  v2 -= (v2 >>> 1) & 0x55555555 // works with signed or unsigned shifts
  v3 -= (v3 >>> 1) & 0x55555555 // works with signed or unsigned shifts
  v4 -= (v4 >>> 1) & 0x55555555 // works with signed or unsigned shifts

  v1 = (v1 & 0x33333333) + ((v1 >>> 2) & 0x33333333)
  v2 = (v2 & 0x33333333) + ((v2 >>> 2) & 0x33333333)
  v3 = (v3 & 0x33333333) + ((v3 >>> 2) & 0x33333333)
  v4 = (v4 & 0x33333333) + ((v4 >>> 2) & 0x33333333)

  v1 = (v1 + (v1 >>> 4)) & 0xf0f0f0f
  v2 = (v2 + (v2 >>> 4)) & 0xf0f0f0f
  v3 = (v3 + (v3 >>> 4)) & 0xf0f0f0f
  v4 = (v4 + (v4 >>> 4)) & 0xf0f0f0f
  return ((v1 + v2 + v3 + v4) * 0x1010101) >>> 24
}
