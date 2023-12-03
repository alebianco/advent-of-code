/**
 * An external sourcefile
 * @typedef {Object} FileInput
 * @property {string} filename - filename relative, relative to the source file
 * @property {string} [encoding="utf-8"] - file encoding
 * @property {'\n'|'\r\n'|'\r'} [eol="\n"] - end of line LF, CRLF or CR
 */

import { lstatSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

/**
 * Raw content for the source
 * @typedef {string[]} RawInput
 */

export class PuzzleInput {
  /**
   * @type {string[]}
   */
  #lines

  /**
   * @param {FileInput|RawInput|string} [source]
   * @param {string} [base]
   */
  constructor (source, base) {
    if (typeof source === 'string') {
      source = { filename: source }
    }
    if (Array.isArray(source)) {
      this.#lines = source
    } else {
      if (base && !lstatSync(fileURLToPath(new URL(base))).isDirectory()) {
        base = fileURLToPath(dirname(base))
      }
      const filename = join(base ?? process.cwd(), source?.filename ?? 'input.txt')
      const encoding = source?.encoding ?? 'utf8'
      const eol = source?.eol || '\n'
      this.#lines = readFileSync(filename, { encoding }).trimEnd().split(eol)
    }
  }

  /**
   * @return {string[]}
   */
  lines () {
    return this.#lines
  }

  /**
   * @return {string[]}
   */
  columns () {
    return this.transpose().lines()
  }

  /**
   * @param {RegExp | string} [dividerLine=""]
   * @return {PuzzleInput[]}
   */
  sections (dividerLine = '') {
    return this.lines()
      .reduce(
        (map, line) => {
          const match = dividerLine instanceof RegExp ? Boolean(line.match(dividerLine)) : line === dividerLine
          if (match) {
            map.push([])
          } else {
            const currentSection = map[map.length - 1]
            currentSection.push(line)
          }
          return map
        },
        [[]]
      )
      .map((lines) => new PuzzleInput(lines))
  }

  /**
   * @template T
   * @param {function(string, number):T} transform
   * @param {number} [numLines]
   * @return {T[]}
   */
  linesData (transform, numLines = undefined) {
    return this.lines().map(transform).slice(0, numLines)
  }

  /**
   * @return {number[]}
   */
  lineInts () {
    return this.linesData((x) => Number(x))
  }

  /**
   *
   * @param {string|RegExp} [separator]
   * @return {string[][]}
   */
  lineFields (separator) {
    if (separator instanceof RegExp) {
      return this.linesData((line) => line.match(separator).slice(1))
    } else {
      return this.linesData((line) => line.split(separator))
    }
  }

  /**
   * @param {function(string):boolean} predicate
   * @return {PuzzleInput}
   */
  linesMatching (predicate) {
    const lines = this.lines().filter(predicate)
    return new PuzzleInput(lines)
  }

  /**
   * @param {number} index
   * @return {string}
   */
  line (index) {
    return this.#lines.at(index)
  }

  /**
   * @param {number} index
   * @return {string}
   */
  column (index) {
    return this.#lines.map((line) => line[index]).join('')
  }

  /**
   * @return {string}
   */
  firstLine () {
    return this.line(0)
  }

  /**
   * @param {number} startLine
   * @param {number} [numLines]
   * @return {PuzzleInput}
   */
  subLines (startLine, numLines = undefined) {
    const lines = this.lines().slice(startLine, numLines)
    return new PuzzleInput(lines)
  }

  /**
   * @return {number}
   */
  rowsCount () {
    return this.#lines.length
  }

  /**
   * @return {number}
   */
  colsCount () {
    return this.line(0).length
  }

  /**
   * @param {number} row
   * @param {number} col
   * @return {string}
   */
  matrixChar (row, col) {
    return this.lines()[row]?.[col]
  }

  /**
   * @param {number} startRow
   * @param {number} startCol
   * @param {number} [rows]
   * @param {number} [cols]
   * @return {PuzzleInput}
   */
  subMatrix (startRow, startCol, rows = undefined, cols = undefined) {
    const sub = this.lines()
      .slice(startRow, startRow + rows)
      .map((line) => line.substr(startCol, cols))
    return new PuzzleInput(sub)
  }

  /**
   * @return {PuzzleInput}
   */
  transpose () {
    const lines = this.lineFields('')
    const inverted = Object.keys(lines[0] ?? []).map((col) => lines.map((row) => row[col]))
    return new PuzzleInput(inverted.map((line) => line.join('')))
  }

  /**
   * @param {number} col
   * @param {string} charToCount
   * @return {number}
   */
  countOccurrencesInColumn (col, charToCount) {
    return this.filterOnColValue(col, charToCount).rowsCount()
  }

  /**
   * @param {number} col
   * @param {string} value
   * @return {PuzzleInput}
   */
  filterOnColValue (col, value) {
    return this.linesMatching((line) => line[col] === value)
  }
}
