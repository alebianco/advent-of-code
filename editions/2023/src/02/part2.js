import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { reduce, sum } from '@advent-of-code/utils/iterables'

const input = new PuzzleInput('input.txt', import.meta.url)

const games = input.lineFields(/^Game (\d+): (.*)$/).map(([game, data]) => {
  const rounds = data
    .split(';')
    .flatMap((round) => {
      return round.split(',')
    })
    .reduce(
      (bag, extraction) => {
        const [, num, color] = extraction.match(/(\d+) (\w+)$/)
        bag[color] = Math.max(bag[color], Number(num))
        return bag
      },
      { red: 0, blue: 0, green: 0 }
    )

  return [Number(game), rounds]
})

export function solve (name) {
  return sum(games, 0, ([game, bag]) =>
    reduce(Object.values(bag), (a, b) => a * b)
  )
}

if (isMain(import.meta)) {
  console.log(solve())
}
