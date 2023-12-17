import { sumPoint2 } from './sum-point.js'

/**
 * @param {Point2} start
 * @param {Point2[]} directions
 * @return {Generator<Point2>}
 */
export function * neighbours (start, directions) {
  for (const direction of directions) {
    yield sumPoint2(start, direction)
  }
}
