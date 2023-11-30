import { reduce } from './reduce.js'
import { map } from './map.js'

/**
 * @template T
 * @template U
 * @param {Iterable<T>} iterable
 * @param {function(T):U} [transform]
 * @return {T}
 */
export function max (iterable, transform = undefined) {
  if (transform == null) {
    return reduce(iterable, Math.max, -Infinity)
  } else {
    return reduce(map(iterable, transform), Math.max, -Infinity)
  }
}
