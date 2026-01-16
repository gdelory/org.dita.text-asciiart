import { inspect } from 'util'
import Logger from '../../Logger'
import SD_Base from './SD_Base'

/**
 * The SD_Sequence shows a Groupseq element of a syntax diagram.
 * It display element in sequence, once after the other.
 * If the sequence is too long, it can break it down in multiple
 * sequences, but an explicit call to breakDown() is needed
 * for this to happen.
 * 
 * If it is printed without breaking down first, it might overflow
 * out of the screen.
 * 
 * Note that is is smart enough to handle positioning all items so
 * their main path offset match, incase they don't have the same height
 * of default group.
 * 
 * It will also fill empty lines if some elements are not as high, so
 * the horizontal alignment is correct.
 * 
 * Here is an example with some explanation:
 * 
 *            Space filled here since the
 *            since the first and last item
 *               have no default group           Filling space
 *            |                        |       until end of screen
 *            |                        |              |
 *            V                        V              V
 *                   .-default_1-.                                  
 * >>-required_item--+-default_2-+--choice_1----------------------><
 * 
 */
export default class SD_Sequence implements SD_Base {
  constructor(
    private logger: Logger
  ) {}

  private elements: SD_Base[] = []
  private compact: boolean = false
  addElement(e: SD_Base) {
    this.elements.push(e)
  }

  setCompact() {
    this.compact = true
  }

  getElements() {
    return this.elements
  }

  getElementCount() {
    return this.elements.length
  }

  isEmpty() {
    return this.elements.length === 0
  }

  getHeight(): number {
    // The height is the sum of the higher top group (default group), the main path (1)
    // and the higher bottom group (option group)
    return this.getDefaultGroupHeight() + this.getMainGroupHeight() + this.getOptionGroupHeight()
  }
  getDefaultGroupHeight(): number {
      return Math.max(...this.elements.map(e => e.getDefaultGroupHeight()))
  }
  getOptionGroupHeight(): number {
      return Math.max(...this.elements.map(e => e.getOptionGroupHeight()))
  }
  getMainGroupHeight(): number {
    return Math.max(...this.elements.map(e => e.getMainGroupHeight()))
  }
  getMinimumWidth(): number {
    // sum of all width, add 2 in case of compact mode and it's up to the sequence to add the leading/traling hypen/spaces
    return this.elements.map(e => e.getMinimumWidth()).reduce((a, b) => a + b, 0) + (this.compact ? 2 : 0)
  }
  print(width?: number): string[] {
    
    if (width && this.getMinimumWidth() > width) {
      this.logger.warn(`Not enough space to print sequence. Required: ${this.getMinimumWidth()}, Given: ${width}`)
      // TODO, cut the sequence?
    }

    if (!width) {
      width = this.getMinimumWidth()
    }

    // we print all blocks, and then merge array together with the right offset

    // the max heigth is the number of lines we will need
    const h = this.getHeight()
    // The offset of the group is the max height of the default groiup
    const maxDefaulstHeight = this.getDefaultGroupHeight()


    // we create an matrix, where each cell is the line of an element, such as with the sequence:
    // A -> B -> C
    // Assuming A is a single item, B is a block with a default, and C is a block with an option
    //                      .-default-item-.                             
    //    >>-required-item--+--------------+--+---------------+----------><
    //                                        '-optional-item-'            
    // The matrix will look like:
    // [undefined,         '.-default-item-.',  undefined]
    // ['-required-item-', '-+--------------+-', '-+---------------+-']
    // [undefined,             undefined,         ''-optional-item-'']
    // Then we just need to append each line of the matric, by filling/passing eeach column

    const matrix: string[][] = Array.from(Array(h), () => new Array(this.elements.length).fill(''))

    for (const [elemIdx, element] of this.elements.entries()) {
      const elemWidth = element.getMinimumWidth()
      const elemDefaultsHeight = element.getDefaultGroupHeight()
      const elemLines = element.print(elemWidth)


      // wr print the lines, the first line is the offset minus the maximum offset
      const startLine = maxDefaulstHeight - elemDefaultsHeight
      let currentLineIdx = startLine

      for (const line of elemLines) {
        this.logger.debug(`Writing line ${currentLineIdx}, cell number ${elemIdx}: ${line}`)
        matrix[currentLineIdx++][elemIdx] = line
      }

    }

    let lines: string[] = []

    for (let lineIdxInMatrix = 0; lineIdxInMatrix < matrix.length; lineIdxInMatrix++) {
      const lineAsArray = matrix[lineIdxInMatrix];
      // join all element
      let l = lineAsArray.map((part, i) => {
        const widthColumn = this.elements[i].getMinimumWidth()
        if (!part) {
          // undefined, fill with space
          return ' '.repeat(widthColumn)
        } else {
          // there is something to print, make sure we pad the end in case it wasn't long enough
          return part.padEnd(widthColumn, ' ')
        }
      }).join('')

      // // we need to pad the line to fill up the width in case we were given mroe than what we need
      l = l.padEnd(width , lineIdxInMatrix === this.getDefaultGroupHeight() ? '-' : ' ')
      if (this.compact) {
        if (lineIdxInMatrix === maxDefaulstHeight) {
          // Printing main path, make sure to add the leading and trailing hyphen
          lines.push(`-${l}-`)
        } else {
          // add leading and trailing space
          lines.push(` ${l} `)
        }
      } else {
        lines.push(l)
      }
      
    }

    return lines
  }

  breakDown(width: number) {
    const result: SD_Sequence[] = []
    let currentWidth = 0
    let currentSequence = new SD_Sequence(this.logger)
    for (const element of this.elements) {
      // If this item will make it go out the screen, create a new sequence and add the element to it
      if (currentWidth + element.getMinimumWidth() > width) {

        // If the current width is 0, it means this single element is too much, display a warning 
        if (currentWidth === 0) {
          // even adding one part of the sequence is too much for the screen, display warning
          this.logger.warn(`Cannot break sequence to fit the screen, single element of the main sequence wider than the screen`)
        }
        // Register the current sequence if not empty (case where the single element is too wide)
        if (!currentSequence.isEmpty()) {
          result.push(currentSequence)
        }
        // initialize a new sequence for next itemn
        currentSequence = new SD_Sequence(this.logger)
        currentWidth = 0
      }

      currentSequence.addElement(element)
      currentWidth += element.getMinimumWidth()
    }

    if (!currentSequence.isEmpty()) {
      result.push(currentSequence)
    }

    return result
  }
}
  