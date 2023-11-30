/**
 * @param {string} source
 * @return {string}
 */
export function toTitleCase (source) {
  return source.replace(/^[-_]*(.)/, (_, c) => c.toUpperCase())
    .replace(/[-_]+(.)/g, (_, c) => ` ${c.toUpperCase()}`)
}
