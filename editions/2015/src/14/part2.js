import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { divmod } from '@advent-of-code/utils/numbers'
import { forEach, map, max, sorted, takeWhile } from '@advent-of-code/utils/iterables'

const input = new PuzzleInput('input.txt', import.meta.url)
  .lineFields(/^(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds./)
  .map(([name, speed, travel, rest]) => [name, Number(speed), Number(travel), Number(rest)])

const calculateDistance = (time, speed, travel, rest) => {
  const [q, r] = divmod(time, travel + rest)
  return (q * travel + Math.min(r, travel)) * speed
}

const distanceSorter = ([r1, d1], [r2, d2]) => d2 - d1

const distanceChanged = () => {
  let lastDistance
  return ([name, distance]) => {
    const same = lastDistance === undefined || distance === lastDistance
    lastDistance = distance
    return same
  }
}

const measure = ([name, speed, travel, rest], time) => {
  return [name, calculateDistance(time, speed, travel, rest)]
}

const leaderboard = new Map([...input].map(([name]) => [name, 0]))
const awardPoint = ([name, distance]) => leaderboard.set(name, leaderboard.get(name) + 1)

const maxTime = 2503

export function solve () {
  let round = 0
  while (round++ < maxTime) {
    forEach(takeWhile(sorted(map(input, reindeer => measure(reindeer, round)), false, distanceSorter), distanceChanged()), awardPoint)
  }
  return max(leaderboard.values())
}

if (isMain(import.meta)) {
  console.log(solve())
}
