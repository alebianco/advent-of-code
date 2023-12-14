import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { flatMap, sum } from '@advent-of-code/utils/iterables'
import { sumBetween } from '@advent-of-code/utils/numbers'
import { ReferenceMap } from '@advent-of-code/utils/collections'

const input = new PuzzleInput('input.txt', import.meta.url)

function computeLoad (data) {
  const size = data.colsCount()
  return sum(flatMap(data.columns(), line => {
    return line.matchAll(/O+/g)
  }), 0, ({ 0: { length }, index }) => {
    return sumBetween(size - index - length + 1, size - index)
  })
}

function roll (data) {
  const lines = data.columns().map(line => {
    const size = line.length
    const boulders = Array.from(line.matchAll(/#/g)).map(m => m.index).concat(size)
    let boundary = 0
    let update = ''
    while (boulders.length) {
      const boulder = boulders.shift()
      const section = line.slice(boundary, boulder)
      const rocks = section.match(/O/g)?.length ?? 0
      update += 'O'.repeat(rocks) + '.'.repeat(section.length - rocks) + '#'
      boundary = boulder + 1
    }
    return update.slice(0, -1)
  })
  return new PuzzleInput(lines).transpose()
}

function cycle (data) {
  for (let i = 0; i < 4; i++) {
    data = roll(data).rotateCW()
  }
  return data
}

export function solve () {
  const target = 1000000000
  const stateMap = new ReferenceMap()

  let data = input
  let current = 0
  while (current++ < target) {
    data = cycle(data)
    const hash = data.valueOf()
    if (stateMap.has(hash)) {
      const [cycleStart, cycleEnd, period = cycleEnd - cycleStart] = [stateMap.get(hash), current]
      const finalPosition = ((target - cycleStart) % period) + cycleStart
      const finalState = new PuzzleInput(stateMap.getKey(finalPosition).split('\n'))
      return computeLoad(finalState)
    }
    stateMap.set(hash, current)
  }
}

if (isMain(import.meta)) {
  console.log(solve())
}
