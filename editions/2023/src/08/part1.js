import { isMain, PuzzleInput } from '@advent-of-code/utils'

const input = new PuzzleInput('input.txt', import.meta.url)

const instructions = input.firstLine()
const map = new Map(input.subLines(2).lines().map(line => {
  const [n, l, r] = line.match(/[A-Z]+/g)
  return [n, [l, r]]
}))

export function solve () {
  let steps = 0
  let node = 'AAA'
  while (node !== 'ZZZ') {
    const next = steps++ % instructions.length
    const direction = instructions[next] === 'L' ? 0 : 1
    node = map.get(node)[direction]
  }
  return steps
}

if (isMain(import.meta)) {
  console.log(solve())
}
