/**
 * @param {...Point2} points
 * @return {Point2}
 */
export function sumPoint2 (...points) {
  return points.reduce(([ax, ay], [bx, by]) => [ax + bx, ay + by])
}
