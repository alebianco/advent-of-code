import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { levenshteinDistance } from '@advent-of-code/utils/strings'

const input = new PuzzleInput('input.txt', import.meta.url)

function findReflection (grid) {
  const lines = grid.lines()
  for (let row = 1; row < lines.length; row++) {
    const span = Math.min(row, lines.length - row)
    const left = lines.slice(row - span, row).toString()
    const right = lines.slice(row, row + span).reverse().toString()
    if (levenshteinDistance(left, right) === 1) {
      return row
    }
  }
  return 0
}

export function solve () {
  let sum = 0
  for (const section of input.sections()) {
    sum += findReflection(section) * 100 || findReflection(section.transpose())
  }
  return sum
}

if (isMain(import.meta)) {
  console.log(solve())
}
