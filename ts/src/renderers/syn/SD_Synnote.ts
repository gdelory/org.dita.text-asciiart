import SD_Base from './SD_Base'
/**
 * The SD_Synnote represents a note in the syntax diagram. It shows
 * as its own component, and is not directly attached to another component.
 * 
 * It prints itself as a hyphen line with the number of the note between parentheses:
 * 
 *   (1) 
 *  -----
 * 
 * It can also pad if the width offered is more than the minimum width:
 *             (1) 
 *  ---------------
 * 
 */
export default class SD_Synnote implements SD_Base {
  constructor(private id: number, private text: string) {}
  getMinimumWidth() {
    // we need four more characters to add the hyphen around it and the V and |
    return this.id.toString().length + 4
  }
  getHeight() {
    // we need one line for the main path, plus one line for the number above it
    return 2
  }
  getText() {
    return this.text
  }
  print(width?: number) {
    if (!width) {
      width = this.getMinimumWidth()
    }

    
    // Display:
    //   (1) 
    //  -----
    //             (1) 
    //  ---------------
    const padding = width - this.getMinimumWidth()
    const id = this.id.toString()

    return [
      ` (${id}) `.padStart(width, ' '),
      `--${'-'.repeat(id.length + padding)}--`
    ]
  }
  getDefaultGroupHeight(): number {
    return 1 
  }
  getOptionGroupHeight(): number {
    return 0
  }
  getMainGroupHeight(): number {
      return 1
  }
  renderNote() {
    return `${this.id}. ${this.text}\n`
  }
}