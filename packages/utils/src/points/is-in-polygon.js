/**
 * @param {Point2} point
 * @param {Point2[]} polygon
 * @param {[Point2, Point2]} area
 * @return {boolean}
 */
export function pointIsInPolygon (point, polygon, area) {
  let isInside = false

  const [[minX, minY], [maxX, maxY]] = area

  if (point[0] < minX || point[0] > maxX || point[1] < minY || point[1] > maxY) {
    return false
  }

  let i = 0; let j = polygon.length - 1
  for (i, j; i < polygon.length; j = i++) {
    if ((polygon[i][1] > point[1]) !== (polygon[j][1] > point[1]) &&
      point[0] < (polygon[j][0] - polygon[i][0]) * (point[1] - polygon[i][1]) / (polygon[j][1] - polygon[i][1]) + polygon[i][0]) {
      isInside = !isInside
    }
  }

  return isInside
}
