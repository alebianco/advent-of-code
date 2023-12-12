import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { sum } from '@advent-of-code/utils/iterables'
import { memoize } from '@advent-of-code/utils/functions'

const input = new PuzzleInput('input.txt', import.meta.url)
  .lineFields(/^([.#?]+) ([0-9,]+)/)
  .map(([line, record]) => [new Array(5).fill(line).join('?'), new Array(5).fill(record).join(',')])
  .map(([line, record]) => [line, record.split(',').map(Number)])

const countArrangements = memoize(function counter ([line, record]) {
  if (line.length === 0) {
    return record.length === 0 ? 1 : 0
  }

  if (record.length === 0) {
    return line.includes('#') ? 0 : 1
  }

  if (line.length < sum(record) + record.length - 1) {
    return 0
  }

  if (line[0] === '.') {
    return countArrangements([line.slice(1), record])
  } else if (line[0] === '#') {
    const [current, ...remaining] = record
    if (line[current] === '#' || line.slice(0, current).includes('.')) {
      return 0
    } else {
      return countArrangements([line.slice(current + 1), remaining])
    }
  } else {
    return countArrangements(['#' + line.slice(1), record]) + countArrangements(['.' + line.slice(1), record])
  }
})

export function solve () {
  return sum(input.map(countArrangements))
}

if (isMain(import.meta)) {
  console.log(solve())
}
