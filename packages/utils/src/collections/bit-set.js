import { hammingWeight, hammingWeight4 } from '../bitwise/index.js'
import { isIterable } from '../iterables/index.js'

const BASE64_DECODE_TABLE = [
  80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, /* 0 - 15 */
  80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, /* 16 - 31 */
  80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 62, 80, 80, 80, 63, /* 32 - 47 */
  52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 80, 80, 80, 64, 80, 80, /* 48 - 63 */
  80, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, /* 64 - 79 */
  15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 80, 80, 80, 80, 80, /* 80 - 96 */
  80, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, /* 87 - 111 */
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 80, 80, 80, 80, 80 /* 112 - 127 */
]

const BASE64_ENCODE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

export class BitSet {
  /**
   * @type {Uint32Array}
   */
  words

  /**
   * @param {Iterable<number>} [iterable]
   * @param {Uint32Array} [words]
   */
  constructor (iterable, words = new Uint32Array(8)) {
    this.words = words
    if (isIterable(iterable)) {
      for (const key of iterable) {
        this.add(key)
      }
    }
  }

  /**
   * Returns a new TypedFastBitset given a Uint32Array of words
   * @param {Iterable<number>} words
   * @return {BitSet}
   */
  static fromWords (words) {
    return new BitSet(undefined, Uint32Array.from(words))
  }

  /**
   * Returns a new TypedFastBitset given an integer
   * @param {number} value
   * @return {BitSet}
   */
  static fromNumber (value) {
    return BitSet.fromWords([value | 0])
  }

  /**
   * Returns a new TypedFastBitset given a binary number representation
   * @param {string} value
   * @return {BitSet}
   */
  static fromBinaryString (value) {
    const base = 2
    const len = 32

    if (value.startsWith('0b')) {
      value = value.substring(2)
    }

    const words = []

    let a = value.length - len
    let b = value.length

    do {
      const num = parseInt(value.slice(a > 0 ? a : 0, b), base)

      if (isNaN(num)) {
        throw SyntaxError('Invalid param')
      }

      words.push(num | 0)

      if (a <= 0) {
        break
      }

      a -= len
      b -= len
    } while (1)

    return BitSet.fromWords(words)
  }

  /**
   * Returns a new TypedFastBitset given a hex number representation
   * @param {string} value
   * @return {BitSet}
   */
  static fromHexString (value) {
    const base = 16
    const len = 8

    if (value.startsWith('0x')) {
      value = value.substring(2)
    }

    const words = []

    let a = value.length - len
    let b = value.length

    do {
      const num = parseInt(value.slice(a > 0 ? a : 0, b), base)

      if (isNaN(num)) {
        throw SyntaxError('Invalid param')
      }

      words.push(num | 0)

      if (a <= 0) {
        break
      }

      a -= len
      b -= len
    } while (1)

    return BitSet.fromWords(words)
  }

  /**
   * Returns a new TypedFastBitset given a base64 number representation
   * @param {string} value
   * @return {BitSet}
   */
  static fromBase64String (value) {
    const words = new Uint32Array(value.length / 4)
    const output = new DataView(words.buffer)

    const isLastQuadrupleIncomplete = value.endsWith('=')
    const lastCompleteQuadrupleIndex = (value.length / 4 - isLastQuadrupleIncomplete ? 1 : 0) * 4

    let writeHead = 0
    let i = 0
    for (i = 0; i < lastCompleteQuadrupleIndex; i += 4) {
      const b1 = BASE64_DECODE_TABLE[value.charCodeAt(i)]
      const b2 = BASE64_DECODE_TABLE[value.charCodeAt(i + 1)]
      const b3 = BASE64_DECODE_TABLE[value.charCodeAt(i + 2)]
      const b4 = BASE64_DECODE_TABLE[value.charCodeAt(i + 3)]

      /* get 3 bytes from 4 base64 characters */
      output.setUint8(writeHead++, (b1 << 2 | ((b2 & 0xF0) >> 4)))
      output.setUint8(writeHead++, (((b2 & 0x0F) << 4) | ((b3 & 0x3C) >> 2)))
      output.setUint8(writeHead++, (((b3 & 0x03) << 6) | (b4 & 0x3F)))
    }

    /* decode last quadruple if incomplete */
    if (isLastQuadrupleIncomplete) {
      const b1 = BASE64_DECODE_TABLE[value.charCodeAt(i)]
      const b2 = BASE64_DECODE_TABLE[value.charCodeAt(i + 1)]
      output.setUint8(writeHead++, (b1 << 2 | ((b2 & 0xF0) >> 4)))

      if (value[i + 2] === '=') {
        /* already added first output character */
      } else {
        /* decode second byte of triple */
        const b3 = BASE64_DECODE_TABLE[value.charCodeAt(i + 2)]
        output.setUint8(writeHead++, (((b2 & 0x0F) << 4) | ((b3 & 0x3C) >> 2)))
      }
    }

    return new BitSet(undefined, words)
  }

  /**
   * Calculates the index of the Most Significant Bit
   * @return {number}
   */
  msb () {
    for (let i = this.words.length; i-- > 0;) {
      const c = Math.clz32(this.words[i])
      if (c !== 32) {
        return (i * 32) + 32 - 1 - c
      }
    }
  }

  /**
   * Calculates the index of the Least Significant Bit
   * @return {number}
   */
  lsb () {
    for (let i = 0; i < this.words.length; i++) {
      const v = this.words[i]
      let c = 0
      if (v) {
        let bit = (v & -v)
        for (; (bit >>>= 1); c++) {
          /* progress counter */
        }
        return 32 * i + c
      }
    }
    return 0
  }

  /**
   * Add the value (Set the bit at index to true)
   * @param {number} index
   */
  add (index) {
    this.resize(index)
    this.words[index >>> 5] |= 1 << index
  }

  /**
   *  If the value was not in the set, add it, otherwise remove it (flip bit at index)
   *  @param {number} index
   */
  flip (index) {
    this.resize(index)
    this.words[index >>> 5] ^= 1 << index
  }

  /**
   * Gets a range from start (inclusive) to end (exclusive) as a new BitSet
   * @param {number} [start]
   * @param {number} [end]
   * @return {BitSet}
   */
  slice (start, end) {
    start = Math.min(start ?? 0, (this.words.length << 5))
    end = Math.min(end ?? Infinity, (this.words.length << 5))

    const result = new BitSet()
    if (start <= end && start >= 0) {
      for (let i = start; i < end; i++) {
        if (this.has(i)) {
          result.add(i - start)
        }
      }
    }
    return result
  }

  shiftRight (offset) {
    this.words = this.words.slice(offset >> 5)
    const words = this.words
    offset = offset % 32

    for (let i = 0; i < words.length - 1; i++) {
      words[i] >>>= offset // Shift current word
      words[i] |= words[i + 1] << (32 - offset) // Do the carry
    }
    words[words.length - 1] >>>= offset // shift [words.length-1] separately, since no carry

    return this
  }

  shiftLeft (offset) {
    const size = (this.msb() + offset) >> 5
    if (size > this.words.length - 1) {
      this.resize(size << 5)
    }

    const words = this.words
    words.copyWithin(offset >> 5)
    words.fill(0, 0, offset >> 5)
    offset = offset % 32

    if (offset > 0) {
      for (let i = words.length - 1; i > 0; i--) {
        words[i] <<= offset // Shift current word
        words[i] |= words[i - 1] >>> (32 - offset) // Do the carry
      }
      words[0] <<= offset // shift [0] separately, since no carry
    }
    return this
  }

  /**
   * Remove all values, reset memory usage
   */
  clear () {
    this.words = new Uint32Array(8)
  }

  /**
   * Set the bit at index to false
   * @param {number} index
   */
  remove (index) {
    this.resize(index)
    this.words[index >>> 5] &= ~(1 << index)
  }

  /**
   * Set bits from start (inclusive) to end (exclusive)
   * @param {number} start
   * @param {number} end
   */
  addRange (start, end) {
    if (start >= end) {
      return
    }

    if (this.words.length << 5 <= end) {
      this.resize(end)
    }
    const words = this.words

    const firstWord = start >> 5
    const endWord = (end - 1) >> 5

    if (firstWord === endWord) {
      words[firstWord] |= (~0 << start) & (~0 >>> -end)
      return
    }
    words[firstWord] |= ~0 << start
    words.fill(~0, firstWord + 1, endWord)
    words[endWord] |= ~0 >>> -end
  }

  /**
   * Remove bits from start (inclusive) to end (exclusive)
   * @param {number} start
   * @param {number} end
   */
  removeRange (start, end) {
    const words = this.words
    start = Math.min(start, (words.length << 5) - 1)
    end = Math.min(end, (words.length << 5) - 1)

    if (start >= end) {
      return
    }
    const firstWord = start >> 5
    const endWord = (end - 1) >> 5

    if (firstWord === endWord) {
      words[firstWord] &= ~((~0 << start) & (~0 >>> -end))
      return
    }
    words[firstWord] &= ~(~0 << start)
    words.fill(0, firstWord + 1, endWord)
    words[endWord] &= ~(~0 >>> -end)
  }

  /**
   * Flip bits from start (inclusive) to end (exclusive)
   * @param {number} start
   * @param {number} end
   */
  flipRange (start, end) {
    if (start >= end) {
      return
    }

    if (this.words.length << 5 <= end) {
      this.resize(end)
    }

    const words = this.words

    const firstWord = start >> 5
    const endWord = (end - 1) >> 5

    if (firstWord === endWord) {
      words[firstWord] ^= (~0 << start) & (~0 >>> -end)
      return
    }

    words[firstWord] ^= ~0 << start
    for (let index = firstWord + 1; index < endWord; index++) {
      words[index] ^= ~0
    }
    words[endWord] ^= ~0 >>> -end
  }

  /**
   * Returns true if no bit is set
   * @return {boolean}
   */
  isEmpty () {
    const words = this.words
    const c = words.length
    for (let i = 0; i < c; i++) {
      if (words[i] !== 0) return false
    }
    return true
  }

  /**
   * Is the value contained in the set? Is the bit at index true or false?
   * @param {number} index
   * @return {boolean}
   */
  has (index) {
    return (this.words[index >>> 5] & (1 << index)) !== 0
  }

  /**
   * Tries to add the value (Set the bit at index to true)
   *
   * Returns 1 if the value was added, 0 if the value was already present
   * @param {number} index
   * @return {0|1}
   */
  checkedAdd (index) {
    const words = this.words
    this.resize(index)
    const word = words[index >>> 5]
    const newWord = word | (1 << index)
    words[index >>> 5] = newWord
    return ((newWord ^ word) >>> index)
  }

  /**
   * Reduce the memory usage to a minimum
   */
  trim () {
    const words = this.words
    let nl = words.length
    while (nl > 0 && words[nl - 1] === 0) {
      nl--
    }
    this.words = words.slice(0, nl)
  }

  /**
   * Resize the bitset so that we can write a value at index
   * @param {number} index
   */
  resize (index) {
    const words = this.words
    if (words.length << 5 > index) return
    const count = (index + 32) >>> 5 // just what is needed
    const newWords = new Uint32Array(count << 1)
    newWords.set(words) // hopefully, this copy is fast
    this.words = newWords
  }

  /**
   * Returns how many values stored in the set? How many set bits?
   * @return {number}
   */
  size () {
    const words = this.words
    let answer = 0
    const c = words.length
    let k = 0 | 0
    for (; k + 4 < c; k += 4) {
      answer += hammingWeight4(
        words[k] | 0,
        words[k + 1] | 0,
        words[k + 2] | 0,
        words[k + 3] | 0
      )
    }

    for (; k < c; ++k) {
      answer += hammingWeight(words[k] | 0)
    }
    return answer
  }

  /**
   * Return an array with the set bit locations (values)
   * @return {number[]}
   */
  array () {
    const words = this.words
    const answer = new Array(this.size())
    let pos = 0 | 0
    const c = words.length
    for (let k = 0; k < c; ++k) {
      let w = words[k]
      while (w !== 0) {
        const t = w & -w
        answer[pos++] = (k << 5) + hammingWeight((t - 1) | 0)
        w ^= t
      }
    }
    return answer
  }

  /**
   * @param {function(id:number):void} fnc
   */
  forEach (fnc) {
    const words = this.words
    const c = words.length
    for (let k = 0; k < c; ++k) {
      let w = words[k]
      while (w !== 0) {
        const t = w & -w
        fnc(((k << 5) + hammingWeight(t - 1)) | 0)
        w ^= t
      }
    }
  }

  /**
   * Iterator of set bit locations (values)
   * @return {IterableIterator<number>}
   */
  [Symbol.iterator] () {
    const words = this.words
    const c = words.length
    let k = 0
    let w = words[k]

    return {
      [Symbol.iterator] () {
        return this
      },
      next () {
        while (k < c) {
          if (w !== 0) {
            const t = w & -w
            const value = (k << 5) + hammingWeight((t - 1) | 0)
            w ^= t
            return { done: false, value }
          } else {
            k++
            if (k < c) {
              w = words[k]
            }
          }
        }
        return { done: true, value: undefined }
      }
    }
  }

  /**
   * Returns a copy of this bitmap
   * @return {BitSet}
   */
  clone () {
    return new BitSet(undefined, new Uint32Array(this.words))
  }

  /**
   * Check if this bitset intersects with another one, no bitmap is modified
   * @param {BitSet} otherBitmap
   * @return {boolean}
   */
  intersects (otherBitmap) {
    const words = this.words
    const otherWords = otherBitmap.words
    const newCount = Math.min(words.length, otherWords.length)
    for (let k = 0 | 0; k < newCount; ++k) {
      if ((words[k] & otherWords[k]) !== 0) return true
    }
    return false
  }

  /**
   * Computes the intersection between this bitset and another one, the current bitmap is modified (and returned by the function)
   * @param {BitSet} otherBitmap
   * @return {this}
   */
  intersection (otherBitmap) {
    const words = this.words
    const otherWords = otherBitmap.words
    const newCount = Math.min(words.length, otherWords.length)
    let k = 0 | 0
    for (; k + 7 < newCount; k += 8) {
      words[k] &= otherWords[k]
      words[k + 1] &= otherWords[k + 1]
      words[k + 2] &= otherWords[k + 2]
      words[k + 3] &= otherWords[k + 3]
      words[k + 4] &= otherWords[k + 4]
      words[k + 5] &= otherWords[k + 5]
      words[k + 6] &= otherWords[k + 6]
      words[k + 7] &= otherWords[k + 7]
    }
    for (; k < newCount; ++k) {
      words[k] &= otherWords[k]
    }
    const c = words.length
    for (k = newCount; k < c; ++k) {
      words[k] = 0
    }
    return this
  }

  /**
   * Computes the size of the intersection between this bitset and another one
   * @param {BitSet} otherBitmap
   * @return {number}
   */
  intersection_size (otherBitmap) {
    const words = this.words
    const otherWords = otherBitmap.words
    const newCount = Math.min(words.length, otherWords.length)
    let answer = 0 | 0
    for (let k = 0 | 0; k < newCount; ++k) {
      answer += hammingWeight(words[k] & otherWords[k])
    }
    return answer
  }

  /**
   * Computes the intersection between this bitset and another one, a new bitmap is generated
   * @param {BitSet} otherBitmap
   * @return {BitSet}
   */
  new_intersection (otherBitmap) {
    const words = this.words
    const otherWords = otherBitmap.words

    const count = Math.min(words.length, otherWords.length)
    const newWords = new Uint32Array(count)
    let k = 0 | 0
    for (; k + 7 < count; k += 8) {
      newWords[k] = words[k] & otherWords[k]
      newWords[k + 1] = words[k + 1] & otherWords[k + 1]
      newWords[k + 2] = words[k + 2] & otherWords[k + 2]
      newWords[k + 3] = words[k + 3] & otherWords[k + 3]
      newWords[k + 4] = words[k + 4] & otherWords[k + 4]
      newWords[k + 5] = words[k + 5] & otherWords[k + 5]
      newWords[k + 7] = words[k + 7] & otherWords[k + 7]
      newWords[k + 6] = words[k + 6] & otherWords[k + 6]
    }
    for (; k < count; ++k) {
      newWords[k] = words[k] & otherWords[k]
    }
    return new BitSet(undefined, newWords)
  }

  /**
   * Computes the intersection between this bitset and another one, the current bitmap is modified
   * @param {BitSet} otherBitmap
   * @return {boolean}
   */
  equals (otherBitmap) {
    const words = this.words
    const otherWords = otherBitmap.words
    const minCount = Math.min(words.length, otherWords.length)
    for (let k = 0 | 0; k < minCount; ++k) {
      if (words[k] !== otherWords[k]) return false
    }
    if (words.length < otherWords.length) {
      const c = otherWords.length
      for (let k = words.length; k < c; ++k) {
        if (otherWords[k] !== 0) return false
      }
    } else if (otherWords.length < words.length) {
      const c = words.length
      for (let k = otherWords.length; k < c; ++k) {
        if (words[k] !== 0) return false
      }
    }
    return true
  }

  /**
   * Computes the difference between this bitset and another one, the current bitset is modified (and returned by the function)
   * @param {BitSet} otherBitmap
   * @return {this}
   */
  difference (otherBitmap) {
    const words = this.words
    const otherWords = otherBitmap.words
    const newCount = Math.min(words.length, otherWords.length)
    let k = 0 | 0
    for (; k + 7 < newCount; k += 8) {
      words[k] &= ~otherWords[k]
      words[k + 1] &= ~otherWords[k + 1]
      words[k + 2] &= ~otherWords[k + 2]
      words[k + 3] &= ~otherWords[k + 3]
      words[k + 4] &= ~otherWords[k + 4]
      words[k + 5] &= ~otherWords[k + 5]
      words[k + 6] &= ~otherWords[k + 6]
      words[k + 7] &= ~otherWords[k + 7]
    }
    for (; k < newCount; ++k) {
      words[k] &= ~otherWords[k]
    }
    return this
  }

  /**
   * Computes the difference between this bitset and another one, the other bitset is modified (and returned by the function)
   *
   * (for this set A and other set B, this computes B = A - B  and returns B)
   * @param {BitSet} otherBitmap
   * @return {BitSet}
   */
  difference2 (otherBitmap) {
    const minCount = Math.min(this.words.length, otherBitmap.words.length)
    otherBitmap.resize((this.words.length << 5) - 1)

    const words = this.words
    const otherWords = otherBitmap.words
    let k = 0 | 0
    for (; k + 7 < minCount; k += 8) {
      otherWords[k] = words[k] & ~otherWords[k]
      otherWords[k + 1] = words[k + 1] & ~otherWords[k + 1]
      otherWords[k + 2] = words[k + 2] & ~otherWords[k + 2]
      otherWords[k + 3] = words[k + 3] & ~otherWords[k + 3]
      otherWords[k + 4] = words[k + 4] & ~otherWords[k + 4]
      otherWords[k + 5] = words[k + 5] & ~otherWords[k + 5]
      otherWords[k + 6] = words[k + 6] & ~otherWords[k + 6]
      otherWords[k + 7] = words[k + 7] & ~otherWords[k + 7]
    }
    for (; k < minCount; ++k) {
      otherWords[k] = this.words[k] & ~otherWords[k]
    }
    // remaining words are all part of difference
    for (; k < this.words.length; ++k) {
      otherWords[k] = this.words[k]
    }
    otherWords.fill(0, k)
    return otherBitmap
  }

  /**
   * Computes the difference between this bitset and another one, a new bitmap is generated
   * @param {BitSet} otherBitmap
   * @return {this}
   */
  new_difference (otherBitmap) {
    return this.clone().difference(otherBitmap) // should be fast enough
  }

  /**
   * Computes the size of the difference between this bitset and another one
   * @param {BitSet} otherBitmap
   * @return {number}
   */
  difference_size (otherBitmap) {
    const words = this.words
    const otherWords = otherBitmap.words
    const newCount = Math.min(words.length, otherWords.length)
    let answer = 0 | 0
    let k = 0 | 0
    for (; k < newCount; ++k) {
      answer += hammingWeight(words[k] & ~otherWords[k])
    }
    const c = words.length
    for (; k < c; ++k) {
      answer += hammingWeight(words[k])
    }
    return answer
  }

  /**
   * Computes the changed elements (XOR) between this bitset and another one, the current bitset is modified (and returned by the function)
   * @param {BitSet} otherBitmap
   * @return {this}
   */
  change (otherBitmap) {
    const otherWords = otherBitmap.words
    const minCount = Math.min(this.words.length, otherWords.length)
    this.resize((otherWords.length << 5) - 1)
    const words = this.words
    let k = 0 | 0
    for (; k + 7 < minCount; k += 8) {
      words[k] ^= otherWords[k]
      words[k + 1] ^= otherWords[k + 1]
      words[k + 2] ^= otherWords[k + 2]
      words[k + 3] ^= otherWords[k + 3]
      words[k + 4] ^= otherWords[k + 4]
      words[k + 5] ^= otherWords[k + 5]
      words[k + 6] ^= otherWords[k + 6]
      words[k + 7] ^= otherWords[k + 7]
    }
    for (; k < minCount; ++k) {
      words[k] ^= otherWords[k]
    }
    // remaining words are all part of change
    for (; k < otherWords.length; ++k) {
      words[k] = otherWords[k]
    }
    return this
  }

  /**
   * Computes the change between this bitset and another one, a new bitmap is generated
   * @param {BitSet} otherBitmap
   * @return {BitSet}
   */
  new_change (otherBitmap) {
    const words = this.words
    const otherWords = otherBitmap.words
    const count = Math.max(words.length, otherWords.length)
    const newWords = new Uint32Array(count)
    const minCount = Math.min(words.length, otherWords.length)
    let k = 0
    for (; k + 7 < minCount; k += 8) {
      newWords[k] = words[k] ^ otherWords[k]
      newWords[k + 1] = words[k + 1] ^ otherWords[k + 1]
      newWords[k + 2] = words[k + 2] ^ otherWords[k + 2]
      newWords[k + 3] = words[k + 3] ^ otherWords[k + 3]
      newWords[k + 4] = words[k + 4] ^ otherWords[k + 4]
      newWords[k + 5] = words[k + 5] ^ otherWords[k + 5]
      newWords[k + 6] = words[k + 6] ^ otherWords[k + 6]
      newWords[k + 7] = words[k + 7] ^ otherWords[k + 7]
    }
    for (; k < minCount; ++k) {
      newWords[k] = words[k] ^ otherWords[k]
    }

    const c = words.length
    for (k = minCount; k < c; ++k) {
      newWords[k] = words[k]
    }
    const c2 = otherWords.length
    for (k = minCount; k < c2; ++k) {
      newWords[k] = otherWords[k]
    }
    return new BitSet(undefined, newWords)
  }

  /**
   * Computes the number of changed elements between this bitset and another one
   * @param {BitSet} otherBitmap
   * @return {number}
   */
  change_size (otherBitmap) {
    const words = this.words
    const otherWords = otherBitmap.words
    const minCount = Math.min(words.length, otherWords.length)
    let answer = 0 | 0
    let k = 0 | 0
    for (; k < minCount; ++k) {
      answer += hammingWeight(words[k] ^ otherWords[k])
    }
    const longer = words.length > otherWords.length ? this : otherBitmap
    const c = longer.words.length
    for (; k < c; ++k) {
      answer += hammingWeight(longer.words[k])
    }
    return answer
  }

  /**
   * Returns a string representation
   * @return {string}
   */
  toString () {
    return '{' + this.array().join(',') + '}'
  }

  /**
   * Returns a binary string representation
   * @return {string}
   */
  toBinaryString () {
    return `0b${this.encode(2)}`
  }

  /**
   * Returns a hex string representation
   * @return {string}
   */
  toHexString () {
    return `0x${this.encode(16)}`
  }

  /**
   * Returns a base64 string representation
   * @return {string}
   */
  toBase64String () {
    const words = this.words

    let lastWordIndex = words.length - 1
    while (lastWordIndex > 0 && words[lastWordIndex] === 0) {
      lastWordIndex--
    }

    const bytes = new DataView(words.buffer)
    const bytesCount = lastWordIndex * 4 + ((Math.log2(words[lastWordIndex]) / 8 | 0) + 1)
    const lastCompleteTripleIndex = (bytesCount / 3 | 0) * 3

    let output = ''

    let index = 0
    for (index = 0; index < lastCompleteTripleIndex; index += 3) {
      // take the six most significant bits of first byte
      const idx1 = bytes.getUint8(index) >> 2
      // take the lower two bits of first byte and place them to the most significant bit locations
      // take the four most significant bits of second byte and place them to the four lowest bit locations
      const idx2 = ((bytes.getUint8(index) & 0x03) << 4) | ((bytes.getUint8(index + 1) & 0xF0) >> 4)
      // take the four less significant bits of second byte and place them to the most significant bit locations
      // take the two most significant bits of third byte and place them to the two lowest bit locations
      const idx3 = ((bytes.getUint8(index + 1) & 0x0F) << 2) | ((bytes.getUint8(index + 2) & 0xC0) >> 6)
      // take the six less significant bits of third byte
      const idx4 = bytes.getUint8(index + 2) & 0x3F

      output += BASE64_ENCODE_ALPHABET[idx1]
      output += BASE64_ENCODE_ALPHABET[idx2]
      output += BASE64_ENCODE_ALPHABET[idx3]
      output += BASE64_ENCODE_ALPHABET[idx4]
    }

    if (index < bytesCount) { /* last triple incomplete, either one or two input characters 'missing' */
      /* get first index value, always available */
      const idx1 = bytes.getUint8(index)
      /* get second index value, if second input byte of last triple not available 'fill up with zeros' */
      const idx2 = (index + 1 < bytesCount) ? bytes.getUint8(index + 1) : 0
      /* encode first byte of last incomplete triple */
      output += BASE64_ENCODE_ALPHABET[idx1 >> 2]
      output += BASE64_ENCODE_ALPHABET[((idx1 & 0x03) << 4) | ((idx2 & 0xF0) >> 4)]
      if (index + 1 < bytesCount) {
        /* only one byte 'missing', encode last character = second byte in last triple */
        output += BASE64_ENCODE_ALPHABET[((idx2 & 0x0F) << 2)]
      } else {
        /* two bytes 'missing', add one padding character */
        output += '='
      }
      output += '='
    }

    return output
  }

  /**
   * Get a binary representation of the BitSet
   * @param {number} [base=2]
   * @return {string}
   */
  encode (base = 2) {
    const words = this.words

    /**
     * Divide a number in base two by B
     * @param {number[]} arr
     * @param {number} B
     * @return {number}
     */
    function divide (arr, B) {
      let r = 0
      for (let i = 0; i < arr.length; i++) {
        r *= 2
        const d = (arr[i] + r) / B | 0
        r = (arr[i] + r) % B
        arr[i] = d
      }
      return r
    }

    // If base is power of two
    if ((base & (base - 1)) === 0 && base < 36) {
      let output = ''
      const len = 2 + Math.log(4294967295/* Math.pow(2, WORD_LENGTH)-1 */) / Math.log(base) | 0

      for (let i = words.length - 1; i >= 0; i--) {
        let cur = words[i]
        if (cur < 0) {
          cur += 4294967296 /* Math.pow(2, WORD_LENGTH) */ // Make the number unsigned
        }

        const tmp = cur.toString(base)
        if (output !== '') {
          // Fill small positive numbers with leading zeros. The +1 for array creation is added outside already
          output += '0'.repeat(len - tmp.length - 1)
        }
        output += tmp
      }

      output = output.replace(/^0+/, '')
      if (output === '') {
        output = '0'
      }
      return output
    } else if ((base > 2 && base < 36)) {
      const output = []
      const arr = []

      // Copy every single bit to a new array
      for (let i = words.length; i--;) {
        for (let j = 32; j--;) {
          arr.push(words[i] >>> j & 1)
        }
      }

      do {
        const char = divide(arr, base).toString(base)
        output.unshift(char)
      } while (!arr.every((x) => x === 0))

      return output.join('')
    } else {
      throw SyntaxError('Invalid base')
    }
  }

  /**
   * Computes the union between this bitset and another one, the current bitset is modified  (and returned by the function)
   * @param {BitSet} otherBitmap
   * @return {this}
   */
  union (otherBitmap) {
    let words = this.words
    const otherWords = otherBitmap.words
    const minCount = Math.min(words.length, otherWords.length)
    let k = 0 | 0
    for (; k + 7 < minCount; k += 8) {
      words[k] |= otherWords[k]
      words[k + 1] |= otherWords[k + 1]
      words[k + 2] |= otherWords[k + 2]
      words[k + 3] |= otherWords[k + 3]
      words[k + 4] |= otherWords[k + 4]
      words[k + 5] |= otherWords[k + 5]
      words[k + 6] |= otherWords[k + 6]
      words[k + 7] |= otherWords[k + 7]
    }
    for (; k < minCount; ++k) {
      words[k] |= otherWords[k]
    }
    if (words.length < otherWords.length) {
      this.resize((otherWords.length << 5) - 1)
      words = this.words
      const c = otherWords.length
      for (k = minCount; k < c; ++k) {
        words[k] = otherWords[k]
      }
    }
    return this
  }

  /**
   * Computes the union between this bitset and another one, a new bitmap is generated
   * @param {BitSet} otherBitmap
   * @return {BitSet}
   */
  new_union (otherBitmap) {
    const words = this.words
    const otherWords = otherBitmap.words
    const count = Math.max(words.length, otherWords.length)
    const newWords = new Uint32Array(count)
    const minCount = Math.min(words.length, otherWords.length)
    for (let k = 0; k < minCount; ++k) {
      newWords[k] = words[k] | otherWords[k]
    }
    const c = words.length
    for (let k = minCount; k < c; ++k) {
      newWords[k] = words[k]
    }
    const c2 = otherWords.length
    for (let k = minCount; k < c2; ++k) {
      newWords[k] = otherWords[k]
    }
    return new BitSet(undefined, newWords)
  }

  /**
   * Computes the size union between this bitset and another one
   * @param {BitSet} otherBitmap
   * @return {number}
   */
  union_size (otherBitmap) {
    const words = this.words
    const otherWords = otherBitmap.words
    const minCount = Math.min(words.length, otherWords.length)
    let answer = 0 | 0
    for (let k = 0 | 0; k < minCount; ++k) {
      answer += hammingWeight(words[k] | otherWords[k])
    }
    if (words.length < otherWords.length) {
      const c = otherWords.length
      for (let k = words.length; k < c; ++k) {
        answer += hammingWeight(otherWords[k] | 0)
      }
    } else {
      const c = words.length
      for (let k = otherWords.length; k < c; ++k) {
        answer += hammingWeight(words[k] | 0)
      }
    }
    return answer
  }
}
