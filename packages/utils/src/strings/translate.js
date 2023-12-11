import { toArray, zip } from '../iterables/index.js'

/**
 * @param {string} source
 * @param {string} characters
 * @param {string} replacements
 * @param {string} [removals]
 * @return {string}
 */
export function translate (source, characters, replacements, removals) {
  const table = new Map(toArray(zip(characters, replacements)))
  return source
    .replace(new RegExp(`[${characters}]`, 'g'), c => table.get(c))
    .replace(new RegExp(`[${removals ?? ''}]`, 'g'), '')
}
