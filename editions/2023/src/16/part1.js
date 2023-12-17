import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { BitSet, HashMap } from '@advent-of-code/utils/collections'
import { DOWN, LEFT, RIGHT, sumPoint2, UP } from '@advent-of-code/utils/points'
import { filter } from '@advent-of-code/utils/iterables'

const input = new PuzzleInput('input.txt', import.meta.url)

const mirrors = new HashMap(filter(input.grid(), (value) => value !== '.'), ([c, r]) => `${c},${r}`)
const cave = new BitSet()
const bounds = [[0, 0], [input.colsCount() - 1, input.rowsCount() - 1]]

function isInGrid ([c, r]) {
  const [[minCol, minRow], [maxCol, maxRow]] = bounds
  return c >= minCol && c <= maxCol && r >= minRow && r <= maxRow
}

function applyMirror (mirror, pos, dir) {
  switch (true) {
    case dir === RIGHT && mirror === '/':
      return [[pos, UP]]
    case dir === RIGHT && mirror === '\\':
      return [[pos, DOWN]]
    case dir === RIGHT && mirror === '|':
      return [[pos, DOWN], [pos, UP]]
    case dir === LEFT && mirror === '/':
      return [[pos, DOWN]]
    case dir === LEFT && mirror === '\\':
      return [[pos, UP]]
    case dir === LEFT && mirror === '|':
      return [[pos, DOWN], [pos, UP]]
    case dir === UP && mirror === '/':
      return [[pos, RIGHT]]
    case dir === UP && mirror === '\\':
      return [[pos, LEFT]]
    case dir === UP && mirror === '-':
      return [[pos, LEFT], [pos, RIGHT]]
    case dir === DOWN && mirror === '/':
      return [[pos, LEFT]]
    case dir === DOWN && mirror === '\\':
      return [[pos, RIGHT]]
    case dir === DOWN && mirror === '-':
      return [[pos, LEFT], [pos, RIGHT]]
    default:
      return [[pos, dir]]
  }
}

function walk (beam) {
  let [pos, dir] = beam
  pos = sumPoint2(pos, dir)
  if (isInGrid(pos)) {
    if (mirrors.has(pos)) {
      return applyMirror(mirrors.get(pos), pos, dir)
    } else {
      return [[pos, dir]]
    }
  }
}

function energize (cave, beam) {
  const [[c, r]] = beam
  const idx = c + r * input.colsCount()
  cave.add(idx)
}

export function solve () {
  const beams = [[[-1, 0], RIGHT]]
  const seen = new HashMap(null, (beam) => JSON.stringify(beam))
  while (beams.length) {
    const newBeams = walk(beams.shift())
    if (newBeams != null) {
      for (const newBeam of newBeams) {
        if (!seen.has(newBeam)) {
          seen.set(newBeam, true)
          energize(cave, newBeam)
          beams.push(newBeam)
        }
      }
    }
  }
  return cave.size()
}

if (isMain(import.meta)) {
  console.log(solve())
}
