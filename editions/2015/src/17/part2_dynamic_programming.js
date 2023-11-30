import { isMain, PuzzleInput } from '@advent-of-code/utils'

const input = new PuzzleInput('input.txt', import.meta.url).lineInts()
const eggnog = 150

export function solve () {
  const solutions = Array.from({ length: eggnog + 1 }, () => new Uint8Array(input.length).fill(0))
  solutions[0][0] = 1

  let minSize = input.length
  for (const bucket of input) {
    for (let volume = eggnog - bucket; volume >= 0; volume--) {
      for (let size = minSize; size > 0; size--) {
        solutions[volume + bucket][size] += solutions[volume][size - 1]
        if (solutions[eggnog][size] > 0 && size < minSize) {
          minSize = size
        }
      }
    }
  }

  return solutions[eggnog][minSize]
}

if (isMain(import.meta)) {
  console.log(solve())
}
