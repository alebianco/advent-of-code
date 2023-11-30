import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { HashSet } from '@advent-of-code/utils/collections'
import { partition } from '@advent-of-code/utils/iterables'
import { sumPoint2 } from '@advent-of-code/utils/points'

const directions = new Map([
  ['>', [1, 0]],
  ['<', [-1, 0]],
  ['^', [0, 1]],
  ['v', [0, -1]]
])

const input = new PuzzleInput('input.txt', import.meta.url).firstLine()

export function solve () {
  const start = [0, 0]

  const visited = new HashSet([start], ([x, y]) => `${x},${y}`)

  const instructions = partition(input.split(''), (v, i) => i % 2 === 0)

  for (const path of instructions) {
    let current = start
    for (const direction of path) {
      const move = directions.get(direction)
      current = sumPoint2(current, move)
      visited.add(current)
    }
  }

  return visited.size
}

if (isMain(import.meta)) {
  console.log(solve())
}
