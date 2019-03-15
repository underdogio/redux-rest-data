/**
 * Trims a given string from another string.
 */
export function trim(stringToTrim: string, toTrimFromString: string) {
  if (
    stringToTrim.length === 0 ||
    toTrimFromString.length === 0 ||
    toTrimFromString.length >= stringToTrim.length
  ) {
    return stringToTrim
  }

  let trimmed = stringToTrim.slice(0)

  while (trimmed.indexOf(toTrimFromString) === 0) {
    trimmed = trimmed.slice(toTrimFromString.length)
  }

  if (trimmed.length < toTrimFromString.length) {
    return trimmed
  }

  while (
    trimmed.lastIndexOf(toTrimFromString) ===
    trimmed.length - toTrimFromString.length
  ) {
    trimmed = trimmed.slice(0, trimmed.length - toTrimFromString.length)
  }

  return trimmed
}
