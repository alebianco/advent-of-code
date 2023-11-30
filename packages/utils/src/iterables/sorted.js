const numberComparator = (a, b) => a < b ? -1 : a > b ? 1 : 0

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @param {boolean} [reverse=false]
 * @param {Comparator} [comparator=numberComparator]
 * @returns {Generator<T>}
 */
export function * sorted (iterable, reverse = false, comparator = undefined) {
  const list = Array.from(iterable).sort(comparator ?? numberComparator)
  if (reverse) {
    list.reverse()
  }
  yield * list
}
