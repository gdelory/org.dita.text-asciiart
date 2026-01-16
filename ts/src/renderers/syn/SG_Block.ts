import SD_Base from './SD_Base'
import SD_DefaultStack from './SD_DefaultStack'
import SD_Filler from './SD_Filler'
import SD_OptionStack from './SD_OptionStack'

/**
 * The SD_Block is the most fundamental block of a syntax diagram. This is a representation
 * of an element with possibly a default group, and an option group.
 * 
 * It know how to print itself.
 */
export default class SD_Block implements SD_Base {
  private top: SD_DefaultStack = new SD_DefaultStack()
  private main: SD_Base
  private bottom: SD_OptionStack = new SD_OptionStack()
  private mainSet = false

  constructor() {
    // By default the block is just containing a filler, which is a line on the main path
    this.main = new SD_Filler()
  }

  getMinimumWidth() {
    // the width is the max width of all inner block, top, main and bottom
    if (this.getDefaultGroupHeight() == 0 && this.getOptionGroupHeight() == 0) {
      return this.main.getMinimumWidth()
    } else {
      return Math.max(this.top.getMinimumWidth() + 2, this.main.getMinimumWidth() + 4, this.bottom.getMinimumWidth() + 2)
    }
  }
  heightGroup(g: SD_Base[]) {
    return g.map(e => e.getHeight()).reduce((a, b) => a + b, 0)
  }
  getHeight(): number {
    // height is the sum option, main path and choices
    return this.top.getHeight() + this.main.getHeight() + this.bottom.getHeight()
  }
  getOffset() {
    // Offset is the height of the default group
    return this.top.getHeight()
  }
  getDefaultGroupHeight(): number {
    return this.top.getHeight()
  }
  getOptionGroupHeight(): number {
    return this.bottom.getHeight()
  }
  getMainGroupHeight(): number {
    return this.main.getHeight()
  }
  addDefault(element: SD_Base) {
    this.top.addOption(element)
  }
  addOptional(element:SD_Base) {
    this.bottom.addOption(element)
  }
  /**
   * Important, it is up to the calling compoenent to call only once this method
   * following require items should be added as choices (bottom group) if there is
   * already one on the main path
   * @param element 
   */
  addRequired(element: SD_Base) {
    if (this.mainSet) {
      this.addOptional(element)
    } else {
      this.main = element
      this.mainSet = true
    }
  }

  print(width: number): string[] {
    const w = Math.max(this.getMinimumWidth(), width)

    if (this.getDefaultGroupHeight() == 0 && this.getOptionGroupHeight() == 0) {
      return [
        this.main.print(w)[0]
      ]
    } else {
      return [
        ...this.top.print(w - 2).map(l => ` ${l} `),
        // `-+${this.main.print(w - 4)[0]}+-`,
        ...this.main.print(w - 4).map((l, li) => li === 0 ? `-+${l}+-` : ` |${l}| `),
        ...this.bottom.print(w - 2).map(l => ` ${l} `)
      ]
    }
    
  }

  getoffset(): number {
    return this.top.getHeight()
  }
}