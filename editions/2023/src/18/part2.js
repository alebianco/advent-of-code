import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { DOWN, LEFT, RIGHT, sumPoint2, UP } from '@advent-of-code/utils/points'
import { HashMap } from '@advent-of-code/utils/collections'
import { toArray } from '@advent-of-code/utils/iterables'
import { shoelaceArea } from '@advent-of-code/utils/polygons'

const dirs = new Map([['0', RIGHT], ['3', UP], ['1', DOWN], ['2', LEFT]])

const input = new PuzzleInput('input.txt', import.meta.url).lineFields(/#([a-f0-9]+)([a-f0-9])/).map(([steps, dir]) => {
  return [dirs.get(dir), parseInt(steps, 16)]
})

const grid = new HashMap([], ([x, y]) => `${x},${y}`)

export function solve () {
  let current = [0, 0]
  grid.set([0, 0], true)
  let perimeter = 0
  for (const [dir, steps] of input) {
    current = sumPoint2(current, [dir[0] * steps, dir[1] * steps])
    grid.set(current, true)
    perimeter += (steps - 1) / 2
  }

  return shoelaceArea(toArray(grid.keys())) + perimeter
}

if (isMain(import.meta)) {
  console.log(solve())
}
