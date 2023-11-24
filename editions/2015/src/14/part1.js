import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { divmod } from '@advent-of-code/utils/numbers'
import { max } from '@advent-of-code/utils/iterables'

const input = new PuzzleInput('input.txt', import.meta.url)
  .lineFields(/^(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds./)
  .map(([name, speed, travel, rest]) => [name, Number(speed), Number(travel), Number(rest)])

const calculateDistance = (time, [name, speed, travel, rest]) => {
  const [q, r] = divmod(time, travel + rest)
  return (q * travel + Math.min(r, travel)) * speed
}

const maxTime = 2503

export function solve () {
  return max(input.map(reindeer => calculateDistance(maxTime, reindeer)))
}

if (isMain(import.meta)) {
  console.log(solve())
}
