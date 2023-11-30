import { isMain, PuzzleInput } from '@advent-of-code/utils'

const input = new PuzzleInput('input.txt', import.meta.url).lineInts()
const eggnog = 150

export function solve () {
  const solutions = [1].concat(new Array(eggnog).fill(0))
  for (const bucket of input) {
    for (let size = eggnog; size >= bucket; size--) {
      solutions[size] += solutions[size - bucket]
    }
  }
  return solutions[eggnog]
}

if (isMain(import.meta)) {
  console.log(solve())
}
