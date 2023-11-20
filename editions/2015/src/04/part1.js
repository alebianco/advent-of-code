import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { createHash } from 'node:crypto'

const md5 = data => createHash('md5').update(data).digest('hex')

const input = new PuzzleInput('input.txt', import.meta.url).firstLine()

export function solve () {
  let answer = 0
  let hash
  do {
    hash = md5(`${input}${++answer}`)
  } while (!hash.startsWith('00000'))

  return answer
}

if (isMain(import.meta)) {
  console.log(solve())
}
