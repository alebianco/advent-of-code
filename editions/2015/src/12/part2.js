import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { sum } from '@advent-of-code/utils/iterables'

const input = new PuzzleInput('input.txt', import.meta.url)

function rebuildWithoutReds (source) {
  return JSON.stringify(JSON.parse(source, (key, value) => {
    if (typeof value === 'object' && !Array.isArray(value)) {
      if (Object.values(value).includes('red')) {
        return 0
      }
    }
    return value
  }))
}

export function solve () {
  const redacted = rebuildWithoutReds(input.firstLine())
  return sum(redacted.matchAll(/[0-9-]+/g), 0, ([match]) => Number(match))
}

if (isMain(import.meta)) {
  console.log(solve())
}
