import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { flatMap, sum, zip } from '@advent-of-code/utils/iterables'

class Workflow {
  static map = new Map()

  constructor (name, rule) {
    this.name = name
    this.rule = rule

    Workflow.map.set(name, this)
  }

  static from (line) {
    const [name, rule] = line.match(/^(\w+){(.+)}/).slice(1)
    const parse = (rule) => {
      let [prop, sign, value, left, right] = rule.match(/^(\w)([<>])(\d+):(.+?),(.+)$/).slice(1)
      if (right.includes(':')) {
        right = parse(right)
      }
      return { prop, sign, value: Number(value), left, right }
    }

    return new Workflow(name, parse(rule))
  }

  validCombos () {
    function branchLeft (state, prop, value) {
      return [
        Object.assign({}, state, { [prop]: [state[prop][0], value - 1] }),
        Object.assign({}, state, { [prop]: [value, state[prop][1]] })
      ]
    }

    function branchRight (state, prop, value) {
      return [
        Object.assign({}, state, { [prop]: [value + 1, state[prop][1]] }),
        Object.assign({}, state, { [prop]: [state[prop][0], value] })
      ]
    }

    function applyRule (rule, state) {
      const { prop, sign, value, left, right } = rule

      const states = (sign === '<') ? branchLeft(state, prop, value) : branchRight(state, prop, value)
      const branches = [left, right]

      return sum(flatMap(zip(branches, states), ([branch, state]) => {
        if (branch === 'A') {
          return Object.values(state).reduce((tot, [min, max]) => tot * (max - min + 1), 1)
        } else if (branch === 'R') {
          return 0
        } else if (typeof branch === 'string') {
          return applyRule(Workflow.map.get(branch).rule, state)
        } else {
          return applyRule(branch, state)
        }
      }))
    }

    return applyRule(this.rule, { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] })
  }
}

const input = new PuzzleInput('input.txt', import.meta.url)
input.sections()[0].linesData(Workflow.from)

export function solve () {
  return Workflow.map.get('in').validCombos()
}

if (isMain(import.meta)) {
  console.log(solve())
}
