import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { BitSet } from '@advent-of-code/utils/collections'

/**
 * @type {[number,BitSet,BitSet][]}
 */
const input = new PuzzleInput('input.txt', import.meta.url)
  .lineFields(/^Card\s+(\d+): ([\d ]+) \| ([\d+ ]+)$/)
  .map(([card, winning, mine]) => {
    return [
      Number(card),
      new BitSet(winning.match(/\d+/g).map(Number)),
      new BitSet(mine.match(/\d+/g).map(Number))
    ]
  })

export function solve () {
  return input
    .filter(([card, winning, mine]) => mine.intersection(winning))
    .map(([card, winning, mine]) => mine.array())
    .map((matched) => Math.max(0, 1 << (matched.length - 1)))
    .reduce((sum, term) => sum + term)
}

if (isMain(import.meta)) {
  console.log(solve())
}
