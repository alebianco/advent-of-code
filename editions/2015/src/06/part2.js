import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { sum } from '@advent-of-code/utils/iterables'

const updates = new Map([
  ['on', 1],
  ['off', -1],
  ['toggle', 2]
])

const input = new PuzzleInput('input.txt', import.meta.url)
  .lineFields(/^(?:turn )?(on|off|toggle) (\d+),(\d+) through (\d+),(\d+)$/)
  .map(([command, sx, sy, ex, ey]) => {
    return [updates.get(command), Number(sx), Number(sy), Number(ex) + 1, Number(ey) + 1]
  })

export function solve () {
  const data = new Uint8Array(1000 * 1000)
  for (const [update, sx, sy, ex, ey] of input) {
    for (let row = sy; row < ey; row++) {
      for (let col = sx; col < ex; col++) {
        const light = row * 1000 + col
        const value = data[light] + update
        data[light] = Math.max(0, value)
      }
    }
  }

  return sum(data)
}

if (isMain(import.meta)) {
  console.log(solve())
}
