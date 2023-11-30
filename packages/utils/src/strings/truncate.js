/**
 * @param {string} source
 * @param {number} size
 * @return {string}
 */
export function truncate (source, size) {
  return source.length > size ? `${source.slice(0, size - 1)}…` : source
}
