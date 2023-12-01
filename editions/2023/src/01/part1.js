import { isMain, PuzzleInput } from '@advent-of-code/utils'

const input = new PuzzleInput('input.txt', import.meta.url)

const numbersMatcher = /\d/g

export function solve () {
  return input.lines().reduce((sum, line) => {
    const values = line.match(numbersMatcher)
    const first = Number(values.at(0))
    const last = Number(values.at(-1))
    return sum + first * 10 + last
  }, 0)
}

if (isMain(import.meta)) {
  console.log(solve())
}
