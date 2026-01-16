import SD_Base from './SD_Base'
/**
 * The SD_Fragref represents a Fragref representation within the Syntax Diagram.
 * 
 * Fragments are shown within the syntax diagram only at their title.
 * Here is an example:
 * 
 * >>-required_item--| parameter-block |--------------------------><
 *                          ↑
 *                This is the reference (fragref) 
 *           to the fragment , only the title is shown
 * 
 *     .-------    This is the Fragment shown at the bottom
 *     V                not part of this component
 * parameter-block
 * 
 * |--+-parameter1-----------------+-------------------------------|
 *    '-parameter2--+-parameter3-+-'                                
 *                  '-parameter4-'                                  
 * 
 */
export default class SD_Fragref implements SD_Base {
  constructor(
    private text: string = ''
  ) {}
  getMinimumWidth() {
    return this.text.length + 6
    
  }
  getHeight() {
    return 1
  }
  print(width?: number) {
  return [`-| ${this.text} |-`.padEnd(width || this.getMinimumWidth(), '-')]
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