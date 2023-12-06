import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { range } from '@advent-of-code/utils/iterables'

const input = new PuzzleInput('input.txt', import.meta.url)
const times = input.line(0).replaceAll(' ', '').match(/\d+/g).map(Number)
const distances = input.line(1).replaceAll(' ', '').match(/\d+/g).map(Number)

const zip = (...arr) => Array(Math.max(...arr.map(a => a.length))).fill().map((_, i) => arr.map(a => a[i]))
const races = zip(times, distances)

function check (race) {
  let win = 0
  for (const charge of range(0, race[0] + 1)) {
    const distance = charge * (race[0] - charge)
    if (distance > race[1]) {
      win++
    }
  }
  return win
}

export function solve () {
  return races.map(check).reduce((tot, wins) => tot * wins)
}

if (isMain(import.meta)) {
  console.log(solve())
}
