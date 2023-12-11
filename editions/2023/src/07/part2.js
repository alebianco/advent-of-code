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
    this.hand = translate(hand, 'AKQTJ', 'DCBA0') // Make hands lexicographically sortable
    this.bid = bid

    const jokers = hand.match(/J/g)?.length ?? 0
    const type = TYPE_MATCHERS.findLastIndex(re => re.test(hand))

    switch (true) {
      case type === 5 && jokers > 0:
        this.type = 6
        break
      case type === 4 && jokers > 0:
        this.type = 6
        break
      case type === 3 && jokers > 0:
        this.type = 5
        break
      case type === 2 && jokers === 2:
        this.type = 5
        break
      case type === 2 && jokers === 1:
        this.type = 4
        break
      case type === 1 && jokers > 0:
        this.type = 3
        break
      case type === 0 && jokers > 0:
        this.type = 1
        break
      default:
        this.type = type
        break
    }
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
