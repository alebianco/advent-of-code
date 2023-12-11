import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { combinations } from '@advent-of-code/utils/iterables'

const input = new PuzzleInput('input.txt', import.meta.url)

function expand (lines) {
  return lines.flatMap(line => line.includes('#') ? line : [line, line])
}

const universe = new PuzzleInput(expand(new PuzzleInput(expand(input.lines())).columns())).transpose()
const galaxies = universe.lines().flatMap((line, row) => Array.from(line.matchAll(/#/g)).map(match => [match.index, row]))

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
