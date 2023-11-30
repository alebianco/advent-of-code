export const [silenceConsole, restoreConsole] = (() => {
  const noop = () => {}
  let memo

  /**
   * @param {string[]} except
   */
  const mute = (except) => {
    if (memo === undefined) {
      memo = {}
      Object.keys(console)
        .filter((key) => typeof console[key] === 'function')
        .forEach((key) => {
          if (!except.includes(key)) {
            memo[key] = console[key]
            console[key] = noop
          }
        })
    }
  }

  const unmute = () => {
    if (memo !== undefined) {
      Object.keys(memo).forEach((key) => {
        console[key] = memo[key]
      })
      memo = undefined
    }
  }

  return [mute, unmute]
})()
