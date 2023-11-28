import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { HashMap } from '@advent-of-code/utils/collections'

const reference = new PuzzleInput('reference.txt', import.meta.url)
  .lineFields(/^(\w+): (\d+)$/)
  .reduce((map, [prop, value]) => Object.assign(map, { [prop]: Number(value) }), {})

const input = new PuzzleInput('input.txt', import.meta.url)
  .lineFields(/^Sue (\d+): (.*)$/)
  .map(([aunt, description]) => {
    const props = description.split(', ').map((part) => {
      const [, prop, value] = part.match(/^(\w+): (\d+)$/)
      return [prop, Number(value)]
    })
    return [Number(aunt), props]
  })

export function solve () {
  const entries = input
    .map(([aunt, description]) => {
      const props = description
        .reduce((map, [prop, value]) => {
          return Object.assign(map, { [prop]: value })
        }, {})
      return [Object.assign({}, reference, props), aunt]
    })

  return new HashMap(entries).get(reference)
}

if (isMain(import.meta)) {
  console.dir(solve())
}
