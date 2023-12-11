import { baseHashing } from './base-hashing.js'

/**
 * @template V
 * @callback HashSet~forEachCallback
 * @param {V} key
 * @param {V} value
 * @param {HashSet<V>} map
 */

/**
 * @template V
 */
export class HashSet {
  /**
   * @type {import('collections/base-hashing.js').baseHashing}
   */
  #hash

  /**
   * @type {Map<string, V>}
   */
  #elements = new Map()

  /**
   * @param {V[]} elements
   * @param {import('collections/base-hashing.js').baseHashing} hash
   */
  constructor (elements, hash = baseHashing) {
    this.#hash = hash

    if (elements) {
      for (const element of elements) {
        this.add(element)
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
   * @return {HashSet<V>}
   */
  clear () {
    this.#elements.clear()
  }

  /**
   * @param {V} element
   */
  delete (element) {
    return this.#elements.delete(this.#hash(element))
  }

  /**
   * @return {IterableIterator<[V, V]>}
   */
  * entries () {
    for (const value of this.#elements.values()) {
      yield [value, value]
    }
  }

  /**
   * @param {V} element
   * @return {HashSet<V>}
   */
  add (element) {
    this.#elements.set(this.#hash(element), element)
    return this
  }

  /**
   * @param {V} element
   * @return {boolean}
   */
  has (element) {
    return this.#elements.has(this.#hash(element))
  }

  /**
   * @return {IterableIterator<V>}
   */
  values () {
    return this.#elements.values()
  }

  /**
   * @param {HashSet~forEachCallback<V>} callback
   * @param {unknown} context
   */
  forEach (callback, context = this) {
    for (const value of this.values()) {
      callback.call(context, value, value, this)
    }
  }

  /**
   * @return {IterableIterator<[V,V]>}
   */
  [Symbol.iterator] () {
    return this.entries()
  }
}
