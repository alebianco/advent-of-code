/**
 * @template K
 * @template V
 * @extends {Map<K, V>}
 */
export class ReferenceMap {
  #left = new Map()
  #right = new Map()

  constructor (iterable = []) {
    this.#left = new Map(iterable)
    this.#right = new Map(ReferenceMap.swapKeyValues(iterable))
  }

  get size () {
    return this.#left.size
  }

  static * swapKeyValues (entries) {
    for (const [key, value] of entries) yield [value, key]
  }

  has (key) {
    return this.#left.has(key)
  }

  hasValue (value) {
    return this.#right.has(value)
  }

  get (key) {
    return this.#left.get(key)
  }

  getKey (value) {
    return this.#right.get(value)
  }

  set (key, value) {
    this.#left.set(key, value)
    this.#right.set(value, key)
  }

  delete (key) {
    const ref = this.#left.get(key)
    this.#left.delete(key)
    this.#right.delete(ref)
  }

  deleteValue (value) {
    const ref = this.#right.get(value)
    this.#right.delete(value)
    this.#left.delete(ref)
  }

  entries () {
    return this.#left.entries()
  }

  keys () {
    return this.#left.keys()
  }

  values () {
    return this.#left.values()
  }

  [Symbol.iterator] () {
    return this.entries()
  }
}
