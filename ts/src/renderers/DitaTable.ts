import align from 'align-text'
import { Align, ColSpec, Entry, Row, Simpletable, Stentry, Table, TBody, TGroup, THead, VerticalAlign, yesorno } from '../DITA'
import Logger from '../Logger'
import RenderingContext from '../RenderingContext'
import DitaRenderer from '../DitaRenderer'
import { attr, elementsByName, firstElementByName } from '../dita-parsing-utils'

type MatrixCell = {
  text: string
  lines: string[]
  rowsep?: Entry[':@']['rowsep']
  colsep?: Entry[':@']['colsep']
  valign?: Entry[':@']['valign']
  namest?: Entry[':@']['namest'],
  nameend?: Entry[':@']['nameend'],
  morerows?: Entry[':@']['morerows'],
  /**
   * The number of column this cell is spanning over horizontally
   */
  spanWidth: number
  colWidth: number
  /** The index of the row where the vertical span should start */
  vspanstart: number
  /** The index of the row where the vertical span should end */
  vspanend: number
  /** 
   * The number of lines already printed, expeciallu used in case of cell
   * spanned vertically on multiple rows, to resume line printing on the next
   * row
   */
  offset: number
  /**
   * True if the cell is the last of the row, including considering horizontal span
   */
  isLastCellOfRow: boolean
  /**
   * Height of the cell, auto calculated when wrapping all text and considering vertical span
   */
  height: number
  /**
   * Height of the cell in previous row if spanned vertically,
   * auto calculated when wrapping all text and considering vertical span
   * This will be used to calculate the max height of the last row of the cell,
   * where this space is not needed since it will be printed on previous rows
   */
  heightInPreviousRow: number
  /**
   * The column Idx, important when the cell is after a vertically spanned cell, which means
   * its index in the cells array or the row in not in real column index. This is used to find
   * the correct colspec
   */
  colIdx: number
}

type MatrixRow = {
  id: number
  cells: MatrixCell[]
  rowsep?: yesorno
  valign?: Row[':@']['valign']
  isHeader?: boolean
  height: number
}

export default class DitaTable {

  constructor(
    private ditaRenderer: DitaRenderer,
    private logger: Logger
  ) {
    ditaRenderer.registerRenderer('table', this.renderTable.bind(this))
    ditaRenderer.registerRenderer('simpletable', this.renderTable.bind(this))
  }

  /**
   * Reads all colspecs within the tgroup element, and return them in the correct
   * order, since they can be in any order because of the colname attribute
   * 
   * It creates default colspec is some columns don't have any, to be consistent
   * in later processing
   * 
   * @param tgroup The Tgroup element
   * @param numberOfColumns The number of columns coming from the @col attribute
   *                        of the trgoup
   * @returns The colspec elements in the order of columns
   */
  readColSpecs(tgroup: TGroup, numberOfColumns: number): ColSpec[] {
    // Find all 
    const colspecs = elementsByName(tgroup.tgroup, 'colspec')
    const colSpecWithNum = colspecs.filter(c => c[':@'].colnum)
    const colSpecWithoutNum = colspecs.filter(c => !c[':@'].colnum)

    const colSpecsInOrder: ColSpec[] = []

    // Issue a warning if any colnum is higher than the number of columns,
    // or if they are most colspec than the number of column
    for (let i = 0; i < colspecs.length; i++) {
      const colspec = colspecs[i];
      if (colspec[':@'].colnum && parseInt(colspec[':@'].colnum) > numberOfColumns) {
        this.logger.warn(`WARN: colspec/@colnum greater than the number of columns: ${parseInt(colspec[':@'].colnum)} > ${numberOfColumns}`)
      }
    }
    if (colspecs.length > numberOfColumns) {
      this.logger.warn(`WARN: Too many colspec elements for the number of columns: ${colspecs.length} > ${numberOfColumns}`)
    }

    let j = 0
    for (let i = 0; i < numberOfColumns; i++) {
      const byNum = colSpecWithNum.find(c => c[':@'].colnum === `${i+1}`)
      if (byNum) {
        colSpecsInOrder[i] = byNum
      } else {
        // no assigning by colnum, so take in order in the colspec without colnum
        colSpecsInOrder[i] = colSpecWithoutNum[j++]
      }

      if (!colSpecsInOrder[i]) {
        // no colspec defined, assigned default
        colSpecsInOrder[i] = {
          colspec: [],
          ':@': {
            elementName: 'colspec'
          }
        }
      }
    }
    return colSpecsInOrder
  }

  /**
   * Read a CALS table and fill the given Matrix with it.
   * 
   * Note that it needs the context so it can render cells with the correct
   * parent context
   * 
   * @param context The rendering context, used to pass to rendering when rendering cells
   *                Note that the line length will be overwritten the to cell with
   *                when rendering
   * @param colWidths The calculated columns width (in number of character)
   * @param colSpecsInOrder The ColSpec object in the correct order
   * @param matrix The matrix to fill
   * @param thead The THead element if any
   * @param tbody The tbody element if any
   */
  readCalsTableContent(context: RenderingContext, colWidths: number[], colSpecsInOrder: ColSpec[], matrix: MatrixRow[], thead: THead | undefined, tbody: TBody | undefined) {
    // Read the header row if any:
    let rowIdx = 0
    /**
     * THis is a buffer of the number of columns length, so we can save cells
     * spanning vertically on multiple row. For printing sake, they will be persister
     * on each row, and the offset and vspanend will make sure they are printed
     * properly.
     */
    const vSpanBuffer = Array(colWidths.length)
    if (thead) {
      // we have a header, add it to our matrix
      const rowElem = firstElementByName(thead.thead, 'row')
      if (rowElem) {
        matrix.push(this.readRow(context, vSpanBuffer, rowElem, colWidths, colSpecsInOrder, rowIdx++, true))
      }
    }
    
    if (tbody) {
      const rowElems = elementsByName(tbody.tbody, 'row')
      for (const rowElem of rowElems) {
        matrix.push(this.readRow(context, vSpanBuffer, rowElem, colWidths, colSpecsInOrder, rowIdx++))
      }
    }

  }

  /**
   * Reads all sentries from a simpletable and return a 
   * @param context The rendering context, used to pass to rendering when rendering cells
   *                Note that the line length will be overwritten the to cell with
   *                when rendering
   * @param rowIdx The row ID we are in right now, starting at 0
   * @param colWidths The array of pre-calculated columns's width (in character)
   * @param stentries The entries to read
   * @param isHeader `true` if the entries are contained in a header row (sthead)
   * @returns The MatrixRow built from the entries
   */
  readStentries(context: RenderingContext, rowIdx: number, colWidths: number[], stentries: Stentry[], isHeader?: boolean) {
    const row: MatrixRow = {
      id: rowIdx,
      cells: [],
      isHeader,
      height: -1 // set to -1 for now, will be calculated later
    }
    for (const [i, stentry] of stentries.entries()) {
      row.cells.push({
        text: this.ditaRenderer.sequenceRenderer()(stentry, context.subContext(stentry, { newLineLength: colWidths[i] })), // no line length because we don't know the width yet to wrap
        lines: [],
        spanWidth: 1,
        colWidth: colWidths[i],
        vspanstart: rowIdx,
        vspanend: -1,
        offset: 0,
        isLastCellOfRow: i === stentries.length - 1,
        height: -1, // set to -1 for now, will be calculated later,
        colIdx: i,
        heightInPreviousRow: 0
      })
    }
    return row
  }

  /**
   * 
   * Read a Simple table and fill the given Matrix with it.
   * 
   * Note that it needs the context so it can render cells with the correct
   * parent context
   * 
   * @param context The rendering context, used to pass to rendering when rendering cells
   *                Note that the line length will be overwritten the to cell with
   *                when rendering
   * @param colWidths The array of pre-calculated columns's width (in character)
   * @param matrix The Matrix to fill
   * @param table The table to read
   */
  readSimpleTableContent(context: RenderingContext, colWidths: number[], matrix: MatrixRow[], table: Simpletable) {
    // Read the header row if any:
    const sthead = firstElementByName(table.simpletable, 'sthead')

    let rowIdx = 0

    if (sthead) {
      // we have a header, add it to our matrix
      const stentries = elementsByName(sthead.sthead, 'stentry')
      matrix.push(this.readStentries(context, rowIdx++, colWidths, stentries))
    }

    const strows = elementsByName(table.simpletable, 'strow')
    for (const strow of strows) {
      const stentries = elementsByName(strow.strow, 'stentry')
      matrix.push(this.readStentries(context, rowIdx++, colWidths, stentries))
    }

  }

  /**
   * Calculate how many columns the cell should span based on namest and nameend attributes
   * @param colSpecsInOrder All ColsSpecs to find the column by name
   * @param cell The cell to calculate the span width for
   * @param rowIdx The row Idx (starting at 0) for messaging purposes to user
   * @param columnIdx The column Idx (starting at 0) for messaging purposes to user
   */
  calcSpanWidth(
    colSpecsInOrder: ColSpec[],
    { namest, nameend }: Pick<MatrixCell, 'namest' | 'nameend'>,
    rowIdx: number,
    columnIdx: number
  ) {
    if (!namest || !nameend) {
      // no span, needs both to enable
      return { spanWidth: 1 }
    }
    // find first the column by name in colspecs:
    const startColSpan = colSpecsInOrder.findIndex(c => c[':@'].colname === namest)
    if (startColSpan < 0) {
      this.logger.warn(`WARN: namest set on cell (Row: ${rowIdx + 1} Column: ${columnIdx + 1}) not found in colspec: "${namest}". You must match a valid column name.`)
      return { spanWidth: 1 }
    }
    const endColSpan = colSpecsInOrder.findIndex(c => c[':@'].colname === nameend)
    if (endColSpan < 0) {
      this.logger.warn(`WARN: nameend set on cell (Row: ${rowIdx + 1} Column: ${columnIdx + 1}) not found in colspec: "${nameend}". You must match a valid column name.`)
      return { spanWidth: 1 }
    }
    if (endColSpan < startColSpan) {
      this.logger.warn(`WARN: nameend cannot be lower than namest (${nameend} < ${namest}) on cell Row: ${rowIdx + 1} Column: ${columnIdx + 1}`)
      return { spanWidth: 1 }
    }
    if (endColSpan === startColSpan) {
      return { spanWidth: 1 }
    }
    return { spanWidth: endColSpan - startColSpan + 1, spanToLastRow: endColSpan === colSpecsInOrder.length - 1 }
  }

  /**
   * 
   * @param context The context to know the line length available, using the context instead of the global line length
   *                allows us to support table within table
   * @param colSpecsInOrder the ColSpec object in the same order as the columns
   * @param numberOfColumns the number of columns, which should match colSpecsInOrder.length, but passed for convenience
   * @returns The array of calculated width for each column
   */
  processWidthFromColSpecs(context: RenderingContext, colSpecsInOrder: ColSpec[], numberOfColumns: number) {
    // Now we pick the width on each column, and go through each row/cell to wrap based on this
    let totalWidthRequest = 0
    for (const colspec of colSpecsInOrder) {
      totalWidthRequest += this.colwithToFloat(colspec)
      this.logger.debug('totalWidthRequest now', totalWidthRequest)
    }

    const colWidths: number[] = []
    let used = 0
    // space available for text is the screen width, minus all separator (numberOfColumns + 1)
    // and minus spaces on each side of the columns (numberOfColumns * 2)
    const widthAvailableWithoutSeparators = context.getLineLength() - (numberOfColumns * 2 + numberOfColumns + 1)
    for (let i = 0; i < colSpecsInOrder.length - 1; i++) {
      const colspec = colSpecsInOrder[i]
      // width is the ratio of the request of this column compared to the total
      const colwidth = this.colwithToFloat(colspec)
      const width = Math.floor(widthAvailableWithoutSeparators * (colwidth / totalWidthRequest))
      colWidths.push(width)
      used += width
    }

    // last row takes what's left
    colWidths.push(widthAvailableWithoutSeparators - used)
    this.logger.debug('calculated width {0}', colWidths.toString())

    return colWidths
  }

  /**
   * 
   * *Concept*
   * 
   * The idea when rendering a table to text is to parse all cells a first time, and build a matrix
   * of text, which is not wrapped yet, at this time we can also calculate horizontal and vertical
   * spanning in number of cells, since we don't have enough information yet to calculate the final
   * widht and height of cells.
   * 
   * Then we can do a first pass through all rows/cells to wrap the text
   * based on the colspec (or 1* if not set) and horiontal spanning, at this time
   * since we have all the information on final width, we can apply
   * horizontal alignment as well. Note that we can't calculate the final height for cell
   * at this point, since the height on vertically spanned cell will depend on the following rows.
   * 
   * Then we need a second pass through all rows/cells to measure all rows height. This is a bit of
   * a tedious process, because we can have vertically spanned cells, in which case their height
   * needs to be the sum of the max height of all the rows they are in. They also do not affect the max
   * height of rows their are in, except the last one, which they can expand if needed to fit their
   * content.
   * During this pass, since we now know the final height of cells (within their last row), we can apply
   * any vertical align rules as well.
   * 
   * *Attributes roles and precendence rules:*
   * 
   * It is important to note that some attributes will affect how we calculate the column width:
   * 
   * * `tgroup/colspec/@colwidth`: This should try to be followed as much as possible
   * 
   * The `@rowsep` attributes will affect row separators,  precedence rule is the following
   * entry > row  > colspec > tgroup > table
   * Note that last cell of each column must have a separator, so no rowswp has effect
   * 
   * The `@colsep` attributes will affect column separators,  precedence rule is the following
   * entry > colspec > tgroup > table
   * Note that last cell in a row must have a separator, so no colspec has effect
   * 
   * Alignment precedence
   * entry > colspec > tgroup
   * 
   * Vertical alignment precedence
   * entry > row > thead/tbody
   * 
   * @param table The table to render, supports both CALS table and simple tables
   * @param context The redering context, to give the parent context when rendering cells
   *                but also to know what is the line length available. Using the context
   *                line length instead of the global line length allows us to support
   *                table within tables
   * 
   */
  renderTable(table: Table | Simpletable, context: RenderingContext) {

    /** the returned output */
    let output = ''
    /** The tgroup > table col separator, tgroup takes precedence if both set */
    let globalColSep: yesorno | undefined
    /** The tgroup > table row separator, tgroup takes precedence if both set */
    let globalRowSep: yesorno | undefined
    /** The group align rule */
    let globalAlign: Align | undefined
    /** Number of column from the table */
    let numberOfColumns: number | undefined

    // Those, although belonging to Table only, are needed later for VAlign
    let thead: THead | undefined
    let tbody: TBody | undefined

    /** Calculated width for each column */
    let colWidths: number[]

    /** The specification for each column, to control alignements, width, col/row separator */
    let colSpecsInOrder: ColSpec[]

    /** The matrix we will be working with */
    const matrix: MatrixRow[] = []

    // Table behavior
    if ('table' in table) {

      const titleId = context.getIntProp('tableId')

      // Only tables have title/desc, render here
      const title = firstElementByName(table.table, 'title')

      if (title) {
        this.logger.debug('Title found')
        if (titleId) {
          output += `Table ${titleId}. `
        }
        output += this.ditaRenderer.renderElement(title, context) + '\n'
      }

      const desc = firstElementByName(table.table, 'desc')

      if (desc) {
        this.logger.debug('Desc found')
        output += this.ditaRenderer.renderElement(desc, context) + '\n'
      }

      const tgroup = firstElementByName(table.table, 'tgroup')
      if (!tgroup) {
        return output
      }

      const tgroupRowSep = attr(tgroup, 'rowsep')
      const tgroupColSep = attr(tgroup, 'colsep')

      // define the global separator, tgroup takes precedence on table
      globalColSep = tgroupColSep || attr(table, 'colsep')
      globalRowSep = tgroupRowSep || attr(table, 'rowsep')
      // alignment set on tgroup
      globalAlign = attr(tgroup, 'align', 'left')

      // Number of column given by prop on table
      numberOfColumns = parseInt(attr(tgroup, 'cols'))
      this.logger.debug('numberOfColumns: {0}', numberOfColumns)

      

      // we read the colspecs elements
      colSpecsInOrder = this.readColSpecs(tgroup, numberOfColumns)

      // we process column width from colspecs
      colWidths = this.processWidthFromColSpecs(context, colSpecsInOrder, numberOfColumns)


      thead = firstElementByName(tgroup.tgroup, 'thead')
      tbody = firstElementByName(tgroup.tgroup, 'tbody')

      

      // read the content of the table
      this.readCalsTableContent(context, colWidths, colSpecsInOrder, matrix, thead, tbody)
    } else if ('simpletable' in table) {
      // Simpletable behavior

      // In simple table, their is no option for separator, set them to 1
      globalColSep = '1'
      globalRowSep = '1'
      // also no option for alignment, default to left
      globalAlign = 'left'

      // number of columns not given in simple table, count how many column we have in first row
      const stheads = elementsByName(table.simpletable, 'sthead')
      const strows = elementsByName(table.simpletable, 'strow')

      if (stheads.length > 1) {
        const stentrys = elementsByName(stheads[0].sthead, 'stentry')
        numberOfColumns = stentrys.length
      } else if (strows.length > 1) {
        const stentrys = elementsByName(strows[0].strow, 'stentry')
        numberOfColumns = stentrys.length
      } else {
        // no row in the simple table, meaning no column and nothing will be rendered
        numberOfColumns = 0
      }

      // For simple table, there is no ColSpec, so create some with default so processing can be
      // shared with normal tables, the only thing that can be set is in the colwidth, taken from the
      const relcolwidth = attr(table, 'relcolwidth')
      colSpecsInOrder = []
      let widthFromRelcolwidth: string[] | undefined
      if (relcolwidth) {
        const splitRelcolwidth = relcolwidth.split(' ')
        if (splitRelcolwidth.length !== numberOfColumns) {
          this.logger.warn(`WARN: relcolwidth is not defining the correct number of columns. ${splitRelcolwidth.length} values, while ${numberOfColumns} columns found`)
        } else {
          widthFromRelcolwidth = splitRelcolwidth
        }
      }
      for (let i = 0; i < numberOfColumns; i++) {
        colSpecsInOrder.push({
          colspec: [],
          ':@': {
            colnum: (i + 1).toString(),
            colwidth: widthFromRelcolwidth ? widthFromRelcolwidth[i] : '1*',
            elementName: 'colspec'
          }
        })
      }

      // we process column width from colspecs
      colWidths = this.processWidthFromColSpecs(context, colSpecsInOrder, numberOfColumns)

      // read the content of the table
      this.readSimpleTableContent(context, colWidths, matrix, table)
    } else {
      // not a table nor a simple table, exiting
      return ''
    }

    // console.log(inspect(matrix, false, null))

    if (matrix.length === 0) {
      // No row to display, return empty table
      return output
    }


    // Render the first horizontal separator using the first row as well, so the + sign
    // for the column separator respects span in the header 
    output += this.horizontalSeparator(matrix[0], '1', true)

    // First, because of vertical span and align, we need to wrap all lines and calculate the
    // height of each cell, considering vspan, so we can valign the vertically spanned cells
    for (const [rowIdx, row] of matrix.entries()) {
      for (const cell of row.cells) {
        // do this if not done yet, since v spanned cells appear on multiple rows
        if (cell.height === -1) {
          // This should be already done now that we have rendeing context, rcomment
          // TODO remove line when working
          // cell.text = wrapText(cell.text, cell.colWidth)
          // Split the wrapped text t build an array, and align it
          cell.lines = this.alignText(
            cell.text.split('\n').filter(e => e !== ''),
            colSpecsInOrder[cell.colIdx][':@'].align || globalAlign,
            cell.colWidth
          )
        }
      }
      // Add the end of the row, we can calculate the max height of the row
      // note that vertically spanned cells are excluded from the max height calculation
      // until their last row, because they will get more vertical space
      const maxHeight = Math.max(...row.cells.map(c => {
        let cellHeight = c.lines.length
        if (c.vspanend > -1) {
          // spanned row not on heir last row as excluded from height calculation, since they will
          // have more vertical space.
          if (rowIdx < c.vspanend) {
            return 0
          }
          // However, on the last row, they participate to the calculation
          // but we subtract the height they will get in the previous rows
          cellHeight = c.lines.length - c.heightInPreviousRow
        }
        return cellHeight
      }))
      
      // set the height to all non spanned cells
      for (const c of row.cells.filter(c => c.vspanend === -1)) {
        c.height = maxHeight
      }
      // sum the height to all spanned cells
      for (const c of row.cells.filter(c => c.vspanend > -1)) {
        // If not on the last row, save the space we have to write before the last row
        // for maxHeight calculation of the last row
        if (row.id < c.vspanend) {
          c.heightInPreviousRow += maxHeight + 1 // add one because we will also write line on the separator
        }
        c.height += maxHeight + 1 // add one because we will also write line on the separator
      }

      row.height = maxHeight
    }


    // Now we can print our rows
    for (const [rowIdx, row] of matrix.entries()) {
      // Now we can vertically align the cells, because we know the height from
      // full calculatio above
      const rowOrGlobalValign = row.valign || (row.isHeader ? thead?.[':@'].valign : tbody?.[':@'].valign) || 'top'
      this.vAlignText(row, rowOrGlobalValign)

      for (let lineIdx = 0; lineIdx < row.height; lineIdx++) {
        output += this.printRow(row, globalColSep)
      }

      const isLastRow = rowIdx === matrix.length - 1
      output += this.horizontalSeparator(row, isLastRow ? '1' : (row.rowsep || globalRowSep), isLastRow)
    }

    return output
  }

  /**
   * Vertically align the content of each cell in a row by editing the lines array of each cells
   * 
   * *Important:* This must be called after the height of each cell has been calculated already.
   * 
   * @param row The row to vertically align
   * @param rowOrGlobalValign the global rule for vertical alignement, coming from thead/tbody or row
   */
  vAlignText(row: MatrixRow, rowOrGlobalValign: VerticalAlign) {
    for (const cell of row.cells) {
      const valign = cell.valign || rowOrGlobalValign || 'top'
      if (valign === 'middle') {
        // Add empty lines before and after
        // in case we fall half way, we want to start a bit higher, so do a floor on before
        // and give the rest to after
        const countLineBefore = Math.floor((cell.height - cell.lines.length) / 2)
        const countLineAfter = (cell.height - cell.lines.length) - countLineBefore
        cell.lines = [...Array(countLineBefore).fill(''), ...cell.lines, ...Array(countLineAfter).fill('')]
      } else if (valign === 'bottom') {
        // Add empty lines before
        cell.lines = [...Array(cell.height - cell.lines.length).fill(''), ...cell.lines]
      }
    }
  }

  /**
   * Prints one row on the screen, following col sep and row sep
   * @param row The row to print
   * @param globalColSep The global column separator rule, coming from table/tgroup/colspec
   * @returns The resulting string
   */
  printRow(row: MatrixRow, globalColSep: yesorno | undefined) {
    let output = '|'
    for (const [i, cell] of row.cells.entries()) {
      output += this.printCellLine(cell, globalColSep)
    }
    return output + '\n'
  }

  /**
   * Prints one cell to the screen, following col/row sep
   * @param cell The cell to print
   * @param globalColSep The global column separator rule, coming from table/tgroup/colspec
   * @param onSeparator set to true if this is a line of cell printed on a separator (vertical
   *                    spanned cell), so it can print a cell intersection character (+)
   *                    instead of a column separator (|)
   * @returns The resulting string
   */
  printCellLine(cell: MatrixCell, globalColSep: yesorno | undefined, onSeparator?: boolean) {
    let output = ' '
    let line = cell.lines[cell.offset++]
    if (!line) {
      // this cell has reach the end of its content
      // fill the line with spaces
      line = ' '.repeat(cell.colWidth)
    } else if (line.length < cell.colWidth) {
      // pad the end of the string
      line += ' '.repeat(cell.colWidth - line.length)
    }
    // Last cell always get column separator, then it's up to the normal precedence rule:
    // entry > colspec > tgroup > table
    const colSep = cell.isLastCellOfRow ? '1' : (cell.colsep || globalColSep || '1')
    output += line + ' '
    if (onSeparator) {
      output += '+'
    } else {
      output += colSep == '1' ? '|' : ' '
    }
    return output
  }

  /**
   * Write the horizontal seprator between two rows. It does take care of printing the content of the cell
   * instead of a separator for vertically spanned cell.
   * @param row The row to print
   * @param parentRowSep the row sep parent rule, coming from the table/tgroup/colspec/row (see
   *                         precedence rule at the top)
   * @param isFirstOrLastRow set to true if we are printing the first ir last line of the array
   *                         because those are not affected by rowsep rules
   * @returns The resulting output string
   */
  horizontalSeparator(row: MatrixRow, parentRowSep: '0' | '1' | undefined, isFirstOrLastRow?: boolean) {
    let output = '+'
    // go through cells one by one, and use the valid span to fill the line
    for (const cell of row.cells) {
      this.logger.debug(`cell.vspanstart: ${cell.vspanstart}, cell.vspanend: ${cell.vspanend} row.id: ${row.id}`)
      if (!isFirstOrLastRow && cell.vspanend !== -1 && cell.vspanstart <= row.id && row.id < cell.vspanend) {
        // print a line instead of separator
        output +=this. printCellLine(cell, '1', true)
      } else {
        // first and last row always get separator, regardless of the value of the entry/@rowsep
        const rowSep = isFirstOrLastRow ? '1' : (cell.rowsep || parentRowSep || '1')
        output += (rowSep === '1' ? '-' : ' ').repeat(cell.colWidth + 2) + '+'
      }
    } 
    return output + '\n'
  }

  /**
   * Convert a colspec/*colwidth value to a float. The `*` is simply dropped, for text rendering
   * all width are proportianal, it doesn't make sense to have px or pt units. We could consider
   * supporting % in the future, but this is not the caase today.
   * @param colspec The ColSpec to read
   * @returns The float, defaults to 1 if there is no colwidth attribute or it's an invalid value
   */
  colwithToFloat(colspec: ColSpec): number {
    const colwidth = colspec[':@']['colwidth'] || '1*'
    const parsed = parseFloat(colwidth)
    return isNaN(parsed) ? 1 : parsed
  }

  /**
   * Reads one row of the CALS table
   * @param context The context to use for rendering the content of the cells
   * @param vSpanBuffer The buffer of cells neing verticvally spanned from previous rows
   * @param row The Row to read
   * @param colWidths The pre-calculated column's widths
   * @param colSpecsInOrder The ColSpec in the same order as columns
   * @param rowIdx The row ID (starts at 0)
   * @param isHeader true if the row is a header
   * @returns The resulting MatrixRow object
   */
  readRow(context: RenderingContext, vSpanBuffer: (MatrixCell | undefined)[], row: Row, colWidths: number[], colSpecsInOrder: ColSpec[], rowIdx: number, isHeader?: boolean): MatrixRow {
    // read all entries
    const entries = elementsByName(row.row, 'entry')

    // go through the entry to build cells, and process cell width at the same time
    const cells: MatrixCell[] = []

    let currentEntryIdx = 0


    for (let columnIdx = 0; columnIdx < colWidths.length;) {

      // we fist consider vertical span, if we have a cell buffered from above line,
      // we want to re-insert this one
      let currentCell = vSpanBuffer[columnIdx]
      if (currentCell) {
        // buffer cell found from vertical span
        // just make sure to remove i if we reach the last row
        if (currentCell.vspanend === rowIdx) {
          vSpanBuffer[columnIdx] = undefined
        }
      } else {
        // no buffer, use the entry we are at in all entries in the row
        // to create the cell
        const e = entries[currentEntryIdx++]
        if (!e) {
          // something is wrong, we are missing entries in this row
          this.logger.warn(`WARN: Missing entries in row ${rowIdx + 1}`)
          continue
        }

        // calculate the spanWidth for this cell
        const { spanWidth, spanToLastRow } = this.calcSpanWidth(colSpecsInOrder, e[':@'], rowIdx, columnIdx)

        // Sum the width of the column we span over
        let colWidth = 0
        for (let spanIdx = 0; spanIdx < spanWidth; spanIdx++) {
          colWidth += colWidths[columnIdx+spanIdx]
          if (spanIdx > 0) {
            // adds 3 for the spaces plus sep we miss since we span over columns
            colWidth += 3
          }
          this.logger.debug('colWidth {0} {1}', colWidth, spanWidth)
        }
        currentCell = this.readEntry(context, columnIdx, e, spanWidth, colWidth, rowIdx)

        // check if this is the last cell of the row, including span
        if (columnIdx === colWidths.length - 1 || spanToLastRow) {
          this.logger.debug('isLastCellOfRow true') 
          currentCell.isLastCellOfRow = true
        }

        // if this cell spans vertically, add it to the buffer so it can be re-added
        // on following lines
        if (currentCell.vspanend > 0) {
          this.logger.debug(`Setting vSpanBuffer for ${columnIdx}`)
          vSpanBuffer[columnIdx] = currentCell
        }
      }
      cells.push(currentCell)
      // the column index is pushed by the with of this cell
      this.logger.debug('moving index by {0}', currentCell.spanWidth)
      columnIdx += currentCell.spanWidth
    }

    return {
      id: rowIdx,
      cells,
      rowsep: row[':@'].rowsep,
      valign: row[':@'].valign,
      isHeader,
      height: -1 // set to -1 for now, will be calculated later
    }
  }

  /**
   * Renders an entry from a row of a CALS table, and returns a MatrixCell object
   * @param context The context to use for rendering the content of the cells
   * @param colIdx The current column ID (starts at 0)
   * @param entry The entry to read
   * @param spanWidth the pre-calculated horizontal span width (in number of columns, not character)
   * @param colWidth The pre-calculated columns width (in characters), already taking into account horizontal span
   * @param rowId the current row ID (starts as 0)
   * @returns The resulting MatrixCell object
   */
  readEntry(context: RenderingContext, colIdx: number, entry: Entry, spanWidth: number, colWidth: number, rowId: number): MatrixCell {
    let vspanend = -1
    const morerows = entry[':@'].morerows ? parseInt(entry[':@'].morerows) : NaN
    if (!isNaN(morerows) && morerows > 0) {
      // set only if the cell is vertically spanning, otherwide leave to -1
      vspanend = rowId + morerows
    }
    return {
      // Use a context with the real column width, so it can already wrap
      text: this.ditaRenderer.sequenceRenderer()(entry, context.subContext(entry, { newLineLength: colWidth })),
      lines: [], // lines will be split when we know the width,
      rowsep: entry[':@'].rowsep,
      colsep: entry[':@'].colsep,
      valign: entry[':@'].valign,
      namest: entry[':@'].namest,
      nameend: entry[':@'].nameend,
      morerows: entry[':@'].morerows,
      spanWidth,
      colWidth,
      vspanstart: rowId,
      vspanend,
      offset: 0,
      isLastCellOfRow: false, // set to talse for now, later check will correct is last
      height: -1, // set to -1 for now, will be calculated later
      colIdx,
      heightInPreviousRow: 0
    }
  }

  /**
   * Align horizontally the given lines, based on the given column width
   * @param s 
   * @param alignment 
   * @param colWidth 
   * @returns 
   */
  alignText(s: string[], alignment: 'left' | 'center' | 'right' | 'justify' | 'char', colWidth: number) {
    switch(alignment) {
    case 'center':
      return align(s, len => Math.floor((colWidth - len) / 2))
    case 'right':
      return align(s, len => colWidth - len)
    default:
      return s
    }
  }
}