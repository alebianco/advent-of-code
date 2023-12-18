import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { DOWN, LEFT, neighbours, pointIsInPolygon, RIGHT, SQUARED, sumPoint2, UP } from '@advent-of-code/utils/points'
import { HashMap } from '@advent-of-code/utils/collections'
import { range, reduce, toArray } from '@advent-of-code/utils/iterables'

const dirs = new Map([['R', RIGHT], ['U', UP], ['D', DOWN], ['L', LEFT]])

const input = new PuzzleInput('input.txt', import.meta.url).lineFields(' ').map(([dir, steps, color]) => {
  return [dirs.get(dir), Number(steps), parseInt(color.substring(2, 8), 16)]
})

const grid = new HashMap([], ([x, y]) => `${x},${y}`)

export function solve () {
  let current = [0, 0]
  for (const [dir, steps, color] of input) {
    // eslint-disable-next-line no-unused-vars
    for (const step of range(0, steps)) {
      current = sumPoint2(current, dir)
      grid.set(current, color)
    }
  }

  const polygon = toArray(grid.keys())
  const min = reduce(polygon, ([minX, minY], [x, y]) => [Math.min(minX, x), Math.min(minY, y)])
  const max = reduce(polygon, ([maxX, maxY], [x, y]) => [Math.max(maxX, x), Math.max(maxY, y)])

  let perimeter = polygon.slice()
  while (perimeter.length) {
    const filled = []
    for (const point of perimeter) {
      for (const neighbour of neighbours(point, SQUARED)) {
        if (!grid.has(neighbour) && pointIsInPolygon(neighbour, polygon, [min, max])) {
          grid.set(neighbour, grid.get(point))
          filled.push(neighbour)
        }
      }
    }
    perimeter = filled
  }

  return grid.size
}

if (isMain(import.meta)) {
  console.log(solve())
}
