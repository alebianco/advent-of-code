import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { lcm } from '@advent-of-code/utils/numbers'

const input = new PuzzleInput('input.txt', import.meta.url)

const instructions = input.firstLine()
const map = new Map(input.subLines(2).lines().map(line => {
  const [n, l, r] = line.match(/[A-Z]+/g)
  return [n, [l, r]]
}))

export function solve () {
  const starts = Array.from(map.keys()).filter(k => k.endsWith('A'))
  const steps = starts.map(node => {
    let step = 0
    while (!node.endsWith('Z')) {
      const next = step++ % instructions.length
      const direction = instructions[next] === 'L' ? 0 : 1
      node = map.get(node)[direction]
    }
    return step
  })
  return steps.reduce(lcm)
}

if (isMain(import.meta)) {
  console.log(solve())
}
