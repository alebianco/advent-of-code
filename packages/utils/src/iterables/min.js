import { reduce } from './reduce.js'
import { map } from './map.js'

/**
 * @template T
 * @template U
 * @param {Iterable<T>} iterable
 * @param {function(T):U} [transform]
 * @return {T}
 */
export function min (iterable, transform = undefined) {
  if (transform == null) {
    return reduce(iterable, Math.min, Infinity)
  } else {
    return reduce(map(iterable, transform), Math.min, Infinity)
  }
}
