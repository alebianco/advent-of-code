/**
 * @param {Point2[]} vertexes
 * @return {number}
 */
export function shoelaceArea (vertexes) {
  let sum = 0
  for (let i = 0; i < vertexes.length; i++) {
    const [x1, y1] = vertexes[i]
    const [x2, y2] = vertexes[(i + 1) % vertexes.length]
    sum += x1 * y2 - x2 * y1
  }
  return Math.abs(sum) / 2 + vertexes.length / 2 + 1
}
