import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { HashMap, PriorityQueue } from '@advent-of-code/utils/collections'
import { coincidentPoint2, dotProductPoint2, sumPoint2, TURN_LEFT, TURN_NONE, TURN_RIGHT } from '@advent-of-code/utils/points'

const input = new PuzzleInput('input.txt', import.meta.url)

const grid = new HashMap(input.grid(value => Number(value)), ([c, r]) => `${c},${r}`)
const start = [0, 0]
const end = [input.colsCount() - 1, input.rowsCount() - 1]

class State {
  constructor (loss, pos, dir, dist) {
    this.loss = loss
    this.pos = pos
    this.dir = dir
    this.dist = dist
  }

  static compare (a, b) {
    return a.loss === b.loss ? a.dist - b.dist : a.loss - b.loss
  }

  hash () {
    return JSON.stringify([this.pos, this.dir, this.dist])
  }
}

export function solve () {
  const seen = new Set()
  const Q = new PriorityQueue(State.compare)
  Q.push(new State(0, start, [1, 0], 0))
  Q.push(new State(0, start, [0, 1], 0))

  while (Q.size()) {
    const current = Q.pop()

    if (seen.has(current.hash())) {
      continue
    }
    seen.add(current.hash())

    const { loss, pos, dir, dist } = current

    if (coincidentPoint2(pos, end)) {
      return loss
    }

    for (const turn of [TURN_NONE, TURN_LEFT, TURN_RIGHT]) {
      const sameDir = turn === TURN_NONE
      const nextDir = dotProductPoint2(dir, turn)
      const nextPos = sumPoint2(pos, nextDir)
      if (grid.has(nextPos)) {
        if (!sameDir || dist < 3) {
          const nextDist = (dist * sameDir) + 1
          const nextValue = loss + grid.get(nextPos)
          Q.push(new State(nextValue, nextPos, nextDir, nextDist))
        }
      }
    }
  }
}

if (isMain(import.meta)) {
  console.log(solve())
}
