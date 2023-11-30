import { readdir } from 'node:fs/promises'
import { resolve } from 'node:path'

/**
 * @param {string} directory
 * @return {Generator<[string, string, string, string]>}
 */
export async function * listSolutions (directory) {
  const solutionMatcher = /(?<day>\d+)\/part(?<part>[1-2])(?:_(?<name>.+))?\.js$/
  const entries = await readdir(directory, { withFileTypes: true })
  for (const entry of entries) {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) {
      yield * listSolutions(path)
    } else if (entry.isFile()) {
      const match = path.match(solutionMatcher)
      if (match != null) {
        yield [match.groups.day, match.groups.part, match.groups.name ?? 'default', path]
      }
    }
  }
}
