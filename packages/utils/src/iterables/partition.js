/**
 * @template T
 * @param {Iterable<T>} iterable
 * @param {function(T, number, Iterable<T>):boolean} sieve
 * @return {[Generator<T>, Generator<T>]}
 */
export function partition (iterable, sieve) {
  const iter = iterable[Symbol.iterator]()
  let index = 0

  const left = []
  const right = []

  const pull = () => {
    const result = iter.next()
    if (result.done) {
      return true
    } else {
      const group = sieve(result.value, index, iterable)
      if (group) {
        left.push(result.value)
      } else {
        right.push(result.value)
      }
      index++
      return false
    }
  }

  function * generator (cache) {
    while (true) {
      if (cache.length === 0) {
        const done = pull()
        if (done) {
          return
        }
      } else {
        yield cache.shift()
      }
    }
  }

  return [generator(left), generator(right)]
}
