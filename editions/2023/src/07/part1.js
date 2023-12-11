import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { translate } from '@advent-of-code/utils/strings'

const five = /^(\w)\1{4}/
const four = /^\w?(\w)\w?\1\w?\1\w?\1/
const fullHouse = /^(?=\w*(\w)\w*\1\w*\1)(?=\w*(?!\1)(\w)\w*\2)/
const three = /^\w*(\w)\w*\1\w*\1/
const twoPair = /^(?=\w*(\w)\w*\1)(?=\w*(?!\1)(\w)\w*\2)/
const onePair = /^\w*(\w)\w*\1/
const highCard = /^\w/

const TYPE_MATCHERS = [highCard, onePair, twoPair, three, fullHouse, four, five]

export class Hand {
  constructor (hand, bid) {
    this.hand = translate(hand, 'AKQJT', 'EDCBA') // Make hands lexicographically sortable
    this.type = TYPE_MATCHERS.findLastIndex(re => re.test(hand))
    this.bid = bid
  }

  compare (other) {
    if (this.type === other.type) {
      return this.hand.localeCompare(other.hand)
    } else {
      return this.type - other.type
    }
  }
}

const input = new PuzzleInput('input.txt', import.meta.url)
const cards = input.lineFields(/(\w+) (\d+)/).map(([hand, bid]) => new Hand(hand, Number(bid)))

export function solve () {
  return cards.sort((a, b) => a.compare(b)).reduce((tot, hand, i) => tot + (i + 1) * hand.bid, 0)
}

if (isMain(import.meta)) {
  console.log(solve())
}
