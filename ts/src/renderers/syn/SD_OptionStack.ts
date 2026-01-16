import SD_Base from './SD_Base'

/**
 * The Option Stack is not a real component being independent in the Syntax diagram. it
 * is a convenient sub-component used in an SD_Block to handle printing the bottom group of a
 * block.
 */
export default class SD_OptionStack implements SD_Base {
  constructor(private stack: SD_Base[] = []) {}
  addOption(o: SD_Base) {
    this.stack.push(o)
  }
  delimChar(isLastChild: boolean, lineIdx: number, childDefaultsHeight: number) {
    // default group always takes pipes
    if (lineIdx < childDefaultsHeight) {
      return '|'
    }
    // main path take + or ' depending if we are on the last choice of the group
    if (lineIdx === childDefaultsHeight) {
      return isLastChild ? '\'' : '+'
    }
    // option group takes | or nothing depending if we are on the last choice of the group
    return isLastChild ? ' ' : '|'
  }
  print(width?: number): string[] {
    if (!width) {
      width = this.getMinimumWidth()
    }
    // Prints:
    //     +-default_choice--+
    //     +-optional_choice-+
    //     '-optional_choice-'

    // If some options need more space, then we should use pipes instead of plus signs:
    //    -+--------------------------------------+-
    //     |                  .-default_choice--. |
    //     +-optional_choice--+-required_choice-+-+
    //     |                  '-required_choice-' |
    //     '-optional_choice----------------------'

    // print each option one by one
    let lines: string[] = []
    for (const [i, e] of this.stack.entries()) {
      // Give the item 2 less width so we can add our delimiters
      const childPrintedLines = e.print(width - 2)
      const offset = e.getDefaultGroupHeight()
      const isLastChild = i === this.stack.length - 1

      for (const [lineIdx, line] of childPrintedLines.entries()) {
        const delimiter = this.delimChar(isLastChild, lineIdx, offset)
        lines.push(`${delimiter}${line}${delimiter}`)
      }
    }
    return lines
  }
  getHeight(): number {
    // height is the sum of height of all the option
    return this.stack.map(e => e.getHeight()).reduce((a, b) => a + b, 0)
  }
  getMinimumWidth(): number {
    // option stack is wraping item with either ' (first item) or + (previous items),
    // so we need at least the space for the widest item plus 2 characters
    return Math.max(...this.stack.map(e => e.getMinimumWidth())) + 2
  }
  getDefaultGroupHeight(): number {
    return 0
  }
  getOptionGroupHeight(): number {
    return this.getHeight()
  }
  getMainGroupHeight(): number {
    return 0
  }
}