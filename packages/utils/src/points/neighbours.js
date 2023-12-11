import { sumPoint2 } from './sum-point.js'

export const UP = [0, -1]
export const DOWN = [0, 1]
export const LEFT = [-1, 0]
export const RIGHT = [1, 0]
export const UP_RIGHT = [1, -1]
export const DOWN_RIGHT = [1, 1]
export const UP_LEFT = [-1, -1]
export const DOWN_LEFT = [-1, 1]

export const SQUARED = [UP, RIGHT, DOWN, LEFT]
export const DIAGONALS = [UP_RIGHT, DOWN_RIGHT, DOWN_LEFT, UP_LEFT]
export const ALL = [UP, UP_RIGHT, RIGHT, DOWN_RIGHT, DOWN, DOWN_LEFT, LEFT, UP_LEFT]

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
