import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { HashSet } from '@advent-of-code/utils/collections'
import { sumPoint2 } from '@advent-of-code/utils/points'

/**
 * @type {Map<string, Point2>}
 */
const directions = new Map([
  ['>', [1, 0]],
  ['<', [-1, 0]],
  ['^', [0, 1]],
  ['v', [0, -1]]
])

const input = new PuzzleInput('input.txt', import.meta.url).firstLine()

export function solve () {
  /**
   * @type {Point2}
   */
  let current = [0, 0]

  const visited = new HashSet([current], ([x, y]) => `${x},${y}`)

  for (const direction of input) {
    const move = directions.get(direction)
    current = sumPoint2(current, move)
    visited.add(current)
  }

  return visited.size
}

if (isMain(import.meta)) {
  console.log(solve())
}
