import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { combinations, range, sum } from '@advent-of-code/utils/iterables'

const input = new PuzzleInput('input.txt', import.meta.url).lineInts()
const eggnog = 150

export function solve () {
  const frequency = new Array(input.length).fill(0)

  for (const size of range(1, input.length)) {
    for (const combo of combinations(input, size)) {
      if (sum(combo) === eggnog) {
        frequency[combo.length] += 1
      }
    }
  }

  // 1048574 combo evaluated
  return frequency.find(v => v > 0)
}

if (isMain(import.meta)) {
  console.log(solve())
}
