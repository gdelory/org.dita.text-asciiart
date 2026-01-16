import { Dl, Image, Li, Lines, P, Pre, Sli, Tm } from '../DITA'
import { attr, elementsByName, firstElementByName } from '../dita-parsing-utils'
import DitaRenderer, { RenderFunction } from '../DitaRenderer'
import RenderingContext from '../RenderingContext'

export default class CommonElements {
  constructor(
    private ditaRenderer: DitaRenderer,
    private noTm: boolean = false
  ) {
    ditaRenderer.registerRenderer('ul', this.renderList('ul', 'li', ' - ').bind(this))
    ditaRenderer.registerRenderer('ol', this.renderList('ol', 'li', i => ` ${i}. `).bind(this))
    ditaRenderer.registerRenderer('sl', this.renderList('sl', 'sli', '').bind(this))
    ditaRenderer.registerRenderer('note', this.renderNote.bind(this))
    ditaRenderer.registerRenderer('p', this.renderP.bind(this))
    ditaRenderer.registerRenderer('dl', this.renderDl.bind(this))
    ditaRenderer.registerRenderer('lines', this.renderLines.bind(this))
    ditaRenderer.registerRenderer('pre', this.renderPre.bind(this))
    ditaRenderer.registerRenderer('q', this.renderQ.bind(this))
    ditaRenderer.registerRenderer('tm', this.renderTm.bind(this))
    ditaRenderer.registerRenderer('image', this.renderImage.bind(this))
    ditaRenderer.registerRenderer('fn', this.renderFn.bind(this))



    
    ditaRenderer.registerRenderer('#text', ditaRenderer.renderRawText)
    
    
    ditaRenderer.registerRenderer('b', ditaRenderer.sequenceRenderer({ inline: true }))
    ditaRenderer.registerRenderer('cite', ditaRenderer.sequenceRenderer({ inline: true }))
    ditaRenderer.registerRenderer('data', ditaRenderer.renderEmpty)
    ditaRenderer.registerRenderer('dataabout', ditaRenderer.renderEmpty)
    ditaRenderer.registerRenderer('div', ditaRenderer.sequenceRenderer())
    ditaRenderer.registerRenderer('draftcomment', ditaRenderer.sequenceRenderer())
    // TODO, better rendering of fig and figgroup to show alt text
    ditaRenderer.registerRenderer('fig', ditaRenderer.renderEmpty)
    ditaRenderer.registerRenderer('fig', ditaRenderer.renderEmpty)

    // Elements simply rendered as blocks
    ditaRenderer.registerRenderer('title', ditaRenderer.sequenceRenderer())
    ditaRenderer.registerRenderer('desc', ditaRenderer.sequenceRenderer())
    ditaRenderer.registerRenderer('longdescref', ditaRenderer.sequenceRenderer())
    ditaRenderer.registerRenderer('longquoteref', ditaRenderer.sequenceRenderer())
    ditaRenderer.registerRenderer('lq', ditaRenderer.sequenceRenderer())


    // Element simply rendered as inline text
    ditaRenderer.registerRenderer('keyword',  ditaRenderer.sequenceRenderer({ inline: true }))
    ditaRenderer.registerRenderer('term', ditaRenderer.sequenceRenderer({ inline: true }))
    ditaRenderer.registerRenderer('text', ditaRenderer.sequenceRenderer({ inline: true }))
    ditaRenderer.registerRenderer('indexbase', ditaRenderer.sequenceRenderer({ inline: true }))
    ditaRenderer.registerRenderer('indexterm', ditaRenderer.sequenceRenderer({ inline: true }))
    ditaRenderer.registerRenderer('indextermref', ditaRenderer.sequenceRenderer({ inline: true }))
    ditaRenderer.registerRenderer('xref', ditaRenderer.sequenceRenderer({ inline: true }))

    // TODO, this is supposed to be a list without prefix
    ditaRenderer.registerRenderer('indextermref', ditaRenderer.sequenceRenderer())

    
    
    ditaRenderer.registerRenderer('ph', ditaRenderer.sequenceRenderer({ inline: true }))
    ditaRenderer.registerRenderer('requirecleanup', ditaRenderer.renderEmpty)

    ditaRenderer.registerRenderer('state', ditaRenderer.renderEmpty)

    ditaRenderer.registerRenderer('foreign', ditaRenderer.renderEmpty)
    ditaRenderer.registerRenderer('unknown', ditaRenderer.renderEmpty)

    


  }


  renderListItem(li: Li | Sli, prefix: string, context: RenderingContext) {
    const key = 'li' in li ? 'li' : 'sli'
    const text = this.ditaRenderer.sequenceRenderer()(li, context.subContext(li, { subtractLineLength: prefix.length }))
    // split lines, li always finishes with a line break, so we will have an empty line at the end, remove it
    const lines = text.split('\n').filter(e => e)
    // add prefix to fist line, then filler the length of prefix on following
    const r = lines.map((l, i) => {
      if (i === 0) {
        return `${prefix}${l}`
      } else {
        return `${' '.repeat(prefix.length)}${l}`
      }
    }).join('\n')
    return r
  }
  
  renderList(elementName: 'ul' | 'ol' | 'sl', childrenName: 'sli' | 'li', prefix: string | ((idx: number) => string)): RenderFunction {
    return (e: any, context: RenderingContext) => {
      const lis = elementsByName(e[elementName], childrenName)
      return '\n' + lis.map((li, i) => this.renderListItem(li, typeof prefix === 'function' ? prefix(i) : prefix, context)).join('\n')
    }
  }
  
  
  renderNote(e: Li, context: RenderingContext) {
    return 'Note:\n' + this.ditaRenderer.sequenceRenderer()(e, context)
  }
  
  renderP(e: P, context: RenderingContext) {
    return this.ditaRenderer.sequenceRenderer()(e, context) + '\n\n'
  }

  renderDl(e: Dl, context: RenderingContext) {
    let output = ''
    // first render dlhead if any (DTD says one but render all just in case)
    const dlHeads = elementsByName(e.dl, 'dlhead')
    for (const dlhead of dlHeads) {
      // render dthd i any
      const dthd = firstElementByName(dlhead.dlhead, 'dthd')
      const ddhd = firstElementByName(dlhead.dlhead, 'ddhd')
      if (dthd) {
        output += this.ditaRenderer.sequenceRenderer()(dthd, context) + '\n'
      }
      if (ddhd) {
        output += this.ditaRenderer.addPrefixToLines(this.ditaRenderer.sequenceRenderer()(ddhd, context.subContext(ddhd, { subtractLineLength: 2 })), '  ') + '\n'
      }
    }
    // then render all dlentrys
    const dlentrys = elementsByName(e.dl, 'dlentry')
    for (const dlentry of dlentrys) {
      const dts = elementsByName(dlentry.dlentry, 'dt')
      const dds = elementsByName(dlentry.dlentry, 'dd')
      for (const dt of dts) {
        output += this.ditaRenderer.sequenceRenderer()(dt, context) + '\n'
      }
      for (const dd of dds) {
        output += this.ditaRenderer.addPrefixToLines(this.ditaRenderer.sequenceRenderer()(dd, context.subContext(dd, { subtractLineLength: 2 })), '  ') + '\n'
      }
    }
    return output
  }

  renderLines(e: Lines, context: RenderingContext) {
    return this.ditaRenderer.sequenceRenderer()(e, context.subContext(e, { keepLineBreak: true }))
  }

  renderPre(e: Pre, context: RenderingContext) {
    return this.ditaRenderer.sequenceRenderer()(e, context.subContext(e, { keepLineBreak: true }))
  }

  renderQ(e: Pre, context: RenderingContext) {
    return `"${this.ditaRenderer.sequenceRenderer({ inline: true})(e, context)}"`
  }

  tmSymbol(e: Tm) {
    if (this.noTm) {
      return ''
    }
    switch (attr(e, 'tmtype')) {
    case 'reg':
      return '®'
    case 'service':
      return '℠'
    default:
      return '™'
    }
  }

  renderTm(e: Tm, context: RenderingContext) {
    return this.ditaRenderer.sequenceRenderer({ inline: true })(e, context) + this.tmSymbol(e)
  }

  renderImage(e: Image, context: RenderingContext) {
    let output = ''
    const attrElement = firstElementByName(e.image, 'alt')
    const altAttr = attr(e, 'alt')
    const inline = e[':@'].placement === 'inline'
    if (attrElement) {
      output = this.ditaRenderer.sequenceRenderer({ inline })(attrElement, context)
    } else if (altAttr) {
      output = this.ditaRenderer.renderRawText({ "#text": altAttr }, context)
    }
    
    return output
  }

  renderFn() {
    return `(${this.ditaRenderer.getAndIncreaseFootnoteOffset()})`
  }
}