import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { pascalRow } from '@advent-of-code/utils/numbers'

const input = new PuzzleInput('input.txt', import.meta.url)

function nextNumber (line) {
  let sum = 0
  for (let l = line.length; l > 0; l--) {
    const coeff = pascalRow(l - 1)
    const nextLevel = line.slice(line.length - l).reduce((tot, term, i) => -1 * tot + term * coeff[i], 0)
    sum += nextLevel
  }
  return sum
}

export function solve () {
  return input.lines()
    .map(line => line.split(' ').map(Number))
    .map(nextNumber)
    .reduce((tot, term) => tot + term)
}

if (isMain(import.meta)) {
  console.log(solve())
}
