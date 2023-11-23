import { isMain, PuzzleInput } from '@advent-of-code/utils'

/**
 * @type {[string, function():number][]}
 */
const input = new PuzzleInput('input.txt', import.meta.url)
  .lineFields(/([a-z0-9]+)?\b\s?([A-Z]+)?\s?([a-z0-9]+) -> ([a-z0-9]+)/)
  .map(([a, op, b, wire]) => {
    switch (op) {
      case 'AND':
        return [wire, () => get(a) & get(b)]
      case 'OR':
        return [wire, () => get(a) | get(b)]
      case 'LSHIFT':
        return [wire, () => get(a) << get(b) % 65536]
      case 'RSHIFT':
        return [wire, () => get(a) >> get(b) % 65536]
      case 'NOT':
        return [wire, () => 65535 - get(b)]
      case undefined:
        return [wire, () => get(b)]
      default:
        throw new Error('unknown operator')
    }
  })

const wires = new Map(input)
wires.set('b', () => get(3176)) // solution from part 1

function get (wire) {
  if (isNaN(+wire)) {
    const gate = wires.get(wire)
    const result = gate()
    // cache result of current wire
    wires.set(wire, () => get(result))
    return result
  } else {
    return parseInt(wire)
  }
}

export function solve () {
  return get('a')
}

if (isMain(import.meta)) {
  console.log(solve())
}
