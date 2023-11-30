import Benchmark from 'benchmark'
import { Presets, SingleBar } from 'cli-progress'
import prettyTime from 'pretty-time'
import { restoreConsole, silenceConsole } from '@advent-of-code/utils/debug'
import { formatWithSIPrefix } from '@advent-of-code/utils/numbers'
import { toTitleCase, truncate } from '@advent-of-code/utils/strings'
import { listSolutions } from './list-solutions.js'
import { Deferred } from '../promise/index.js'

const progress = new SingleBar(
  {
    format: '[{bar}] {percentage}% | {duration_formatted} | {value}/{total}',
    clearOnComplete: true,
    hideCursor: true,
    emptyOnZero: true
  },
  Presets.shades_classic
)

const noop = () => {}

export class Runner {
  #benches

  constructor () {
    this.#benches = new Deferred(async (resolve) => {
      const list = []
      for await (const [day, part, variant, file] of listSolutions('./src')) {
        const name = `${day}-${part}-${variant}`
        const { solve, bench } = await import(file)
        if (bench != null && 'skip' in bench && bench.skip === true) {
          list.push(Benchmark({ name, fn: noop, minSamples: 0, maxTime: 0 }))
        } else {
          list.push(Benchmark({ name, fn: solve, async: true, minSamples: 5, maxTime: 2, ...bench }))
        }
      }
      resolve(list)
    })
  }

  async run () {
    const benches = await this.#benches
    const results = []

    return new Promise((resolve, reject) => {
      Benchmark.invoke(benches, { name: 'reset' })
      Benchmark.invoke(benches, {
        name: 'run',
        onStart: () => {
          silenceConsole(['error'])
          progress.start(benches.length)
        },
        onCycle: ({ target }) => {
          progress.increment()

          const { name, hz } = target
          const { mean, rme, sample } = target.stats
          const { elapsed } = target.times
          const [day, part, variant = ''] = name.split('-')

          if (target.fn === noop) {
            results.push({ day, part, variant })
          } else {
            const solution = target.fn()
            results.push({
              day,
              part,
              variant: truncate(toTitleCase(variant), 20),
              speed: formatWithSIPrefix(hz, ' ops/sec'),
              'solve time': `${prettyTime([mean | 0, (mean * 1e9) | 0])}`,
              'error margin': `±${rme.toFixed(2)}%`,
              samples: sample.length,
              elapsed: prettyTime([elapsed | 0, (elapsed * 1e9) | 0]),
              solution: typeof solution === 'number' ? solution : truncate(solution, 20)
            })
          }
        },
        onComplete: () => {
          restoreConsole()
          progress.stop()
          resolve(results)
        }
      })
    })
  }
}
