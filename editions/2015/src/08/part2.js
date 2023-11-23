import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { sum } from '@advent-of-code/utils/iterables'

const input = new PuzzleInput('input.txt', import.meta.url).lines()

function escape (value) {
  return JSON.stringify(value)
}

export function solve () {
  return sum(input.map(line => escape(line).length - line.length))
}

if (isMain(import.meta)) {
  console.log(solve())
}
