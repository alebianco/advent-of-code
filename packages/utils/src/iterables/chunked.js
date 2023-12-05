/**
 * @template T
 * @param {Iterable<T>} iterable
 * @param {number} chunkSize
 * @return {Generator<Generator<T>>}
 */
export function * chunked (iterable, chunkSize) {
  const it = iterable[Symbol.iterator]()
  let next = it.next()

  function * reader (count) {
    while (true) {
      if (count-- > 0 && !next.done) {
        yield next.value
        next = it.next()
      } else {
        break
      }
    }
  }

  while (!next.done) {
    yield reader(chunkSize)
  }
}
