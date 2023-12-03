import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { HashMap } from '@advent-of-code/utils/collections'
import { filter, sum } from '@advent-of-code/utils/iterables'

const input = new PuzzleInput('input.txt', import.meta.url)

const symbol = /[^\d\w.]/

const left = ([v, [c, r]]) => {
  const match = input.matrixChar(r, c - 1)?.match(symbol)
  if (match) {
    return { char: match[0], pos: [r, c - 1] }
  }
}

const right = ([v, [c, r]]) => {
  const match = input.matrixChar(r, c + String(v).length)?.match(symbol)
  if (match) {
    return { char: match[0], pos: [r, c + String(v).length] }
  }
}
const top = ([v, [c, r]]) => {
  const chars = input.subMatrix(r - 1, c, 1, String(v).length).firstLine()
  if (chars) {
    const list = []
    const re = /[^\d\w.]/g
    while (true) {
      const match = re.exec(chars)
      if (match == null) {
        break
      }
      list.push({ char: match[0], pos: [r - 1, c + match.index] })
    }
    return list
  }
}
const bottom = ([v, [c, r]]) => {
  const chars = input.subMatrix(r + 1, c, 1, String(v).length).firstLine()
  if (chars) {
    const list = []
    const re = /[^\d\w.]/g
    while (true) {
      const match = re.exec(chars)
      if (match == null) {
        break
      }
      list.push({ char: match[0], pos: [r + 1, c + match.index] })
    }
    return list
  }
}
const bottomleft = ([v, [c, r]]) => {
  const match = input.matrixChar(r + 1, c - 1)?.match(symbol)
  if (match) {
    return { char: match[0], pos: [r + 1, c - 1] }
  }
}
const bottomright = ([v, [c, r]]) => {
  const match = input.matrixChar(r + 1, c + String(v).length)?.match(symbol)
  if (match) {
    return { char: match[0], pos: [r + 1, c + String(v).length] }
  }
}
const topleft = ([v, [c, r]]) => {
  const match = input.matrixChar(r - 1, c - 1)?.match(symbol)
  if (match) {
    return { char: match[0], pos: [r - 1, c - 1] }
  }
}
const topright = ([v, [c, r]]) => {
  const match = input.matrixChar(r - 1, c + String(v).length)?.match(symbol)
  if (match) {
    return { char: match[0], pos: [r - 1, c + String(v).length] }
  }
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

  const gears = new HashMap([], ([x, y]) => `${x},${y}`)
  for (const value of values) {
    const matches = all.flatMap(test => test(value)).filter(match => match != null && match.char === '*')

    for (const match of matches) {
      if (!gears.has(match.pos)) {
        gears.set(match.pos, [])
      }
      gears.get(match.pos).push(value[0])
    }
  }

  return sum(filter(gears.values(), (values) => values.length === 2), 0, ([a, b]) => a * b)
}

if (isMain(import.meta)) {
  console.log(solve())
}
