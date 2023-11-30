/**
 * @type {Map<Symbol, string>}
 */
const symbolNames = new Map()

/**
 * @param {unknown} thing
 * @return {string}
 */
export function baseHashing (thing) {
  /**
   * @type {WeakMap<object, string>}
   */
  const savedPaths = new WeakMap()

  /**
   * @param {Symbol} symbol
   * @return {string}
   */
  function hashSymbol (symbol) {
    if (!symbolNames.has(symbol)) {
      symbolNames.set(symbol, symbol.toString() + ` - ${symbolNames.size}`)
    }
    return symbolNames.get(symbol)
  }

  /**
   * @param {unknown} thing
   * @param {string} name
   * @return {string}
   */
  function hash (thing, name) {
    if (Array.isArray(thing)) {
      return '[' + thing.map((el, i) => hash(el, `${name}[${i}]`)).join(',') + ']'
    }

    if (typeof thing === 'object') {
      if (savedPaths.has(thing)) return savedPaths.get(thing)

      savedPaths.set(thing, name)

      const keyHashes = Object.getOwnPropertyNames(thing)
        .sort((a, b) => a.localeCompare(b))
        .map(key => `${key}:${hash(thing[key], `${name}.${key}`)}`)
      const symbolHashes = Object.getOwnPropertySymbols(thing)
        .sort((a, b) => hashSymbol(a).localeCompare(hashSymbol(b)))
        .map(symbol => {
          const key = hashSymbol(symbol)
          return `[${key}]:${hash(thing[symbol], `${name}[${key}]`)}`
        })

      return '{' + keyHashes.concat(symbolHashes).join(',') + '}'
    }

    if (typeof thing === 'string') {
      return `"${thing}"`
    }

    if (typeof thing === 'symbol') {
      return hashSymbol(thing)
    }

    return thing.toString()
  }

  return hash(thing, 'this')
}
