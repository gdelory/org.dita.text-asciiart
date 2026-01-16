import { AllKeys, AllTypes } from './DITA'
import { getElementName } from './dita-parsing-utils'
import Logger from './Logger'
import RenderingContext from './RenderingContext'
import { customWrap } from './wrap'

export type RenderFunction =  (e: any, context: RenderingContext) => string
export type SequenceRendererOptions = {
  inline?: boolean
  wrap?: boolean
}

export default class DitaRenderer {
  private renderers: {
    [elementName in AllKeys]?: RenderFunction | undefined
  } = {}
  constructor(
    private logger: Logger,
    private fnOffset: number
  ) {}

  getFootnoteOffset() {
    return this.fnOffset
  }

  getAndIncreaseFootnoteOffset() {
    return this.fnOffset++
  }

  registerRenderer(elementName: AllKeys, renderer: RenderFunction) {
    this.renderers[elementName] = renderer
  }

  unregisterRenderer(elementName: AllKeys) {
    delete this.renderers[elementName]
  }

  renderEmpty() {
    return ''
  }

  findByInheritance(e: AllTypes) {
    const attributes = e[':@'] as any
    const classAttr = attributes['class'] as string
    if (classAttr) {
      // Fiund all inheritance and reseverse, since last would be the best match if found
      const inheritanceAncestors = classAttr.split(' ').reverse()
      for (const inheritanceAncestor of inheritanceAncestors) {
        // For intance, this is topic/title, we only care about the element name to try to find a match
        const elementName = inheritanceAncestor.split('/').at(-1)
        if (elementName && this.renderers[elementName as AllKeys]) {
          return elementName as AllKeys
        }
      }
    }
  }

  renderElement(e: AllTypes, context: RenderingContext): string | undefined {
    const elementName = getElementName(e)
    if (elementName) {
      const renderer = this.renderers[elementName as AllKeys]
      if (!renderer) {
        const byInheritance = this.findByInheritance(e)
        if (byInheritance) {
          this.logger.warn(`Using inheritance to render ${elementName} as ${byInheritance}`)
          return (<RenderFunction>(this.renderers[byInheritance]))(e, context)
        } else {
          this.logger.warn(`No rendering processing found for element ${elementName}, using sequence`)
          return this.sequenceRenderer({ inline: true })(e, context)
        }
        
      }
      return renderer(e, context)
    }
  }

  /**
   * Renders a raw text node (not Text, but CDATA/PCDATA) from the XML.
   * 
   * This function does NOT wrap the text, it only removes line breaks and extra spaces
   * if `context.keepLineBreak` is not set to true.
   * 
   * @param e The text node
   * @param context The context to know if it should replace line break and extra spaces or not
   * @returns the resulting string
   */
  renderRawText(e: { '#text': string }, context: RenderingContext) {
    let t = e['#text']
  
    // We don't want to keep single line break, because they come from formatting XML
    if (t === '\n') return ''
  
    // remove line breaks
    if (!context.keepLineBreak) {
      t = t.replace(/\r\n|\n|\r/g, ' ')
      // trim spaces
      t = t.replace(/\s+/g, ' ')
    }
    return t
  }
  
  sequenceRenderer({ inline }: SequenceRendererOptions = {}) {
    return <T extends AllTypes>(element: T, context: RenderingContext) => {
      let output = ''
      const elementName = getElementName(element) as keyof AllTypes
      const content = element[elementName] as unknown as  AllTypes[] | undefined
      if (!content) {
        this.logger.error(`${elementName} not found on element: {0}`, JSON.stringify(element))
        return output
      }
      for (const e of content) {
        output += this.renderElement(e, context)
      }
      if (context.getLineLength() > 0) {
        output = this.wrapText(output, context.getLineLength())
      }
      return output + (inline ? '' : '\n')
    }
  }

  /**
   * Wrap text to the given width.
   * @param t The text to wrap
   * @param width The width
   * @returns the resulting string
   */
  wrapText(t: string, width: number) {
    // Break line every X character
    const res = customWrap(t, { width, removeNBreakingSpaces: true })
    return res
  }


  splitLines(s: string, keepEmptyLines?: boolean) {
    const res = s.split('\n')
    return keepEmptyLines ? res : res.filter(e => e)
  }
  
  addPrefixToLines(s: string, prefix: string) {
    return this.splitLines(s).map(l => `${prefix}${l}`).join('\n')
  }
}