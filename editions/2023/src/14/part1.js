import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { sum } from '@advent-of-code/utils/iterables'
import { sumBetween } from '@advent-of-code/utils/numbers'

const input = new PuzzleInput('input.txt', import.meta.url)

export function solve () {
  return sum(input.columns().map(line => {
    const size = line.length
    const boulders = Array.from(line.matchAll(/#/g)).map(m => m.index).concat(size)
    let boundary = 0
    let total = 0
    while (boulders.length) {
      const boulder = boulders.shift()
      const section = line.slice(boundary, boulder)
      const rocks = section.match(/O/g)?.length ?? 0
      total += sumBetween(size - boundary - rocks + 1, size - boundary)
      boundary = boulder + 1
    }
    return total
  }))
}

if (isMain(import.meta)) {
  console.log(solve())
}
