import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { hammingWeight } from '@advent-of-code/utils/bitwise'

const input = new PuzzleInput('input.txt', import.meta.url).lineInts()

// sorting in decreasing order gives a 30% speed improvement
const numbers = input.sort((a, b) => b - a)
const eggnog = 150

export function solve () {
  let min = numbers.length
  let count = 0

  for (let mask = 1; mask < 1 << numbers.length; mask++) {
    const bits = hammingWeight(mask)
    if (bits <= min) {
      let sum = 0
      for (let idx = 0; idx < numbers.length; idx++) {
        if ((1 << idx) & mask) {
          sum += numbers[idx]
          if (sum > eggnog) {
            break
          }
        }
      }
      if (sum === eggnog) {
        if (bits < min) {
          min = bits
          count = 1
        } else if (bits === min) {
          count++
        }
      }
    }
  }

  return count
}

if (isMain(import.meta)) {
  console.log(solve())
}
