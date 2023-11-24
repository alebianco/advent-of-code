import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { cycle, map, max, min, pairwise, permutations, sum, take, toArray } from '@advent-of-code/utils/iterables'

const people = new Map()

const input = new PuzzleInput('input.txt', import.meta.url)
  .lineFields(/^(\w+) would (lose|gain) (\d+) happiness units by sitting next to (\w+).$/)
  .map(([a, op, amount, b]) => {
    if (!people.has(a)) {
      people.set(a, 1 << (people.size))
    }
    if (!people.has(b)) {
      people.set(b, 1 << (people.size))
    }
    const edge = people.get(a) | people.get(b)
    const mul = (op === 'lose') ? -1 : 1
    return [edge, Number(amount) * mul]
  })

const relationships = input.reduce((map, [edge, value]) => {
  return map.set(edge, (map.get(edge) ?? 0) + value)
}, new Map())

const getHappiness = ([from, to]) => relationships.get(from | to)

const computeHappiness = (sequence) => {
  const edges = toArray(map(pairwise(sequence), getHappiness))
  // sit between the least happy pair, cancelling their edge value
  return sum(edges) - min(edges)
}

const repeatFirstItem = (sequence) => take(cycle(sequence), people.size + 1)

export function solve () {
  return max(map(map(permutations(people.values()), repeatFirstItem), computeHappiness))
}

if (isMain(import.meta)) {
  console.log(solve())
}
