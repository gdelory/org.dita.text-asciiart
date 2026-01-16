import SD_Base from './SD_Base'
/**
 * The SD_Fragment represents a Fragment representation within the Syntax Diagram.
 * 
 * Fragments are shown at the end of the syntax diagram. They are almost printed as an
 * independent Syntax diagram, at the exception:
 *  - They print their title first
 *  - The start/end character is a pipe
 * 
 * Here is an example:
 * 
 * >>-required_item--| parameter-block |--------------------------><
 *                          ↑
 *                This is the reference (fragref) 
 *           to the fragment (nor part of this component)
 * 
 *     .-------    This is the Fragment shown
 *     V
 * parameter-block
 * 
 * |--+-parameter1-----------------+-------------------------------|
 *    '-parameter2--+-parameter3-+-'                                
 *                  '-parameter4-'                                  
 * 
 */
export default class SD_Fragment implements SD_Base {
  constructor(
    private title: string,
    private sequence: SD_Base
  ) {}
  getMinimumWidth() {
    return this.sequence.getMinimumWidth() + 4
    
  }
  getHeight() {
    return 1
  }
  print(width?: number) {
  const lines =  [
      this.title,
      ''
  ]

  const lineSequences = this.sequence.print((width || this.getMinimumWidth()) - 4)
  const offsetSequence = this.sequence.getDefaultGroupHeight()

  // print all lines before the main path, add a leading 2 spaces for the start fo diagram >>
    for (let i = 0; i < offsetSequence; i++) {
      lines.push('  ' + lineSequences[i] + '  ')
    }

    // print the main path line
    lines.push('|-' + lineSequences[offsetSequence] + '-|')
    

    // print remaining lines
    for (let i = offsetSequence + 1; i < lineSequences.length; i++) {
      lines.push('  ' + lineSequences[i] + '  ')
    }

  return lines
  }
  getDefaultGroupHeight(): number {
    return 0
  }
  getOptionGroupHeight(): number {
    return 0
  }
  getMainGroupHeight(): number {
    return 1
  }
}