import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { sum } from '@advent-of-code/utils/iterables'

const input = new PuzzleInput('input.txt', import.meta.url).lines()

function unescape (value) {
  return eval(value) // eslint-disable-line no-eval
}

export function solve () {
  return sum(input.map(line => line.length - unescape(line).length))
}

if (isMain(import.meta)) {
  console.log(solve())
}
