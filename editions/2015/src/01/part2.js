import { isMain, PuzzleInput } from '@advent-of-code/utils'

const input = new PuzzleInput('input.txt', import.meta.url).firstLine()

const moves = new Map([['(', +1], [')', -1]])

export function solve () {
  let floor = 0
  let index = 0
  for (index = 0; index < input.length && floor >= 0; index++) {
    floor += moves.get(input.charAt(index)) ?? 0
  }
  return index
}

if (isMain(import.meta)) {
  console.log(solve())
}
