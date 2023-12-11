/**
 * @template T
 * @param {...IterableIterator<T>} iterables
 * @return {Generator<T[]>}
 */
export function * zip (...iterables) {
  const iterators = iterables.map(iter => iter[Symbol.iterator]())
  while (true) {
    const results = iterators.map(iter => iter.next())
    const done = results.every(result => result.done)
    if (done) break
    const values = results.map(result => result.value)
    yield values
  }
}
