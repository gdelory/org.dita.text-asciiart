import SD_Base from './SD_Base'

/**
 * The Default Stack is not a real component being independent in the Syntax diagram. it
 * is a convenient sub-component used in an SD_Block to handle printing the top group of a
 * block.
 */
export default class SD_DefaultStack implements SD_Base {
  constructor(private stack: SD_Base[] = []) {}
  addOption(o: SD_Base) {
    this.stack.push(o)
  }
  delimChar(childIdx: number, lineIdx: number, offsetChild: number) {
    const aboveMainPathOfItem = lineIdx < offsetChild
    const isMainPathOfItem = lineIdx === offsetChild
    const isFirstItem = childIdx === 0

    // first item gets different behavior. All lines below the main path get no vertical delimiter instead of |
    // the main path gets a . instead of a +
    // lines below the main path gets treated the same as other item, and gets a pipe

    if (aboveMainPathOfItem) {
      return isFirstItem ? ' ' : '|'
    } else if (isMainPathOfItem) {
      return isFirstItem ? '.' : '+'
    } else {
      return '|'
    }
  }
  print(width?: number): string[] {
    if (!width) {
      width = this.getMinimumWidth()
    }
    // Prints:
    //  .-default_2------.   
    //  +-default_1------+ 
    // return  this.stack.map((o, i) => ` ${this.delimChar(i === 0)}${o.print(width - 4)}${this.delimChar(i === 0)} `)

    // The size delimiter should only reach the main path of the first item is the default stach, not the top of the stack.
    // This is correct:
    //                 .-default 2-.                                    
    //    .-default 1--+-----------+--variable 1-.                      
    // >>-+--------------------------------------+--------------------><
    // This is incorrect:
    //    .            .-default 2-.             .                      
    //    +-default 1--+-----------+--variable 1-+                      
    // >>-+--------------------------------------+--------------------><
    //
    // If a default item is a block with a option group, the main path should be connected with pipes, such as:
    //                   .-+-default_1-+-.
    //                   | '-default_2-' |
    // >>-required_item--+-choice_1------+----------------------------><


    let lines: string[] = []
    for (const [childIdx, e] of this.stack.entries()) {
      // remove 2 to the width so we can add the start/end character
      const childPrinted = e.print(width - 2)
      lines.push(...childPrinted.map((l, i) => `${this.delimChar(childIdx, i, e.getDefaultGroupHeight())}${l}${this.delimChar(childIdx, i, e.getDefaultGroupHeight())}`))
    }
    return lines
  }
  getHeight(): number {
    // height is the sum of height of all the stack
    return this.stack.map(e => e.getHeight()).reduce((a, b) => a + b, 0)
  }
  getMinimumWidth(): number {
    // default stack is wraping item with either . (first item) or + (following items),
    // so we need at least the space for the widest item plus 2 characters
    return Math.max(...this.stack.map(e => e.getMinimumWidth())) + 2
  }
  getDefaultGroupHeight(): number {
    return this.getHeight()
  }
  getOptionGroupHeight(): number {
    return 0
  }
  getMainGroupHeight(): number {
    return 0
  }
}