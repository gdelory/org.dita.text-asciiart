import { readFileSync, writeFileSync} from 'fs'
import { XMLParser } from 'fast-xml-parser'
import RenderingContext from './RenderingContext'
import Logger from './Logger'
import { attr, elementsByName, getElementName } from './dita-parsing-utils'
import DitaRenderer from './DitaRenderer'
import CommonElements from './renderers/CommonElements'
import DitaTable from './renderers/DitaTable'
import SyntaxDiagram from './renderers/SyntaxDiagram'



/**
 * Default line length if not passed as command line option
 */
const defaultLineLength = 65


/**
 * Parsed the given XML string content, tries to find a CALS table or simple table
 * in it, and renders it to text
 * @param content The content of the imput file, already read as UTF-8
 * @param lineLength The line length available
 * @returns The resulting text output
 */
function convert(content: string, lineLength: number, logger: Logger, noTm: boolean): string {
  const parser = new XMLParser({
    preserveOrder: true,
    ignoreAttributes: false,
    trimValues: false, // Do not let the parser trim, or we'll lost spaces before/after inline elements (bold, italic, ...)
    attributeNamePrefix: '',
    // Use this to set the element name as attribute, so we don't need to loop through keys to find it every time
    updateTag(tagName, jPath, attrs){
      if (attrs) {
        attrs['elementName'] = tagName
      }
      return tagName
    }
  });
  const doc = parser.parse(content) as any[]

  // ===================================================================
  // = Find all information passed by the dita-ot via "state" elements =
  // ===================================================================
  const states = elementsByName(doc, 'state')

  // The footnote offset tells us how many footnotes there were in the document before the table we are transforming
  // this is not used for syntax diagram since synnotes index is local to the syntax diagram
  const offsetState = states.find(e => attr(e, 'name') === 'fn_offset')
  // find all states node to get document's context metadata, like footnote offset
  let fnOffset: number | undefined
  if (offsetState) {
    fnOffset = parseInt(attr(offsetState, 'value') || '0') + 1
  }

  // We also extract the table ID, because the table number is displayed as prefix of the table, so we need to
  // know how many tables exist in the document before this one.
  const context = new RenderingContext(lineLength)
  const tableIdState = states.find(e => attr(e, 'name') === 'table_id')
  if (tableIdState) {
    const tableId = parseInt(attr(tableIdState, 'value') || '')
    if (!isNaN(tableId)) {
      context.putProp('tableId',  tableId)
    }
  }

  // Everything else are element to be converted, it should be one sicne the XSLT put one element by temp file
  // but for testing purpose I usually drop more than one table or syntax diagram in the temp file, to test more things at
  // once, so handling multiple elements is mostly for convenience than actually prod implementation
  const withoutStates = doc.filter(e => getElementName(e) !== 'state')

  // Create a Dita Renderer and register all our renderers
  const renderer = new DitaRenderer(logger, fnOffset || 1)
  new CommonElements(renderer)
  new DitaTable(renderer, logger)
  new SyntaxDiagram(renderer, logger, noTm)


  // Render all the elements found in the temporary file
  let output = ''
  for (const e of withoutStates) {
    output += renderer.renderElement(e, context)
  }

  logger.debug('output')
  logger.debug(output || '')

  return output || 'FAILED RENDERING ELEMENT'
}

/**
 * Convenient function to find a given command line option
 * 
 * @param params The array of command line arguments
 * @param name The name of the option, without the trailing `--`
 * @returns The Option value if found, undefined if not found
 */
function readOpt(params: string[], name: string) {
  const re = new RegExp(`^--${name}=(.*)$`)
  let m
  for (const p of params) {
    if (m = re.exec(p)) {
      return m[1]
    }
  }
}


/**
 * Main entry function that reads the input file, convert the table,
 * and write the resulting string to the output file
 */
function main () {
  const params =  process.argv.slice(2)
  const positionalArgsOnly = params.filter(e => !/^--/.test(e))
  const [srcFile, outputFile] = positionalArgsOnly

  const logger = new Logger('info')

  if (!srcFile || !outputFile) {
    logger.error('Usage: <srcFile> <outputFile>')
    process.exit(99)
  }

  let content
  try {
    content = readFileSync(srcFile, 'utf-8')
  } catch (error) {
    logger.error(`ERROR: Could not read ${srcFile}`)
    process.exit(2)
  }

  let lineLength = defaultLineLength
  const lineLengthOpt = readOpt(params, 'line-length')
  if (lineLengthOpt) {
    const m = /^(\d+)/.exec(lineLengthOpt)
    if (m) {
      lineLength = parseInt(m[1])
      logger.debug(`INFO: Line length set by option to ${lineLength}`)
    } else {
      logger.warn(`WARN: Invalid line length. Number expected, got ${lineLengthOpt.substring(14)}`)
    }
  } else {
    logger.debug(`INFO: Using default line length: ${lineLength}`)
  }

  const tmOpt = readOpt(params, 'no-tm')

  const tableAsText = convert(content, lineLength, logger, tmOpt === 'yes' || tmOpt === 'true');

  writeFileSync(outputFile, tableAsText, 'utf-8')
}

main()
