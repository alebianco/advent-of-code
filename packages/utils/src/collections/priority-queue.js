export const MIN_HEAP_COMPARATOR = (a, b) => Math.sign(a - b)
export const MAX_HEAP_COMPARATOR = (a, b) => Math.sign(b - a)

/**
 * @template T
 */
export class PriorityQueue {
  #data = []
  #comparator

  /**
   * @template T
   * @param {function(a:T, b:T):-1|0|1} [comparator]
   */
  constructor (comparator) {
    this.#comparator = comparator ?? MIN_HEAP_COMPARATOR
  }

  size () {
    return this.#data.length
  }

  peak () {
    return this.#data[0]
  }

  push (value) {
    this.#data.push(value)

    let i = this.#data.length - 1
    while (i > 0) {
      const parentIndex = Math.ceil((i / 2) - 1)
      if (this.#comparator(this.#data[i], this.#data[parentIndex]) < 0) {
        this.#swap(i, parentIndex)
        i = parentIndex
      } else {
        break
      }
    }
  }

  pop () {
    // 1 or no remaining items is a special case
    if (this.#data.length < 2) {
      return this.#data.pop()
    }

    const min = this.#data[0]
    this.#data[0] = this.#data.pop()

    let i = 0
    while (true) {
      const [leftIndex, rightIndex] = [(i * 2) + 1, (i * 2) + 2]
      const leftValue = this.#data[leftIndex]
      const rightValue = this.#data[rightIndex]

      // If both children are larger than the candidate, we're done.
      if ((leftValue == null || this.#comparator(this.#data[i], leftValue) < 0) && (rightValue == null || this.#comparator(this.#data[i], rightValue) < 0)) {
        break
      }

      // Otherwise pick the index of the smallest value
      const smallestIndex = (rightValue == null || this.#comparator(leftValue, rightValue) < 0) ? leftIndex : rightIndex

      this.#swap(i, smallestIndex)
      i = smallestIndex
    }

    return min
  };

  #swap (i1, i2) {
    const temp = this.#data[i1]
    this.#data[i1] = this.#data[i2]
    this.#data[i2] = temp
  }
}
