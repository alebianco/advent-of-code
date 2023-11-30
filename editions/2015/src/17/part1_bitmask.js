import { isMain, PuzzleInput } from '@advent-of-code/utils'

const input = new PuzzleInput('input.txt', import.meta.url).lineInts()

// sorting in decreasing order gives a 70% speed improvement
const numbers = input.sort((a, b) => b - a)
const eggnog = 150

export function solve () {
  let count = 0

  for (let mask = 1; mask < 1 << numbers.length; mask++) {
    let sum = 0
    for (let idx = 0; idx < numbers.length; idx++) {
      if ((1 << idx) & mask) {
        sum += numbers[idx]
        if (sum > eggnog) {
          break
        }
      }
    }
    count += Number(sum === eggnog)
  }

  return count
}

if (isMain(import.meta)) {
  console.log(solve())
}
