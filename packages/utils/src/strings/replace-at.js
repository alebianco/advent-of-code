/**
 * @param {string} source
 * @param {number|number[]} position
 * @param {string} replacement
 * @return {string}
 */
export function replaceAt (source, position, replacement) {
  if (Array.isArray(position)) {
    return position.reduce((result, pos) => {
      return result.substring(0, pos) + replacement + source.substring(pos + replacement.length)
    }, source)
  } else {
    return source.substring(0, position) + replacement + source.substring(position + replacement.length)
  }
}
