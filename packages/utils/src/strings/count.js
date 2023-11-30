import assert from 'node:assert'

/**
 * @param {string} source
 * @param {string} needle
 * @return {number}
 */
export function count (source, needle) {
  assert(needle.length === 1, 'needle should be a single character')
  return ((source ?? '').match(new RegExp(`[${needle}]`, 'g')) || []).length
}
