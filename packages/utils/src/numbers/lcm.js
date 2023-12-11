import { gcd } from './gcd.js'

// Least Common Multiple function
export function lcm (a, b) {
  return a * b / gcd(a, b)
}
