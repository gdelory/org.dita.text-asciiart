# DITA to ASCII Art processor

## Introduction

This DITA-OT plug-in adds ASCII Art processing to some element that don't render really nicely
in the normal Text transform, which inherits from the Troff transform.

At this moment, the following DITA elements are being extracted from the DITA and processed
separately:

 1. CALS tables (table element) and simple tables (`simpletable` element)
 2. Syntax diagrams (`syntaxdiagram` element)


It uses `node` to process the tables and output ASCII tables. You can also
set the environment variable `NODE_BINARY_PATH` to the path of the node binary
instead.

If node is not available in the PATH, it will display a warning message and
fall back to the classic DITA-OT behavior.

## Installation

First install the plug-in `org.jung.ant-contrib` using:

```
dita install https://github.com/stefan-jung/org.jung.ant-contrib/archive/master.zip
```

Then install this plugin:

```
dita install org.dita.text-asciiart
```

## Feature support for tables

We support pretty much all CALS feature. Here is a table summarizing the features and the limitation if any

| Feature | Supported on | Values supported |
| ------- | ------------ | ---------------- |
| Horizontal alignment | All elements, first takes precedence: `entry`, `colspec` and `tgroup` | `justify` is *not* supported, all other values are |
| Vertical alignment | All elements, first takes precedence: `entry`, `row`, `thead`/`tbody` | All values are supported |
| Column Width | On colspec (CALS) and `relcolwidth` attribute for simple table | All values are treated as proportional (like if they had `*`) even if they are number of units, because it doesn't really make sense to have pt or px in text mode. This means that if you have `1000/500/500`, this means the same as `2*/1*/1*` |
| Row Separator | All elements, first takes precedence: `entry`, `row`, `colspec`, `tgroup`, `table` | |
| Column Separator | All elements, first takes precedence: `entry`, `colspec`, `tgroup`, `table` | |
| Horizontal spanning | entry with `namest`/`nameend`  | |
| Vertical spanning | entry with `morerows` |  |
| char and charoff | *NOT* supported. |  But they don't do anything either in HTML, this seems like a long gone specification |

Here are some examples of CALS table rendered with this plugin:

```
+--------------------+--------------------+---------------------+
| Column 1 with me   | Col 2              | C 3                 |
| text to see the    |                    |                     |
| alignment of the   |                    |                     |
| other header cells |                    |                     |
+--------------------+--------------------+---------------------+
|                    | Mauris non nulla   | Mauris sagittis     |
|                    | interdum, laoreet  | eleifend libero ac  |
| This cell spans    | risus a, posuere   | euismod.            |
| vertically on 2    | ipsum.             |                     |
+ rows and is        +--------------------+---------------------+
| vertically bottom  | Fusce quis         |                     |
| aligned.           | tincidunt magna,   |                     |
|                    | eget laoreet metus |                     |
|                    | .                  |                     |
+--------------------+--------------------+ This cell spans     +
| Mauris non nulla   | Duis dictum felis  | vertically on 3     |
| interdum, laoreet  | vitae scelerisque  | rows and is         |
| risus a, posuere   | dapibus.           | vertically middle   |
| ipsum.             |                    | aligned.            |
+--------------------+--------------------+                     +
| Phasellus          | Curabitur finibus  |                     |
| tristique nibh     | magna vel laoreet  |                     |
| orci.              | blandit.           |                     |
+--------------------+--------------------+---------------------+


+-------------+------------------------+------------------------+
| Element     | Simple use             | More complex           |
| name        |                        |                        |
+-------------+------------------------+------------------------+
| ul          |  - Item 1: item 1 is a |  - Item 1: item 1 is a |
|             |    long item, to see   |    long item, to see   |
|             |    how the wrapping    |    how the wrapping    |
|             |    behave, see if we   |    behave, see if we   |
|             |    have a nice         |    have a nice         |
|             |    identification      |    identification      |
|             |    below the prefix.   |    below the prefix.   |
|             |  - Item 2: short item  |  - Item 2: I contain   |
|             |    to see              |    another list:       |
|             |  - Item 3              |     - Sub-item 1       |
|             |                        |     - Sub-item 2       |
|             |                        |  - Item 3              |
+-------------+------------------------+------------------------+
| ol          |  0. Item 1: item 1 is  |  0. Item 1: item 1 is  |
|             |     a long item, to    |     a long item, to    |
|             |     see how the        |     see how the        |
|             |     wrapping behave,   |     wrapping behave,   |
|             |     see if we have a   |     see if we have a   |
|             |     nice               |     nice               |
|             |     identification     |     identification     |
|             |     below the prefix.  |     below the prefix.  |
|             |  1. Item 2: short item |  1. Item 2: I contain  |
|             |     to see             |     another list:      |
|             |  2. Item 3             |      - Sub-item 1      |
|             |                        |      - Sub-item 2      |
|             |                        |  2. Item 3             |
+-------------+------------------------+------------------------+
| dl          | first term             | first term             |
|             |   Some definition      |   Some definition      |
|             | second term            |   Another definition   |
|             |   Another definition   |   for the same term.   |
|             |                        |   The description is   |
|             |                        |   long test wrapping   |
|             |                        |   ass well.            |
|             |                        | second term            |
|             |                        |   Another definition   |
|             |                        | third term with        |
|             |                        | embedded dl            |
|             |                        |   sub-term             |
|             |                        |     A sub-definition   |
|             |                        | fourth term            |
|             |                        |   Definition for the   |
|             |                        |   fourth term.         |
+-------------+------------------------+------------------------+
| image       | Alternative text       | Alternative text set   |
|             | describing the DITA-OT | as attribute, which is |
|             | logo                   | depcreated but we      |
|             |                        | still support          |
+-------------+------------------------+------------------------+
| lines       | This                   |                        |
|             | is                     |                        |
|             | a                      |                        |
|             | lines                  |                        |
|             | element                |                        |
|             | And   this   line      |                        |
|             | has   3   spaces       |                        |
|             | between   each   word. |                        |
+-------------+------------------------+------------------------+
| table       | Table within table                              |
|             | +----------------------+----------------------+ |
|             | | Name                 | Role                 | |
|             | +----------------------+----------------------+ |
|             | | Guillaume            | Dev                  | |
|             | +----------------------+----------------------+ |
|             | | John                 | PO                   | |
|             | +----------------------+----------------------+ |
|             | | Jane                 | PM                   | |
|             | +----------------------+----------------------+ |
+-------------+-------------------------------------------------+
| syntax      | >>-+---------------+------------------------->< |
| diagram     |    '-required_item-'                            |
+-------------+-------------------------------------------------+
| long syntax | >>-required_item------------------------------> |
| diagram     | >-+--------------------------------------+--->< |
|             |   |                  .-default_choice--. |      |
|             |   +-optional_choice--+-required_choice-+-+      |
|             |   |                  '-required_choice-' |      |
|             |   |                  .-default_choice--. |      |
|             |   '-optional_choice--+-required_choice-+-'      |
|             |                      '-required_choice-'        |
+-------------+-------------------------------------------------+
```

## Feature support for Syntax diagrams

Here are some examples of Syntax diagram rendered with this plugin:

```
>>-required_item--+------------------------------------------+-><
                  |                  .-default_c-------.     |   
                  +-optional_choice--+-required_choice-+-----+   
                  |                  '-required_choice-'     |   
                  |                  .-default_long_choice-. |   
                  '-optional_choice--+-required_choice-----+-'   
                                     '-required_choice-----'     

                  .-,---------------.                            
                  V                 |                            
>>-required_item----repeatable_item-+--------------------------><

                  .------------------------------------------.   
                  V                  .-default_long_choice-. |   
>>-required_item----repeatable_item--+-required_choice-----+-+-><
                                     '-required_choice-----'     
```

## Implementation

This plugin uses two extension points of the Text transform.

 1. The `dita.xsl.text.ast` XSL extension point, to import its own XSLT extracting the element we want to process
    separately: (DITA tables  and Syntax Diagrams) during step 1 of the text transform, which is the
    DITA to AST conversion.
 2. The `depend.org.dita.text.pre` Ant depend injection point, to run its own `table2ascii` Ant target, which:
      a. processes all temporary file extracted in step 1 (during the DITA -> AST transform) to generate an ASCII Art
         version of them in a text output file.
      b. re-insert the generated text within the AST as `text` element, so they can be outputted as such in the final
         text file

Note that the `table2ascii` checks for the availability on `node` in the PATH, and does nothing is it isn't present.

## Typescript implementation

The core of the implementation is preset in the `ts/src` folder. The main entry file is `text-to-dita.ts`, which takes
the command line parameters to know which input file to process, which output file to output the text output to, and some
other various parameter line the line length, or trademark option.

The typescript implementation is done directly used by the DITA-OT plugin. The DITA-OT plugin used the compile version in
the `ts/dist` folder. This is why you should always run `npm run build` before pushing to Git, so the plugin can be
installed and use in a DITA-OT distribution. You should also clean the dev dependencies before pushing, see the *Contribution*
at the end of this README.

The main entry point is `src/dita-to-text.ts`. This file can be called with command line arguments. Tow are positional, as:

```
node dist/dita-to-text.js <input_file> <output_file>
```

Some are named, such as :

```
node dist/dita-to-text.js <input_file> <output_file> --line-length=65
```

Here is the full list of options:

| Name | Default | Description |
| ------------- | ----------------------- | ----------------------- |
| --line-length=<length> | 65 | Line length available fot the text |
| --no-tm=true | false | Disable the trademark signs in the output |

This file also takes care of parsing the DITA file provided as input, using `fast-xml-parser`, and renders it.

The DitaRenderer class takes care of the rendering. It is mapping element to their rendering method. It provides some useful rendering methods,
that can be used by others renderers, such as:
 - `renderElement`: renders the element with the mapping registered, or try to find a mapping by inheritance reading the `@class` attributes#
 - `sequenceRenderer`: recursively renders all children of an element
 - `renderRawText`: renders text
 - `wrapText`: wraps the text without breaking words.

Any other class can register function to render elements.  This is how we split the complexity in sub-classes dedicated only some elements. Those
classes are all within the src/renderers folder. Here is the list of the renderer at this day:
 1. `CommonElement.ts`: Renders all common elements from DITA, not linked to a specific domain
 2. `DitaTables.ts`: Renders CALS table and simple tables
 3. `SyntaxDiagram.ts`: Renders syntax diagrams

The fact that classes can register themselves prevent dependency cycle, since those renderers classes also need the basic methods from the DitaRenderer to
do their own rendering. This means we normal modules, they would need to import each others, while DitaRenderer doesn't need to import the renderer when
they are being registered.

More explanation on how this rendering is happening, especially for tables and syntax diagram, which are somehow complex, is given in comments at the beginning
of the rendering files and on each method.


## Contribution

Before pushing this to GitHub, make sure to run:

```
cd ts
npm run build
```

This will make sure that the compiled version of the script (`dist/dita-to-text.js`) is up-to-date with the code. The compile code needs to be committed
because that is what the dita-ot is calling from Ant.
