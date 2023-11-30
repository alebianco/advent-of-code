import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { sum } from '@advent-of-code/utils/iterables'

const input = new PuzzleInput('input.txt', import.meta.url).linesData(line => line.split('x').map(Number).sort((a, b) => a - b))

export function solve () {
  return sum(input, 0, ([a, b, c]) => (2 * a * b) + (2 * b * c) + (2 * a * c) + (a * b))
}

if (isMain(import.meta)) {
  console.log(solve())
}
