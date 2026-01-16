


// This doesn't work because we reach circular dependencies which are supported in Typescript, unless you are using generic...
// type XMLElement<Name extends string, Value, Attributes> = {
//   // The mandatory property for the element's name
//   [Property in Name]: Value
// } & {
//   ':@': {[Property in keyof Attributes]?: Attributes[Property]}
// }
// const aaa: XMLElement<'aaa', Q[], {
//   attr: boolean
// } > = {
//   ":@": {attr: false},
//   aaa: []

// }

// Is index I in list L?
type IsIn<I extends number, L extends readonly number[]> =
  I extends L[number] ? true : false;

// Expand a type at index I based on whether it is repeatable and/or optional
type Expand<
  T,
  I extends number,
  R extends readonly number[],
  O extends readonly number[]
> =
  IsIn<I, R> extends true
    ? IsIn<I, O> extends true
      ? T[]             // repeatable & optional → 0+
      : [T, ...T[]]     // repeatable only → 1+
    : IsIn<I, O> extends true
      ? [] | [T]        // optional only → 0 or 1
      : [T];            // required

// This create an array type where some types can be optional or repeatable, but create all possible combinations
// This uses recursive call with our repeatable and optional array of index staying constant, but the current index (I) being incremented
// This allows us concatenating the correct type to the output array depending on the current index and if it appears in the Repeatable or Optional arrays
type OrderedSequence<
  Children extends readonly unknown[],
  Repeatable extends readonly number[] = [],
  Optional extends readonly number[] = [],
  Output extends unknown[] = [],
  I extends number = 0
> = Children extends [infer Head, ...infer Tail]
  ? OrderedSequence<
      Tail,
      Repeatable,
      Optional,
      [...Output, ...Expand<Head, I, Repeatable, Optional>],
      Increment<I> // increment the current index we are checking
    >
  : Output;

// utility function to incement since it doesn't exist in typescript
type Increment<N extends number> =
  N extends 0 ? 1 :
  N extends 1 ? 2 :
  N extends 2 ? 3 :
  N extends 3 ? 4 :
  N extends 4 ? 5 :
  N extends 5 ? 6 :
  N extends 6 ? 7 :
  N extends 7 ? 8 :
  N extends 8 ? 9 :
  N extends 9 ? 10 :
  never;

type TTTTT = Increment<1>


/**
 * 
 * START - Common attributes definitions
 * 
 */
type FrameAttrValue = 'top' | 'bottom' | 'topbot' | 'all' | 'sides' | 'none'

type Align = 'left' | 'right' | 'center' | 'justify' | 'char'

export type VerticalAlign = 'top' | 'bottom' | 'middle'

type yesorno = '0' | '1'

type SynDiagramImportance = 'optional' | 'required' | 'default'

type SelectAttrs = {
  platform?: string
  product?: string
  audience?: string
  otherprops?: string
  importance?: 'obsolete' | 'deprecated' | 'optional' | 'default' | 'low' | 'normal' | 'high' | 'recommended' | 'required' | 'urgent'
  rev?: string
  status?: 'new' | 'changed' | 'deleted' | 'unchanged'
}
type DisplayAttributes = {
  scale?: string
  frame?: FrameAttrValue
}
type ElementNameAttr = {
 /**
   * This is not a DITA element, but something injected by fast-xml-parser via the updateTag function
   * to conveniently find the element name without going through the object's keys
   */
  elementName: AllNames
}
type CommonAttributes = ElementNameAttr & {
  class?: string
  outputclass?: string
}
type UniversalAttributes = SelectAttrs & {
  id?: string
  translate?: 'yes' | 'no'
}

type KeyRefAttrs = {
  /** keyref: indirect key reference to a description resource */
  keyref?: string 
}

type ScopeAttr = {
  scope?: 'external' | 'local' | 'peer' | '-dita-use-conref-target'
}

type CrossRefAttrs = {
  /** href: reference to the resource */
  href?: string
  /** scope: closeness of relationship to the referenced resource */
  scope?: ScopeAttr
  /** format: media type or file extension (e.g. "dita", "html") */
  format?: string
  /**
   * Describes the target of a cross-reference and may generate cross-reference
   * text based on that description. Only the <xref> element can link to content
   * below the topic level: other types of linking can target whole topics,
   * but not parts of topics. Typically <xref> should also be limited to topic-level
   * targets, unless the output is primarily print-oriented. Web-based referencing
   * works best at the level of whole topics, rather than anchor locations within topics.
   * 
   * When targeting DITA content, the type should match one of the values in the
   * target's class attribute. For example, if type="topic", the link could be to
   * a generic topic, or any specialization of topic, including concept, task,
   * and reference.
   * 
   * Some possible values include:
   *
   *  * `fig`: Indicates a link to a figure.
   *  * `table` : Indicates a link to a table.
   *  * `li`:  Indicates a link to an ordered list item.
   *  * `fn`: Indicates a link to a footnote.
   *  * `section`: "section" indicates a link to a section.
   *  * `concept`, `task`, `reference`, `topic`: Cross-reference to a topic type.
   *  * (no value): Defaults to generic topic, or the processor may retrieve the actual type
   *                from the target if available.
   * 
   * Other values can be used to indicate other types of topics or elements as
   * targets. Processing is only required to support the above list, or
   * specializations of types in that list. Supporting additional types as
   * targets may require the creation of processing overrides.
   */
  type?: string
}


/**
 * 
 * END - Common attributes definitions
 * 
 */


/**
 * 
 * START - Entity definitions
 * 
 */

/* basic.block.notbfgobj */
type Ent_BasicBlockNotbfgobj = Dl | Div | Image | Lines | Lq | Note | Ol | P | Pre | Sl | Ul

/* basic.ph */
type Ent_BasicPh = Cite | Keyword | Ph | Q | Term | E_Text | Tm | Xref | State

/* basic.ph.notm */
type Ent_BasicPhNoTm = B | Cite | Keyword | Ph | Q | Term | Text | Xref | State

/* data.elements.incl */
type Ent_DataElementsIncl = Data | DataAbout
/* foreign.unknown.incl */
type Ent_ForeignUnknownIncl = Foreign | Unknown

/* basic.block.notbl */
type Ent_BasicBlockNotbl = Dl | Div | Fig | Image | Lines | Lq | Note | Object | Ol | P | Pre | Sl | Ul
/* tblcell.cnt */
type Ent_TblcellCnt = PCDATA | Ent_BasicBlockNotbl | Ent_BasicPh | Ent_DataElementsIncl | Ent_ForeignUnknownIncl | Ent_TxtIncl

/* txt.incl */
type Ent_TxtIncl = DraftComment | Fn | Indextermref | Indexterm | RequireCleanup

type DitaTableAttribute = {
  orient?: 'port' | 'land'
  /**
   * This attribute specifies whether the content of the first column in a table contains row headings.
   * In the same way that a column header introduces a table column, the row header introduces the table
   * row. This attribute makes tables whose first column contains row headings more readable on output.
   * Allowable values are:
   *  * `firstcol`: The first column contains the row headings.
   *  * `norowheader`: Indicates that no column contains row headings. This is the default.
   */
  rowheader?: 'firstcol' | 'headers' | 'norowheader'
  scale?: string

} & UniversalAttributes & CommonAttributes


/** basic.ph.noxref.nocite */
type Ent_BasicPhNoXrefNoCite = Keyword | Ph | Q | Term | E_Text | Tm | State
/** basic.ph.noxref */
type Ent_BasicPhNoXref = Ent_BasicPhNoXrefNoCite | Cite

/** words.cnt */
type Ent_WordsCnt = Ent_DataElementsIncl | Ent_ForeignUnknownIncl | Keyword | Term | E_Text


/** basic.block */
type Ent_BasicBlock =  Dl | Div | Fig | Image | Lines | Lq | Note | Object | Ol | P | Pre | Simpletable | Sl | Table | URL

/** pre.cnt */
type Ent_PreCnt = PCDATA | Ent_BasicBlock | Ent_DataElementsIncl | Ent_ForeignUnknownIncl | Ent_TxtIncl

/** term.cnt */
type Ent_TermCnt = PCDATA | Ent_BasicPh | Ent_DataElementsIncl | DraftComment | Ent_ForeignUnknownIncl | RequireCleanup | Image

/** title.cnt */
type Ent_TitleCnt = PCDATA | Ent_BasicPhNoXref | Ent_DataElementsIncl | DraftComment | Ent_ForeignUnknownIncl | RequireCleanup | Image

/** basic.block.nolq */
type Ent_BasicBlockNolq = Dl | Div | Fig | Image | Lines | Note | Object | Ol | P | Pre | Simpletable | Sl | Table | Ul


/** basic.block.notbnofg */
type BasicBlockNotbnofg = Dl | Div | Image | Lines | Lq | Note | Object | Ol | P | Pre | Sl | Ul

/** fig.cnt */
type Ent_FigCnt = BasicBlockNotbnofg | Ent_DataElementsIncl | Fn | Ent_ForeignUnknownIncl | Simpletable | Xref

/** figgroup.cnt */
type Ent_FiggroupCnt = BasicBlockNotbnofg | Ent_BasicPh | Ent_DataElementsIncl | DraftComment | Fn | Ent_ForeignUnknownIncl | RequireCleanup

/** longquote.cnt */
type Ent_LongquoteCnt = Ent_BasicBlockNolq | Ent_BasicPh | Ent_DataElementsIncl | Ent_ForeignUnknownIncl | Longquoteref | Ent_TxtIncl

/** note.cnt */
type Ent_NoteCnt = Ent_BasicBlockNotbl | Ent_BasicPh | Ent_DataElementsIncl | Ent_ForeignUnknownIncl | Ent_TxtIncl

/** ph.cnt */
type Ent_PhCnt = Ent_BasicPh | Ent_DataElementsIncl | Ent_ForeignUnknownIncl | Image | Ent_TxtIncl

/** listitem.cnt */
type Ent_ListitemCnt = PCDATA | Ent_BasicBlock | Ent_BasicPh | Ent_DataElementsIncl | Ent_ForeignUnknownIncl | ItemGroup | Ent_TxtIncl

/** itemgroup.cnt */
type Ent_ItemgroupCnt = PCDATA | Ent_BasicBlock | Ent_BasicPh | Ent_DataElementsIncl | Ent_ForeignUnknownIncl | Ent_TxtIncl

/** basic.block.nopara */
type Ent_BasicBlockNopara = Dl | Div | Fig | Image | Lines | Lq | Note | Object | Ol | Pre | Simpletable | Sl | Table | Ul

/** para.cnt */
type Ent_ParaCnt = Ent_BasicBlockNopara | Ent_BasicPh | Ent_DataElementsIncl | Ent_ForeignUnknownIncl | Ent_TxtIncl

/** fn.cnt */
type Ent_FnCnt = Ent_BasicBlockNotbl | Ent_BasicPh | Ent_DataElementsIncl | DraftComment | Ent_ForeignUnknownIncl | RequireCleanup

/** xrefph.cnt */
type Ent_XrefphCnt = Ent_BasicPhNoXrefNoCite | Ent_DataElementsIncl | DraftComment | Ent_ForeignUnknownIncl | RequireCleanup

/** div.cnt */
type Ent_DivCnt = Ent_BasicBlock | Ent_BasicPh | Ent_DataElementsIncl | Ent_ForeignUnknownIncl | Ent_TxtIncl

/** xreftext.cnt */
type Ent_XreftextCnt = PCDATA | Ent_BasicPhNoXref | Ent_DataElementsIncl | DraftComment | Ent_ForeignUnknownIncl | RequireCleanup | Image

/** desc.cnt */
type Ent_DescCnt = PCDATA | Ent_BasicBlockNotbfgobj | Ent_BasicPh | Ent_DataElementsIncl | DraftComment | Ent_ForeignUnknownIncl | RequireCleanup

/** data.cnt */
type Ent_DataCnt = PCDATA | Ent_BasicPh | Ent_DataElementsIncl | DraftComment | Ent_ForeignUnknownIncl | Image | Object | RequireCleanup | Title

/** basic.phandblock */
type Ent_BasicPhandblock = Ent_BasicPh | Ent_BasicBlock

/** defn.cnt */
type Ent_DefnCnt = PCDATA | Ent_BasicPh | Ent_DataElementsIncl | Ent_ForeignUnknownIncl | Ent_TxtIncl

type EMPTY = []

type ANY = any

type PCDATA = {
  '#text': string
}

/**
 * 
 * END - Entity definitions
 * 
 */

/**
 * 
 * START - Common elements definition
 * 
 */

type Foreign_Content = ANY
type Foreign_Attrs = UniversalAttributes & CommonAttributes
export interface Foreign {
  foreign: Foreign_Content
  ':@': Foreign_Attrs
}

type Unknown_Content = ANY
type Unknown_Attrs = UniversalAttributes & CommonAttributes
export interface Unknown {
  unknown: Unknown_Content
  ':@': Unknown_Attrs
}

type State_Content = EMPTY
type State_Attrs = UniversalAttributes & CommonAttributes & {
  /**
   * The name of the property whose state is being described.
   */
  name: string
  /**
   * The state of the property identified by the name attribute.
   */
  value?: string
}
export interface State {
  state: State_Content
  ':@': State_Attrs
}

/** (%pre.cnt;)* */
type Pre_Content = Ent_PreCnt[]
type Pre_Attrs = DisplayAttributes & UniversalAttributes & CommonAttributes & {
  'xml:space'?: 'preserve'
}
export interface Pre {
  pre: Pre_Content
  ':@': Pre_Attrs
}

/** (%title.cnt;)* */
type Title_Content = Ent_TitleCnt[]
type Title_Attrs = UniversalAttributes & CommonAttributes
export interface Title {
  title: Title_Content
  ':@': Title_Attrs
} 

/** (%pre.cnt;)* */
type Lines_Content = Pre_Content[]
type Lines_Attrs = Pre_Attrs
export interface Lines {
  lines: Lines_Content
  ':@': Lines_Attrs
} 

/** (%div.cnt;)* */
type Div_Content = Ent_DivCnt[]
type Div_Attr = ElementNameAttr & UniversalAttributes
export interface Div {
  div: Div_Content
  ':@': Div_Attr
}

/** (%words.cnt; |
      %draft-comment; |
      %required-cleanup; |
      %ph;)* */
type Alt_Content = (Ent_WordsCnt | DraftComment | RequireCleanup | Ph)[]
type Alt_Attrs = UniversalAttributes & CommonAttributes
export interface Alt {
  alt: Alt_Content
  ':@': Alt_Attrs
}

/** "EMPTY" */
type LongDescRef_Content = EMPTY
type LongDescRef_Attrs = UniversalAttributes & CommonAttributes & KeyRefAttrs & CrossRefAttrs
export interface LongDescRef {
  longdescref: LongDescRef_Content
  ':@': LongDescRef_Attrs
}

/** ((%alt;)?, (%longdescref;)?) */
type Image_Content = OrderedSequence<[Alt, LongDescRef], [], [0, 1]>
type Image_Attrs = UniversalAttributes & CommonAttributes & KeyRefAttrs & Omit<CrossRefAttrs, 'type'> & {
  /** height: vertical dimension with optional unit (e.g. "100px", "10cm") */
  height?: string
  /** width: horizontal dimension with optional unit */
  width?: string
  /** align: horizontal alignment when placement is "break" */
  align?: 'left' | 'right' | 'center'
  /** placement: how image is placed in flow */
  placement?: 'inline' | 'break' | '-dita-use-conref-target'
  /** scale: percentage (e.g. 50 means 50%) */
  scale?: number
  /** scalefit: allow scaling to fit space */
  scalefit?: 'yes' | 'no' | '-dita-use-conref-target'
  /** alt: deprecated attribute for alternative text (prefer <alt> element) */
  alt?: string
  /** longdescref: deprecated long description URI */
  longdescref?: string
}
export interface Image {
  image: Image_Content
  ':@': Image_Attrs
}

/** (%para.cnt;)* */
type P_Content = Ent_ParaCnt[]
type P_Attrs = UniversalAttributes & CommonAttributes
export interface P {
  p: P_Content
  ':@': P_Attrs
}

/** (%tblcell.cnt;)* */
type Stentry_Content = Ent_TblcellCnt[]
type Stentry_Attrs = UniversalAttributes & CommonAttributes
export interface Stentry {
  stentry: Stentry_Content
  ':@': Stentry_Attrs
}

/** (%stentry;)+ */
type Sthead_Content = OrderedSequence<[Stentry], [0], []>
type Sthead_Attrs = UniversalAttributes & CommonAttributes
export interface Sthead {
  sthead: Sthead_Content
  ':@': Sthead_Attrs
}

/** (%stentry;)* */
type Strow_Content = OrderedSequence<[Stentry], [0], [0]>
type Strow_Attrs = UniversalAttributes & CommonAttributes
export interface Strow {
  strow: Strow_Content
  ':@': Strow_Attrs
}

/** ((%sthead;)?, (%strow;)+) */
type Simpletable_Content = OrderedSequence<[Sthead, Strow], [1], [0]>
type Simpletable_Attrs = DisplayAttributes & UniversalAttributes & CommonAttributes & {
  /** keycol: defines which column is treated as vertical row header (NMTOKEN) */
  keycol?: string
  /**
   * relcolwidth: relative column widths, space‑separated units (e.g. "1* 2* 3*")
   */
  relcolwidth?: string
  /**
   * refcols: reserved for future; comma‑separated list of column numbers (NMTOKENS)
   */
  refcols?: string

}
export interface Simpletable {
  simpletable: Simpletable_Content
  ':@': Simpletable_Attrs
}

/** "EMPTY" */
type Longquoteref_Content = EMPTY
type Longquoteref_Attrs = UniversalAttributes & CommonAttributes & KeyRefAttrs & CrossRefAttrs
export interface Longquoteref {
  longquoteref: Longquoteref_Content
  ':@': Longquoteref_Attrs
}

/** (%note.cnt;)* */
type Note_Content = Ent_NoteCnt[]
type Note_Attrs = UniversalAttributes & CommonAttributes & {
  type?: 'attention' | 'caution' | 'danger' | 'fastpath' | 'important' |
         'note' | 'notice' | 'other' | 'remember' | 'restriction' |
         'tip' | 'trouble' | 'warning'
  othertype?: String
}
export interface Note {
  note: Note_Content
  ':@': Note_Attrs
}

/** (#PCDATA | %text;)* */
type Text_Content = (PCDATA | E_Text)[]
type Text_Attrs = ElementNameAttr & UniversalAttributes
export interface E_Text {
  text: Text_Content
  ':@': Text_Attrs
}

/** (%ph.cnt;)* */
type Ph_Content = Ent_PhCnt[]
type Ph_Attrs = UniversalAttributes & CommonAttributes & KeyRefAttrs
export interface Ph {
  ph: Ph_Content
  ':@': Ph_Attrs
}

/** (%itemgroup.cnt;)* */
type ItemGroup_Content = Ent_ItemgroupCnt[]
type ItemGroup_Attrs = UniversalAttributes & CommonAttributes
export interface ItemGroup {
  itemgroup: ItemGroup_Content
  ':@': ItemGroup_Attrs
}

/** (%ph.cnt;)* */
type Li_Content = Ent_ListitemCnt[]
type Li_Attrs = UniversalAttributes & CommonAttributes
export interface Li {
  li: Li_Content
  ':@': Li_Attrs
}

/** ((%data; | %data-about;)*, (%li;)+ */
type Ol_Content = OrderedSequence<[(Data | DataAbout), Li], [0, 1], [0]>
type Ol_Attrs = UniversalAttributes & CommonAttributes & {
  compact?: 'yes' | 'no'
}
export interface Ol {
  ol: Ol_Content
  ':@': Ol_Attrs
}

/** ((%data; | %data-about;)*, (%li;)+ */
type Ul_Content = OrderedSequence<[(Data | DataAbout), Li], [0, 1], [0]>
type Ul_Attrs = UniversalAttributes & CommonAttributes & {
  compact?: 'yes' | 'no'
}
export interface Ul {
  ul: Ul_Content
  ':@': Ul_Attrs
}

/** (%longquote.cnt;)* */
type Lq_Content = Ent_LongquoteCnt[]
type Lq_Attrs = UniversalAttributes & CommonAttributes
export interface Lq {
  lq: Lq_Content
  ':@': Lq_Attrs
}

/** ((%title;)?, (%figgroup; | %figgroup.cnt;)*) */
type Figgroup_Content = OrderedSequence<[Title, Figgroup | Ent_FiggroupCnt], [1], [0, 1]>
type Figgroup_Attrs = UniversalAttributes & CommonAttributes
export interface Figgroup {
  figgroup: Figgroup_Content
  ':@': Figgroup_Attrs
}

/** ((%title;)?, (%desc;)?, (%figgroup; | %fig.cnt;)*) */
type Fig_Content = OrderedSequence<[Title, Desc, Figgroup | Ent_FigCnt], [2], [0,1,2]>
type Fig_Attrs = ElementNameAttr
export interface Fig {
  fig: Fig_Content
  ':@': Fig_Attrs
}

/** (%desc.cnt;)* */
type Desc_Content = Ent_DescCnt[]
type Desc_Attrs = UniversalAttributes & CommonAttributes
export interface Desc {
  desc: Desc_Content
  ':@': Desc_Attrs
}

/**  */
type RequireCleanup_Content = ANY
type RequireCleanup_Attrs = UniversalAttributes & CommonAttributes & {
  /** 
   * Indicates the element that the contents of the required-cleanup
   * element were mapped from (provides an idea about what the new intent should be).
   */
  remap?: string
}
export interface RequireCleanup {
  'require-cleanup': RequireCleanup_Attrs
  ':@': RequireCleanup_Attrs
}

/** (%data.cnt;)* */
type Data_Content = Ent_DataCnt[]
type Data_Attrs = UniversalAttributes & CommonAttributes & KeyRefAttrs & CrossRefAttrs & {
  datatype?: string
  value?: string
}
export interface Data {
  data: Data_Content
  ':@': Data_Attrs
}

/** ((%data;), (%data; | %data-about;)*) */
type DataAbout_Content = OrderedSequence<[Data, Data | DataAbout], [1], [1]>
type DataAbout_Attrs = UniversalAttributes & CommonAttributes & KeyRefAttrs & CrossRefAttrs
export interface DataAbout {
  dataabout: DataAbout_Content
  ':@': DataAbout_Attrs
}

/** (#PCDATA | %basic.phandblock; | %data.elements.incl; | %foreign.unknown.incl;)* */
type DraftComment_Content = (PCDATA | Ent_BasicPhandblock | Ent_DataElementsIncl | Ent_ForeignUnknownIncl)[]
type DraftComment_Attrs = CommonAttributes & {
  author: string
  time: string
  disposition: string
}
export interface DraftComment {
  'draft-comment': DraftComment_Content
  ':@': DraftComment_Attrs
}

/** (#PCDATA | %basic.ph; | %data.elements.incl; | %draft-comment; | %foreign.unknown.incl; | %required-cleanup;)* */
type B_Content = (PCDATA | Ent_BasicPh | Ent_DataElementsIncl | DraftComment | Ent_ForeignUnknownIncl | RequireCleanup)[]
type B_Attributes = UniversalAttributes & CommonAttributes
export interface B {
  b: B_Content
  ':@': B_Attributes
}

/** (#PCDATA | %text; | %tm;)* */
type Tm_Content = (PCDATA | E_Text | Tm)[]
type Tm_Attrs = ElementNameAttr & UniversalAttributes & {
  /** trademark: the trademarked term */
  trademark?: string
  /** tmowner: owner of the trademark (e.g. "OASIS") */
  tmowner?: string
  /** tmtype: type of trademark ("trademark", "registered trademark", "service mark") */
  tmtype?: 'reg' | 'service' | 'tm'
  /** tmclass: classification of the trademark */
  tmclass?: string
}
export interface Tm {
  tm: Tm_Content
  ':@': Tm_Attrs
}

/** (#PCDATA | %draft-comment; | %required-cleanup; | %text; | %tm;)* */
type Keyword_Content = (PCDATA | DraftComment | RequireCleanup | E_Text | Tm)[]
type Keyword_Attrs = UniversalAttributes & CommonAttributes & KeyRefAttrs
export interface Keyword {
  keyword: Keyword_Content
  ':@': Keyword_Attrs
}

/** (%xrefph.cnt;)* */
type Cite_Content = Ent_XrefphCnt[]
type Cite_Attrs = UniversalAttributes & CommonAttributes & KeyRefAttrs
export interface Cite {
  cite: Cite_Content
  ':@': Cite_Attrs
}

/** (%longquote.cnt;)* */
type Q_Content = Ent_LongquoteCnt[]
type Q_Attrs = UniversalAttributes & CommonAttributes & CrossRefAttrs
export interface Q {
  q: Q_Content
  ':@': Q_Attrs
}


/** (#PCDATA | %draft-comment; | %required-cleanup; | %text; | %tm;)* */
type Term_Content = (PCDATA | DraftComment | RequireCleanup | E_Text | Tm)[]
type Term_Attrs = UniversalAttributes & CommonAttributes & KeyRefAttrs
export interface Term {
  term: Term_Content
  ':@': Term_Attrs
}

/** "(%xreftext.cnt; |  %desc;)* */
type Xref_Content = (Ent_XreftextCnt | Desc)[]
type Xref_Attrs = UniversalAttributes & CommonAttributes & CrossRefAttrs
export interface Xref {
  xref: Xref_Content
  ':@': Xref_Attrs
}

/** (%fn.cnt;)* */
type Fn_Content = Ent_FnCnt[]
type Fn_Attrs = UniversalAttributes & CommonAttributes & {
  /** 
   * Specifies what character is used for the footnote link,
   * for example a number or an alpha character. Numbers are the default.
   * You could also specify a graphic for the footnote callout during
   * output processing. */
  callout?: string
}
export interface Fn {
  fn: Fn_Content
  ':@': Fn_Attrs
}

/** "(%words.cnt; | %indexterm;)* */
type Indexbase_Content = (Ent_WordsCnt | Indexterm)[]
type Indexbase_Attrs = ElementNameAttr & UniversalAttributes & KeyRefAttrs
export interface Indexbase {
  indexbase: Indexbase_Content
  ':@': Indexbase_Attrs
}

/** "(%words.cnt; |  %ph; | %indexterm; | %index-base;)* */
type Indexterm_Content = (Ent_WordsCnt | Ph | Indexterm | Indexbase)[]
type Indexterm_Attrs = ElementNameAttr & UniversalAttributes & KeyRefAttrs & {
  /** Specifies an identifier that indicates the start of an index range. */
  start: string
  /** Specifies an identifier that indicates the end of an index range. */
  end: string
}
export interface Indexterm {
  indexterm: Indexterm_Content
  ':@': Indexterm_Attrs
}

/** "EMPTY" */
type Indextermref_Content = EMPTY
type Indextermref_Attrs = ElementNameAttr & UniversalAttributes & KeyRefAttrs
export interface Indextermref {
  indextermref: Indextermref_Content
  ':@': Indextermref_Attrs
}

/** (%ph.cnt;)* */
type Sli_Content = Ent_PhCnt[]
type Sli_Attrs = UniversalAttributes & CommonAttributes
export interface Sli {
  sli: Sli_Content
  ':@': Sli_Attrs
}

/** ((%data; | %data-about;)*, (%sli;)+) */
type Sl_Content = OrderedSequence<[Data | DataAbout, Sli], [0, 1], [0]>
type Sl_Attrs = UniversalAttributes & CommonAttributes & {
  /**
   * Indicates close vertical spacing between the list items.
   * Expanded spacing is the default value.
   * The output result of compact spacing depends on
   * the processor or browser
   */
  compact?: 'yes' | 'no'
}
export interface Sl {
  sl: Sl_Content
  ':@': Sl_Attrs
}


/**
 * 
 * END - Common elements definition
 * 
 */

/**
 * 
 * START - Definition List definition
 * 
 */
/** (%title.cnt;)* */
type Ddhd_Content = Ent_TitleCnt[]
type Ddhd_Attrs = UniversalAttributes & CommonAttributes
export interface Ddhd {
  ddhd: Ddhd_Content
  ':@': Ddhd_Attrs
}

/** (%title.cnt;)* */
type Dthd_Content = Ent_TitleCnt[]
type Dthd_Attrs = UniversalAttributes & CommonAttributes
export interface Dthd {
  dthd: Ddhd_Content
  ':@': Dthd_Attrs
}

/** ((%dthd;)?, (%ddhd;)?) */
type DlHead_Content = OrderedSequence<[Dthd, Ddhd], [], [0,1]>
type DlHead_Attrs = UniversalAttributes & CommonAttributes
export interface DlHead {
  dlhead: DlHead_Content
  ':@': DlHead_Attrs
}

/** (%defn.cnt;)* */
type Dd_Content = Ent_DefnCnt[]
type Dd_Attrs = UniversalAttributes & CommonAttributes
export interface Dd {
  dd: Dd_Content
  ':@': Dd_Attrs
}

/** (%term.cnt;)* */
type Dt_Content = Ent_TermCnt[]
type Dt_Attrs = KeyRefAttrs & UniversalAttributes & CommonAttributes
export interface Dt {
  dt: Dt_Content
  ':@': Dt_Attrs
}

/** ((%dt;)+, (%dd;)+) */
type DlEntry_Content = OrderedSequence<[Dt, Dd], [0, 1], []>
type DlEntry_Attrs = UniversalAttributes & CommonAttributes
export interface DlEntry {
  dlentry: DlEntry_Content
  ':@': DlEntry_Attrs
}

/** ((%data; | %data-about;)*, (%dlhead;)?, (%dlentry;)+) */
type Dl_Content = OrderedSequence<[Data | DataAbout, DlHead, DlEntry], [0, 2], [0, 1]>
type Dl_Attrs = UniversalAttributes & CommonAttributes & {
  compact: 'yes' | 'no'
  spectitle: string
}
export interface Dl {
  dl: Dl_Content
  ':@': Dl_Attrs
}
/**
 * 
 * END - Definition List definition
 * 
 */

/**
 * 
 * START - Table specific definition
 * 
 */


type ColSpec_attrs = ElementNameAttr & {
  /** colnum: column number, from first logical column to last (NMTOKEN). Optional */
  colnum?: string
  /** colname: name of the column for reference in entries (NMTOKEN). Optional */
  colname?: string
  /** align: text alignment in the column. Optional */
  align?: Align
  /** char: single character used when align="char". Optional */
  char?: string
  /** charoff: horizontal offset (0 < number ≤ 100). Optional */
  charoff?: string
  /** colwidth: width of the column (CDATA, e.g. "121*"). Optional */
  colwidth?: string
  /** colsep: column separator flag: "0" (none) or "1". Defaults to "0". Optional */
  colsep?: yesorno
  /** rowsep: row separator flag: "0" or "1". Defaults to "0". Optional */
  rowsep?: yesorno

  /**
   * rowheader: indicates row header behavior.
   * Used on <colspec> to mark that entries in this column serve as headers.
   * Optional.
   */
  rowheader?: 'firstcol' | 'headers' | 'norowheader'
}
export interface ColSpec {
  colspec: {}
  ':@': ColSpec_attrs
}

/** (%paracon;)* => paracon = "%tblcell.cnt;*/
type Entry_Content = Ent_TblcellCnt[]
type Entry_Attrs = UniversalAttributes & CommonAttributes & {
  /** colname: reference to the column name defined by a <colspec> */
  colname?: string
  /** namest: first logical column number for a horizontal span */
  namest?: string
  /** nameend: last logical column number for a horizontal span */
  nameend?: string
  /** morerows: number of additional rows in a vertical span */
  morerows?: string
  /** colsep: column separator flag (“0” or “1”) */
  colsep?: yesorno
  /** rowsep: row separator flag (“0” or “1”) */
  rowsep?: yesorno
  /** align: horizontal text alignment in the entry */
  align?: 'left' | 'right' | 'center' | 'justify' | 'char' | '-dita-use-conref-target'
  /** char: character used for char-based alignment (when align="char") */
  char?: string
  /** charoff: offset percentage for character alignment (1–100) */
  charoff?: string
  /** valign: vertical alignment of cell content */
  valign?: VerticalAlign
  /** Specifies whether the contents of the entry are rotated */
  rotate: yesorno
  /** Specifies that the current entry is a header for other table entries */
  scope: 'col' | 'colgroup' | 'row' | 'rowgroup'
  /** Specifies which entries in the current table provide headers for this cell.
   * The `@headers` attribute contains an unordered set of unique, space-separated tokens,
   * each of which is an ID reference of an entry from the same table. */
  headers: string
}
export interface Entry {
  entry: Entry_Content
  ':@': Entry_Attrs
}

/** (%entry;)+ */
type Row_Content = OrderedSequence<[Entry], [0], []>
type Row_Attrs = UniversalAttributes & CommonAttributes & {
  rowsep?: yesorno
  valign: VerticalAlign
}
export interface Row {
  row: Row_Content
  ':@': Row_Attrs
}

type THead_Content = OrderedSequence<[Row], [0], []>
type THead_Attrs = UniversalAttributes & CommonAttributes & {
  /** Indicates the vertical alignment of text in a table entry (cell) */
  valign: VerticalAlign
}
export interface THead {
  thead: THead_Content
  ':@': THead_Attrs
}

/** (%row;)+ */
type TBody_Content = OrderedSequence<[Row], [0], []>
type TBody_Attrs = UniversalAttributes & CommonAttributes & {
  valign: VerticalAlign
}
export interface TBody {
  tbody: TBody_Content
  ':@': TBody_Attrs
}

/** ((%colspec;)*, (%thead;)?, (%tbody;)) */
type TGroup_Content = OrderedSequence<[ColSpec, THead, TBody], [0], [0, 1]>
type TGroup_Attrs = UniversalAttributes & CommonAttributes & {
  /** cols: number of columns in the table tgroup. NMTOKEN. Required. */
  cols: string
  /** colsep: column separator flag ("0" or "1"). Optional; default "0". */
  colsep?: yesorno
  /** rowsep: row separator flag ("0" or "1"). Optional; default "0". */
  rowsep?: yesorno
  /**
   * align: default alignment for table columns.
   */
  align?: Align
}
export interface TGroup {
  tgroup: TGroup_Content
  ':@': TGroup_Attrs
}

type Table_Attrs = Pick<DisplayAttributes, 'frame'> & {
  /** Column separator. A value of 0 indicates no separators; 1 indicates separators. */
  colsep?: yesorno
  /** Row separator. A value of 0 indicates no separators; 1 indicates separators. */
  rowsep?: yesorno
  /**
   * Determines the horizontal placement of the element.
   * Supported values are 1 for page width, or 0 for resize to galley or column.
   */
  pgwide?: yesorno
} & DitaTableAttribute
/** tbl.table-titles.mdl;) */
type Ent_TblTableTitlesMdl = OrderedSequence<[Title, Desc], [], [0,1]>
/** tbl.table-main.mdl */
type Ent_TblTableMainMdl = OrderedSequence<[TGroup], [0], []>
/** ((%tbl.table-titles.mdl;), (%tbl.table-main.mdl;)) */
// type Table_Content = OrderedSequence<[Ent_TblTableTitlesMdl, Ent_TblTableMainMdl], [], []>
type Table_Content = OrderedSequence<[Title, Desc, TGroup], [2], [0,1]>

export interface Table {
  table: Table_Content,
  ':@': Table_Attrs
}

/**
 * Simple Table specific definition
 */

type Simpletable_Content = OrderedSequence<[Sthead, Strow], [1], [0]>
type Simpletable_Attrs = UniversalAttributes & CommonAttributes & DisplayAttributes &  {
  /** 
   * Defines the column that will be used for row headings.
   * No value indicates no key column. When present,
   * the numerical value causes the specified column
   * to be highlighted as a vertical header.
   */
  keycol?: string

  /**
   * A relative value to specify the width of a column in relationship to
   * the width of the other columns for print output. The values
   * are totaled and made a percent. For example:
   * 
   * `relcolwidth="1* 2* 3*"`
   * 
   * causes widths of 16.7%, 33.3%, and 66.7%.
   * 
   * `relcolwidth="90* 150*"`
   * 
   * causes width of 37.5% and 62.5%.
   */
  relcolwidth?: string

  /** 
   * Designates columns that contain references, and are candidates
   * for automated linking (not currently supported).
   * Columns are identified by a comma-delimited list of
   * numbers (for example: 1,3).
   */
  refcols?: string
}
interface Simpletable {
  simpletable: Simpletable_Content
  ':@': Simpletable_Attrs
}

/**
 * 
 * END - Table specific definition
 * 
 */


/**
 * 
 * START - Programming domain definition
 * 
 */

type Codeph_Content = Ent_BasicPhNoTM
type Codeph_Attrs = UniversalAttributes & CommonAttributes
interface Codeph {
  codeph: Codeph_Content
  ':@': Codeph_Attrs
}

type Sep_Content = Ent_WordsCnt
type Sep_Attrs = UniversalAttributes & CommonAttributes & {
   importance?: SynDiagramImportance
}
interface Sep {
  sep: Sep_Content
  ':@': Sep_Attrs
}

type Delim_Content = Ent_WordsCnt
type Delim_Attrs = UniversalAttributes & CommonAttributes & {
   importance?: SynDiagramImportance
}
interface Delim {
  delim: Delim_Content
  ':@': Delim_Attrs
}

type Oper_Content = Ent_WordsCnt
type Oper_Attrs = UniversalAttributes & CommonAttributes & {
   importance?: SynDiagramImportance
}
interface Oper {
  oper: Oper_Content
  ':@': Oper_Attrs
}

type Kwd_Content = PCDATA | E_Text
type Kwd_Attrs = UniversalAttributes & CommonAttributes & KeyRefAttrs & {
   importance?: SynDiagramImportance
}
interface Kwd {
  kwd: Kwd_Content
  ':@': Kwd_Attrs
}

type Var_Content = Ent_WordsCnt
type Var_Attrs = UniversalAttributes & CommonAttributes & {
  importance?: SynDiagramImportance
}
interface Var {
  var: Var_Content
  ':@': Var_Attrs
}

type Repsep_Content = Ent_WordsCnt
type Repsep_Attrs = UniversalAttributes & CommonAttributes & {
  importance?: SynDiagramImportance
}
interface Repsep {
  repsep: Repsep_Content
  ':@': Repsep_Attrs
}

type Fragref_Content = OrderedSequence<[Title, Fragref | Groupchoice | Groupcomp | Groupseq | Synnote | Synnoteref], [1], [0]>
type Fragref_Attrs = UniversalAttributes & CommonAttributes
interface Fragref {
  fragref: Fragref_Content
  ':@': Fragref_Attrs
}

type Synnote_Content = PCDATA | Ent_BasicPh
type Synnote_Attrs = UniversalAttributes & CommonAttributes & {
  /**
   * Specifies what character is used for the footnote link, for example a
   * number or an alpha character. Numbers are the default. You could also
   * specify a graphic for the footnote callout during output processing.
   */
  callout?: string
}
interface Synnote {
  synnote: Synnote_Content
  ':@': Synnote_Attrs
}

type Synnoteref_Content = EMPTY
type Synnoteref_Attrs = UniversalAttributes & CommonAttributes & {
  href?: string
}
interface Synnoteref {
  synenoteref: Synnoteref_Content
  ':@': Synnoteref_Attrs
}

type Synblk_Content = OrderedSequence<[Title, Groupseq | Groupchoice | Groupcomp | Fragref | Fragment | Synnote | Synnoteref], [1], [0]>
type Synblk_Attrs = UniversalAttributes & CommonAttributes
interface Synblk {
  synblk: Synblk_Content
  ':@': Synblk_Attrs
}

type Fragment_Content = OrderedSequence<[Title, Groupseq | Groupchoice | Groupcomp | Fragref | Synnote | Synnoteref], [1], [0]>
type Fragment_Attrs = UniversalAttributes & CommonAttributes
interface Fragment {
  fragment: Fragment_Content
  ':@': Fragment_Attrs
}

type Groupcomp_Content = OrderedSequence<[Title, Repsep, Groupseq | Groupchoice | Groupcomp | Fragref | Kwd | Var | Delim | Oper | Sep | Synnote | Synnoteref], [2], [0,1]>
type Groupcomp_Attrs = UniversalAttributes & CommonAttributes & {
  importance?: SynDiagramImportance
}
interface Groupcomp {
  groupcomp: Groupcomp_Content
  ':@': Groupcomp_Attrs
}

type Groupchoice_Content = OrderedSequence<[Title, Repsep, Groupseq | Groupchoice | Groupcomp | Fragref | Kwd | Var | Delim | Oper | Sep | Synnote | Synnoteref], [2], [0,1]>
type Groupchoice_Attrs = UniversalAttributes & CommonAttributes & {
  importance?: SynDiagramImportance
}
interface Groupchoice {
  groupchoice: Groupchoice_Content
  ':@': Groupchoice_Attrs
}


type Groupseq_Content = OrderedSequence<[Title, Repsep, Groupseq | Groupchoice | Groupcomp | Fragref | Kwd | Var | Delim | Oper | Sep | Synnote | Synnoteref], [2], [0,1]>
type Groupseq_Attrs = UniversalAttributes & CommonAttributes & {
  importance?: SynDiagramImportance
}
interface Groupseq {
  groupseq: Groupseq_Content
  ':@': Groupseq_Attrs
}

type Syntaxdiagram_Content = OrderedSequence<[Title, Groupseq | Groupchoice | Groupcomp | Fragment | Fragref | Synblk | Synnote | Synnoteref], [1], [0]>
type Syntaxdiagram_Attrs = UniversalAttributes & DisplayAttributes & CommonAttributes
interface Syntaxdiagram {
  syntaxdiagram: Syntaxdiagram_Content
  ':@': Syntaxdiagram_Attrs
}

/**
 * 
 * END - Programming domain definition
 * 
 */

type AllTypes = Foreign | Unknown | State | Pre | Title | Lines | Div | Alt |
                LongDescRef | Image | P | Stentry | Sthead | Strow |
                Simpletable | Longquoteref | Note | E_Text | Ph |
                ItemGroup | Li | Ol | Ul | Lq | Figgroup | Fig | Desc |
                RequireCleanup | Data | DataAbout | DraftComment | B |
                Tm | Keyword | Cite | Q | Term | Xref | Fn | Indexbase |
                Indexterm | Indextermref | Sli | Sl | Ddhd | Dthd |
                DlHead | Dd | Dt | DlEntry | Dl | ColSpec | Entry |
                Row | THead | TBody | TGroup | Table | Codeph | Syntaxdiagram |
                Groupseq | Groupchoice | Groupcomp | Fragment | Synblk | Synnoteref |
                Synnote | Fragref | Repsep | Var | Kwd | Oper | Delim | Sep

type AllNames = 'foreign' | 'unknown' | 'state' | 'pre' | 'title' | 'lines' | 'div' | 'alt' |
                'longdescref' | 'image' | 'p' | 'stentry' | 'sthead' | 'strow' |
                'simpletable' | 'longquoteref' | 'note' | 'text' | 'ph' |
                'itemgroup' | 'li' | 'ol' | 'ul' | 'lq' | 'figgroup' | 'fig' | 'desc' |
                'requirecleanup' | 'data' | 'dataabout' | 'draftcomment' | 'b' |
                'tm' | 'keyword' | 'cite' | 'q' | 'term' | 'xref' | 'fn' | 'indexbase' |
                'indexterm' | 'indextermref' | 'sli' | 'sl' | 'ddhd' | 'dthd' |
                'dlhead' | 'dd' | 'dt' | 'dlentry' | 'dl' | 'colspec' | 'entry' |
                'row' | 'thead' | 'tbody' | 'tgroup' | 'table' | 'codeph' | 'syntaxdiagram' |
                'groupseq' | 'groupchoice' | 'groupcomp' | 'fragment' | 'synblk' | 'synnoteref'
                'synnote' | 'fragref' | 'repsep' | 'var' | 'kwd' | 'oper' | 'delim' | 'sep'

export type NameToType = {
  foreign: Foreign
  unknown: Unknown
  state: State
  pre: Pre
  title: Title
  lines: Lines
  div: Div
  alt: Alt
  longdescref: LongDescRef
  image: Image
  p: P
  stentry: Stentry
  sthead: Sthead
  strow: Strow
  simpletable: Simpletable
  longquoteref: Longquoteref
  note: Note
  text: E_Text
  ph: Ph
  itemgroup: ItemGroup
  li: Li
  ol: Ol
  ul: Ul
  lq: Lq
  figgroup: Figgroup
  fig: Fig
  desc: Desc
  requirecleanup: RequireCleanup
  data: Data
  dataabout:DataAbout
  draftcomment: DraftComment
  b: B
  tm: Tm
  keyword: Keyword
  cite: Cite
  q: Q
  term: Term
  xref: Xref
  fn: Fn
  indexbase: Indexbase
  indexterm: Indexterm
  indextermref: Indextermref
  sli: Sli
  sl: Sl
  ddhd: Ddhd
  dthd: Dthd
  dlhead: DlHead
  dd: Dd
  dt: Dt
  dlentry: DlEntry
  dl: Dl
  colspec: ColSpec
  entry: Entry
  row: Row
  thead: THead
  tbody: TBody
  tgroup: TGroup
  table: Table
  codeph: Codeph,
  syntaxdiagram: Syntaxdiagram
  groupseq: Groupseq
  groupchoice: Groupchoice
  groupcomp: Groupcomp
  fragment: Fragment
  synblk: Synblk
  synnoteref: Synnoteref
  synnote: Synnote
  fragref: Fragref
  repsep: Repsep
  var: Var
  kwd: Kwd
  oper: Oper
  delim: Delim
  sep: Sep
}

export type AllKeys = keyof NameToType | '#text'

export type AnyElement = NameToType[keyof NameToType]

export type Element = {
 [name in keyof NameToType]?: Element[]
} & { ':@': { elementName: string } }




