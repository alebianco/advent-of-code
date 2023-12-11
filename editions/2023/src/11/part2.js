import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { combinations } from '@advent-of-code/utils/iterables'

const input = new PuzzleInput('input.txt', import.meta.url)

function empty (line) {
  return !line.includes('#')
}

function expand (lines) {
  let c = 0
  return lines.map((line, r) => {
    if (empty(line)) {
      c += 1000000
    } else {
      c++
    }
    return c
  })
}

const ROWS = expand(input.lines())
const COLS = expand(input.columns())

const galaxies = input.lines().flatMap((line, row) => {
  return Array.from(line.matchAll(/#/g)).map(match => {
    return [COLS[match.index], ROWS[row]]
  })
})

export function solve () {
  let sum = 0
  for (const pair of combinations(galaxies, 2)) {
    const [[x1, y1], [x2, y2]] = pair
    const dist = Math.abs(x1 - x2) + Math.abs(y1 - y2)
    sum += dist
  }
  return sum
}

if (isMain(import.meta)) {
  console.log(solve())
}
