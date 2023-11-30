import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { BitSet } from '@advent-of-code/utils/collections'

const actions = new Map([
  ['on', BitSet.prototype.addRange],
  ['off', BitSet.prototype.removeRange],
  ['toggle', BitSet.prototype.flipRange]
])

const input = new PuzzleInput('input.txt', import.meta.url)
  .lineFields(/^(?:turn )?(on|off|toggle) (\d+),(\d+) through (\d+),(\d+)$/)
  .map(([command, sx, sy, ex, ey]) => {
    const action = actions.get(command)
    return [action, Number(sx), Number(sy), Number(ex) + 1, Number(ey) + 1]
  })

export function solve () {
  const grid = new BitSet()
  for (const [action, sx, sy, ex, ey] of input) {
    for (let row = sy; row < ey; row++) {
      action.call(grid, row * 1000 + sx, row * 1000 + ex)
    }
  }

  return grid.size()
}

if (isMain(import.meta)) {
  console.log(solve())
}
