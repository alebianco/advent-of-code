import { isMain, PuzzleInput } from '@advent-of-code/utils'

const input = new PuzzleInput('input.txt', import.meta.url).firstLine()

const sequenceTest = /(abc|bcd|cde|def|efg|fgh|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/
const doublePairTest = /(\w)\1.*(\w)\2/
const invalidCharsTest = /^[^oil]*$/

function check (password) {
  return sequenceTest.test(password) && doublePairTest.test(password) && invalidCharsTest.test(password)
}

function next (password, pos) {
  if (pos === undefined) pos = password.length - 1
  const charCode = password.charCodeAt(pos)
  let nextChar
  switch (charCode) {
    case 122: // z
      if (pos > 0) {
        password = next(password, pos - 1)
      }
      nextChar = 'a'
      break
    default:
      nextChar = String.fromCharCode(charCode + 1)
      break
  }

  return password.slice(0, pos) + nextChar + password.slice(pos + 1, password.length - pos)
}

function findNext (password) {
  do {
    password = next(password)
  } while (!check(password))
  return password
}

export function solve () {
  return findNext(input)
}

if (isMain(import.meta)) {
  console.log(solve())
}
