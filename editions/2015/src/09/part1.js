import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { min, pairwise, permutations, sum } from '@advent-of-code/utils/iterables'

const towns = new Map()

const input = new PuzzleInput('input.txt', import.meta.url)
  .lineFields(/^(\w+) to (\w+) = (\d+)$/)
  .flatMap(([from, to, distance]) => {
    if (!towns.has(from)) {
      towns.set(from, 1 << (towns.size))
    }
    if (!towns.has(to)) {
      towns.set(to, 1 << (towns.size))
    }
    const edge = towns.get(from) | towns.get(to)
    return [[edge, Number(distance)]]
  })

const routes = new Map(input)

const getDistance = ([from, to]) => routes.get(from | to)

const computeDistance = (path) => sum(pairwise(path), 0, getDistance)

export function solve () {
  return min(permutations(towns.values()), computeDistance)
}

if (isMain(import.meta)) {
  console.log(solve())
}
