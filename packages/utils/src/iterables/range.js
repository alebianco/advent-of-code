/**
 * @param {number} start
 * @param {number} stop
 * @param {number} [step=1]
 * @return {Generator<number>}
 */
export function * range (start, stop, step = 1) {
  for (let i = start; i < stop; i += step) {
    yield i
  }
}
