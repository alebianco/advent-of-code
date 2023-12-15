import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { sum } from '@advent-of-code/utils/iterables'

const input = new PuzzleInput('input.txt', import.meta.url).lineFields(',').flat()

function hash (source) {
  let sum = 0
  for (const char of source) {
    sum += char.charCodeAt(0)
    sum *= 17
    sum %= 256
  }
  return sum
}

export function solve () {
  return sum(input, 0, hash)
}

if (isMain(import.meta)) {
  console.log(solve())
}
