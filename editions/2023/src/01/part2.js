import { isMain, PuzzleInput } from '@advent-of-code/utils'

const input = new PuzzleInput('input.txt', import.meta.url)

const values = new Map([
  ['one', 1],
  ['two', 2],
  ['three', 3],
  ['four', 4],
  ['five', 5],
  ['six', 6],
  ['seven', 7],
  ['eight', 8],
  ['nine', 9],
  ['1', 1],
  ['2', 2],
  ['3', 3],
  ['4', 4],
  ['5', 5],
  ['6', 6],
  ['7', 7],
  ['8', 8],
  ['9', 9]
])

const firstNumberMatcher = new RegExp(`(?<value>${[...values.keys()].join('|')}).*$`, 'i')
const lastNumberMatcher = new RegExp(`^.*(?<value>${[...values.keys()].join('|')})`, 'i')

export function solve () {
  return input.lines().reduce((sum, line) => {
    const first = line.match(firstNumberMatcher).groups.value
    const last = line.match(lastNumberMatcher).groups.value
    return sum + values.get(first) * 10 + values.get(last)
  }, 0)
}

if (isMain(import.meta)) {
  console.log(solve())
}
