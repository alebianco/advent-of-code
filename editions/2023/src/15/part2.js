import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { sum } from '@advent-of-code/utils/iterables'

const input = new PuzzleInput('input.txt', import.meta.url).firstLine().split(',').map(step => {
  const match = step.match(/(\w+)([=-])(\d)?/)
  return [...match.slice(1, 4), hash(match.at(1))]
})

function hash (source) {
  let sum = 0
  for (const char of source) {
    sum += char.charCodeAt(0)
    sum *= 17
    sum %= 256
  }
  return sum
}

export function solve () {
  const boxes = Array.from({ length: 256 }, () => [])
  let power = 0
  for (const step of input) {
    const [label, op, value, box] = step
    const idx = boxes[box].findIndex((lens) => lens[0] === label)
    if (op === '=') {
      if (idx >= 0) {
        power += (box + 1) * (idx + 1) * (value - boxes[box][idx][1])
        boxes[box][idx][1] = value
      } else {
        const pos = boxes[box].push([label, value])
        power += (box + 1) * pos * (value)
      }
    } else {
      if (idx >= 0) {
        power -= sum(boxes[box].map((lens, i) => (box + 1) * (i + 1) * (lens[1])))
        boxes[box].splice(idx, 1)
        power += sum(boxes[box].map((lens, i) => (box + 1) * (i + 1) * (lens[1])))
      }
    }
  }
  return power
}

if (isMain(import.meta)) {
  console.log(solve())
}
