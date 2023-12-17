export * from './coincident-point.js'
export * from './dot-product.js'
export * from './multiply-point.js'
export * from './neighbours.js'
export * from './sum-point.js'

/**
 * @typedef {[number, number]} Point2
 */

// DIRECTIONS

export const UP = [0, -1]
export const DOWN = [0, 1]
export const LEFT = [-1, 0]
export const RIGHT = [1, 0]
export const UP_RIGHT = [1, -1]
export const DOWN_RIGHT = [1, 1]
export const UP_LEFT = [-1, -1]
export const DOWN_LEFT = [-1, 1]

// GROUPS

export const SQUARED = [UP, RIGHT, DOWN, LEFT]
export const DIAGONALS = [UP_RIGHT, DOWN_RIGHT, DOWN_LEFT, UP_LEFT]
export const ALL = [UP, UP_RIGHT, RIGHT, DOWN_RIGHT, DOWN, DOWN_LEFT, LEFT, UP_LEFT]

// TURNS

export const TURN_NONE = [[1, 0], [0, 1]]
export const TURN_RIGHT = [[0, -1], [1, 0]]
export const TURN_LEFT = [[0, 1], [-1, 0]]
export const TURN_BACK = [[-1, 0], [0, -1]]
