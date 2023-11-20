import { isMain, PuzzleInput } from '@advent-of-code/utils'

const input = new PuzzleInput('input.txt', import.meta.url).lines()

const doubles = /(\w\w).*\1/
const palindrome = /(\w)\w\1/

/**
 * @param {string} line
 * @return {boolean}
 */
function isNice (line) {
  return doubles.test(line) && palindrome.test(line)
}

export function solve () {
  return input.filter(line => isNice(line)).length
}

if (isMain(import.meta)) {
  console.log(solve())
}
