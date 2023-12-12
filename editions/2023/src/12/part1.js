import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { map, powerSet, sum } from '@advent-of-code/utils/iterables'
import { replaceAt } from '@advent-of-code/utils/strings'

const input = new PuzzleInput('input.txt', import.meta.url)
  .lineFields(/^([.#?]+) ([0-9,]+)/)
  .map(([line, record]) => [line, record.split(',').map(Number)])

function countArrangements ([line, record]) {
  let valid = 0

  const re = new RegExp(`^\\.*${record.map(n => '#'.repeat(n)).join('\\.+')}\\.*$`)
  const damages = map(line.matchAll(/\?/g), (match) => match.index)
  for (const replacements of powerSet(damages)) {
    const arrangement = replaceAt(line, replacements, '.').replaceAll('?', '#')
    if (re.test(arrangement)) {
      valid++
    }
  }

  return valid
}

export function solve () {
  return sum(input.map(countArrangements))
}

if (isMain(import.meta)) {
  console.log(solve())
}
