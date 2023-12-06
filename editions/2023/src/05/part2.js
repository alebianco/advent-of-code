import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { chunked, map, min, toArray } from '@advent-of-code/utils/iterables'

/**
 * @typedef {[number, number]} Range
 */

/**
 * @typedef {[number, Range]} Conversion
 */

/**
 * @typedef {Conversion[]} Map
 */

const input = new PuzzleInput('input.txt', import.meta.url).sections()

/**
 * @type {Range[]}
 */
const seeds = toArray(map(chunked(map(input.at(0).firstLine().match(/\d+/g), Number), 2), toArray))

/**
 * @type {Map[]}
 */
const maps = input.slice(1).map(map => map.subLines(1)
  .lineFields(' ')
  .map(values => values.map(Number))
  .sort((a, b) => a[1] - b[1])
  .map(([destination, ...range]) => [destination, range])
)

/**
 * @param {Range} seed
 * @param {Conversion} ranges
 * @return {Range[]}
 */
const transform = (seed, ranges) => {
  const mapped = []
  let [from, count] = seed

  for (const [destination, [source, span]] of ranges) {
    if (count <= 0) {
      break
    }

    if (from < source && source - from > 0) {
      const diff = Math.min(count, source - from)
      mapped.push([from, diff])
      from = source
      count -= diff
    }

    if (from >= source && from < source + span) {
      const diff = Math.min(source - from + span, span, count)
      const loc = destination + from - source
      mapped.push([loc, diff])
      from += diff
      count -= diff
    }
  }

  if (count > 0) {
    mapped.push([from, count])
  }

  return mapped
}

export function solve () {
  const queue = maps.slice()
  let list = seeds.slice()

  while (queue.length) {
    const map = queue.shift()
    list = list.flatMap(seed => transform(seed, map))
  }

  return min(list, (range) => range[0])
}

if (isMain(import.meta)) {
  console.log(solve())
}
