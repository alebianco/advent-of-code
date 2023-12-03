import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { sum } from '@advent-of-code/utils/iterables'

const input = new PuzzleInput('input.txt', import.meta.url)

const symbol = /[^\d\w.]/g

const left = ([v, [c, r]]) => {
  return input.matrixChar(r, c - 1)?.match(symbol) != null
}

const right = ([v, [c, r]]) => {
  return input.matrixChar(r, c + String(v).length)?.match(symbol) != null
}
const top = ([v, [c, r]]) => {
  return input.subMatrix(r - 1, c, 1, String(v).length).firstLine()?.matchAll(symbol).next().value != null
}
const bottom = ([v, [c, r]]) => {
  return input.subMatrix(r + 1, c, 1, String(v).length).firstLine()?.matchAll(symbol).next().value != null
}
const bottomleft = ([v, [c, r]]) => {
  return input.matrixChar(r + 1, c - 1)?.match(symbol) != null
}
const bottomright = ([v, [c, r]]) => {
  return input.matrixChar(r + 1, c + String(v).length)?.match(symbol) != null
}
const topleft = ([v, [c, r]]) => {
  return input.matrixChar(r - 1, c - 1)?.match(symbol) != null
}
const topright = ([v, [c, r]]) => {
  return input.matrixChar(r - 1, c + String(v).length)?.match(symbol) != null
}

const all = [top, bottom, left, right, topleft, topright, bottomright, bottomleft]

export function solve () {
  const values = input.linesData((line, index) => {
    const list = []
    const re = /\d+/g
    while (true) {
      const match = re.exec(line)
      if (match == null) {
        break
      }
      list.push([Number(match[0]), [match.index, index]])
    }
    return list
  }).flat()

  // const idx = 3
  // return all.map(test => test(values[idx]))

  const marked = values.filter(value => all.some(test => test(value)))

  return sum(marked, 0, ([value]) => value)
}

if (isMain(import.meta)) {
  console.log(solve())
}
