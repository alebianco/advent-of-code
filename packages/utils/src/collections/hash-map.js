import { baseHashing } from './base-hashing.js'

/**
 * @template K
 * @template V
 * @callback HashMap~forEachCallback
 * @param {K} key
 * @param {V} value
 * @param {HashMap<K, V>} map
 */

/**
 * @template K
 * @template V
 */
export class HashMap {
  /**
   * @type {import('collections/base-hashing.js').baseHashing}
   */
  #hash

  /**
   * @type {Map<string, V>}
   */
  #elements = new Map()

  /**
   * @type {Map<string, K>}
   */
  #keys = new Map()

  /**
   * @param {[K, V][]} elements
   * @param {import('collections/base-hashing.js').baseHashing} hash
   */
  constructor (elements, hash = baseHashing) {
    this.#hash = hash

    if (elements) {
      for (const [key, value] of elements) {
        this.set(key, value)
      }
    }
  }

  /**
   * @return {number}
   */
  get size () {
    return this.#elements.size
  }

  /**
   * @return {HashMap<K, V>}
   */
  clear () {
    this.#elements.clear()
    this.#keys.clear()
    return this
  }

  /**
   * @param {K} key
   * @return {boolean}
   */
  delete (key) {
    const hash = this.#hash(key)
    return this.#elements.delete(hash) && this.#keys.delete(hash)
  }

  /**
   * @return {IterableIterator<[K, V]>}
   */
  entries () {
    return function * () {
      const keys = this.#keys.entries()
      for (const [hash, key] of keys) {
        yield [key, this.#elements.get(hash)]
      }
    }
  }

  /**
   * @return {IterableIterator<K>}
   */
  keys () {
    return this.#keys.values()
  }

  /**
   * @return {IterableIterator<V>}
   */
  values () {
    return this.#elements.values()
  }

  /**
   * @param {K} key
   * @param {V} value
   * @return {HashMap<K, V>}
   */
  set (key, value) {
    const hash = this.#hash(key)
    this.#keys.set(hash, key)
    this.#elements.set(hash, value)
    return this
  }

  /**
   * @param {K} key
   * @return {V}
   */
  get (key) {
    return this.#elements.get(this.#hash(key))
  }

  /**
   * @param {K} key
   * @return {boolean}
   */
  has (key) {
    return this.#elements.has(this.#hash(key))
  }

  /**
   * @param {HashMap~forEachCallback<K, V>} callback
   * @param {unknown} context
   */
  forEach (callback, context = this) {
    for (const [key, value] of this.entries()) {
      callback.call(context, value, key, this)
    }
  }

  /**
   * @return {IterableIterator<[K,V]>}
   */
  [Symbol.iterator] () {
    return this.entries()
  }
}
