// Euclid algorithm for Greatest Common Divisor
export function gcd (a, b) {
  return a ? gcd(b % a, a) : b
}
