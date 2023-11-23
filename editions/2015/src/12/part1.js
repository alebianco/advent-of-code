import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { sum } from '@advent-of-code/utils/iterables'

const input = new PuzzleInput('input.txt', import.meta.url)

export function solve () {
  return sum(input.firstLine().matchAll(/[0-9-]+/g), 0, ([match]) => Number(match))
}

if (isMain(import.meta)) {
  console.log(solve())
}
