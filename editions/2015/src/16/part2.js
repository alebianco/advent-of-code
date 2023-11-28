import { isMain, PuzzleInput } from '@advent-of-code/utils'

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

const gt = (has, want) => want > has
const lt = (has, want) => want < has
const eq = (has, want) => want === has

const comparators = new Map(Object.keys(reference).map((prop) => [prop, eq]))
comparators.set('cat', lt)
comparators.set('trees', lt)
comparators.set('pomeranians', gt)
comparators.set('goldfish', gt)

function matchesReference ([name, value]) {
  const comparator = comparators.get(name)
  const wanted = reference[name]
  return comparator(value, wanted)
}

export function solve () {
  for (const [aunt, properties] of input) {
    if (properties.every(matchesReference)) {
      return aunt
    }
  }
}

if (isMain(import.meta)) {
  console.dir(solve())
}
