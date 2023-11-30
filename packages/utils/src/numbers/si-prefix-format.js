const SI_PREFIXES_CENTER_INDEX = 8
const siPrefixes = ['y', 'z', 'a', 'f', 'p', 'n', 'μ', 'm', '', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']

/**
 * @param {number} value
 * @param {string} unit
 * @return {string}
 */
export const formatWithSIPrefix = (value, unit = '') => {
  if (value === 0) {
    return `${value.toFixed(3)}${unit}`
  }

  const EXP_STEP_SIZE = 3
  const base = Math.floor(Math.log10(Math.abs(value)))
  const siBase = (base < 0 ? Math.ceil : Math.floor)(base / EXP_STEP_SIZE)
  const prefix = siPrefixes[siBase + SI_PREFIXES_CENTER_INDEX]

  // return number as-is if no prefix is available
  if (siBase === 0) {
    return `${value.toFixed(3)}${unit}`
  }

  // We're left with a number which needs to be divided by the power of 10e[base]
  // This outcome is then rounded two decimals and parsed as float to make sure those
  // decimals only appear when they're actually required (10.0 -> 10, 10.90 -> 19.9, 10.01 -> 10.01)
  const baseNumber = parseFloat((value / Math.pow(10, siBase * EXP_STEP_SIZE)).toFixed(2))
  return `${baseNumber}${prefix}${unit}`
}
