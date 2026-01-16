/**
 * a SD_Base is an independent part of syntax diagram.
 * 
 * It is aware of its height or each group:
 *  - top, also called default group
 *  - main, which represents the main path
 *  - bottom, also called option group
 * 
 * It is alsop aware of the minimum width is required to draw its content.
 * 
 * It can print itself, to at least the minimum width of the component,
 * but a wider with can be given to add extra padding, in case there
 * are other wider stacked components.
 * 
 * It is not aware of the overall position in the Syntax diagram, so
 * when printed, horizontal and vertical offset, either other
 * components or filling lines/spaces needs yo be added by the rendering parent.
 * 
 */
export default interface SD_Base {
  /**
   * The minimum width needed but the component to print all its content
   */
  getMinimumWidth(): number
  /**
   * The total height (in number of lines) needed to print the component
   */
  getHeight(): number
  /**
   * Print the component and return the array of lines. Note that
   * the component is not aware of its context in the overall Syntax diagra, so those lines
   * need to be injected in the correct position, meaning below/above/after/before other lines
   * coming from the adjacent components.
   * @param width The with to print to. If this is less that the minimum width the component
   *              requires, it should print a warning. Components are not supposed to handle
   *              shrinking, it is up to the renderer to give enough space, or to the sequence
   *              to break down sequences in smnaller parts.
   */
  print(width?: number): string[]
  /**
   * The number of lines required by the option group (bottom group) to be printed
   */
  getOptionGroupHeight(): number
  /**
   * The number of lines required by the default group (top group) to be printed
   */
  getDefaultGroupHeight(): number
  /**
   * The number of lines required by the main group (main path) to be printed
   */
  getMainGroupHeight(): number
}