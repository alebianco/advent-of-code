import { isMain, PuzzleInput } from '@advent-of-code/utils'

const input = new PuzzleInput('input.txt', import.meta.url)
const times = input.line(0).replaceAll(' ', '').match(/\d+/g).map(Number)
const distances = input.line(1).replaceAll(' ', '').match(/\d+/g).map(Number)

const zip = (...arr) => Array(Math.max(...arr.map(a => a.length))).fill().map((_, i) => arr.map(a => a[i]))
const races = zip(times, distances)

export function solve () {
  /**
   * Hold for x secs, run for T-x secs, cover dist x*(T-x)
   *
   * written as a quadratic formula x^2 - time * x + distance = 0
   * resolve the roots and count the integers between them
   */

  return races.map(([time, distance]) => {
    const diff = Math.sqrt(Math.pow(time / 2, 2) - distance)
    const lower = Math.floor(time / 2 - diff + 1)
    const upper = Math.ceil(time / 2 + diff - 1)
    return upper - lower + 1
  }).reduce((prod, term) => prod * term)
}

if (isMain(import.meta)) {
  console.log(solve())
}
