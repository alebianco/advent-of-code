import { isMain, PuzzleInput } from '@advent-of-code/utils'
import { lcm } from '@advent-of-code/utils/numbers'

class Module {
  static registry = new Map()
  static #inputs = new Map()

  #outputs = []

  constructor (name, outputs) {
    this.name = name
    this.#outputs.push(...outputs)

    Module.registry.set(name, this)
    outputs.forEach(dest => {
      // register temporary module, might get replaced later
      if (!Module.registry.has(dest)) {
        // eslint-disable-next-line no-new
        new Module(dest, [])
      }

      if (!Module.#inputs.has(dest)) {
        Module.#inputs.set(dest, [])
      }
      Module.#inputs.get(dest).push(name)
    })
  }

  get inputs () {
    return Module.#inputs.get(this.name).map(name => Module.registry.get(name))
  }

  get outputs () {
    return this.#outputs.map(name => Module.registry.get(name))
  }

  static make (line) {
    const [type, name, dests] = line.match(/^([%&])?(\w+) -> (.+)$/).slice(1)
    const outputs = dests.split(', ')

    if (type == null) {
      return new Module(name, outputs)
    } else if (type === '%') {
      return new FlipFlop(name, outputs)
    } else if (type === '&') {
      return new Conjunction(name, outputs)
    }
  }

  process (source, pulse) {
    return this.outputs.map(mod => [mod, pulse])
  }
}

class FlipFlop extends Module {
  #state = 0

  process (source, pulse) {
    if (pulse === 0) {
      this.#state = !this.#state * 1
      return this.outputs.map(mod => [mod, this.#state])
    } else {
      return []
    }
  }
}

class Conjunction extends Module {
  #memory = null

  process (source, pulse) {
    if (this.#memory == null) {
      this.#memory = new Map(this.inputs.map(mod => [mod.name, 0]))
    }

    this.#memory.set(source.name, pulse)
    if (Array.from(this.#memory.values()).every(Boolean)) {
      return this.outputs.map(mod => [mod, 0])
    } else {
      return this.outputs.map(mod => [mod, 1])
    }
  }
}

new PuzzleInput('input.txt', import.meta.url).linesData(Module.make)

export function solve () {
  // the output target "rx" has 1 Conjunction module "rg" that is fed by a few inputs
  // when all "rg" inputs emit return to the initial low pulse state, we can compute
  // the full cycle length by LCM-ing the value

  const targets = new Set(Module.registry.get('rg').inputs)

  const cycles = []

  let cycle = 0
  while (targets.size) {
    cycle++

    const queue = [[null, Module.registry.get('broadcaster'), 0]]

    while (queue.length) {
      const [source, module, pulse] = queue.shift()
      const results = module.process(source, pulse)

      const target = results.find(([dest, pulse]) => targets.has(dest) && pulse === 0)?.[0]
      if (target) {
        targets.delete(target)
        cycles.push(cycle)
      }

      queue.push(...results.map((result) => [module, ...result]))
    }
  }

  return cycles.reduce((a, b) => lcm(a, b))
}

if (isMain(import.meta)) {
  console.dir(solve(), { depth: null })
}
