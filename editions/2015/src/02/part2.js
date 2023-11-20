import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { sum } from '@advent-of-code/utils/iterables'

const input = new PuzzleInput('input.txt', import.meta.url).linesData(line => line.split('x').map(Number).sort((a, b) => a - b))

export function solve () {
  return sum(input, 0, ([a, b, c]) => (2 * a) + (2 * b) + (a * b * c))
}

if (isMain(import.meta)) {
  console.log(solve())
}
