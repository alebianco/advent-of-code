import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { count } from '@advent-of-code/utils/strings'

const input = new PuzzleInput('input.txt', import.meta.url).firstLine()

export function solve () {
  const up = count(input, '(')
  const down = input.length - up
  return up - down
}

if (isMain(import.meta)) {
  console.log(solve())
}
