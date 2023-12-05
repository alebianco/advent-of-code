import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { min } from '@advent-of-code/utils/iterables'

const input = new PuzzleInput('input.txt', import.meta.url).sections()

/**
 * @param {number} seed
 * @param {[number, number, number]} ranges
 * @return {number}
 */
const lookup = (seed, ranges) => {
  for (const [destination, source, span] of ranges) {
    if (seed >= source && seed <= source + span) {
      return destination + seed - source
    }
  }
  return seed
}

const seeds = input.at(0).firstLine().match(/\d+/g).map(Number)

const maps = input.slice(1).map(map => {
  return map.subLines(1).lineFields(' ').map(line => line.map(Number))
})

export function solve () {
  return min(seeds.map(seed => maps.reduce((seed, map) => lookup(seed, map), seed)))
}

if (isMain(import.meta)) {
  console.log(solve())
}
