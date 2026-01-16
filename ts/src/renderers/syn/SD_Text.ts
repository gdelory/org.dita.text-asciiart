import SD_Base from './SD_Base'
/**
 * The SD_Text component just show a text component from the
 * syntax diagram, which are:
 *  - `kwd`
 *  - `var`
 *  - `delim`
 *  - `oper`
 *  - `sep`
 * 
 * It will show surrounded by hyphens:#
 * 
 * -some_name-
 * 
 * And can also pad if the given width is more than the minimum width:
 * -some_name---------------
 * 
 * 
 * It can take a compact form when it doesn't add hyphen, which is useful if the element
 * is part of a groupcomp:
 * 
 * >>-a_delima_kwdan_opera_sepa_var-------------------------------><
 * 
 */
export default class SD_Text implements SD_Base {
  constructor(
    private text: string = '',
    private compact?: boolean
  ) {}
  getMinimumWidth() {
    // To print text, we just need to ass hyphen before and after,
    // so we need two more characters than the text's length
    return this.text.length + (this.compact ? 0 : 2)
    
  }
  getHeight() {
    return 1
  }
  print(width?: number) {
    if (this.compact) {
      return [`${this.text}`.padEnd(width || this.getMinimumWidth(), '-')]
    } else {
      return [`-${this.text}-`.padEnd(width || this.getMinimumWidth(), '-')]
    }
    
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