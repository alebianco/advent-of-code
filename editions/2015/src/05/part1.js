import { isMain, PuzzleInput } from '@advent-of-code/utils'

const input = new PuzzleInput('input.txt', import.meta.url).lines()

const vowels = /([aeiou].*){3}/
const doubles = /(\w)\1/
const banned = /(ab|cd|pq|xy)/

/**
 * @param {string} line
 * @return {boolean}
 */
function isNice (line) {
  return vowels.test(line) && doubles.test(line) && !banned.test(line)
}

export function solve () {
  return input.filter(line => isNice(line)).length
}

if (isMain(import.meta)) {
  console.log(solve())
}
