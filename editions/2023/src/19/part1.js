import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { map } from '@advent-of-code/utils/iterables'

class Part {
  constructor (x, m, a, s) {
    this.x = x
    this.m = m
    this.a = a
    this.s = s
  }

  get score () {
    return this.x + this.m + this.a + this.s
  }

  static from (line) {
    const [x, m, a, s] = line.match(/\d+/g).map(Number)
    return new Part(x, m, a, s)
  }
}

class Worflow {
  constructor (name, cond) {
    this.name = name
    this.cond = cond
  }

  static from (line) {
    const name = line.match(/^\w+/)[0]
    const conditions = line.match(/\{(.+)}/)[1].split(',').map(check => {
      if (check.includes(':')) {
        const [test, dest] = check.split(':')
        // eslint-disable-next-line no-new-func
        return new Function('{x, m, a, s}', `if (${test}) return '${dest}'`)
      } else {
        return () => check
      }
    })

    return new Worflow(name, conditions)
  }

  entry () {
    return [this.name, this.cond]
  }
}

const input = new PuzzleInput('input.txt', import.meta.url)

const parts = input.sections()[1].linesData(Part.from)
const conditions = new Map(input.sections()[0].linesData(Worflow.from).map((workflow) => workflow.entry()))

const buckets = new Map(map(conditions.keys(), (name) => [name, []]))
const accepted = []
const rejected = []

export function solve () {
  buckets.get('in').push(...parts)

  while ([...buckets.values()].some(list => list.length > 0)) {
    for (const [name, parts] of buckets.entries()) {
      const condition = conditions.get(name)
      while (parts.length) {
        const part = parts.pop()
        for (const workflow of condition) {
          const dest = workflow(part)
          if (dest != null) {
            if (dest === 'A') {
              accepted.push(part)
            } else if (dest === 'R') {
              rejected.push(part)
            } else {
              buckets.get(dest).push(part)
            }
            break
          }
        }
      }
    }
  }

  return accepted.reduce((sum, part) => sum + part.score, 0)
}

if (isMain(import.meta)) {
  console.log(solve())
}
