import { multiplyPoint2 } from './multiply-point.js'

/**
 * @param {Point2} point
 * @param {[Point2, Point2]} matrix
 * @return {Point2}
 */
export function dotProductPoint2 (point, matrix) {
  return matrix.map(slice => multiplyPoint2(point, slice).reduce((sum, term) => sum + term, 0))
}
