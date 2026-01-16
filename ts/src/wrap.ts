const noneBreakingChar = /[a-zA-Z0-9'"]/
const removableBreakingCharacter = / /

function foundBreakingCharIndex(line: string, width: number) {
  // start crawling back until we find a breaking character
  for (let i = width; i >= 0; i--) {
    if (!noneBreakingChar.test(line[i])) {
      return i
    }
  }
  // not found, returning the width, we will cut mid-word, no choice
  return width
}

function wrapSingleLine(line: string, opts: WrapOptions): string[] {
  let idx = opts.width
  if (!line[idx]) {
    // nothing at this index, return the string
    return [line]
  }

  const breakAt = opts.mode === 'hard' ?  opts.width : foundBreakingCharIndex(line, opts.width)
  if (breakAt <= 0) {
    return [line]
  }
  let continueAt = breakAt
  if (opts.removeNBreakingSpaces && removableBreakingCharacter.test(line[breakAt])) {
    continueAt = breakAt + 1
  } 
  return [line.substring(0, breakAt), ...wrapSingleLine(line.substring(continueAt), opts)]
  
}

type WrapOptions = {
  width: number
  mode?: 'soft' | 'hard'
  removeNBreakingSpaces?: boolean
}

/**
 * 
 * @param s Wrap text without ever 
 * @param width 
 * @returns 
 */
export function customWrap(s: string, opts: WrapOptions) {
  // first break on line break
  const result: string[] = []
  const lines = s.split('\n')
  for (const [i, line] of lines.entries()) {
    const newLines = wrapSingleLine(line, opts)
    // re-inject new line(s) within
    result.push(...newLines)
  }
  return result.join('\n')
}