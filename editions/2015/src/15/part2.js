import { isMain, PuzzleInput } from '@advent-of-code/utils'

/**
 * @type {[number, number, number, number][]}
 */
const ingredients = new PuzzleInput('input.txt', import.meta.url)
  .lineFields(/^(\w+): capacity ([\d-]+), durability ([\d-]+), flavor ([\d-]+), texture ([\d-]+), calories ([\d-]+)$/)
  .map(([name, capacity, durability, flavor, texture, calories]) => [Number(capacity), Number(durability), Number(flavor), Number(texture), Number(calories)])

const maxTeaspoons = 100
const totalCalories = 500

/**
 * @param {number[]} quantities
 * @return {number}
 */
const score = (quantities) => {
  const numProps = ingredients[0].length - 1
  const values = new Array(numProps).fill(0)
  for (let i = 0; i < ingredients.length; i++) {
    const properties = ingredients[i]
    const quantity = quantities[i]
    for (let p = 0; p < numProps; p++) {
      const property = properties[p]
      const value = property * quantity
      values[p] += value
    }
  }

  let total = 1
  for (const value of values) {
    total *= Math.max(0, value)
  }
  return total
}

/**
 * @param {number} ingredients
 * @param {number} totalTeaspoons
 * @return {Generator<number[]>}
 */
function * generateRecipe (ingredients, totalTeaspoons) {
  const start = ingredients === 1 ? totalTeaspoons : 1
  for (let teaspoons = start; teaspoons < totalTeaspoons + 1; teaspoons++) {
    const teaspoonsLeft = totalTeaspoons - teaspoons
    if (ingredients < 2) {
      yield [teaspoons]
    } else {
      for (const mixture of generateRecipe(ingredients - 1, teaspoonsLeft)) {
        yield [teaspoons].concat(mixture)
      }
    }
  }
}

function isDiet (quantities) {
  let calories = 0
  for (let i = 0; i < ingredients.length; i++) {
    const ingredient = ingredients[i]
    const quantity = quantities[i]
    calories += ingredient.at(-1) * quantity
  }
  return calories === totalCalories
}

export function solve () {
  let maxScore = 0
  for (const recipe of generateRecipe(ingredients.length, maxTeaspoons)) {
    if (isDiet(recipe)) {
      maxScore = Math.max(maxScore, score(recipe))
    }
  }
  return maxScore
}

if (isMain(import.meta)) {
  console.log(solve())
}
