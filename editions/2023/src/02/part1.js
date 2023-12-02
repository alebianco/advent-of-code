import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { filter, sum } from '@advent-of-code/utils/iterables'

const input = new PuzzleInput('input.txt', import.meta.url)

const games = input.lineFields(/^Game (\d+): (.*)$/).map(([game, data]) => {
  const rounds = data
    .split(';')
    .flatMap((round) => {
      return round.split(',')
    })
    .reduce(
      (bag, extraction) => {
        const [num, color] = extraction.match(/(\d+) (\w+)$/).slice(1)
        bag[color] = Math.max(bag[color], Number(num))
        return bag
      },
      { red: 0, blue: 0, green: 0 }
    )

  return [Number(game), rounds]
})

const target = { red: 12, green: 13, blue: 14 }

export function solve (name) {
  return sum(
    filter(games, ([game, bag]) =>
      Object.entries(target).every(([color, value]) => bag[color] <= value)
    ),
    0,
    ([game]) => game
  )
}

if (isMain(import.meta)) {
  console.log(solve())
}
