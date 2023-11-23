import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { sum } from '@advent-of-code/utils/iterables'

const table = new PuzzleInput('table.csv', import.meta.url)
  .subLines(1)
  .lineFields(';')
  .map(([index, sequence, evolution]) => {
    return [+index, sequence, evolution.split(',').map(Number)]
  })

const terms = new Map(table.map(([index, sequence]) => [index, sequence]))
const indexes = new Map(table.map(([index, sequence]) => [sequence, index]))
const evolutions = new Map(table.map(([index, _, evolution]) => [index, evolution]))

// Assume that the seed given is one of the elements of Conway's Cosmological Theorem
const input = new PuzzleInput('input.txt', import.meta.url)

export function solve () {
  let composition = new Map(input.linesData(line => [indexes.get(line), 1]))
  let count = 50
  while (count--) {
    const next = new Map()
    for (const [term, count] of composition.entries()) {
      for (const nextTerm of evolutions.get(term)) {
        next.set(nextTerm, ((next.get(nextTerm) ?? 0) + count))
      }
    }
    composition = next
  }

  return sum(composition.entries(), 0, ([term, count]) => terms.get(term).length * count)
}

if (isMain(import.meta)) {
  console.log(solve())
}
