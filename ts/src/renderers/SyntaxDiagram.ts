import { inspect } from 'util'
import { AllTypes, Delim, Fragment, Fragref, Groupchoice, Groupcomp, Groupseq, Kwd, Oper, Sep, SynDiagramImportance, Synnote, Synnoteref, Syntaxdiagram, Title, Var } from '../DITA'
import { firstElementByName, getContent, setContent } from '../dita-parsing-utils'
import DitaRenderer from '../DitaRenderer'
import RenderingContext from '../RenderingContext'
import { cleanTopicId, recursively } from '../utils'
import Logger from '../Logger'
import SD_Synnote from './syn/SD_Synnote'
import SD_Sequence from './syn/SD_Sequence'
import SD_Fragment from './syn/SD_Fragment'
import SD_Base from './syn/SD_Base'
import SD_Block from './syn/SG_Block'
import SD_RepGroup from './syn/SD_RegGroup'
import SD_Fragref from './syn/SD_Fragref'
import SD_Text from './syn/SD_Text'

export type SG_TextElem = Kwd | Var | Delim | Oper | Sep

export default class SyntaxDiagram {
  private fragmentMap: { id: string, title: string, value: SD_Fragment }[] = []
  private synnotesMap: { id: string, value: SD_Synnote }[] = []
  constructor(
    private ditaRenderer: DitaRenderer,
    private logger: Logger,
    private noTm: boolean = false
  ) {
    ditaRenderer.registerRenderer('syntaxdiagram', this.renderSyntaxDiagram.bind(this))
  }

  /**
   * 
   * Syntax diagrams are made of groups, either in sequence (groupseq and groupcomp), 
   * or in vertically stacked choices (groupchoice).
   * 
   * Those group can be directly referenced, or come from indirect reference with
   * fragments (fragment/fragref).
   * 
   * Then can also contain notes (synnote/synnoteref) which behave like
   * footnotes (parenthesed number and note after the diagram).
   * 
   * Groups are shown in sequence on the horinzontal line (the main path):
   * >>-required-item-----------------------------------------------><
   * 
   * Optional items are below the main path:
   *    >>-required-item--+---------------+----------------------------><
   *                      '-optional-item-'
   * 
   * The present of a Repsep element in the sequence means it can be repeated,
   * and we should display the return arrow above the group:
   *                       .------------------.   
   *                       V                  |   
   *    >>-required_item ----repeatable_item -+------------------------><
   *    
   * 
   * 
   * Fragments are only shown after their name, for instance:
   * 
   *  >>-required_item--| parameter-block |--------------------------><
   *     
   *     parameter-block
   *     
   *     |--+-parameter1-----------------+-------------------------------|
   *        '-parameter2--+-parameter3-+-'   
   *                      '-parameter4-'  
   * 
   * Where "parameter-block" is a fragref in the syntax diagram:
   * <syntaxdiagram>
   *   <groupseq>
   *     <var>required_item</var>
   *   </groupseq>
   *   <fragref>parameter-block</fragref>
   *   <fragment>
   *     <title>parameter-block</title>
   *     <groupchoice>
   *       <var>parameter1</var>
   *       <groupseq>
   *         <var>parameter2</var>
   *         <groupchoice>
   *           <var>parameter3</var>
   *           <var>parameter4</var>
   *         </groupchoice>
   *       </groupseq>
   *     </groupchoice>
   *   </fragment>
   * </syntaxdiagram>
   * 
   * 
   * 
   * @param e The SYntax diagram to render
   * @param context Context to know the available width
   * @returns The output string
   */
  renderSyntaxDiagram(e: Syntaxdiagram, context: RenderingContext) {

    // Reset the notes and fragments in case we already rendered a syntax diagram
    this.synnotesMap.length = 0
    this.fragmentMap.length = 0

    // logger.debug(inspect(content, false, null, true))


    // find recursively all fragments since they can be referenced later with fragref
    const fragmentsOnly: Fragment[] = []

    recursively(e, (el => {
      // Clean empty text nodes, in a syntax diagram they have no value
      // and will notes processing wince they won't be seen as first element in a group
      // if there is a empty text node before
      this.cleanTextInPlace(el)
      if (this.isFragment(el)) {
        fragmentsOnly.push(el)
      }
    }))

    // Process all root synnotes since they can be referenced later using synnoteref
    for (const synnote of e.syntaxdiagram.filter(e => this.isSynnote(e) && e[':@'].id)) {
      if (synnote[':@'].id) {
        this.synnotesMap.push({
          id: synnote[':@'].id as string,
          value: new SD_Synnote(this.synnotesMap.length + 1, this.ditaRenderer.sequenceRenderer({ inline: true})(synnote, RenderingContext.empty()))
        })
      }
    }

    // Process synnotes to re-attach them as groupseq or previous sibling of the parent if needed
    this.relocateSynnotes(e)

    const noneFragmentsNorRootSynnotes = e.syntaxdiagram.filter(e => !this.isFragment(e) && !(this.isSynnote(e) && e[':@'].id)) as Exclude<Syntaxdiagram['syntaxdiagram'][number], Fragment>[]

    // create map of framment
    for (const f of fragmentsOnly) {
      const title = firstElementByName(f.fragment, 'title')
      if (title) {
        const titleAsText = this.ditaRenderer.sequenceRenderer({ inline: true })(title, context)
        this.fragmentMap.push({
          id: '',
          title: titleAsText,
          value: this.processFragment(f, context)
        })
      }
    }

    const mainSequence = new SD_Sequence(this.logger)

    // process all other element
    for (const e of noneFragmentsNorRootSynnotes) {
      const r = this.convertToSgBase(e)
      if (r) {
        mainSequence.addElement(r)
      }
    }

    let output = ''

    // Keep 4 characters for >> (beginning) and >< (end)
    const availableWidth = context.getLineLength() - 4

    // break down the sequence if too long for the screen
    const allSequences: SD_Sequence[] = []
    let currentWidth = 0
    let currentSequence = new SD_Sequence(this.logger)

    const _logger = this.logger

    function newSequence() {
      if (!currentSequence.isEmpty()) {
          allSequences.push(currentSequence)
        }
        // initialize a new sequence for next itemn
        currentSequence = new SD_Sequence(_logger)
        currentWidth = 0
    }

    for (const element of mainSequence.getElements()) {

      // if the element is a sequence and is wider than the screen, break it itself
      if (element instanceof SD_Sequence && element.getMinimumWidth() > availableWidth) {
        // First reset any ongoing squence, to keep this one together as much as possible
        newSequence()
        allSequences.push(...element.breakDown(availableWidth))
        continue
      }

      // If this is a normal suite of group choice or sequence, process them normally

      // If this item will make it go out the screen, create a new sequence and add the element to it
      if (currentWidth + element.getMinimumWidth() > availableWidth) {

        // If the current width is 0, it means this single element is too much, display a warning 
        if (currentWidth === 0) {
          // even adding one part of the sequence is too much for the screen, display warning
          this.logger.warn(`Cannot break sequence to fit the screen, single element of the main sequen ce wider than the screen`)
        }
        // Register the current sequence if not empty (case where the single element is too wide)
        newSequence()
      }

      currentSequence.addElement(element)
      currentWidth += element.getMinimumWidth()
    }
    // Add any remind elements in the last sequence
    if (!currentSequence.isEmpty()) {
      allSequences.push(currentSequence)
    }

    // render all sub sequences
    for (const [seqIdx, subSequence] of allSequences.entries()) {

      const isFirst = seqIdx === 0
      const isLast = seqIdx === allSequences.length - 1
      const isAlone = allSequences.length === 1

      // Remove 4 is alone, because we will print
      // >>-----------------------------><
      // remove 3 if first or last, because we will print:
      // >>------------------------------>
      // or
      // >------------------------------><
      // Remove 2 if middle sequences, because we will print
      // >-------------------------------<
      let toRemove, prefix, prefixMain, suffix, suffixMain
      if (isAlone) {
        toRemove = 4
        prefix = '  '
        prefixMain = '>>'
        suffix = '  '
        suffixMain = '><'
      } else if (isFirst) {
        toRemove = 3
        prefix = '  '
        prefixMain = '>>'
        suffix = ' '
        suffixMain = '>'
      } else if (isLast) {
        toRemove = 3
        prefix = ' '
        prefixMain = '>'
        suffix = '  '
        suffixMain = '><'
      } else {
        toRemove = 2
        prefix = ' '
        prefixMain = '>'
        suffix = '  '
        suffixMain = '>'
      }
      const lines = subSequence.print(context.getLineLength() - toRemove)
      const mainPathOffset = subSequence.getDefaultGroupHeight()

      // print all lines before the main path, add a leading 2 spaces for the start fo diagram >>
      for (let i = 0; i < mainPathOffset; i++) {
        output += prefix + lines[i] + suffix + '\n'
      }

      // print the main path line
      output += prefixMain + lines[mainPathOffset] + suffixMain + '\n'
      
      

      // print remaining lines
      for (let i = mainPathOffset + 1; i < lines.length; i++) {
        output += prefix + lines[i] + suffix + '\n'
      }

      // render all fragment if any
      for (const { value } of this.fragmentMap) {
        output += '\n' + value.print(context.getLineLength()).join('\n')
      }
    }

    // render all notes if any
    if (this.synnotesMap.length > 0) {
      output += '\nNotes:\n'
      for (const { value } of this.synnotesMap) {
        output += '\n' + value.renderNote()
      }
    }
    return output + '\n'
  }

  /**
   * Synnotes should always form a groupseq with their previous element (not parent). To make processing easier later, rework the tree to
   * make this happen so we don't have to do crazy processing to find the previous element in individual processing later
   * @returns the note if it should be moved outside of the current element back to the previous sibling of this element
   * 
   */
  relocateSynnotes(e: Syntaxdiagram | Groupchoice | Groupcomp | Groupseq | Fragment, isRoot = true): (Synnote | Synnoteref)[] {

    const content = getContent(e)

    const result: (Synnote | Synnoteref)[] = []
    let numberOfNotesToDelete = 0

    let currentNotNotesIdx = 0

    for (let i = 0; i < content.length; i++) {
      const child = content[i];

      if (this.isSynnoteOrSynnoteref(child) && !isRoot) {
        // if the note is first of it's group, it need to be re-attached to the previous sibling of this group
        if (currentNotNotesIdx === 0) {
          // delete for this group
          numberOfNotesToDelete++
          // then return so the parent call can move the element
          result.push(child)
          continue
        }

        // The note is not first in its parent, check if the parent is a groupchoice
        // in which case we need to create a groupseq with the previous option, or it would show below
        // it
        // because they will alreaday go in sequence after the previous sibling
        if (this.isGroupchoice(e)) {
          // create groupseq between last option and the synnote
          const previousOption = content[i - 1] // TODO here, is the previous child is already a groupseq, just inject it in there!
          if (this.isGroupseq(previousOption)) {
            // Since the previous option is already a sequence, just add it there
            previousOption.groupseq.push(child)
          } else {
            // If not, create a groupseq with the previous sibling and the note so they show together
            const newGroup: Groupseq = {
              ':@': {
                elementName: 'groupseq'
              },
              groupseq: <Groupseq['groupseq']>[
                previousOption,
                child
              ]
            }
            // replace the previous chid with the new groupseq containing the previous child and the notes
            content[i - 1] = newGroup
          }
          // Delete the synnote now that we injected it in a group with the previous child (or within the previous child if it's a sequence)
          content.splice(i, 1)
          // Move back the current index by one, or we would end up skipping the next item since we just deleted the synnote
          i--
        }
      } else {
        currentNotNotesIdx++
        // processs the element if this is a group
        if (this.isGroup(child)) {
          const toReattachHigher = this.relocateSynnotes(child, false) as AllTypes[]
          // TODO synnotes were first in this group, we need to add them before this group,
          // issue is that if the current group is also a group choice, we need to wrap them
          // in a groupseq with the previoous item. If not, then we can just insert them before
          // the current child
          if (toReattachHigher.length > 0) {
            content.splice(i, 0, ...toReattachHigher)
            // and move the current index by how many element we inserted or we would end up reprocessing them and the current child
            i += toReattachHigher.length
          }
        }
      }
    }

    // Now delete all the first notes that need to be re-attached to a previous sibling of the parent
    if (numberOfNotesToDelete > 0) {
      content.splice(0, numberOfNotesToDelete)
    }

    return result
    
  }

  isGroup(e: AllTypes) {
    return this.isFragment(e) || this.isGroupcomp(e) || this.isGroupseq(e) || this.isGroupchoice(e)
  }

  isGroupchoice(e: AllTypes): e is Groupchoice {
    return 'groupchoice' in e
  }

  isFragment(e: AllTypes): e is Fragment {
    return 'fragment' in e
  }

  isSynnoteOrSynnoteref(e: AllTypes): e is Synnote | Synnoteref {
    return this.isSynnote(e) || this.isSynnoteref(e)
  }

  isSynnote(e: AllTypes): e is Synnote {
    return 'synnote' in e
  }

  isSynnoteref(e: AllTypes): e is Synnoteref {
    return 'synnoteref' in e
  }

  isFragref(e: AllTypes): e is Fragref {
    return 'fragref' in e
  }

  isGroupseq(e: AllTypes): e is Groupseq {
    return 'groupseq' in e
  }

  isGroupcomp(e: AllTypes): e is Groupcomp {
    return 'groupcomp' in e
  }

  isTextElem(e: AllTypes): e is SG_TextElem  {
    return 'var' in e || 'kwd' in e || 'delim' in e || 'oper' in e || 'sep' in e
  }


  cleanText<T extends AllTypes>(elements: T[]): T[] {
    return elements.filter(e => !('#text' in e) || (e['#text'] && (<string>e['#text']).toString().trim()))
  }
  cleanTextInPlace<T extends AllTypes>(e: T) {
    const content = getContent(e)
    const newContent = this.cleanText(content)
    setContent(e, newContent)
  }

  wrapIfOptionalOrDefault(importance: SynDiagramImportance | undefined, elem: SD_Base) {
    if (importance === 'optional') {
      const b = new SD_Block()
      b.addOptional(elem)
      return b
    }
    if (importance === 'default') {
      const b = new SD_Block()
      b.addDefault(elem)
      return b
    }
    return elem
  }

  convertToSgBase(e: AllTypes): SD_Base | undefined {
    if (this.isFragment(e)) {
      // do nothing, we already index them
      return
    }
    if (this.isFragref(e)) {
      // resolve the fragment:
      return new SD_Fragref(this.ditaRenderer.sequenceRenderer({ inline: true})(e, new RenderingContext(-1)))
    }
    if (this.isTextElem(e)) {
      return this.wrapIfOptionalOrDefault(e[':@'].importance, new SD_Text(this.ditaRenderer.sequenceRenderer({ inline: true})(e, new RenderingContext(-1))))
    }
    if (this.isSynnote(e)) {
      const synnote = new SD_Synnote(this.synnotesMap.length + 1, this.ditaRenderer.sequenceRenderer({ inline: true})(e, RenderingContext.empty()))
      this.synnotesMap.push({
        id: '',
        value: synnote
      })
      return synnote
    }
    if (this.isSynnoteref(e)) {
      return this.processSynnoteref(e)
    }
    if (this.isGroupchoice(e)) {
      return this.processGroupChoice(e)
    }
    if (this.isGroupseq(e)) {
      return this.processGroupSeq(e)
    }
    if (this.isGroupcomp(e)) {
      return this.processGroupcomp(e)
    }
    console.error(`${e[':@'].elementName} not supported yet`)
    throw new Error()
  }

  processSynnoteref(e: Synnoteref) {
    // Try to find the synnote for it
    const href = e[':@'].href
    if (href) {
      const cleanId = cleanTopicId(href)
      const match = this.synnotesMap.find(e => e.id === cleanId)
      if (!match) {
        this.logger.warn(`synnoteref target not found. ${href} not found in this syntax diagram`)
      } else {

        return match.value
      }
    } else {
      this.logger.warn(`synnoteref without href attribute. Won't be resolved`)
    }
    
  }

  _processSeq(children: Groupseq['groupseq'] | Fragment['fragment']) {
    const res = new SD_Sequence(this.logger)

    let isRep: string | undefined
    
    for (const child of children) {
      if ('repsep' in child) {
        // The whole sequence should be wrapped in a repsep at the end
        isRep = this.ditaRenderer.sequenceRenderer({ inline: true })(child, new RenderingContext(-1)) || ''
        continue
      }

      const c = this.convertToSgBase(child)
      if (c) {
        if (this.isTextElem(child)) {
          // alone text element
          // if this is a standalone text element in a sequence, wrap it in a block
          res.addElement(c)
        } else {
          res.addElement(c)
        }
      }
    }
    if (isRep !== undefined) {
      return new SD_RepGroup(res, isRep)
    }
    return res
  }

  wrapInBlockByImportance(importance: SynDiagramImportance | undefined, elem: SD_Base, wrapEvenIfNone?: boolean) {
    if (importance === 'default') {
      const b = new SD_Block()
      b.addDefault(elem)
      return b
    }
    if (importance === 'optional') {
      const b = new SD_Block()
      b.addOptional(elem)
      return b
    }
    if (wrapEvenIfNone) {
      const b = new SD_Block()
      b.addRequired(elem)
      return b
    }
    return elem
  }

  processGroupSeq(g: Groupseq): SD_Base {

    // Groupseq are rendered in order

    return this.wrapIfOptionalOrDefault(g[':@'].importance, this._processSeq(g.groupseq))
  }

  processFragment(g: Fragment, context: RenderingContext): SD_Fragment {

    // Frament are rendered in order, basically same as Groupseq. The only different is that they get a title, so we can re-use the processing of groupseq

    const titles = g.fragment.filter(e => 'title' in e) as Title[]
    const withoutTitles = g.fragment.filter(e => !('title' in e)) as Fragment['fragment']

    let title = ''
    if (titles.length > 0) {
      title = this.ditaRenderer.sequenceRenderer({ inline: true })(titles[0], context)
    }
    return new SD_Fragment(title, this._processSeq(withoutTitles))

  }

  processGroupcomp(g: Groupcomp): SD_Base {

    /**
     * Groupseq are rendered in order
     * 
     */

    const importance = g[':@'].importance

    const seq = new SD_Sequence(this.logger)

    let isCompact = false

    let res = this.wrapInBlockByImportance(g[':@'].importance, seq)

    if (res === seq) {
      // not wrapped, male it compact
      seq.setCompact()
      isCompact = true
    }

    let isRep: string | undefined
    
    for (const child of g.groupcomp) {
      if ('repsep' in child) {
        // The whole sequence should be wrapped in a repsep at the end
        isRep = this.ditaRenderer.sequenceRenderer({ inline: true })(child, new RenderingContext(-1)) || ''
        continue
      }
      if (this.isTextElem(child)) {
        // alone text element
        // if this is a standalone text element in a groupcom, wrap it in a block and make it compact
        const textElem = new SD_Text(this.ditaRenderer.sequenceRenderer({ inline: true})(child, new RenderingContext(-1)), isCompact)
        seq.addElement(this.wrapInBlockByImportance(child[':@'].importance, textElem, true))
      } else {
        const c = this.convertToSgBase(child)
        if (c) {
          seq.addElement(c)
        }
      }
      
    }
    if (isRep !== undefined) {
      return new SD_RepGroup(res, isRep)
    }
    return res

  }

  /**
   * Group choices are displayed as stackeed choices, default goes above the main path, all other go below.
   * Note that if the group is optional itself, they all go below the main path, even if one of the child
   * is having default importance attribute
   * @param g 
   * @param context 
   */
  processGroupChoice(g: Groupchoice): SD_Base {

    // find default if there is any


    const res = new SD_Block()


    /**
     * How does this work?
     * 
     * If the groupchoice is optional, all choices go below the main
     * path, even if one entry is tagged as default:
     * 
     * <syntaxdiagram>
     *   <groupchoice importance="optional">
     *     <var importance="default">default_choice</var>
     *     <var importance="required">required_choice</var>
     *     <var>no_importance_choice</var>
     *   </groupchoice>
     * </syntaxdiagram>
     * 
     *    .-default_choice-------.   
     * >>-+----------------------+------------------------------------><
     *    +-required_choice------+   
     *    '-no_importance_choice-'
     * 
     * If all items are required or nothing, then the first one goes on the main path, and others below:
     * 
     * <syntaxdiagram>
     *   <groupchoice>
     *     <var importance="required">required_1</var>
     *     <var>nothing_1</var>
     *     <var importance="required">required_2</var>
     *   </groupchoice>
     * </syntaxdiagram>
     * 
     * >>-+-required_1-+----------------------------------------------><
     *    +-nothing_1--+   
     *    '-required_2-' 
     * 
     * 
     * If all items are optional, then each item is creating its own double path, and the group acts like
     * each sub-group is required/nothing, so the main path gets the first sub-group:
     * <syntaxdiagram>
     *   <groupchoice>
     *     <var importance="optional">optional_1</var>
     *     <var importance="optional">optional_2</var>
     *     <var importance="optional">optional_3</var>
     *   </groupchoice>
     * </syntaxdiagram>
     * 
     * >>-+-+------------+-+------------------------------------------><
     *    | '-optional_1-' |   
     *    +-+------------+-+   
     *    | '-optional_2-' |   
     *    '-+------------+-'   
     *      '-optional_3-'    
     * 
     * 
     *  If one or more is default, they all go above, and all options creates their own small sub-group
     * <syntaxdiagram>
     *   <groupchoice>
     *     <var importance="optional">optional_1</var>
     *     <var importance="optional">optional_2</var>
     *     <var importance="optional">optional_3</var>
     *     <var importance="default">default_1</var>
     *   </groupchoice>
     * </syntaxdiagram>
     * 
     * <syntaxdiagram>
     *   <groupchoice>
     *     <var importance="optional">optional_1</var>
     *     <var importance="optional">optional_2</var>
     *     <var importance="optional">optional_3</var>
     *     <var importance="default">default_1</var>
     *     <var importance="default">default_2</var>
     *   </groupchoice>
     * </syntaxdiagram>
     * 
     *    .-default_1------.   
     * >>-+-+------------+-+------------------------------------------><
     *    | '-optional_1-' |   
     *    +-+------------+-+   
     *    | '-optional_2-' |   
     *    '-+------------+-'   
     *      '-optional_3-'     
     * 
     * 
     * 
     *    .-default_2------.   
     *    +-default_1------+   
     * >>-+-+------------+-+------------------------------------------><
     *    | '-optional_1-' |   
     *    +-+------------+-+   
     *    | '-optional_2-' |   
     *    '-+------------+-'   
     *      '-optional_3-'     
     */

    // if the groupchouice is optional it self, then all choices go below, even if they are mark as default

    // If the whole group is optional, main path will stay empty
    const isGroupOptional = g[':@'].importance === 'optional'
    const isGroupDefault = g[':@'].importance === 'default'

    const defaults = g.groupchoice.filter(e => 'importance' in e[':@'] && e[':@'].importance === 'default')
    const required = g.groupchoice.filter(e => (!e[':@'].importance || e[':@'].importance === 'required'))
    const optionals = g.groupchoice.filter(e => 'importance' in e[':@'] && e[':@'].importance === 'optional')

    // If all choices are optional, they 

    // Add all default to default group
    for (const d of defaults) {
      // Because this will eb used as default of the group option, remove it so it doesn't get wrapped itself as it's on default
      delete d[':@'].importance
      const c = this.convertToSgBase(d)
      if (c) {
        res.addDefault(c)
      }
    }
    let isRep

    // find all required/no importance elements, add as required if the group is optional, and optional if the group is optional
    if (isGroupOptional) {
      for (const e of required) {
        if ('repsep' in e) {
          // The whole sequence should be wrapped in a repsep at the end
          isRep = this.ditaRenderer.sequenceRenderer({ inline: true })(e, new RenderingContext(-1)) || ''
          continue
        }
        const c = this.convertToSgBase(e)
        if (c) {
          res.addOptional(c)
        }
      }
    } else {
      for (const [i, e] of required.entries()) {
        if ('repsep' in e) {
          // The whole sequence should be wrapped in a repsep at the end
          isRep = this.ditaRenderer.sequenceRenderer({ inline: true })(e, new RenderingContext(-1)) || ''
          continue
        }
        const c = this.convertToSgBase(e)
        if (c) {

          // If the whole group is set as default, and there is nothing yet in the default group, we can set the first entry without any importance as default
          if (isGroupDefault && res.getDefaultGroupHeight() === 0 && !e[':@'].importance) {
            res.addDefault(c)
          } else {
            res.addRequired(c)
          }
        }

        
      }
    }

    // Then add any optional element as optional
    
    for (const e of optionals) {
      const c = this.convertToSgBase(e)
      if (c) {
        res.addRequired(c)
      }
    }

    if (isRep !== undefined) {
      return new SD_RepGroup(res, isRep)
    }
    return res

  }
}