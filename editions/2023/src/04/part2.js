import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { BitSet } from '@advent-of-code/utils/collections'

/**
 * @type {[number,BitSet,BitSet][]}
 */
const input = new PuzzleInput('input.txt', import.meta.url)
  .lineFields(/^Card\s+(\d+): ([\d ]+) \| ([\d+ ]+)$/)
  .map(([card, winning, mine]) => {
    return [
      Number(card - 1),
      new BitSet(winning.match(/\d+/g).map(Number)),
      new BitSet(mine.match(/\d+/g).map(Number))
    ]
  })

export function solve () {
  const matches = new Map(input
    .filter(([card, winning, mine]) => mine.intersection(winning))
    .map(([card, winning, mine]) => [card, mine.size()]))

  const copies = new Array(matches.size).fill(1)
  for (const [card, count] of matches) {
    for (let i = 1; i <= count; i++) {
      copies[card + i] += copies[card]
    }
  }
  return copies.reduce((sum, term) => sum + term)
}

if (isMain(import.meta)) {
  console.log(solve())
}
