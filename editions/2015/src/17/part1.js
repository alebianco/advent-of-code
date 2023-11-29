import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { filter, powerSet, sum, toArray } from '@advent-of-code/utils/iterables'

const input = new PuzzleInput('input.txt', import.meta.url).lineInts()
const eggnog = 150

export function solve () {
  const validCombos = filter(powerSet(input), (buckets) => eggnog === sum(buckets))
  return toArray(validCombos).length
}

if (isMain(import.meta)) {
  console.log(solve())
}
