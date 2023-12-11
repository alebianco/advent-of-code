import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { HashSet } from '@advent-of-code/utils/collections'
import { SQUARED, sumPoint2 } from '@advent-of-code/utils/points'

const input = new PuzzleInput('input.txt', import.meta.url)

const start = input.lines().map((line, i) => {
  const match = line.match(/S/)
  return (match) ? [match.index, i] : null
}).find(Boolean)

const CONNECTIONS = new Map([
  ['|', ['|7F', '', '|JL', '']],
  ['-', ['', '-7J', '', '-FL']],
  ['7', ['', '', '|JL', '-FL']],
  ['F', ['', '-7J', '|JL', '']],
  ['J', ['|7F', '', '', '-FL']],
  ['L', ['|7F', '-7J', '', '']],
  ['S', ['|7F', '-7J', '|JL', '-FL']]
])

const visited = new HashSet([start], ([c, r]) => `${c},${r}`)

function findNextTile (node) {
  const value = input.matrixChar(node[1], node[0])
  for (const direction of SQUARED) {
    const nextNode = sumPoint2(node, direction)
    const nextValue = input.matrixChar(nextNode[1], nextNode[0])
    const connected = CONNECTIONS.get(value)?.at(SQUARED.indexOf(direction))?.includes(nextValue)
    if (connected && !visited.has(nextNode)) {
      visited.add(nextNode)
      return nextNode
    }
  }
}

export function solve () {
  const queue = [start]
  while (queue.length) {
    const next = findNextTile(queue.shift())
    if (next != null) {
      queue.push(next)
    }
  }

  return visited.size / 2
}

if (isMain(import.meta)) {
  console.log(solve())
}
