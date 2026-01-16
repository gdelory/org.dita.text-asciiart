import SD_Base from './SD_Base'

/**
 * The SD_Filler component is used to print the hyphen line on groups
 * when the main path is empty. For example:
 *   -+-----------------+-    <-- The main group contains a filler
 *    '-optional_choice--' 
 */
export default class SD_Filler implements SD_Base {
  getMinimumWidth() {
    // Filler needs only 2 chacaters to print
    return 2
  }
  getHeight() {
      return 1
  }
  print(width?: number) {
    return ['-'.repeat(width || 2)]
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