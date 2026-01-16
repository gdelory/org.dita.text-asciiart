import { AllTypes, Element } from "./DITA"

export type SubContextOpts = {
  /**
   * Subtracts the given value to the the current line
   * length for the sub-context. The subtract is safe,
   * meaning it can go under 1.
   */
  subtractLineLength?: number

  newLineLength?: number
  /**
   * Forces the Raw Text renderer to keep line breaks
   */
  keepLineBreak?: boolean
}
export default class RenderingContext {

  private stack: AllTypes[] = []
  private _keepLineBreak?: boolean
  private properties: Record<string, string | number> = {}

  /**
   * 
   * @param lineLength Line length available for rendering
   *                   Can be set to 0 in case no wrapping is needed
   */
  constructor(private lineLength: number, rootElement?: AllTypes) {
    if (rootElement) {
      this.stack.push(rootElement)
    }
  }

  static empty() {
    return new RenderingContext(-1)
  }

  getRenderingParent() {
    return this.stack[0]
  }

  getLineLength() {
    return this.lineLength
  }

  putProp(key: string, value: string | number) {
    this.properties[key] = value
  }

  getProp(key: string) {
    return this.properties[key]
  }

  getIntProp(key: string) {
    return this.properties[key] as number | undefined
  }

  
  public get keepLineBreak() : boolean | undefined {
    return this._keepLineBreak
  }

  
  public set keepLineBreak(v : boolean | undefined) {
    this._keepLineBreak = v;
  }
  

  subContext(e: AllTypes, opts: SubContextOpts = {}): RenderingContext {
    const res = new RenderingContext(this.lineLength)
    res.keepLineBreak = this.keepLineBreak

    if (opts.subtractLineLength) {
      res.lineLength = Math.max(1, this.lineLength - opts.subtractLineLength)
    }
    if (opts.newLineLength) {
      res.lineLength = opts.newLineLength
    }
    if (opts.keepLineBreak) {
      res.keepLineBreak = opts.keepLineBreak
    }
    res.stack = [e, ...this.stack]
    return res
  }
}