import SD_Base from './SD_Base'

/**
 * This component handle repeated groups. It display the loop arrow on top of the
 * component, and show the repeat character if any. Here is an example:
 * 
 *  .-,-----------------.
 *  V                   |
 *  ---sub-item-to-print-+-
 * 
 * Note that if the surrounded component has a default group (top group), it is smart
 * enough to fit the default block below the arrow:
 * 
 *  .-,------------------.
 *  | .-default_1------. |
 *  V +-default_2------+ |
 *  --+-some-item-here-+-+-
 *  +-option_1-------+  
 *  '-option_2-------'  
 */
export default class SD_RepGroup implements SD_Base {
  constructor(private repeatedItem: SD_Base, private sepChar: string = '') {}
  getMinimumWidth() {
    // we need four more characters to add the hyphen around it and the V and |
    return this.repeatedItem.getMinimumWidth() + 4
  }
  getHeight() {
    // we need two more lines to add our arrow
    return this.repeatedItem.getHeight() + 2
  }
  print(width?: number) {
    if (!width) {
      width = this.getMinimumWidth()
    }

    
    // Display:
    //  .-,-----------------.
    //  V                   |
    // ---sub-item-to-print-+-
    //
    // or more compelx with a group
    // .-,------------------.
    // | .-default_1------. |
    // V +-default_2------+ |
    // --+-some-item-here-+-+-
    //   +-option_1-------+  
    //   '-option_2-------'  

    const itemLines = this.repeatedItem.print(width - 4)
    const itemDefaultGroupHeight = this.repeatedItem.getDefaultGroupHeight()

    const lines = []
    // Add the top arrow line
    lines.push(` .-${this.sepChar.padEnd(width - 5, '-')}. `)
    // Add all the default lines, the last one takes the arrow
    // If there is no option, we still need to add a line for the arrow
    if (itemDefaultGroupHeight === 0) {
      lines.push(` V${' '.repeat(width - 4)}| `)
    } else {
      for (let itemLineIdx = 0; itemLineIdx < itemDefaultGroupHeight; itemLineIdx++) {
        const itemLine = itemLines[itemLineIdx]
        const isLast = itemLineIdx === itemDefaultGroupHeight - 1
        if (!isLast) {
          lines.push(` |${itemLine}| `)
        } else {
          lines.push(` V${itemLine}| `)
        }
        
      }
    }
    // Then add the main path line
    lines.push(`--${itemLines[itemDefaultGroupHeight]}+-`)

    // then we add all chouices line if any
    for (let itemLineIdx = itemDefaultGroupHeight + 1; itemLineIdx < itemLines.length; itemLineIdx++) {
      lines.push(`  ${itemLines[itemLineIdx]}  `)
    }

    return lines
  }
  getDefaultGroupHeight(): number {
    // We neexd one more row on the top rows (default group) so we can render our arrow
    // also if the item has no default group, we still want one to print the "V      |" bottom of the arrow alone
    return 1 + Math.max(1, this.repeatedItem.getDefaultGroupHeight())
  }
  getOptionGroupHeight(): number {
    return  this.repeatedItem.getOptionGroupHeight()
  }
  getMainGroupHeight(): number {
      return this.repeatedItem.getMainGroupHeight()
  }
}