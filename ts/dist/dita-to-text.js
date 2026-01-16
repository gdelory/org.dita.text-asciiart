"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/kind-of/index.js
var require_kind_of = __commonJS({
  "node_modules/kind-of/index.js"(exports2, module2) {
    var toString = Object.prototype.toString;
    module2.exports = function kindOf(val) {
      var type = typeof val;
      if (type === "undefined") {
        return "undefined";
      }
      if (val === null) {
        return "null";
      }
      if (val === true || val === false || val instanceof Boolean) {
        return "boolean";
      }
      if (type === "string" || val instanceof String) {
        return "string";
      }
      if (type === "number" || val instanceof Number) {
        return "number";
      }
      if (type === "function" || val instanceof Function) {
        if (typeof val.constructor.name !== "undefined" && val.constructor.name.slice(0, 9) === "Generator") {
          return "generatorfunction";
        }
        return "function";
      }
      if (typeof Array.isArray !== "undefined" && Array.isArray(val)) {
        return "array";
      }
      if (val instanceof RegExp) {
        return "regexp";
      }
      if (val instanceof Date) {
        return "date";
      }
      type = toString.call(val);
      if (type === "[object RegExp]") {
        return "regexp";
      }
      if (type === "[object Date]") {
        return "date";
      }
      if (type === "[object Arguments]") {
        return "arguments";
      }
      if (type === "[object Error]") {
        return "error";
      }
      if (type === "[object Promise]") {
        return "promise";
      }
      if (isBuffer(val)) {
        return "buffer";
      }
      if (type === "[object Set]") {
        return "set";
      }
      if (type === "[object WeakSet]") {
        return "weakset";
      }
      if (type === "[object Map]") {
        return "map";
      }
      if (type === "[object WeakMap]") {
        return "weakmap";
      }
      if (type === "[object Symbol]") {
        return "symbol";
      }
      if (type === "[object Map Iterator]") {
        return "mapiterator";
      }
      if (type === "[object Set Iterator]") {
        return "setiterator";
      }
      if (type === "[object String Iterator]") {
        return "stringiterator";
      }
      if (type === "[object Array Iterator]") {
        return "arrayiterator";
      }
      if (type === "[object Int8Array]") {
        return "int8array";
      }
      if (type === "[object Uint8Array]") {
        return "uint8array";
      }
      if (type === "[object Uint8ClampedArray]") {
        return "uint8clampedarray";
      }
      if (type === "[object Int16Array]") {
        return "int16array";
      }
      if (type === "[object Uint16Array]") {
        return "uint16array";
      }
      if (type === "[object Int32Array]") {
        return "int32array";
      }
      if (type === "[object Uint32Array]") {
        return "uint32array";
      }
      if (type === "[object Float32Array]") {
        return "float32array";
      }
      if (type === "[object Float64Array]") {
        return "float64array";
      }
      return "object";
    };
    function isBuffer(val) {
      return val.constructor && typeof val.constructor.isBuffer === "function" && val.constructor.isBuffer(val);
    }
  }
});

// node_modules/repeat-string/index.js
var require_repeat_string = __commonJS({
  "node_modules/repeat-string/index.js"(exports2, module2) {
    "use strict";
    var res = "";
    var cache;
    module2.exports = repeat;
    function repeat(str, num) {
      if (typeof str !== "string") {
        throw new TypeError("expected a string");
      }
      if (num === 1) return str;
      if (num === 2) return str + str;
      var max = str.length * num;
      if (cache !== str || typeof cache === "undefined") {
        cache = str;
        res = "";
      } else if (res.length >= max) {
        return res.substr(0, max);
      }
      while (max > res.length && num > 1) {
        if (num & 1) {
          res += str;
        }
        num >>= 1;
        str += str;
      }
      res += str;
      res = res.substr(0, max);
      return res;
    }
  }
});

// node_modules/longest/index.js
var require_longest = __commonJS({
  "node_modules/longest/index.js"(exports2, module2) {
    "use strict";
    module2.exports = function(arr) {
      if (!Array.isArray(arr)) {
        throw new TypeError("expected an array");
      }
      var len = arr.length;
      if (len === 0) {
        return void 0;
      }
      var val = arr[0];
      if (typeof val === "number") {
        val = String(val);
      }
      var longest = val.length;
      var idx = 0;
      while (++idx < len) {
        var ele = arr[idx];
        if (ele == null) {
          continue;
        }
        if (typeof ele === "number") {
          ele = String(ele);
        }
        var elen = ele.length;
        if (typeof elen !== "number") {
          continue;
        }
        if (elen > longest) {
          longest = elen;
          val = ele;
        }
      }
      return val;
    };
  }
});

// node_modules/align-text/index.js
var require_align_text = __commonJS({
  "node_modules/align-text/index.js"(exports2, module2) {
    "use strict";
    var typeOf = require_kind_of();
    var repeat = require_repeat_string();
    var longest = require_longest();
    module2.exports = function alignText(val, fn) {
      var originalType = typeOf(val);
      var lines = val;
      if (originalType === "string") {
        lines = val.split(/(?:\r\n|\n)/);
      } else if (originalType !== "array") {
        throw new TypeError("align-text expects a string or array.");
      }
      var fnType = typeOf(fn);
      var max = longest(lines);
      var len = lines.length;
      var idx = -1;
      var res = [];
      while (++idx < len) {
        var line = String(lines[idx]);
        var diff;
        if (fnType === "function") {
          diff = fn(line.length, max.length, line, lines, idx);
        } else if (fnType === "number") {
          diff = fn;
        } else {
          diff = max.length - line.length;
        }
        if (typeOf(diff) === "number") {
          res.push(repeat(" ", diff) + line);
        } else if (typeOf(diff) === "object") {
          var result = repeat(diff.character || " ", diff.indent || 0);
          res.push((diff.prefix || "") + result + line);
        }
      }
      if (originalType === "array") return res;
      return res.join("\n");
    };
  }
});

// src/dita-to-text.ts
var import_fs = require("fs");

// node_modules/fast-xml-parser/src/util.js
var nameStartChar = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
var nameChar = nameStartChar + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
var nameRegexp = "[" + nameStartChar + "][" + nameChar + "]*";
var regexName = new RegExp("^" + nameRegexp + "$");
function getAllMatches(string, regex) {
  const matches = [];
  let match = regex.exec(string);
  while (match) {
    const allmatches = [];
    allmatches.startIndex = regex.lastIndex - match[0].length;
    const len = match.length;
    for (let index = 0; index < len; index++) {
      allmatches.push(match[index]);
    }
    matches.push(allmatches);
    match = regex.exec(string);
  }
  return matches;
}
var isName = function(string) {
  const match = regexName.exec(string);
  return !(match === null || typeof match === "undefined");
};
function isExist(v) {
  return typeof v !== "undefined";
}

// node_modules/fast-xml-parser/src/validator.js
var defaultOptions = {
  allowBooleanAttributes: false,
  //A tag can have attributes without any value
  unpairedTags: []
};
function validate(xmlData, options) {
  options = Object.assign({}, defaultOptions, options);
  const tags = [];
  let tagFound = false;
  let reachedRoot = false;
  if (xmlData[0] === "\uFEFF") {
    xmlData = xmlData.substr(1);
  }
  for (let i = 0; i < xmlData.length; i++) {
    if (xmlData[i] === "<" && xmlData[i + 1] === "?") {
      i += 2;
      i = readPI(xmlData, i);
      if (i.err) return i;
    } else if (xmlData[i] === "<") {
      let tagStartPos = i;
      i++;
      if (xmlData[i] === "!") {
        i = readCommentAndCDATA(xmlData, i);
        continue;
      } else {
        let closingTag = false;
        if (xmlData[i] === "/") {
          closingTag = true;
          i++;
        }
        let tagName = "";
        for (; i < xmlData.length && xmlData[i] !== ">" && xmlData[i] !== " " && xmlData[i] !== "	" && xmlData[i] !== "\n" && xmlData[i] !== "\r"; i++) {
          tagName += xmlData[i];
        }
        tagName = tagName.trim();
        if (tagName[tagName.length - 1] === "/") {
          tagName = tagName.substring(0, tagName.length - 1);
          i--;
        }
        if (!validateTagName(tagName)) {
          let msg;
          if (tagName.trim().length === 0) {
            msg = "Invalid space after '<'.";
          } else {
            msg = "Tag '" + tagName + "' is an invalid name.";
          }
          return getErrorObject("InvalidTag", msg, getLineNumberForPosition(xmlData, i));
        }
        const result = readAttributeStr(xmlData, i);
        if (result === false) {
          return getErrorObject("InvalidAttr", "Attributes for '" + tagName + "' have open quote.", getLineNumberForPosition(xmlData, i));
        }
        let attrStr = result.value;
        i = result.index;
        if (attrStr[attrStr.length - 1] === "/") {
          const attrStrStart = i - attrStr.length;
          attrStr = attrStr.substring(0, attrStr.length - 1);
          const isValid = validateAttributeString(attrStr, options);
          if (isValid === true) {
            tagFound = true;
          } else {
            return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid.err.line));
          }
        } else if (closingTag) {
          if (!result.tagClosed) {
            return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' doesn't have proper closing.", getLineNumberForPosition(xmlData, i));
          } else if (attrStr.trim().length > 0) {
            return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
          } else if (tags.length === 0) {
            return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' has not been opened.", getLineNumberForPosition(xmlData, tagStartPos));
          } else {
            const otg = tags.pop();
            if (tagName !== otg.tagName) {
              let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
              return getErrorObject(
                "InvalidTag",
                "Expected closing tag '" + otg.tagName + "' (opened in line " + openPos.line + ", col " + openPos.col + ") instead of closing tag '" + tagName + "'.",
                getLineNumberForPosition(xmlData, tagStartPos)
              );
            }
            if (tags.length == 0) {
              reachedRoot = true;
            }
          }
        } else {
          const isValid = validateAttributeString(attrStr, options);
          if (isValid !== true) {
            return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i - attrStr.length + isValid.err.line));
          }
          if (reachedRoot === true) {
            return getErrorObject("InvalidXml", "Multiple possible root nodes found.", getLineNumberForPosition(xmlData, i));
          } else if (options.unpairedTags.indexOf(tagName) !== -1) {
          } else {
            tags.push({ tagName, tagStartPos });
          }
          tagFound = true;
        }
        for (i++; i < xmlData.length; i++) {
          if (xmlData[i] === "<") {
            if (xmlData[i + 1] === "!") {
              i++;
              i = readCommentAndCDATA(xmlData, i);
              continue;
            } else if (xmlData[i + 1] === "?") {
              i = readPI(xmlData, ++i);
              if (i.err) return i;
            } else {
              break;
            }
          } else if (xmlData[i] === "&") {
            const afterAmp = validateAmpersand(xmlData, i);
            if (afterAmp == -1)
              return getErrorObject("InvalidChar", "char '&' is not expected.", getLineNumberForPosition(xmlData, i));
            i = afterAmp;
          } else {
            if (reachedRoot === true && !isWhiteSpace(xmlData[i])) {
              return getErrorObject("InvalidXml", "Extra text at the end", getLineNumberForPosition(xmlData, i));
            }
          }
        }
        if (xmlData[i] === "<") {
          i--;
        }
      }
    } else {
      if (isWhiteSpace(xmlData[i])) {
        continue;
      }
      return getErrorObject("InvalidChar", "char '" + xmlData[i] + "' is not expected.", getLineNumberForPosition(xmlData, i));
    }
  }
  if (!tagFound) {
    return getErrorObject("InvalidXml", "Start tag expected.", 1);
  } else if (tags.length == 1) {
    return getErrorObject("InvalidTag", "Unclosed tag '" + tags[0].tagName + "'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
  } else if (tags.length > 0) {
    return getErrorObject("InvalidXml", "Invalid '" + JSON.stringify(tags.map((t) => t.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 });
  }
  return true;
}
function isWhiteSpace(char) {
  return char === " " || char === "	" || char === "\n" || char === "\r";
}
function readPI(xmlData, i) {
  const start = i;
  for (; i < xmlData.length; i++) {
    if (xmlData[i] == "?" || xmlData[i] == " ") {
      const tagname = xmlData.substr(start, i - start);
      if (i > 5 && tagname === "xml") {
        return getErrorObject("InvalidXml", "XML declaration allowed only at the start of the document.", getLineNumberForPosition(xmlData, i));
      } else if (xmlData[i] == "?" && xmlData[i + 1] == ">") {
        i++;
        break;
      } else {
        continue;
      }
    }
  }
  return i;
}
function readCommentAndCDATA(xmlData, i) {
  if (xmlData.length > i + 5 && xmlData[i + 1] === "-" && xmlData[i + 2] === "-") {
    for (i += 3; i < xmlData.length; i++) {
      if (xmlData[i] === "-" && xmlData[i + 1] === "-" && xmlData[i + 2] === ">") {
        i += 2;
        break;
      }
    }
  } else if (xmlData.length > i + 8 && xmlData[i + 1] === "D" && xmlData[i + 2] === "O" && xmlData[i + 3] === "C" && xmlData[i + 4] === "T" && xmlData[i + 5] === "Y" && xmlData[i + 6] === "P" && xmlData[i + 7] === "E") {
    let angleBracketsCount = 1;
    for (i += 8; i < xmlData.length; i++) {
      if (xmlData[i] === "<") {
        angleBracketsCount++;
      } else if (xmlData[i] === ">") {
        angleBracketsCount--;
        if (angleBracketsCount === 0) {
          break;
        }
      }
    }
  } else if (xmlData.length > i + 9 && xmlData[i + 1] === "[" && xmlData[i + 2] === "C" && xmlData[i + 3] === "D" && xmlData[i + 4] === "A" && xmlData[i + 5] === "T" && xmlData[i + 6] === "A" && xmlData[i + 7] === "[") {
    for (i += 8; i < xmlData.length; i++) {
      if (xmlData[i] === "]" && xmlData[i + 1] === "]" && xmlData[i + 2] === ">") {
        i += 2;
        break;
      }
    }
  }
  return i;
}
var doubleQuote = '"';
var singleQuote = "'";
function readAttributeStr(xmlData, i) {
  let attrStr = "";
  let startChar = "";
  let tagClosed = false;
  for (; i < xmlData.length; i++) {
    if (xmlData[i] === doubleQuote || xmlData[i] === singleQuote) {
      if (startChar === "") {
        startChar = xmlData[i];
      } else if (startChar !== xmlData[i]) {
      } else {
        startChar = "";
      }
    } else if (xmlData[i] === ">") {
      if (startChar === "") {
        tagClosed = true;
        break;
      }
    }
    attrStr += xmlData[i];
  }
  if (startChar !== "") {
    return false;
  }
  return {
    value: attrStr,
    index: i,
    tagClosed
  };
}
var validAttrStrRegxp = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
function validateAttributeString(attrStr, options) {
  const matches = getAllMatches(attrStr, validAttrStrRegxp);
  const attrNames = {};
  for (let i = 0; i < matches.length; i++) {
    if (matches[i][1].length === 0) {
      return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' has no space in starting.", getPositionFromMatch(matches[i]));
    } else if (matches[i][3] !== void 0 && matches[i][4] === void 0) {
      return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' is without value.", getPositionFromMatch(matches[i]));
    } else if (matches[i][3] === void 0 && !options.allowBooleanAttributes) {
      return getErrorObject("InvalidAttr", "boolean attribute '" + matches[i][2] + "' is not allowed.", getPositionFromMatch(matches[i]));
    }
    const attrName = matches[i][2];
    if (!validateAttrName(attrName)) {
      return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is an invalid name.", getPositionFromMatch(matches[i]));
    }
    if (!attrNames.hasOwnProperty(attrName)) {
      attrNames[attrName] = 1;
    } else {
      return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is repeated.", getPositionFromMatch(matches[i]));
    }
  }
  return true;
}
function validateNumberAmpersand(xmlData, i) {
  let re = /\d/;
  if (xmlData[i] === "x") {
    i++;
    re = /[\da-fA-F]/;
  }
  for (; i < xmlData.length; i++) {
    if (xmlData[i] === ";")
      return i;
    if (!xmlData[i].match(re))
      break;
  }
  return -1;
}
function validateAmpersand(xmlData, i) {
  i++;
  if (xmlData[i] === ";")
    return -1;
  if (xmlData[i] === "#") {
    i++;
    return validateNumberAmpersand(xmlData, i);
  }
  let count = 0;
  for (; i < xmlData.length; i++, count++) {
    if (xmlData[i].match(/\w/) && count < 20)
      continue;
    if (xmlData[i] === ";")
      break;
    return -1;
  }
  return i;
}
function getErrorObject(code, message, lineNumber) {
  return {
    err: {
      code,
      msg: message,
      line: lineNumber.line || lineNumber,
      col: lineNumber.col
    }
  };
}
function validateAttrName(attrName) {
  return isName(attrName);
}
function validateTagName(tagname) {
  return isName(tagname);
}
function getLineNumberForPosition(xmlData, index) {
  const lines = xmlData.substring(0, index).split(/\r?\n/);
  return {
    line: lines.length,
    // column number is last line's length + 1, because column numbering starts at 1:
    col: lines[lines.length - 1].length + 1
  };
}
function getPositionFromMatch(match) {
  return match.startIndex + match[1].length;
}

// node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js
var defaultOptions2 = {
  preserveOrder: false,
  attributeNamePrefix: "@_",
  attributesGroupName: false,
  textNodeName: "#text",
  ignoreAttributes: true,
  removeNSPrefix: false,
  // remove NS from tag name or attribute name if true
  allowBooleanAttributes: false,
  //a tag can have attributes without any value
  //ignoreRootElement : false,
  parseTagValue: true,
  parseAttributeValue: false,
  trimValues: true,
  //Trim string values of tag and attributes
  cdataPropName: false,
  numberParseOptions: {
    hex: true,
    leadingZeros: true,
    eNotation: true
  },
  tagValueProcessor: function(tagName, val) {
    return val;
  },
  attributeValueProcessor: function(attrName, val) {
    return val;
  },
  stopNodes: [],
  //nested tags will not be parsed even for errors
  alwaysCreateTextNode: false,
  isArray: () => false,
  commentPropName: false,
  unpairedTags: [],
  processEntities: true,
  htmlEntities: false,
  ignoreDeclaration: false,
  ignorePiTags: false,
  transformTagName: false,
  transformAttributeName: false,
  updateTag: function(tagName, jPath, attrs) {
    return tagName;
  },
  // skipEmptyListItem: false
  captureMetaData: false
};
var buildOptions = function(options) {
  return Object.assign({}, defaultOptions2, options);
};

// node_modules/fast-xml-parser/src/xmlparser/xmlNode.js
var METADATA_SYMBOL;
if (typeof Symbol !== "function") {
  METADATA_SYMBOL = "@@xmlMetadata";
} else {
  METADATA_SYMBOL = Symbol("XML Node Metadata");
}
var XmlNode = class {
  constructor(tagname) {
    this.tagname = tagname;
    this.child = [];
    this[":@"] = {};
  }
  add(key, val) {
    if (key === "__proto__") key = "#__proto__";
    this.child.push({ [key]: val });
  }
  addChild(node, startIndex) {
    if (node.tagname === "__proto__") node.tagname = "#__proto__";
    if (node[":@"] && Object.keys(node[":@"]).length > 0) {
      this.child.push({ [node.tagname]: node.child, [":@"]: node[":@"] });
    } else {
      this.child.push({ [node.tagname]: node.child });
    }
    if (startIndex !== void 0) {
      this.child[this.child.length - 1][METADATA_SYMBOL] = { startIndex };
    }
  }
  /** symbol used for metadata */
  static getMetaDataSymbol() {
    return METADATA_SYMBOL;
  }
};

// node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js
function readDocType(xmlData, i) {
  const entities = {};
  if (xmlData[i + 3] === "O" && xmlData[i + 4] === "C" && xmlData[i + 5] === "T" && xmlData[i + 6] === "Y" && xmlData[i + 7] === "P" && xmlData[i + 8] === "E") {
    i = i + 9;
    let angleBracketsCount = 1;
    let hasBody = false, comment = false;
    let exp = "";
    for (; i < xmlData.length; i++) {
      if (xmlData[i] === "<" && !comment) {
        if (hasBody && hasSeq(xmlData, "!ENTITY", i)) {
          i += 7;
          let entityName, val;
          [entityName, val, i] = readEntityExp(xmlData, i + 1);
          if (val.indexOf("&") === -1)
            entities[entityName] = {
              regx: RegExp(`&${entityName};`, "g"),
              val
            };
        } else if (hasBody && hasSeq(xmlData, "!ELEMENT", i)) {
          i += 8;
          const { index } = readElementExp(xmlData, i + 1);
          i = index;
        } else if (hasBody && hasSeq(xmlData, "!ATTLIST", i)) {
          i += 8;
        } else if (hasBody && hasSeq(xmlData, "!NOTATION", i)) {
          i += 9;
          const { index } = readNotationExp(xmlData, i + 1);
          i = index;
        } else if (hasSeq(xmlData, "!--", i)) comment = true;
        else throw new Error(`Invalid DOCTYPE`);
        angleBracketsCount++;
        exp = "";
      } else if (xmlData[i] === ">") {
        if (comment) {
          if (xmlData[i - 1] === "-" && xmlData[i - 2] === "-") {
            comment = false;
            angleBracketsCount--;
          }
        } else {
          angleBracketsCount--;
        }
        if (angleBracketsCount === 0) {
          break;
        }
      } else if (xmlData[i] === "[") {
        hasBody = true;
      } else {
        exp += xmlData[i];
      }
    }
    if (angleBracketsCount !== 0) {
      throw new Error(`Unclosed DOCTYPE`);
    }
  } else {
    throw new Error(`Invalid Tag instead of DOCTYPE`);
  }
  return { entities, i };
}
var skipWhitespace = (data, index) => {
  while (index < data.length && /\s/.test(data[index])) {
    index++;
  }
  return index;
};
function readEntityExp(xmlData, i) {
  i = skipWhitespace(xmlData, i);
  let entityName = "";
  while (i < xmlData.length && !/\s/.test(xmlData[i]) && xmlData[i] !== '"' && xmlData[i] !== "'") {
    entityName += xmlData[i];
    i++;
  }
  validateEntityName(entityName);
  i = skipWhitespace(xmlData, i);
  if (xmlData.substring(i, i + 6).toUpperCase() === "SYSTEM") {
    throw new Error("External entities are not supported");
  } else if (xmlData[i] === "%") {
    throw new Error("Parameter entities are not supported");
  }
  let entityValue = "";
  [i, entityValue] = readIdentifierVal(xmlData, i, "entity");
  i--;
  return [entityName, entityValue, i];
}
function readNotationExp(xmlData, i) {
  i = skipWhitespace(xmlData, i);
  let notationName = "";
  while (i < xmlData.length && !/\s/.test(xmlData[i])) {
    notationName += xmlData[i];
    i++;
  }
  validateEntityName(notationName);
  i = skipWhitespace(xmlData, i);
  const identifierType = xmlData.substring(i, i + 6).toUpperCase();
  if (identifierType !== "SYSTEM" && identifierType !== "PUBLIC") {
    throw new Error(`Expected SYSTEM or PUBLIC, found "${identifierType}"`);
  }
  i += identifierType.length;
  i = skipWhitespace(xmlData, i);
  let publicIdentifier = null;
  let systemIdentifier = null;
  if (identifierType === "PUBLIC") {
    [i, publicIdentifier] = readIdentifierVal(xmlData, i, "publicIdentifier");
    i = skipWhitespace(xmlData, i);
    if (xmlData[i] === '"' || xmlData[i] === "'") {
      [i, systemIdentifier] = readIdentifierVal(xmlData, i, "systemIdentifier");
    }
  } else if (identifierType === "SYSTEM") {
    [i, systemIdentifier] = readIdentifierVal(xmlData, i, "systemIdentifier");
    if (!systemIdentifier) {
      throw new Error("Missing mandatory system identifier for SYSTEM notation");
    }
  }
  return { notationName, publicIdentifier, systemIdentifier, index: --i };
}
function readIdentifierVal(xmlData, i, type) {
  let identifierVal = "";
  const startChar = xmlData[i];
  if (startChar !== '"' && startChar !== "'") {
    throw new Error(`Expected quoted string, found "${startChar}"`);
  }
  i++;
  while (i < xmlData.length && xmlData[i] !== startChar) {
    identifierVal += xmlData[i];
    i++;
  }
  if (xmlData[i] !== startChar) {
    throw new Error(`Unterminated ${type} value`);
  }
  i++;
  return [i, identifierVal];
}
function readElementExp(xmlData, i) {
  i = skipWhitespace(xmlData, i);
  let elementName = "";
  while (i < xmlData.length && !/\s/.test(xmlData[i])) {
    elementName += xmlData[i];
    i++;
  }
  if (!validateEntityName(elementName)) {
    throw new Error(`Invalid element name: "${elementName}"`);
  }
  i = skipWhitespace(xmlData, i);
  let contentModel = "";
  if (xmlData[i] === "E" && hasSeq(xmlData, "MPTY", i)) i += 4;
  else if (xmlData[i] === "A" && hasSeq(xmlData, "NY", i)) i += 2;
  else if (xmlData[i] === "(") {
    i++;
    while (i < xmlData.length && xmlData[i] !== ")") {
      contentModel += xmlData[i];
      i++;
    }
    if (xmlData[i] !== ")") {
      throw new Error("Unterminated content model");
    }
  } else {
    throw new Error(`Invalid Element Expression, found "${xmlData[i]}"`);
  }
  return {
    elementName,
    contentModel: contentModel.trim(),
    index: i
  };
}
function hasSeq(data, seq, i) {
  for (let j = 0; j < seq.length; j++) {
    if (seq[j] !== data[i + j + 1]) return false;
  }
  return true;
}
function validateEntityName(name) {
  if (isName(name))
    return name;
  else
    throw new Error(`Invalid entity name ${name}`);
}

// node_modules/strnum/strnum.js
var hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
var numRegex = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/;
var consider = {
  hex: true,
  // oct: false,
  leadingZeros: true,
  decimalPoint: ".",
  eNotation: true
  //skipLike: /regex/
};
function toNumber(str, options = {}) {
  options = Object.assign({}, consider, options);
  if (!str || typeof str !== "string") return str;
  let trimmedStr = str.trim();
  if (options.skipLike !== void 0 && options.skipLike.test(trimmedStr)) return str;
  else if (str === "0") return 0;
  else if (options.hex && hexRegex.test(trimmedStr)) {
    return parse_int(trimmedStr, 16);
  } else if (trimmedStr.search(/.+[eE].+/) !== -1) {
    return resolveEnotation(str, trimmedStr, options);
  } else {
    const match = numRegex.exec(trimmedStr);
    if (match) {
      const sign = match[1] || "";
      const leadingZeros = match[2];
      let numTrimmedByZeros = trimZeros(match[3]);
      const decimalAdjacentToLeadingZeros = sign ? (
        // 0., -00., 000.
        str[leadingZeros.length + 1] === "."
      ) : str[leadingZeros.length] === ".";
      if (!options.leadingZeros && (leadingZeros.length > 1 || leadingZeros.length === 1 && !decimalAdjacentToLeadingZeros)) {
        return str;
      } else {
        const num = Number(trimmedStr);
        const parsedStr = String(num);
        if (num === 0) return num;
        if (parsedStr.search(/[eE]/) !== -1) {
          if (options.eNotation) return num;
          else return str;
        } else if (trimmedStr.indexOf(".") !== -1) {
          if (parsedStr === "0") return num;
          else if (parsedStr === numTrimmedByZeros) return num;
          else if (parsedStr === `${sign}${numTrimmedByZeros}`) return num;
          else return str;
        }
        let n = leadingZeros ? numTrimmedByZeros : trimmedStr;
        if (leadingZeros) {
          return n === parsedStr || sign + n === parsedStr ? num : str;
        } else {
          return n === parsedStr || n === sign + parsedStr ? num : str;
        }
      }
    } else {
      return str;
    }
  }
}
var eNotationRegx = /^([-+])?(0*)(\d*(\.\d*)?[eE][-\+]?\d+)$/;
function resolveEnotation(str, trimmedStr, options) {
  if (!options.eNotation) return str;
  const notation = trimmedStr.match(eNotationRegx);
  if (notation) {
    let sign = notation[1] || "";
    const eChar = notation[3].indexOf("e") === -1 ? "E" : "e";
    const leadingZeros = notation[2];
    const eAdjacentToLeadingZeros = sign ? (
      // 0E.
      str[leadingZeros.length + 1] === eChar
    ) : str[leadingZeros.length] === eChar;
    if (leadingZeros.length > 1 && eAdjacentToLeadingZeros) return str;
    else if (leadingZeros.length === 1 && (notation[3].startsWith(`.${eChar}`) || notation[3][0] === eChar)) {
      return Number(trimmedStr);
    } else if (options.leadingZeros && !eAdjacentToLeadingZeros) {
      trimmedStr = (notation[1] || "") + notation[3];
      return Number(trimmedStr);
    } else return str;
  } else {
    return str;
  }
}
function trimZeros(numStr) {
  if (numStr && numStr.indexOf(".") !== -1) {
    numStr = numStr.replace(/0+$/, "");
    if (numStr === ".") numStr = "0";
    else if (numStr[0] === ".") numStr = "0" + numStr;
    else if (numStr[numStr.length - 1] === ".") numStr = numStr.substring(0, numStr.length - 1);
    return numStr;
  }
  return numStr;
}
function parse_int(numStr, base) {
  if (parseInt) return parseInt(numStr, base);
  else if (Number.parseInt) return Number.parseInt(numStr, base);
  else if (window && window.parseInt) return window.parseInt(numStr, base);
  else throw new Error("parseInt, Number.parseInt, window.parseInt are not supported");
}

// node_modules/fast-xml-parser/src/ignoreAttributes.js
function getIgnoreAttributesFn(ignoreAttributes) {
  if (typeof ignoreAttributes === "function") {
    return ignoreAttributes;
  }
  if (Array.isArray(ignoreAttributes)) {
    return (attrName) => {
      for (const pattern of ignoreAttributes) {
        if (typeof pattern === "string" && attrName === pattern) {
          return true;
        }
        if (pattern instanceof RegExp && pattern.test(attrName)) {
          return true;
        }
      }
    };
  }
  return () => false;
}

// node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js
var OrderedObjParser = class {
  constructor(options) {
    this.options = options;
    this.currentNode = null;
    this.tagsNodeStack = [];
    this.docTypeEntities = {};
    this.lastEntities = {
      "apos": { regex: /&(apos|#39|#x27);/g, val: "'" },
      "gt": { regex: /&(gt|#62|#x3E);/g, val: ">" },
      "lt": { regex: /&(lt|#60|#x3C);/g, val: "<" },
      "quot": { regex: /&(quot|#34|#x22);/g, val: '"' }
    };
    this.ampEntity = { regex: /&(amp|#38|#x26);/g, val: "&" };
    this.htmlEntities = {
      "space": { regex: /&(nbsp|#160);/g, val: " " },
      // "lt" : { regex: /&(lt|#60);/g, val: "<" },
      // "gt" : { regex: /&(gt|#62);/g, val: ">" },
      // "amp" : { regex: /&(amp|#38);/g, val: "&" },
      // "quot" : { regex: /&(quot|#34);/g, val: "\"" },
      // "apos" : { regex: /&(apos|#39);/g, val: "'" },
      "cent": { regex: /&(cent|#162);/g, val: "\xA2" },
      "pound": { regex: /&(pound|#163);/g, val: "\xA3" },
      "yen": { regex: /&(yen|#165);/g, val: "\xA5" },
      "euro": { regex: /&(euro|#8364);/g, val: "\u20AC" },
      "copyright": { regex: /&(copy|#169);/g, val: "\xA9" },
      "reg": { regex: /&(reg|#174);/g, val: "\xAE" },
      "inr": { regex: /&(inr|#8377);/g, val: "\u20B9" },
      "num_dec": { regex: /&#([0-9]{1,7});/g, val: (_, str) => String.fromCodePoint(Number.parseInt(str, 10)) },
      "num_hex": { regex: /&#x([0-9a-fA-F]{1,6});/g, val: (_, str) => String.fromCodePoint(Number.parseInt(str, 16)) }
    };
    this.addExternalEntities = addExternalEntities;
    this.parseXml = parseXml;
    this.parseTextData = parseTextData;
    this.resolveNameSpace = resolveNameSpace;
    this.buildAttributesMap = buildAttributesMap;
    this.isItStopNode = isItStopNode;
    this.replaceEntitiesValue = replaceEntitiesValue;
    this.readStopNodeData = readStopNodeData;
    this.saveTextToParentTag = saveTextToParentTag;
    this.addChild = addChild;
    this.ignoreAttributesFn = getIgnoreAttributesFn(this.options.ignoreAttributes);
  }
};
function addExternalEntities(externalEntities) {
  const entKeys = Object.keys(externalEntities);
  for (let i = 0; i < entKeys.length; i++) {
    const ent = entKeys[i];
    this.lastEntities[ent] = {
      regex: new RegExp("&" + ent + ";", "g"),
      val: externalEntities[ent]
    };
  }
}
function parseTextData(val, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
  if (val !== void 0) {
    if (this.options.trimValues && !dontTrim) {
      val = val.trim();
    }
    if (val.length > 0) {
      if (!escapeEntities) val = this.replaceEntitiesValue(val);
      const newval = this.options.tagValueProcessor(tagName, val, jPath, hasAttributes, isLeafNode);
      if (newval === null || newval === void 0) {
        return val;
      } else if (typeof newval !== typeof val || newval !== val) {
        return newval;
      } else if (this.options.trimValues) {
        return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
      } else {
        const trimmedVal = val.trim();
        if (trimmedVal === val) {
          return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
        } else {
          return val;
        }
      }
    }
  }
}
function resolveNameSpace(tagname) {
  if (this.options.removeNSPrefix) {
    const tags = tagname.split(":");
    const prefix = tagname.charAt(0) === "/" ? "/" : "";
    if (tags[0] === "xmlns") {
      return "";
    }
    if (tags.length === 2) {
      tagname = prefix + tags[1];
    }
  }
  return tagname;
}
var attrsRegx = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");
function buildAttributesMap(attrStr, jPath, tagName) {
  if (this.options.ignoreAttributes !== true && typeof attrStr === "string") {
    const matches = getAllMatches(attrStr, attrsRegx);
    const len = matches.length;
    const attrs = {};
    for (let i = 0; i < len; i++) {
      const attrName = this.resolveNameSpace(matches[i][1]);
      if (this.ignoreAttributesFn(attrName, jPath)) {
        continue;
      }
      let oldVal = matches[i][4];
      let aName = this.options.attributeNamePrefix + attrName;
      if (attrName.length) {
        if (this.options.transformAttributeName) {
          aName = this.options.transformAttributeName(aName);
        }
        if (aName === "__proto__") aName = "#__proto__";
        if (oldVal !== void 0) {
          if (this.options.trimValues) {
            oldVal = oldVal.trim();
          }
          oldVal = this.replaceEntitiesValue(oldVal);
          const newVal = this.options.attributeValueProcessor(attrName, oldVal, jPath);
          if (newVal === null || newVal === void 0) {
            attrs[aName] = oldVal;
          } else if (typeof newVal !== typeof oldVal || newVal !== oldVal) {
            attrs[aName] = newVal;
          } else {
            attrs[aName] = parseValue(
              oldVal,
              this.options.parseAttributeValue,
              this.options.numberParseOptions
            );
          }
        } else if (this.options.allowBooleanAttributes) {
          attrs[aName] = true;
        }
      }
    }
    if (!Object.keys(attrs).length) {
      return;
    }
    if (this.options.attributesGroupName) {
      const attrCollection = {};
      attrCollection[this.options.attributesGroupName] = attrs;
      return attrCollection;
    }
    return attrs;
  }
}
var parseXml = function(xmlData) {
  xmlData = xmlData.replace(/\r\n?/g, "\n");
  const xmlObj = new XmlNode("!xml");
  let currentNode = xmlObj;
  let textData = "";
  let jPath = "";
  for (let i = 0; i < xmlData.length; i++) {
    const ch = xmlData[i];
    if (ch === "<") {
      if (xmlData[i + 1] === "/") {
        const closeIndex = findClosingIndex(xmlData, ">", i, "Closing Tag is not closed.");
        let tagName = xmlData.substring(i + 2, closeIndex).trim();
        if (this.options.removeNSPrefix) {
          const colonIndex = tagName.indexOf(":");
          if (colonIndex !== -1) {
            tagName = tagName.substr(colonIndex + 1);
          }
        }
        if (this.options.transformTagName) {
          tagName = this.options.transformTagName(tagName);
        }
        if (currentNode) {
          textData = this.saveTextToParentTag(textData, currentNode, jPath);
        }
        const lastTagName = jPath.substring(jPath.lastIndexOf(".") + 1);
        if (tagName && this.options.unpairedTags.indexOf(tagName) !== -1) {
          throw new Error(`Unpaired tag can not be used as closing tag: </${tagName}>`);
        }
        let propIndex = 0;
        if (lastTagName && this.options.unpairedTags.indexOf(lastTagName) !== -1) {
          propIndex = jPath.lastIndexOf(".", jPath.lastIndexOf(".") - 1);
          this.tagsNodeStack.pop();
        } else {
          propIndex = jPath.lastIndexOf(".");
        }
        jPath = jPath.substring(0, propIndex);
        currentNode = this.tagsNodeStack.pop();
        textData = "";
        i = closeIndex;
      } else if (xmlData[i + 1] === "?") {
        let tagData = readTagExp(xmlData, i, false, "?>");
        if (!tagData) throw new Error("Pi Tag is not closed.");
        textData = this.saveTextToParentTag(textData, currentNode, jPath);
        if (this.options.ignoreDeclaration && tagData.tagName === "?xml" || this.options.ignorePiTags) {
        } else {
          const childNode = new XmlNode(tagData.tagName);
          childNode.add(this.options.textNodeName, "");
          if (tagData.tagName !== tagData.tagExp && tagData.attrExpPresent) {
            childNode[":@"] = this.buildAttributesMap(tagData.tagExp, jPath, tagData.tagName);
          }
          this.addChild(currentNode, childNode, jPath, i);
        }
        i = tagData.closeIndex + 1;
      } else if (xmlData.substr(i + 1, 3) === "!--") {
        const endIndex = findClosingIndex(xmlData, "-->", i + 4, "Comment is not closed.");
        if (this.options.commentPropName) {
          const comment = xmlData.substring(i + 4, endIndex - 2);
          textData = this.saveTextToParentTag(textData, currentNode, jPath);
          currentNode.add(this.options.commentPropName, [{ [this.options.textNodeName]: comment }]);
        }
        i = endIndex;
      } else if (xmlData.substr(i + 1, 2) === "!D") {
        const result = readDocType(xmlData, i);
        this.docTypeEntities = result.entities;
        i = result.i;
      } else if (xmlData.substr(i + 1, 2) === "![") {
        const closeIndex = findClosingIndex(xmlData, "]]>", i, "CDATA is not closed.") - 2;
        const tagExp = xmlData.substring(i + 9, closeIndex);
        textData = this.saveTextToParentTag(textData, currentNode, jPath);
        let val = this.parseTextData(tagExp, currentNode.tagname, jPath, true, false, true, true);
        if (val == void 0) val = "";
        if (this.options.cdataPropName) {
          currentNode.add(this.options.cdataPropName, [{ [this.options.textNodeName]: tagExp }]);
        } else {
          currentNode.add(this.options.textNodeName, val);
        }
        i = closeIndex + 2;
      } else {
        let result = readTagExp(xmlData, i, this.options.removeNSPrefix);
        let tagName = result.tagName;
        const rawTagName = result.rawTagName;
        let tagExp = result.tagExp;
        let attrExpPresent = result.attrExpPresent;
        let closeIndex = result.closeIndex;
        if (this.options.transformTagName) {
          tagName = this.options.transformTagName(tagName);
        }
        if (currentNode && textData) {
          if (currentNode.tagname !== "!xml") {
            textData = this.saveTextToParentTag(textData, currentNode, jPath, false);
          }
        }
        const lastTag = currentNode;
        if (lastTag && this.options.unpairedTags.indexOf(lastTag.tagname) !== -1) {
          currentNode = this.tagsNodeStack.pop();
          jPath = jPath.substring(0, jPath.lastIndexOf("."));
        }
        if (tagName !== xmlObj.tagname) {
          jPath += jPath ? "." + tagName : tagName;
        }
        const startIndex = i;
        if (this.isItStopNode(this.options.stopNodes, jPath, tagName)) {
          let tagContent = "";
          if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
            if (tagName[tagName.length - 1] === "/") {
              tagName = tagName.substr(0, tagName.length - 1);
              jPath = jPath.substr(0, jPath.length - 1);
              tagExp = tagName;
            } else {
              tagExp = tagExp.substr(0, tagExp.length - 1);
            }
            i = result.closeIndex;
          } else if (this.options.unpairedTags.indexOf(tagName) !== -1) {
            i = result.closeIndex;
          } else {
            const result2 = this.readStopNodeData(xmlData, rawTagName, closeIndex + 1);
            if (!result2) throw new Error(`Unexpected end of ${rawTagName}`);
            i = result2.i;
            tagContent = result2.tagContent;
          }
          const childNode = new XmlNode(tagName);
          if (tagName !== tagExp && attrExpPresent) {
            childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
          }
          if (tagContent) {
            tagContent = this.parseTextData(tagContent, tagName, jPath, true, attrExpPresent, true, true);
          }
          jPath = jPath.substr(0, jPath.lastIndexOf("."));
          childNode.add(this.options.textNodeName, tagContent);
          this.addChild(currentNode, childNode, jPath, startIndex);
        } else {
          if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
            if (tagName[tagName.length - 1] === "/") {
              tagName = tagName.substr(0, tagName.length - 1);
              jPath = jPath.substr(0, jPath.length - 1);
              tagExp = tagName;
            } else {
              tagExp = tagExp.substr(0, tagExp.length - 1);
            }
            if (this.options.transformTagName) {
              tagName = this.options.transformTagName(tagName);
            }
            const childNode = new XmlNode(tagName);
            if (tagName !== tagExp && attrExpPresent) {
              childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
            }
            this.addChild(currentNode, childNode, jPath, startIndex);
            jPath = jPath.substr(0, jPath.lastIndexOf("."));
          } else {
            const childNode = new XmlNode(tagName);
            this.tagsNodeStack.push(currentNode);
            if (tagName !== tagExp && attrExpPresent) {
              childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
            }
            this.addChild(currentNode, childNode, jPath, startIndex);
            currentNode = childNode;
          }
          textData = "";
          i = closeIndex;
        }
      }
    } else {
      textData += xmlData[i];
    }
  }
  return xmlObj.child;
};
function addChild(currentNode, childNode, jPath, startIndex) {
  if (!this.options.captureMetaData) startIndex = void 0;
  const result = this.options.updateTag(childNode.tagname, jPath, childNode[":@"]);
  if (result === false) {
  } else if (typeof result === "string") {
    childNode.tagname = result;
    currentNode.addChild(childNode, startIndex);
  } else {
    currentNode.addChild(childNode, startIndex);
  }
}
var replaceEntitiesValue = function(val) {
  if (this.options.processEntities) {
    for (let entityName in this.docTypeEntities) {
      const entity = this.docTypeEntities[entityName];
      val = val.replace(entity.regx, entity.val);
    }
    for (let entityName in this.lastEntities) {
      const entity = this.lastEntities[entityName];
      val = val.replace(entity.regex, entity.val);
    }
    if (this.options.htmlEntities) {
      for (let entityName in this.htmlEntities) {
        const entity = this.htmlEntities[entityName];
        val = val.replace(entity.regex, entity.val);
      }
    }
    val = val.replace(this.ampEntity.regex, this.ampEntity.val);
  }
  return val;
};
function saveTextToParentTag(textData, currentNode, jPath, isLeafNode) {
  if (textData) {
    if (isLeafNode === void 0) isLeafNode = currentNode.child.length === 0;
    textData = this.parseTextData(
      textData,
      currentNode.tagname,
      jPath,
      false,
      currentNode[":@"] ? Object.keys(currentNode[":@"]).length !== 0 : false,
      isLeafNode
    );
    if (textData !== void 0 && textData !== "")
      currentNode.add(this.options.textNodeName, textData);
    textData = "";
  }
  return textData;
}
function isItStopNode(stopNodes, jPath, currentTagName) {
  const allNodesExp = "*." + currentTagName;
  for (const stopNodePath in stopNodes) {
    const stopNodeExp = stopNodes[stopNodePath];
    if (allNodesExp === stopNodeExp || jPath === stopNodeExp) return true;
  }
  return false;
}
function tagExpWithClosingIndex(xmlData, i, closingChar = ">") {
  let attrBoundary;
  let tagExp = "";
  for (let index = i; index < xmlData.length; index++) {
    let ch = xmlData[index];
    if (attrBoundary) {
      if (ch === attrBoundary) attrBoundary = "";
    } else if (ch === '"' || ch === "'") {
      attrBoundary = ch;
    } else if (ch === closingChar[0]) {
      if (closingChar[1]) {
        if (xmlData[index + 1] === closingChar[1]) {
          return {
            data: tagExp,
            index
          };
        }
      } else {
        return {
          data: tagExp,
          index
        };
      }
    } else if (ch === "	") {
      ch = " ";
    }
    tagExp += ch;
  }
}
function findClosingIndex(xmlData, str, i, errMsg) {
  const closingIndex = xmlData.indexOf(str, i);
  if (closingIndex === -1) {
    throw new Error(errMsg);
  } else {
    return closingIndex + str.length - 1;
  }
}
function readTagExp(xmlData, i, removeNSPrefix, closingChar = ">") {
  const result = tagExpWithClosingIndex(xmlData, i + 1, closingChar);
  if (!result) return;
  let tagExp = result.data;
  const closeIndex = result.index;
  const separatorIndex = tagExp.search(/\s/);
  let tagName = tagExp;
  let attrExpPresent = true;
  if (separatorIndex !== -1) {
    tagName = tagExp.substring(0, separatorIndex);
    tagExp = tagExp.substring(separatorIndex + 1).trimStart();
  }
  const rawTagName = tagName;
  if (removeNSPrefix) {
    const colonIndex = tagName.indexOf(":");
    if (colonIndex !== -1) {
      tagName = tagName.substr(colonIndex + 1);
      attrExpPresent = tagName !== result.data.substr(colonIndex + 1);
    }
  }
  return {
    tagName,
    tagExp,
    closeIndex,
    attrExpPresent,
    rawTagName
  };
}
function readStopNodeData(xmlData, tagName, i) {
  const startIndex = i;
  let openTagCount = 1;
  for (; i < xmlData.length; i++) {
    if (xmlData[i] === "<") {
      if (xmlData[i + 1] === "/") {
        const closeIndex = findClosingIndex(xmlData, ">", i, `${tagName} is not closed`);
        let closeTagName = xmlData.substring(i + 2, closeIndex).trim();
        if (closeTagName === tagName) {
          openTagCount--;
          if (openTagCount === 0) {
            return {
              tagContent: xmlData.substring(startIndex, i),
              i: closeIndex
            };
          }
        }
        i = closeIndex;
      } else if (xmlData[i + 1] === "?") {
        const closeIndex = findClosingIndex(xmlData, "?>", i + 1, "StopNode is not closed.");
        i = closeIndex;
      } else if (xmlData.substr(i + 1, 3) === "!--") {
        const closeIndex = findClosingIndex(xmlData, "-->", i + 3, "StopNode is not closed.");
        i = closeIndex;
      } else if (xmlData.substr(i + 1, 2) === "![") {
        const closeIndex = findClosingIndex(xmlData, "]]>", i, "StopNode is not closed.") - 2;
        i = closeIndex;
      } else {
        const tagData = readTagExp(xmlData, i, ">");
        if (tagData) {
          const openTagName = tagData && tagData.tagName;
          if (openTagName === tagName && tagData.tagExp[tagData.tagExp.length - 1] !== "/") {
            openTagCount++;
          }
          i = tagData.closeIndex;
        }
      }
    }
  }
}
function parseValue(val, shouldParse, options) {
  if (shouldParse && typeof val === "string") {
    const newval = val.trim();
    if (newval === "true") return true;
    else if (newval === "false") return false;
    else return toNumber(val, options);
  } else {
    if (isExist(val)) {
      return val;
    } else {
      return "";
    }
  }
}

// node_modules/fast-xml-parser/src/xmlparser/node2json.js
var METADATA_SYMBOL2 = XmlNode.getMetaDataSymbol();
function prettify(node, options) {
  return compress(node, options);
}
function compress(arr, options, jPath) {
  let text;
  const compressedObj = {};
  for (let i = 0; i < arr.length; i++) {
    const tagObj = arr[i];
    const property = propName(tagObj);
    let newJpath = "";
    if (jPath === void 0) newJpath = property;
    else newJpath = jPath + "." + property;
    if (property === options.textNodeName) {
      if (text === void 0) text = tagObj[property];
      else text += "" + tagObj[property];
    } else if (property === void 0) {
      continue;
    } else if (tagObj[property]) {
      let val = compress(tagObj[property], options, newJpath);
      const isLeaf = isLeafTag(val, options);
      if (tagObj[METADATA_SYMBOL2] !== void 0) {
        val[METADATA_SYMBOL2] = tagObj[METADATA_SYMBOL2];
      }
      if (tagObj[":@"]) {
        assignAttributes(val, tagObj[":@"], newJpath, options);
      } else if (Object.keys(val).length === 1 && val[options.textNodeName] !== void 0 && !options.alwaysCreateTextNode) {
        val = val[options.textNodeName];
      } else if (Object.keys(val).length === 0) {
        if (options.alwaysCreateTextNode) val[options.textNodeName] = "";
        else val = "";
      }
      if (compressedObj[property] !== void 0 && compressedObj.hasOwnProperty(property)) {
        if (!Array.isArray(compressedObj[property])) {
          compressedObj[property] = [compressedObj[property]];
        }
        compressedObj[property].push(val);
      } else {
        if (options.isArray(property, newJpath, isLeaf)) {
          compressedObj[property] = [val];
        } else {
          compressedObj[property] = val;
        }
      }
    }
  }
  if (typeof text === "string") {
    if (text.length > 0) compressedObj[options.textNodeName] = text;
  } else if (text !== void 0) compressedObj[options.textNodeName] = text;
  return compressedObj;
}
function propName(obj) {
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (key !== ":@") return key;
  }
}
function assignAttributes(obj, attrMap, jpath, options) {
  if (attrMap) {
    const keys = Object.keys(attrMap);
    const len = keys.length;
    for (let i = 0; i < len; i++) {
      const atrrName = keys[i];
      if (options.isArray(atrrName, jpath + "." + atrrName, true, true)) {
        obj[atrrName] = [attrMap[atrrName]];
      } else {
        obj[atrrName] = attrMap[atrrName];
      }
    }
  }
}
function isLeafTag(obj, options) {
  const { textNodeName } = options;
  const propCount = Object.keys(obj).length;
  if (propCount === 0) {
    return true;
  }
  if (propCount === 1 && (obj[textNodeName] || typeof obj[textNodeName] === "boolean" || obj[textNodeName] === 0)) {
    return true;
  }
  return false;
}

// node_modules/fast-xml-parser/src/xmlparser/XMLParser.js
var XMLParser = class {
  constructor(options) {
    this.externalEntities = {};
    this.options = buildOptions(options);
  }
  /**
   * Parse XML dats to JS object 
   * @param {string|Buffer} xmlData 
   * @param {boolean|Object} validationOption 
   */
  parse(xmlData, validationOption) {
    if (typeof xmlData === "string") {
    } else if (xmlData.toString) {
      xmlData = xmlData.toString();
    } else {
      throw new Error("XML data is accepted in String or Bytes[] form.");
    }
    if (validationOption) {
      if (validationOption === true) validationOption = {};
      const result = validate(xmlData, validationOption);
      if (result !== true) {
        throw Error(`${result.err.msg}:${result.err.line}:${result.err.col}`);
      }
    }
    const orderedObjParser = new OrderedObjParser(this.options);
    orderedObjParser.addExternalEntities(this.externalEntities);
    const orderedResult = orderedObjParser.parseXml(xmlData);
    if (this.options.preserveOrder || orderedResult === void 0) return orderedResult;
    else return prettify(orderedResult, this.options);
  }
  /**
   * Add Entity which is not by default supported by this library
   * @param {string} key 
   * @param {string} value 
   */
  addEntity(key, value) {
    if (value.indexOf("&") !== -1) {
      throw new Error("Entity value can't have '&'");
    } else if (key.indexOf("&") !== -1 || key.indexOf(";") !== -1) {
      throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
    } else if (value === "&") {
      throw new Error("An entity with value '&' is not permitted");
    } else {
      this.externalEntities[key] = value;
    }
  }
  /**
   * Returns a Symbol that can be used to access the metadata
   * property on a node.
   * 
   * If Symbol is not available in the environment, an ordinary property is used
   * and the name of the property is here returned.
   * 
   * The XMLMetaData property is only present when `captureMetaData`
   * is true in the options.
   */
  static getMetaDataSymbol() {
    return XmlNode.getMetaDataSymbol();
  }
};

// src/RenderingContext.ts
var RenderingContext = class _RenderingContext {
  /**
   * 
   * @param lineLength Line length available for rendering
   *                   Can be set to 0 in case no wrapping is needed
   */
  constructor(lineLength, rootElement) {
    this.lineLength = lineLength;
    if (rootElement) {
      this.stack.push(rootElement);
    }
  }
  stack = [];
  _keepLineBreak;
  properties = {};
  static empty() {
    return new _RenderingContext(-1);
  }
  getRenderingParent() {
    return this.stack[0];
  }
  getLineLength() {
    return this.lineLength;
  }
  putProp(key, value) {
    this.properties[key] = value;
  }
  getProp(key) {
    return this.properties[key];
  }
  getIntProp(key) {
    return this.properties[key];
  }
  get keepLineBreak() {
    return this._keepLineBreak;
  }
  set keepLineBreak(v) {
    this._keepLineBreak = v;
  }
  subContext(e, opts = {}) {
    const res = new _RenderingContext(this.lineLength);
    res.keepLineBreak = this.keepLineBreak;
    if (opts.subtractLineLength) {
      res.lineLength = Math.max(1, this.lineLength - opts.subtractLineLength);
    }
    if (opts.newLineLength) {
      res.lineLength = opts.newLineLength;
    }
    if (opts.keepLineBreak) {
      res.keepLineBreak = opts.keepLineBreak;
    }
    res.stack = [e, ...this.stack];
    return res;
  }
};

// src/Logger.ts
var levelIdx = [
  "debug",
  "info",
  "warning",
  "error"
];
var Logger = class {
  constructor(level) {
    this.level = level;
    this.activeLevelIdx = levelIdx.indexOf(level);
  }
  activeLevelIdx;
  isActive(level) {
    return levelIdx.indexOf(level) >= this.activeLevelIdx;
  }
  paramToString(p) {
    if (!p) {
      return;
    }
    if (typeof p === "number") {
      return p.toString();
    }
    if (typeof p === "object") {
      return JSON.stringify(p);
    }
    return p;
  }
  format(message, ...params) {
    return message.replace(/{(\d+)}/g, (match, number) => this.paramToString(params[number]) || match);
  }
  log(f, prefix, level, message, ...params) {
    if (this.isActive(level)) {
      f(`${prefix}: ${this.format(message, ...params)}`);
    }
  }
  debug(message, ...params) {
    this.log(console.debug, "DEBUG", "debug", message, ...params);
  }
  info(message, ...params) {
    this.log(console.info, "INFO", "info", message, ...params);
  }
  warn(message, ...params) {
    this.log(console.warn, "WARNING", "warning", message, ...params);
  }
  error(message, ...params) {
    this.log(console.error, "ERROR", "error", message, ...params);
  }
};

// src/dita-parsing-utils.ts
function elementsByName(array, name) {
  return array.filter((e) => e[name]);
}
function firstElementByName(array, name) {
  return array.find((e) => e[name]);
}
function attr(e, attrName, defaultValue) {
  return e[":@"][attrName] || defaultValue;
}
function getElementName(e) {
  return e[":@"]?.elementName || "#text";
}
function getContent(e) {
  const contentKey = getElementName(e);
  return e[contentKey];
}
function setContent(e, newContent) {
  const contentKey = getElementName(e);
  e[contentKey] = newContent;
}

// src/wrap.ts
var noneBreakingChar = /[a-zA-Z0-9'"]/;
var removableBreakingCharacter = / /;
function foundBreakingCharIndex(line, width) {
  for (let i = width; i >= 0; i--) {
    if (!noneBreakingChar.test(line[i])) {
      return i;
    }
  }
  return width;
}
function wrapSingleLine(line, opts) {
  let idx = opts.width;
  if (!line[idx]) {
    return [line];
  }
  const breakAt = opts.mode === "hard" ? opts.width : foundBreakingCharIndex(line, opts.width);
  if (breakAt <= 0) {
    return [line];
  }
  let continueAt = breakAt;
  if (opts.removeNBreakingSpaces && removableBreakingCharacter.test(line[breakAt])) {
    continueAt = breakAt + 1;
  }
  return [line.substring(0, breakAt), ...wrapSingleLine(line.substring(continueAt), opts)];
}
function customWrap(s, opts) {
  const result = [];
  const lines = s.split("\n");
  for (const [i, line] of lines.entries()) {
    const newLines = wrapSingleLine(line, opts);
    result.push(...newLines);
  }
  return result.join("\n");
}

// src/DitaRenderer.ts
var DitaRenderer = class {
  constructor(logger, fnOffset) {
    this.logger = logger;
    this.fnOffset = fnOffset;
  }
  renderers = {};
  getFootnoteOffset() {
    return this.fnOffset;
  }
  getAndIncreaseFootnoteOffset() {
    return this.fnOffset++;
  }
  registerRenderer(elementName, renderer) {
    this.renderers[elementName] = renderer;
  }
  unregisterRenderer(elementName) {
    delete this.renderers[elementName];
  }
  renderEmpty() {
    return "";
  }
  findByInheritance(e) {
    const attributes = e[":@"];
    const classAttr = attributes["class"];
    if (classAttr) {
      const inheritanceAncestors = classAttr.split(" ").reverse();
      for (const inheritanceAncestor of inheritanceAncestors) {
        const elementName = inheritanceAncestor.split("/").at(-1);
        if (elementName && this.renderers[elementName]) {
          return elementName;
        }
      }
    }
  }
  renderElement(e, context) {
    const elementName = getElementName(e);
    if (elementName) {
      const renderer = this.renderers[elementName];
      if (!renderer) {
        const byInheritance = this.findByInheritance(e);
        if (byInheritance) {
          this.logger.warn(`Using inheritance to render ${elementName} as ${byInheritance}`);
          return this.renderers[byInheritance](e, context);
        } else {
          this.logger.warn(`No rendering processing found for element ${elementName}, using sequence`);
          return this.sequenceRenderer({ inline: true })(e, context);
        }
      }
      return renderer(e, context);
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
  renderRawText(e, context) {
    let t = e["#text"];
    if (t === "\n") return "";
    if (!context.keepLineBreak) {
      t = t.replace(/\r\n|\n|\r/g, " ");
      t = t.replace(/\s+/g, " ");
    }
    return t;
  }
  sequenceRenderer({ inline } = {}) {
    return (element, context) => {
      let output = "";
      const elementName = getElementName(element);
      const content = element[elementName];
      if (!content) {
        this.logger.error(`${elementName} not found on element: {0}`, JSON.stringify(element));
        return output;
      }
      for (const e of content) {
        output += this.renderElement(e, context);
      }
      if (context.getLineLength() > 0) {
        output = this.wrapText(output, context.getLineLength());
      }
      return output + (inline ? "" : "\n");
    };
  }
  /**
   * Wrap text to the given width.
   * @param t The text to wrap
   * @param width The width
   * @returns the resulting string
   */
  wrapText(t, width) {
    const res = customWrap(t, { width, removeNBreakingSpaces: true });
    return res;
  }
  splitLines(s, keepEmptyLines) {
    const res = s.split("\n");
    return keepEmptyLines ? res : res.filter((e) => e);
  }
  addPrefixToLines(s, prefix) {
    return this.splitLines(s).map((l) => `${prefix}${l}`).join("\n");
  }
};

// src/renderers/CommonElements.ts
var CommonElements = class {
  constructor(ditaRenderer, noTm = false) {
    this.ditaRenderer = ditaRenderer;
    this.noTm = noTm;
    ditaRenderer.registerRenderer("ul", this.renderList("ul", "li", " - ").bind(this));
    ditaRenderer.registerRenderer("ol", this.renderList("ol", "li", (i) => ` ${i}. `).bind(this));
    ditaRenderer.registerRenderer("sl", this.renderList("sl", "sli", "").bind(this));
    ditaRenderer.registerRenderer("note", this.renderNote.bind(this));
    ditaRenderer.registerRenderer("p", this.renderP.bind(this));
    ditaRenderer.registerRenderer("dl", this.renderDl.bind(this));
    ditaRenderer.registerRenderer("lines", this.renderLines.bind(this));
    ditaRenderer.registerRenderer("pre", this.renderPre.bind(this));
    ditaRenderer.registerRenderer("q", this.renderQ.bind(this));
    ditaRenderer.registerRenderer("tm", this.renderTm.bind(this));
    ditaRenderer.registerRenderer("image", this.renderImage.bind(this));
    ditaRenderer.registerRenderer("fn", this.renderFn.bind(this));
    ditaRenderer.registerRenderer("#text", ditaRenderer.renderRawText);
    ditaRenderer.registerRenderer("b", ditaRenderer.sequenceRenderer({ inline: true }));
    ditaRenderer.registerRenderer("cite", ditaRenderer.sequenceRenderer({ inline: true }));
    ditaRenderer.registerRenderer("data", ditaRenderer.renderEmpty);
    ditaRenderer.registerRenderer("dataabout", ditaRenderer.renderEmpty);
    ditaRenderer.registerRenderer("div", ditaRenderer.sequenceRenderer());
    ditaRenderer.registerRenderer("draftcomment", ditaRenderer.sequenceRenderer());
    ditaRenderer.registerRenderer("fig", ditaRenderer.renderEmpty);
    ditaRenderer.registerRenderer("fig", ditaRenderer.renderEmpty);
    ditaRenderer.registerRenderer("title", ditaRenderer.sequenceRenderer());
    ditaRenderer.registerRenderer("desc", ditaRenderer.sequenceRenderer());
    ditaRenderer.registerRenderer("longdescref", ditaRenderer.sequenceRenderer());
    ditaRenderer.registerRenderer("longquoteref", ditaRenderer.sequenceRenderer());
    ditaRenderer.registerRenderer("lq", ditaRenderer.sequenceRenderer());
    ditaRenderer.registerRenderer("keyword", ditaRenderer.sequenceRenderer({ inline: true }));
    ditaRenderer.registerRenderer("term", ditaRenderer.sequenceRenderer({ inline: true }));
    ditaRenderer.registerRenderer("text", ditaRenderer.sequenceRenderer({ inline: true }));
    ditaRenderer.registerRenderer("indexbase", ditaRenderer.sequenceRenderer({ inline: true }));
    ditaRenderer.registerRenderer("indexterm", ditaRenderer.sequenceRenderer({ inline: true }));
    ditaRenderer.registerRenderer("indextermref", ditaRenderer.sequenceRenderer({ inline: true }));
    ditaRenderer.registerRenderer("xref", ditaRenderer.sequenceRenderer({ inline: true }));
    ditaRenderer.registerRenderer("indextermref", ditaRenderer.sequenceRenderer());
    ditaRenderer.registerRenderer("ph", ditaRenderer.sequenceRenderer({ inline: true }));
    ditaRenderer.registerRenderer("requirecleanup", ditaRenderer.renderEmpty);
    ditaRenderer.registerRenderer("state", ditaRenderer.renderEmpty);
    ditaRenderer.registerRenderer("foreign", ditaRenderer.renderEmpty);
    ditaRenderer.registerRenderer("unknown", ditaRenderer.renderEmpty);
  }
  renderListItem(li, prefix, context) {
    const key = "li" in li ? "li" : "sli";
    const text = this.ditaRenderer.sequenceRenderer()(li, context.subContext(li, { subtractLineLength: prefix.length }));
    const lines = text.split("\n").filter((e) => e);
    const r = lines.map((l, i) => {
      if (i === 0) {
        return `${prefix}${l}`;
      } else {
        return `${" ".repeat(prefix.length)}${l}`;
      }
    }).join("\n");
    return r;
  }
  renderList(elementName, childrenName, prefix) {
    return (e, context) => {
      const lis = elementsByName(e[elementName], childrenName);
      return "\n" + lis.map((li, i) => this.renderListItem(li, typeof prefix === "function" ? prefix(i) : prefix, context)).join("\n");
    };
  }
  renderNote(e, context) {
    return "Note:\n" + this.ditaRenderer.sequenceRenderer()(e, context);
  }
  renderP(e, context) {
    return this.ditaRenderer.sequenceRenderer()(e, context) + "\n\n";
  }
  renderDl(e, context) {
    let output = "";
    const dlHeads = elementsByName(e.dl, "dlhead");
    for (const dlhead of dlHeads) {
      const dthd = firstElementByName(dlhead.dlhead, "dthd");
      const ddhd = firstElementByName(dlhead.dlhead, "ddhd");
      if (dthd) {
        output += this.ditaRenderer.sequenceRenderer()(dthd, context) + "\n";
      }
      if (ddhd) {
        output += this.ditaRenderer.addPrefixToLines(this.ditaRenderer.sequenceRenderer()(ddhd, context.subContext(ddhd, { subtractLineLength: 2 })), "  ") + "\n";
      }
    }
    const dlentrys = elementsByName(e.dl, "dlentry");
    for (const dlentry of dlentrys) {
      const dts = elementsByName(dlentry.dlentry, "dt");
      const dds = elementsByName(dlentry.dlentry, "dd");
      for (const dt of dts) {
        output += this.ditaRenderer.sequenceRenderer()(dt, context) + "\n";
      }
      for (const dd of dds) {
        output += this.ditaRenderer.addPrefixToLines(this.ditaRenderer.sequenceRenderer()(dd, context.subContext(dd, { subtractLineLength: 2 })), "  ") + "\n";
      }
    }
    return output;
  }
  renderLines(e, context) {
    return this.ditaRenderer.sequenceRenderer()(e, context.subContext(e, { keepLineBreak: true }));
  }
  renderPre(e, context) {
    return this.ditaRenderer.sequenceRenderer()(e, context.subContext(e, { keepLineBreak: true }));
  }
  renderQ(e, context) {
    return `"${this.ditaRenderer.sequenceRenderer({ inline: true })(e, context)}"`;
  }
  tmSymbol(e) {
    if (this.noTm) {
      return "";
    }
    switch (attr(e, "tmtype")) {
      case "reg":
        return "\xAE";
      case "service":
        return "\u2120";
      default:
        return "\u2122";
    }
  }
  renderTm(e, context) {
    return this.ditaRenderer.sequenceRenderer({ inline: true })(e, context) + this.tmSymbol(e);
  }
  renderImage(e, context) {
    let output = "";
    const attrElement = firstElementByName(e.image, "alt");
    const altAttr = attr(e, "alt");
    const inline = e[":@"].placement === "inline";
    if (attrElement) {
      output = this.ditaRenderer.sequenceRenderer({ inline })(attrElement, context);
    } else if (altAttr) {
      output = this.ditaRenderer.renderRawText({ "#text": altAttr }, context);
    }
    return output;
  }
  renderFn() {
    return `(${this.ditaRenderer.getAndIncreaseFootnoteOffset()})`;
  }
};

// src/renderers/DitaTable.ts
var import_align_text = __toESM(require_align_text());
var DitaTable = class {
  constructor(ditaRenderer, logger) {
    this.ditaRenderer = ditaRenderer;
    this.logger = logger;
    ditaRenderer.registerRenderer("table", this.renderTable.bind(this));
    ditaRenderer.registerRenderer("simpletable", this.renderTable.bind(this));
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
  readColSpecs(tgroup, numberOfColumns) {
    const colspecs = elementsByName(tgroup.tgroup, "colspec");
    const colSpecWithNum = colspecs.filter((c) => c[":@"].colnum);
    const colSpecWithoutNum = colspecs.filter((c) => !c[":@"].colnum);
    const colSpecsInOrder = [];
    for (let i = 0; i < colspecs.length; i++) {
      const colspec = colspecs[i];
      if (colspec[":@"].colnum && parseInt(colspec[":@"].colnum) > numberOfColumns) {
        this.logger.warn(`WARN: colspec/@colnum greater than the number of columns: ${parseInt(colspec[":@"].colnum)} > ${numberOfColumns}`);
      }
    }
    if (colspecs.length > numberOfColumns) {
      this.logger.warn(`WARN: Too many colspec elements for the number of columns: ${colspecs.length} > ${numberOfColumns}`);
    }
    let j = 0;
    for (let i = 0; i < numberOfColumns; i++) {
      const byNum = colSpecWithNum.find((c) => c[":@"].colnum === `${i + 1}`);
      if (byNum) {
        colSpecsInOrder[i] = byNum;
      } else {
        colSpecsInOrder[i] = colSpecWithoutNum[j++];
      }
      if (!colSpecsInOrder[i]) {
        colSpecsInOrder[i] = {
          colspec: [],
          ":@": {
            elementName: "colspec"
          }
        };
      }
    }
    return colSpecsInOrder;
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
  readCalsTableContent(context, colWidths, colSpecsInOrder, matrix, thead, tbody) {
    let rowIdx = 0;
    const vSpanBuffer = Array(colWidths.length);
    if (thead) {
      const rowElem = firstElementByName(thead.thead, "row");
      if (rowElem) {
        matrix.push(this.readRow(context, vSpanBuffer, rowElem, colWidths, colSpecsInOrder, rowIdx++, true));
      }
    }
    if (tbody) {
      const rowElems = elementsByName(tbody.tbody, "row");
      for (const rowElem of rowElems) {
        matrix.push(this.readRow(context, vSpanBuffer, rowElem, colWidths, colSpecsInOrder, rowIdx++));
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
  readStentries(context, rowIdx, colWidths, stentries, isHeader) {
    const row = {
      id: rowIdx,
      cells: [],
      isHeader,
      height: -1
      // set to -1 for now, will be calculated later
    };
    for (const [i, stentry] of stentries.entries()) {
      row.cells.push({
        text: this.ditaRenderer.sequenceRenderer()(stentry, context.subContext(stentry, { newLineLength: colWidths[i] })),
        // no line length because we don't know the width yet to wrap
        lines: [],
        spanWidth: 1,
        colWidth: colWidths[i],
        vspanstart: rowIdx,
        vspanend: -1,
        offset: 0,
        isLastCellOfRow: i === stentries.length - 1,
        height: -1,
        // set to -1 for now, will be calculated later,
        colIdx: i,
        heightInPreviousRow: 0
      });
    }
    return row;
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
  readSimpleTableContent(context, colWidths, matrix, table) {
    const sthead = firstElementByName(table.simpletable, "sthead");
    let rowIdx = 0;
    if (sthead) {
      const stentries = elementsByName(sthead.sthead, "stentry");
      matrix.push(this.readStentries(context, rowIdx++, colWidths, stentries));
    }
    const strows = elementsByName(table.simpletable, "strow");
    for (const strow of strows) {
      const stentries = elementsByName(strow.strow, "stentry");
      matrix.push(this.readStentries(context, rowIdx++, colWidths, stentries));
    }
  }
  /**
   * Calculate how many columns the cell should span based on namest and nameend attributes
   * @param colSpecsInOrder All ColsSpecs to find the column by name
   * @param cell The cell to calculate the span width for
   * @param rowIdx The row Idx (starting at 0) for messaging purposes to user
   * @param columnIdx The column Idx (starting at 0) for messaging purposes to user
   */
  calcSpanWidth(colSpecsInOrder, { namest, nameend }, rowIdx, columnIdx) {
    if (!namest || !nameend) {
      return { spanWidth: 1 };
    }
    const startColSpan = colSpecsInOrder.findIndex((c) => c[":@"].colname === namest);
    if (startColSpan < 0) {
      this.logger.warn(`WARN: namest set on cell (Row: ${rowIdx + 1} Column: ${columnIdx + 1}) not found in colspec: "${namest}". You must match a valid column name.`);
      return { spanWidth: 1 };
    }
    const endColSpan = colSpecsInOrder.findIndex((c) => c[":@"].colname === nameend);
    if (endColSpan < 0) {
      this.logger.warn(`WARN: nameend set on cell (Row: ${rowIdx + 1} Column: ${columnIdx + 1}) not found in colspec: "${nameend}". You must match a valid column name.`);
      return { spanWidth: 1 };
    }
    if (endColSpan < startColSpan) {
      this.logger.warn(`WARN: nameend cannot be lower than namest (${nameend} < ${namest}) on cell Row: ${rowIdx + 1} Column: ${columnIdx + 1}`);
      return { spanWidth: 1 };
    }
    if (endColSpan === startColSpan) {
      return { spanWidth: 1 };
    }
    return { spanWidth: endColSpan - startColSpan + 1, spanToLastRow: endColSpan === colSpecsInOrder.length - 1 };
  }
  /**
   * 
   * @param context The context to know the line length available, using the context instead of the global line length
   *                allows us to support table within table
   * @param colSpecsInOrder the ColSpec object in the same order as the columns
   * @param numberOfColumns the number of columns, which should match colSpecsInOrder.length, but passed for convenience
   * @returns The array of calculated width for each column
   */
  processWidthFromColSpecs(context, colSpecsInOrder, numberOfColumns) {
    let totalWidthRequest = 0;
    for (const colspec of colSpecsInOrder) {
      totalWidthRequest += this.colwithToFloat(colspec);
      this.logger.debug("totalWidthRequest now", totalWidthRequest);
    }
    const colWidths = [];
    let used = 0;
    const widthAvailableWithoutSeparators = context.getLineLength() - (numberOfColumns * 2 + numberOfColumns + 1);
    for (let i = 0; i < colSpecsInOrder.length - 1; i++) {
      const colspec = colSpecsInOrder[i];
      const colwidth = this.colwithToFloat(colspec);
      const width = Math.floor(widthAvailableWithoutSeparators * (colwidth / totalWidthRequest));
      colWidths.push(width);
      used += width;
    }
    colWidths.push(widthAvailableWithoutSeparators - used);
    this.logger.debug("calculated width {0}", colWidths.toString());
    return colWidths;
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
  renderTable(table, context) {
    let output = "";
    let globalColSep;
    let globalRowSep;
    let globalAlign;
    let numberOfColumns;
    let thead;
    let tbody;
    let colWidths;
    let colSpecsInOrder;
    const matrix = [];
    if ("table" in table) {
      const titleId = context.getIntProp("tableId");
      const title = firstElementByName(table.table, "title");
      if (title) {
        this.logger.debug("Title found");
        if (titleId) {
          output += `Table ${titleId}. `;
        }
        output += this.ditaRenderer.renderElement(title, context) + "\n";
      }
      const desc = firstElementByName(table.table, "desc");
      if (desc) {
        this.logger.debug("Desc found");
        output += this.ditaRenderer.renderElement(desc, context) + "\n";
      }
      const tgroup = firstElementByName(table.table, "tgroup");
      if (!tgroup) {
        return output;
      }
      const tgroupRowSep = attr(tgroup, "rowsep");
      const tgroupColSep = attr(tgroup, "colsep");
      globalColSep = tgroupColSep || attr(table, "colsep");
      globalRowSep = tgroupRowSep || attr(table, "rowsep");
      globalAlign = attr(tgroup, "align", "left");
      numberOfColumns = parseInt(attr(tgroup, "cols"));
      this.logger.debug("numberOfColumns: {0}", numberOfColumns);
      colSpecsInOrder = this.readColSpecs(tgroup, numberOfColumns);
      colWidths = this.processWidthFromColSpecs(context, colSpecsInOrder, numberOfColumns);
      thead = firstElementByName(tgroup.tgroup, "thead");
      tbody = firstElementByName(tgroup.tgroup, "tbody");
      this.readCalsTableContent(context, colWidths, colSpecsInOrder, matrix, thead, tbody);
    } else if ("simpletable" in table) {
      globalColSep = "1";
      globalRowSep = "1";
      globalAlign = "left";
      const stheads = elementsByName(table.simpletable, "sthead");
      const strows = elementsByName(table.simpletable, "strow");
      if (stheads.length > 1) {
        const stentrys = elementsByName(stheads[0].sthead, "stentry");
        numberOfColumns = stentrys.length;
      } else if (strows.length > 1) {
        const stentrys = elementsByName(strows[0].strow, "stentry");
        numberOfColumns = stentrys.length;
      } else {
        numberOfColumns = 0;
      }
      const relcolwidth = attr(table, "relcolwidth");
      colSpecsInOrder = [];
      let widthFromRelcolwidth;
      if (relcolwidth) {
        const splitRelcolwidth = relcolwidth.split(" ");
        if (splitRelcolwidth.length !== numberOfColumns) {
          this.logger.warn(`WARN: relcolwidth is not defining the correct number of columns. ${splitRelcolwidth.length} values, while ${numberOfColumns} columns found`);
        } else {
          widthFromRelcolwidth = splitRelcolwidth;
        }
      }
      for (let i = 0; i < numberOfColumns; i++) {
        colSpecsInOrder.push({
          colspec: [],
          ":@": {
            colnum: (i + 1).toString(),
            colwidth: widthFromRelcolwidth ? widthFromRelcolwidth[i] : "1*",
            elementName: "colspec"
          }
        });
      }
      colWidths = this.processWidthFromColSpecs(context, colSpecsInOrder, numberOfColumns);
      this.readSimpleTableContent(context, colWidths, matrix, table);
    } else {
      return "";
    }
    if (matrix.length === 0) {
      return output;
    }
    output += this.horizontalSeparator(matrix[0], "1", true);
    for (const [rowIdx, row] of matrix.entries()) {
      for (const cell of row.cells) {
        if (cell.height === -1) {
          cell.lines = this.alignText(
            cell.text.split("\n").filter((e) => e !== ""),
            colSpecsInOrder[cell.colIdx][":@"].align || globalAlign,
            cell.colWidth
          );
        }
      }
      const maxHeight = Math.max(...row.cells.map((c) => {
        let cellHeight = c.lines.length;
        if (c.vspanend > -1) {
          if (rowIdx < c.vspanend) {
            return 0;
          }
          cellHeight = c.lines.length - c.heightInPreviousRow;
        }
        return cellHeight;
      }));
      for (const c of row.cells.filter((c2) => c2.vspanend === -1)) {
        c.height = maxHeight;
      }
      for (const c of row.cells.filter((c2) => c2.vspanend > -1)) {
        if (row.id < c.vspanend) {
          c.heightInPreviousRow += maxHeight + 1;
        }
        c.height += maxHeight + 1;
      }
      row.height = maxHeight;
    }
    for (const [rowIdx, row] of matrix.entries()) {
      const rowOrGlobalValign = row.valign || (row.isHeader ? thead?.[":@"].valign : tbody?.[":@"].valign) || "top";
      this.vAlignText(row, rowOrGlobalValign);
      for (let lineIdx = 0; lineIdx < row.height; lineIdx++) {
        output += this.printRow(row, globalColSep);
      }
      const isLastRow = rowIdx === matrix.length - 1;
      output += this.horizontalSeparator(row, isLastRow ? "1" : row.rowsep || globalRowSep, isLastRow);
    }
    return output;
  }
  /**
   * Vertically align the content of each cell in a row by editing the lines array of each cells
   * 
   * *Important:* This must be called after the height of each cell has been calculated already.
   * 
   * @param row The row to vertically align
   * @param rowOrGlobalValign the global rule for vertical alignement, coming from thead/tbody or row
   */
  vAlignText(row, rowOrGlobalValign) {
    for (const cell of row.cells) {
      const valign = cell.valign || rowOrGlobalValign || "top";
      if (valign === "middle") {
        const countLineBefore = Math.floor((cell.height - cell.lines.length) / 2);
        const countLineAfter = cell.height - cell.lines.length - countLineBefore;
        cell.lines = [...Array(countLineBefore).fill(""), ...cell.lines, ...Array(countLineAfter).fill("")];
      } else if (valign === "bottom") {
        cell.lines = [...Array(cell.height - cell.lines.length).fill(""), ...cell.lines];
      }
    }
  }
  /**
   * Prints one row on the screen, following col sep and row sep
   * @param row The row to print
   * @param globalColSep The global column separator rule, coming from table/tgroup/colspec
   * @returns The resulting string
   */
  printRow(row, globalColSep) {
    let output = "|";
    for (const [i, cell] of row.cells.entries()) {
      output += this.printCellLine(cell, globalColSep);
    }
    return output + "\n";
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
  printCellLine(cell, globalColSep, onSeparator) {
    let output = " ";
    let line = cell.lines[cell.offset++];
    if (!line) {
      line = " ".repeat(cell.colWidth);
    } else if (line.length < cell.colWidth) {
      line += " ".repeat(cell.colWidth - line.length);
    }
    const colSep = cell.isLastCellOfRow ? "1" : cell.colsep || globalColSep || "1";
    output += line + " ";
    if (onSeparator) {
      output += "+";
    } else {
      output += colSep == "1" ? "|" : " ";
    }
    return output;
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
  horizontalSeparator(row, parentRowSep, isFirstOrLastRow) {
    let output = "+";
    for (const cell of row.cells) {
      this.logger.debug(`cell.vspanstart: ${cell.vspanstart}, cell.vspanend: ${cell.vspanend} row.id: ${row.id}`);
      if (!isFirstOrLastRow && cell.vspanend !== -1 && cell.vspanstart <= row.id && row.id < cell.vspanend) {
        output += this.printCellLine(cell, "1", true);
      } else {
        const rowSep = isFirstOrLastRow ? "1" : cell.rowsep || parentRowSep || "1";
        output += (rowSep === "1" ? "-" : " ").repeat(cell.colWidth + 2) + "+";
      }
    }
    return output + "\n";
  }
  /**
   * Convert a colspec/*colwidth value to a float. The `*` is simply dropped, for text rendering
   * all width are proportianal, it doesn't make sense to have px or pt units. We could consider
   * supporting % in the future, but this is not the caase today.
   * @param colspec The ColSpec to read
   * @returns The float, defaults to 1 if there is no colwidth attribute or it's an invalid value
   */
  colwithToFloat(colspec) {
    const colwidth = colspec[":@"]["colwidth"] || "1*";
    const parsed = parseFloat(colwidth);
    return isNaN(parsed) ? 1 : parsed;
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
  readRow(context, vSpanBuffer, row, colWidths, colSpecsInOrder, rowIdx, isHeader) {
    const entries = elementsByName(row.row, "entry");
    const cells = [];
    let currentEntryIdx = 0;
    for (let columnIdx = 0; columnIdx < colWidths.length; ) {
      let currentCell = vSpanBuffer[columnIdx];
      if (currentCell) {
        if (currentCell.vspanend === rowIdx) {
          vSpanBuffer[columnIdx] = void 0;
        }
      } else {
        const e = entries[currentEntryIdx++];
        if (!e) {
          this.logger.warn(`WARN: Missing entries in row ${rowIdx + 1}`);
          continue;
        }
        const { spanWidth, spanToLastRow } = this.calcSpanWidth(colSpecsInOrder, e[":@"], rowIdx, columnIdx);
        let colWidth = 0;
        for (let spanIdx = 0; spanIdx < spanWidth; spanIdx++) {
          colWidth += colWidths[columnIdx + spanIdx];
          if (spanIdx > 0) {
            colWidth += 3;
          }
          this.logger.debug("colWidth {0} {1}", colWidth, spanWidth);
        }
        currentCell = this.readEntry(context, columnIdx, e, spanWidth, colWidth, rowIdx);
        if (columnIdx === colWidths.length - 1 || spanToLastRow) {
          this.logger.debug("isLastCellOfRow true");
          currentCell.isLastCellOfRow = true;
        }
        if (currentCell.vspanend > 0) {
          this.logger.debug(`Setting vSpanBuffer for ${columnIdx}`);
          vSpanBuffer[columnIdx] = currentCell;
        }
      }
      cells.push(currentCell);
      this.logger.debug("moving index by {0}", currentCell.spanWidth);
      columnIdx += currentCell.spanWidth;
    }
    return {
      id: rowIdx,
      cells,
      rowsep: row[":@"].rowsep,
      valign: row[":@"].valign,
      isHeader,
      height: -1
      // set to -1 for now, will be calculated later
    };
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
  readEntry(context, colIdx, entry, spanWidth, colWidth, rowId) {
    let vspanend = -1;
    const morerows = entry[":@"].morerows ? parseInt(entry[":@"].morerows) : NaN;
    if (!isNaN(morerows) && morerows > 0) {
      vspanend = rowId + morerows;
    }
    return {
      // Use a context with the real column width, so it can already wrap
      text: this.ditaRenderer.sequenceRenderer()(entry, context.subContext(entry, { newLineLength: colWidth })),
      lines: [],
      // lines will be split when we know the width,
      rowsep: entry[":@"].rowsep,
      colsep: entry[":@"].colsep,
      valign: entry[":@"].valign,
      namest: entry[":@"].namest,
      nameend: entry[":@"].nameend,
      morerows: entry[":@"].morerows,
      spanWidth,
      colWidth,
      vspanstart: rowId,
      vspanend,
      offset: 0,
      isLastCellOfRow: false,
      // set to talse for now, later check will correct is last
      height: -1,
      // set to -1 for now, will be calculated later
      colIdx,
      heightInPreviousRow: 0
    };
  }
  /**
   * Align horizontally the given lines, based on the given column width
   * @param s 
   * @param alignment 
   * @param colWidth 
   * @returns 
   */
  alignText(s, alignment, colWidth) {
    switch (alignment) {
      case "center":
        return (0, import_align_text.default)(s, (len) => Math.floor((colWidth - len) / 2));
      case "right":
        return (0, import_align_text.default)(s, (len) => colWidth - len);
      default:
        return s;
    }
  }
};

// src/utils.ts
function recursively(e, f) {
  if (e[":@"]) {
    f(e);
    const name = e[":@"].elementName;
    const children = e[name];
    for (const c of children) {
      recursively(c, f);
    }
  }
}
function cleanTopicId(fullId) {
  const lastSlash = fullId.lastIndexOf("/");
  if (lastSlash >= 0) {
    return fullId.substring(lastSlash + 1);
  }
  const lastHash = fullId.lastIndexOf("#");
  if (lastHash >= 0) {
    return fullId.substring(lastHash + 1);
  }
  return fullId;
}

// src/renderers/syn/SD_Synnote.ts
var SD_Synnote = class {
  constructor(id, text) {
    this.id = id;
    this.text = text;
  }
  getMinimumWidth() {
    return this.id.toString().length + 4;
  }
  getHeight() {
    return 2;
  }
  getText() {
    return this.text;
  }
  print(width) {
    if (!width) {
      width = this.getMinimumWidth();
    }
    const padding = width - this.getMinimumWidth();
    const id = this.id.toString();
    return [
      ` (${id}) `.padStart(width, " "),
      `--${"-".repeat(id.length + padding)}--`
    ];
  }
  getDefaultGroupHeight() {
    return 1;
  }
  getOptionGroupHeight() {
    return 0;
  }
  getMainGroupHeight() {
    return 1;
  }
  renderNote() {
    return `${this.id}. ${this.text}
`;
  }
};

// src/renderers/syn/SD_Sequence.ts
var SD_Sequence = class _SD_Sequence {
  constructor(logger) {
    this.logger = logger;
  }
  elements = [];
  compact = false;
  addElement(e) {
    this.elements.push(e);
  }
  setCompact() {
    this.compact = true;
  }
  getElements() {
    return this.elements;
  }
  getElementCount() {
    return this.elements.length;
  }
  isEmpty() {
    return this.elements.length === 0;
  }
  getHeight() {
    return this.getDefaultGroupHeight() + this.getMainGroupHeight() + this.getOptionGroupHeight();
  }
  getDefaultGroupHeight() {
    return Math.max(...this.elements.map((e) => e.getDefaultGroupHeight()));
  }
  getOptionGroupHeight() {
    return Math.max(...this.elements.map((e) => e.getOptionGroupHeight()));
  }
  getMainGroupHeight() {
    return Math.max(...this.elements.map((e) => e.getMainGroupHeight()));
  }
  getMinimumWidth() {
    return this.elements.map((e) => e.getMinimumWidth()).reduce((a, b) => a + b, 0) + (this.compact ? 2 : 0);
  }
  print(width) {
    if (width && this.getMinimumWidth() > width) {
      this.logger.warn(`Not enough space to print sequence. Required: ${this.getMinimumWidth()}, Given: ${width}`);
    }
    if (!width) {
      width = this.getMinimumWidth();
    }
    const h = this.getHeight();
    const maxDefaulstHeight = this.getDefaultGroupHeight();
    const matrix = Array.from(Array(h), () => new Array(this.elements.length).fill(""));
    for (const [elemIdx, element] of this.elements.entries()) {
      const elemWidth = element.getMinimumWidth();
      const elemDefaultsHeight = element.getDefaultGroupHeight();
      const elemLines = element.print(elemWidth);
      const startLine = maxDefaulstHeight - elemDefaultsHeight;
      let currentLineIdx = startLine;
      for (const line of elemLines) {
        this.logger.debug(`Writing line ${currentLineIdx}, cell number ${elemIdx}: ${line}`);
        matrix[currentLineIdx++][elemIdx] = line;
      }
    }
    let lines = [];
    for (let lineIdxInMatrix = 0; lineIdxInMatrix < matrix.length; lineIdxInMatrix++) {
      const lineAsArray = matrix[lineIdxInMatrix];
      let l = lineAsArray.map((part, i) => {
        const widthColumn = this.elements[i].getMinimumWidth();
        if (!part) {
          return " ".repeat(widthColumn);
        } else {
          return part.padEnd(widthColumn, " ");
        }
      }).join("");
      l = l.padEnd(width, lineIdxInMatrix === this.getDefaultGroupHeight() ? "-" : " ");
      if (this.compact) {
        if (lineIdxInMatrix === maxDefaulstHeight) {
          lines.push(`-${l}-`);
        } else {
          lines.push(` ${l} `);
        }
      } else {
        lines.push(l);
      }
    }
    return lines;
  }
  breakDown(width) {
    const result = [];
    let currentWidth = 0;
    let currentSequence = new _SD_Sequence(this.logger);
    for (const element of this.elements) {
      if (currentWidth + element.getMinimumWidth() > width) {
        if (currentWidth === 0) {
          this.logger.warn(`Cannot break sequence to fit the screen, single element of the main sequence wider than the screen`);
        }
        if (!currentSequence.isEmpty()) {
          result.push(currentSequence);
        }
        currentSequence = new _SD_Sequence(this.logger);
        currentWidth = 0;
      }
      currentSequence.addElement(element);
      currentWidth += element.getMinimumWidth();
    }
    if (!currentSequence.isEmpty()) {
      result.push(currentSequence);
    }
    return result;
  }
};

// src/renderers/syn/SD_Fragment.ts
var SD_Fragment = class {
  constructor(title, sequence) {
    this.title = title;
    this.sequence = sequence;
  }
  getMinimumWidth() {
    return this.sequence.getMinimumWidth() + 4;
  }
  getHeight() {
    return 1;
  }
  print(width) {
    const lines = [
      this.title,
      ""
    ];
    const lineSequences = this.sequence.print((width || this.getMinimumWidth()) - 4);
    const offsetSequence = this.sequence.getDefaultGroupHeight();
    for (let i = 0; i < offsetSequence; i++) {
      lines.push("  " + lineSequences[i] + "  ");
    }
    lines.push("|-" + lineSequences[offsetSequence] + "-|");
    for (let i = offsetSequence + 1; i < lineSequences.length; i++) {
      lines.push("  " + lineSequences[i] + "  ");
    }
    return lines;
  }
  getDefaultGroupHeight() {
    return 0;
  }
  getOptionGroupHeight() {
    return 0;
  }
  getMainGroupHeight() {
    return 1;
  }
};

// src/renderers/syn/SD_DefaultStack.ts
var SD_DefaultStack = class {
  constructor(stack = []) {
    this.stack = stack;
  }
  addOption(o) {
    this.stack.push(o);
  }
  delimChar(childIdx, lineIdx, offsetChild) {
    const aboveMainPathOfItem = lineIdx < offsetChild;
    const isMainPathOfItem = lineIdx === offsetChild;
    const isFirstItem = childIdx === 0;
    if (aboveMainPathOfItem) {
      return isFirstItem ? " " : "|";
    } else if (isMainPathOfItem) {
      return isFirstItem ? "." : "+";
    } else {
      return "|";
    }
  }
  print(width) {
    if (!width) {
      width = this.getMinimumWidth();
    }
    let lines = [];
    for (const [childIdx, e] of this.stack.entries()) {
      const childPrinted = e.print(width - 2);
      lines.push(...childPrinted.map((l, i) => `${this.delimChar(childIdx, i, e.getDefaultGroupHeight())}${l}${this.delimChar(childIdx, i, e.getDefaultGroupHeight())}`));
    }
    return lines;
  }
  getHeight() {
    return this.stack.map((e) => e.getHeight()).reduce((a, b) => a + b, 0);
  }
  getMinimumWidth() {
    return Math.max(...this.stack.map((e) => e.getMinimumWidth())) + 2;
  }
  getDefaultGroupHeight() {
    return this.getHeight();
  }
  getOptionGroupHeight() {
    return 0;
  }
  getMainGroupHeight() {
    return 0;
  }
};

// src/renderers/syn/SD_Filler.ts
var SD_Filler = class {
  getMinimumWidth() {
    return 2;
  }
  getHeight() {
    return 1;
  }
  print(width) {
    return ["-".repeat(width || 2)];
  }
  getDefaultGroupHeight() {
    return 0;
  }
  getOptionGroupHeight() {
    return 0;
  }
  getMainGroupHeight() {
    return 1;
  }
};

// src/renderers/syn/SD_OptionStack.ts
var SD_OptionStack = class {
  constructor(stack = []) {
    this.stack = stack;
  }
  addOption(o) {
    this.stack.push(o);
  }
  delimChar(isLastChild, lineIdx, childDefaultsHeight) {
    if (lineIdx < childDefaultsHeight) {
      return "|";
    }
    if (lineIdx === childDefaultsHeight) {
      return isLastChild ? "'" : "+";
    }
    return isLastChild ? " " : "|";
  }
  print(width) {
    if (!width) {
      width = this.getMinimumWidth();
    }
    let lines = [];
    for (const [i, e] of this.stack.entries()) {
      const childPrintedLines = e.print(width - 2);
      const offset = e.getDefaultGroupHeight();
      const isLastChild = i === this.stack.length - 1;
      for (const [lineIdx, line] of childPrintedLines.entries()) {
        const delimiter = this.delimChar(isLastChild, lineIdx, offset);
        lines.push(`${delimiter}${line}${delimiter}`);
      }
    }
    return lines;
  }
  getHeight() {
    return this.stack.map((e) => e.getHeight()).reduce((a, b) => a + b, 0);
  }
  getMinimumWidth() {
    return Math.max(...this.stack.map((e) => e.getMinimumWidth())) + 2;
  }
  getDefaultGroupHeight() {
    return 0;
  }
  getOptionGroupHeight() {
    return this.getHeight();
  }
  getMainGroupHeight() {
    return 0;
  }
};

// src/renderers/syn/SG_Block.ts
var SD_Block = class {
  top = new SD_DefaultStack();
  main;
  bottom = new SD_OptionStack();
  mainSet = false;
  constructor() {
    this.main = new SD_Filler();
  }
  getMinimumWidth() {
    if (this.getDefaultGroupHeight() == 0 && this.getOptionGroupHeight() == 0) {
      return this.main.getMinimumWidth();
    } else {
      return Math.max(this.top.getMinimumWidth() + 2, this.main.getMinimumWidth() + 4, this.bottom.getMinimumWidth() + 2);
    }
  }
  heightGroup(g) {
    return g.map((e) => e.getHeight()).reduce((a, b) => a + b, 0);
  }
  getHeight() {
    return this.top.getHeight() + this.main.getHeight() + this.bottom.getHeight();
  }
  getOffset() {
    return this.top.getHeight();
  }
  getDefaultGroupHeight() {
    return this.top.getHeight();
  }
  getOptionGroupHeight() {
    return this.bottom.getHeight();
  }
  getMainGroupHeight() {
    return this.main.getHeight();
  }
  addDefault(element) {
    this.top.addOption(element);
  }
  addOptional(element) {
    this.bottom.addOption(element);
  }
  /**
   * Important, it is up to the calling compoenent to call only once this method
   * following require items should be added as choices (bottom group) if there is
   * already one on the main path
   * @param element 
   */
  addRequired(element) {
    if (this.mainSet) {
      this.addOptional(element);
    } else {
      this.main = element;
      this.mainSet = true;
    }
  }
  print(width) {
    const w = Math.max(this.getMinimumWidth(), width);
    if (this.getDefaultGroupHeight() == 0 && this.getOptionGroupHeight() == 0) {
      return [
        this.main.print(w)[0]
      ];
    } else {
      return [
        ...this.top.print(w - 2).map((l) => ` ${l} `),
        // `-+${this.main.print(w - 4)[0]}+-`,
        ...this.main.print(w - 4).map((l, li) => li === 0 ? `-+${l}+-` : ` |${l}| `),
        ...this.bottom.print(w - 2).map((l) => ` ${l} `)
      ];
    }
  }
  getoffset() {
    return this.top.getHeight();
  }
};

// src/renderers/syn/SD_RegGroup.ts
var SD_RepGroup = class {
  constructor(repeatedItem, sepChar = "") {
    this.repeatedItem = repeatedItem;
    this.sepChar = sepChar;
  }
  getMinimumWidth() {
    return this.repeatedItem.getMinimumWidth() + 4;
  }
  getHeight() {
    return this.repeatedItem.getHeight() + 2;
  }
  print(width) {
    if (!width) {
      width = this.getMinimumWidth();
    }
    const itemLines = this.repeatedItem.print(width - 4);
    const itemDefaultGroupHeight = this.repeatedItem.getDefaultGroupHeight();
    const lines = [];
    lines.push(` .-${this.sepChar.padEnd(width - 5, "-")}. `);
    if (itemDefaultGroupHeight === 0) {
      lines.push(` V${" ".repeat(width - 4)}| `);
    } else {
      for (let itemLineIdx = 0; itemLineIdx < itemDefaultGroupHeight; itemLineIdx++) {
        const itemLine = itemLines[itemLineIdx];
        const isLast = itemLineIdx === itemDefaultGroupHeight - 1;
        if (!isLast) {
          lines.push(` |${itemLine}| `);
        } else {
          lines.push(` V${itemLine}| `);
        }
      }
    }
    lines.push(`--${itemLines[itemDefaultGroupHeight]}+-`);
    for (let itemLineIdx = itemDefaultGroupHeight + 1; itemLineIdx < itemLines.length; itemLineIdx++) {
      lines.push(`  ${itemLines[itemLineIdx]}  `);
    }
    return lines;
  }
  getDefaultGroupHeight() {
    return 1 + Math.max(1, this.repeatedItem.getDefaultGroupHeight());
  }
  getOptionGroupHeight() {
    return this.repeatedItem.getOptionGroupHeight();
  }
  getMainGroupHeight() {
    return this.repeatedItem.getMainGroupHeight();
  }
};

// src/renderers/syn/SD_Fragref.ts
var SD_Fragref = class {
  constructor(text = "") {
    this.text = text;
  }
  getMinimumWidth() {
    return this.text.length + 6;
  }
  getHeight() {
    return 1;
  }
  print(width) {
    return [`-| ${this.text} |-`.padEnd(width || this.getMinimumWidth(), "-")];
  }
  getDefaultGroupHeight() {
    return 0;
  }
  getOptionGroupHeight() {
    return 0;
  }
  getMainGroupHeight() {
    return 1;
  }
};

// src/renderers/syn/SD_Text.ts
var SD_Text = class {
  constructor(text = "", compact) {
    this.text = text;
    this.compact = compact;
  }
  getMinimumWidth() {
    return this.text.length + (this.compact ? 0 : 2);
  }
  getHeight() {
    return 1;
  }
  print(width) {
    if (this.compact) {
      return [`${this.text}`.padEnd(width || this.getMinimumWidth(), "-")];
    } else {
      return [`-${this.text}-`.padEnd(width || this.getMinimumWidth(), "-")];
    }
  }
  getDefaultGroupHeight() {
    return 0;
  }
  getOptionGroupHeight() {
    return 0;
  }
  getMainGroupHeight() {
    return 1;
  }
};

// src/renderers/SyntaxDiagram.ts
var SyntaxDiagram = class {
  constructor(ditaRenderer, logger, noTm = false) {
    this.ditaRenderer = ditaRenderer;
    this.logger = logger;
    this.noTm = noTm;
    ditaRenderer.registerRenderer("syntaxdiagram", this.renderSyntaxDiagram.bind(this));
  }
  fragmentMap = [];
  synnotesMap = [];
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
  renderSyntaxDiagram(e, context) {
    this.synnotesMap.length = 0;
    this.fragmentMap.length = 0;
    const fragmentsOnly = [];
    recursively(e, ((el) => {
      this.cleanTextInPlace(el);
      if (this.isFragment(el)) {
        fragmentsOnly.push(el);
      }
    }));
    for (const synnote of e.syntaxdiagram.filter((e2) => this.isSynnote(e2) && e2[":@"].id)) {
      if (synnote[":@"].id) {
        this.synnotesMap.push({
          id: synnote[":@"].id,
          value: new SD_Synnote(this.synnotesMap.length + 1, this.ditaRenderer.sequenceRenderer({ inline: true })(synnote, RenderingContext.empty()))
        });
      }
    }
    this.relocateSynnotes(e);
    const noneFragmentsNorRootSynnotes = e.syntaxdiagram.filter((e2) => !this.isFragment(e2) && !(this.isSynnote(e2) && e2[":@"].id));
    for (const f of fragmentsOnly) {
      const title = firstElementByName(f.fragment, "title");
      if (title) {
        const titleAsText = this.ditaRenderer.sequenceRenderer({ inline: true })(title, context);
        this.fragmentMap.push({
          id: "",
          title: titleAsText,
          value: this.processFragment(f, context)
        });
      }
    }
    const mainSequence = new SD_Sequence(this.logger);
    for (const e2 of noneFragmentsNorRootSynnotes) {
      const r = this.convertToSgBase(e2);
      if (r) {
        mainSequence.addElement(r);
      }
    }
    let output = "";
    const availableWidth = context.getLineLength() - 4;
    const allSequences = [];
    let currentWidth = 0;
    let currentSequence = new SD_Sequence(this.logger);
    const _logger = this.logger;
    function newSequence() {
      if (!currentSequence.isEmpty()) {
        allSequences.push(currentSequence);
      }
      currentSequence = new SD_Sequence(_logger);
      currentWidth = 0;
    }
    for (const element of mainSequence.getElements()) {
      if (element instanceof SD_Sequence && element.getMinimumWidth() > availableWidth) {
        newSequence();
        allSequences.push(...element.breakDown(availableWidth));
        continue;
      }
      if (currentWidth + element.getMinimumWidth() > availableWidth) {
        if (currentWidth === 0) {
          this.logger.warn(`Cannot break sequence to fit the screen, single element of the main sequen ce wider than the screen`);
        }
        newSequence();
      }
      currentSequence.addElement(element);
      currentWidth += element.getMinimumWidth();
    }
    if (!currentSequence.isEmpty()) {
      allSequences.push(currentSequence);
    }
    for (const [seqIdx, subSequence] of allSequences.entries()) {
      const isFirst = seqIdx === 0;
      const isLast = seqIdx === allSequences.length - 1;
      const isAlone = allSequences.length === 1;
      let toRemove, prefix, prefixMain, suffix, suffixMain;
      if (isAlone) {
        toRemove = 4;
        prefix = "  ";
        prefixMain = ">>";
        suffix = "  ";
        suffixMain = "><";
      } else if (isFirst) {
        toRemove = 3;
        prefix = "  ";
        prefixMain = ">>";
        suffix = " ";
        suffixMain = ">";
      } else if (isLast) {
        toRemove = 3;
        prefix = " ";
        prefixMain = ">";
        suffix = "  ";
        suffixMain = "><";
      } else {
        toRemove = 2;
        prefix = " ";
        prefixMain = ">";
        suffix = "  ";
        suffixMain = ">";
      }
      const lines = subSequence.print(context.getLineLength() - toRemove);
      const mainPathOffset = subSequence.getDefaultGroupHeight();
      for (let i = 0; i < mainPathOffset; i++) {
        output += prefix + lines[i] + suffix + "\n";
      }
      output += prefixMain + lines[mainPathOffset] + suffixMain + "\n";
      for (let i = mainPathOffset + 1; i < lines.length; i++) {
        output += prefix + lines[i] + suffix + "\n";
      }
      for (const { value } of this.fragmentMap) {
        output += "\n" + value.print(context.getLineLength()).join("\n");
      }
    }
    if (this.synnotesMap.length > 0) {
      output += "\nNotes:\n";
      for (const { value } of this.synnotesMap) {
        output += "\n" + value.renderNote();
      }
    }
    return output + "\n";
  }
  /**
   * Synnotes should always form a groupseq with their previous element (not parent). To make processing easier later, rework the tree to
   * make this happen so we don't have to do crazy processing to find the previous element in individual processing later
   * @returns the note if it should be moved outside of the current element back to the previous sibling of this element
   * 
   */
  relocateSynnotes(e, isRoot = true) {
    const content = getContent(e);
    const result = [];
    let numberOfNotesToDelete = 0;
    let currentNotNotesIdx = 0;
    for (let i = 0; i < content.length; i++) {
      const child = content[i];
      if (this.isSynnoteOrSynnoteref(child) && !isRoot) {
        if (currentNotNotesIdx === 0) {
          numberOfNotesToDelete++;
          result.push(child);
          continue;
        }
        if (this.isGroupchoice(e)) {
          const previousOption = content[i - 1];
          if (this.isGroupseq(previousOption)) {
            previousOption.groupseq.push(child);
          } else {
            const newGroup = {
              ":@": {
                elementName: "groupseq"
              },
              groupseq: [
                previousOption,
                child
              ]
            };
            content[i - 1] = newGroup;
          }
          content.splice(i, 1);
          i--;
        }
      } else {
        currentNotNotesIdx++;
        if (this.isGroup(child)) {
          const toReattachHigher = this.relocateSynnotes(child, false);
          if (toReattachHigher.length > 0) {
            content.splice(i, 0, ...toReattachHigher);
            i += toReattachHigher.length;
          }
        }
      }
    }
    if (numberOfNotesToDelete > 0) {
      content.splice(0, numberOfNotesToDelete);
    }
    return result;
  }
  isGroup(e) {
    return this.isFragment(e) || this.isGroupcomp(e) || this.isGroupseq(e) || this.isGroupchoice(e);
  }
  isGroupchoice(e) {
    return "groupchoice" in e;
  }
  isFragment(e) {
    return "fragment" in e;
  }
  isSynnoteOrSynnoteref(e) {
    return this.isSynnote(e) || this.isSynnoteref(e);
  }
  isSynnote(e) {
    return "synnote" in e;
  }
  isSynnoteref(e) {
    return "synnoteref" in e;
  }
  isFragref(e) {
    return "fragref" in e;
  }
  isGroupseq(e) {
    return "groupseq" in e;
  }
  isGroupcomp(e) {
    return "groupcomp" in e;
  }
  isTextElem(e) {
    return "var" in e || "kwd" in e || "delim" in e || "oper" in e || "sep" in e;
  }
  cleanText(elements) {
    return elements.filter((e) => !("#text" in e) || e["#text"] && e["#text"].toString().trim());
  }
  cleanTextInPlace(e) {
    const content = getContent(e);
    const newContent = this.cleanText(content);
    setContent(e, newContent);
  }
  wrapIfOptionalOrDefault(importance, elem) {
    if (importance === "optional") {
      const b = new SD_Block();
      b.addOptional(elem);
      return b;
    }
    if (importance === "default") {
      const b = new SD_Block();
      b.addDefault(elem);
      return b;
    }
    return elem;
  }
  convertToSgBase(e) {
    if (this.isFragment(e)) {
      return;
    }
    if (this.isFragref(e)) {
      return new SD_Fragref(this.ditaRenderer.sequenceRenderer({ inline: true })(e, new RenderingContext(-1)));
    }
    if (this.isTextElem(e)) {
      return this.wrapIfOptionalOrDefault(e[":@"].importance, new SD_Text(this.ditaRenderer.sequenceRenderer({ inline: true })(e, new RenderingContext(-1))));
    }
    if (this.isSynnote(e)) {
      const synnote = new SD_Synnote(this.synnotesMap.length + 1, this.ditaRenderer.sequenceRenderer({ inline: true })(e, RenderingContext.empty()));
      this.synnotesMap.push({
        id: "",
        value: synnote
      });
      return synnote;
    }
    if (this.isSynnoteref(e)) {
      return this.processSynnoteref(e);
    }
    if (this.isGroupchoice(e)) {
      return this.processGroupChoice(e);
    }
    if (this.isGroupseq(e)) {
      return this.processGroupSeq(e);
    }
    if (this.isGroupcomp(e)) {
      return this.processGroupcomp(e);
    }
    console.error(`${e[":@"].elementName} not supported yet`);
    throw new Error();
  }
  processSynnoteref(e) {
    const href = e[":@"].href;
    if (href) {
      const cleanId = cleanTopicId(href);
      const match = this.synnotesMap.find((e2) => e2.id === cleanId);
      if (!match) {
        this.logger.warn(`synnoteref target not found. ${href} not found in this syntax diagram`);
      } else {
        return match.value;
      }
    } else {
      this.logger.warn(`synnoteref without href attribute. Won't be resolved`);
    }
  }
  _processSeq(children) {
    const res = new SD_Sequence(this.logger);
    let isRep;
    for (const child of children) {
      if ("repsep" in child) {
        isRep = this.ditaRenderer.sequenceRenderer({ inline: true })(child, new RenderingContext(-1)) || "";
        continue;
      }
      const c = this.convertToSgBase(child);
      if (c) {
        if (this.isTextElem(child)) {
          res.addElement(c);
        } else {
          res.addElement(c);
        }
      }
    }
    if (isRep !== void 0) {
      return new SD_RepGroup(res, isRep);
    }
    return res;
  }
  wrapInBlockByImportance(importance, elem, wrapEvenIfNone) {
    if (importance === "default") {
      const b = new SD_Block();
      b.addDefault(elem);
      return b;
    }
    if (importance === "optional") {
      const b = new SD_Block();
      b.addOptional(elem);
      return b;
    }
    if (wrapEvenIfNone) {
      const b = new SD_Block();
      b.addRequired(elem);
      return b;
    }
    return elem;
  }
  processGroupSeq(g) {
    return this.wrapIfOptionalOrDefault(g[":@"].importance, this._processSeq(g.groupseq));
  }
  processFragment(g, context) {
    const titles = g.fragment.filter((e) => "title" in e);
    const withoutTitles = g.fragment.filter((e) => !("title" in e));
    let title = "";
    if (titles.length > 0) {
      title = this.ditaRenderer.sequenceRenderer({ inline: true })(titles[0], context);
    }
    return new SD_Fragment(title, this._processSeq(withoutTitles));
  }
  processGroupcomp(g) {
    const importance = g[":@"].importance;
    const seq = new SD_Sequence(this.logger);
    let isCompact = false;
    let res = this.wrapInBlockByImportance(g[":@"].importance, seq);
    if (res === seq) {
      seq.setCompact();
      isCompact = true;
    }
    let isRep;
    for (const child of g.groupcomp) {
      if ("repsep" in child) {
        isRep = this.ditaRenderer.sequenceRenderer({ inline: true })(child, new RenderingContext(-1)) || "";
        continue;
      }
      if (this.isTextElem(child)) {
        const textElem = new SD_Text(this.ditaRenderer.sequenceRenderer({ inline: true })(child, new RenderingContext(-1)), isCompact);
        seq.addElement(this.wrapInBlockByImportance(child[":@"].importance, textElem, true));
      } else {
        const c = this.convertToSgBase(child);
        if (c) {
          seq.addElement(c);
        }
      }
    }
    if (isRep !== void 0) {
      return new SD_RepGroup(res, isRep);
    }
    return res;
  }
  /**
   * Group choices are displayed as stackeed choices, default goes above the main path, all other go below.
   * Note that if the group is optional itself, they all go below the main path, even if one of the child
   * is having default importance attribute
   * @param g 
   * @param context 
   */
  processGroupChoice(g) {
    const res = new SD_Block();
    const isGroupOptional = g[":@"].importance === "optional";
    const isGroupDefault = g[":@"].importance === "default";
    const defaults = g.groupchoice.filter((e) => "importance" in e[":@"] && e[":@"].importance === "default");
    const required = g.groupchoice.filter((e) => !e[":@"].importance || e[":@"].importance === "required");
    const optionals = g.groupchoice.filter((e) => "importance" in e[":@"] && e[":@"].importance === "optional");
    for (const d of defaults) {
      delete d[":@"].importance;
      const c = this.convertToSgBase(d);
      if (c) {
        res.addDefault(c);
      }
    }
    let isRep;
    if (isGroupOptional) {
      for (const e of required) {
        if ("repsep" in e) {
          isRep = this.ditaRenderer.sequenceRenderer({ inline: true })(e, new RenderingContext(-1)) || "";
          continue;
        }
        const c = this.convertToSgBase(e);
        if (c) {
          res.addOptional(c);
        }
      }
    } else {
      for (const [i, e] of required.entries()) {
        if ("repsep" in e) {
          isRep = this.ditaRenderer.sequenceRenderer({ inline: true })(e, new RenderingContext(-1)) || "";
          continue;
        }
        const c = this.convertToSgBase(e);
        if (c) {
          if (isGroupDefault && res.getDefaultGroupHeight() === 0 && !e[":@"].importance) {
            res.addDefault(c);
          } else {
            res.addRequired(c);
          }
        }
      }
    }
    for (const e of optionals) {
      const c = this.convertToSgBase(e);
      if (c) {
        res.addRequired(c);
      }
    }
    if (isRep !== void 0) {
      return new SD_RepGroup(res, isRep);
    }
    return res;
  }
};

// src/dita-to-text.ts
var defaultLineLength = 65;
function convert(content, lineLength, logger, noTm) {
  const parser = new XMLParser({
    preserveOrder: true,
    ignoreAttributes: false,
    trimValues: false,
    // Do not let the parser trim, or we'll lost spaces before/after inline elements (bold, italic, ...)
    attributeNamePrefix: "",
    // Use this to set the element name as attribute, so we don't need to loop through keys to find it every time
    updateTag(tagName, jPath, attrs) {
      if (attrs) {
        attrs["elementName"] = tagName;
      }
      return tagName;
    }
  });
  const doc = parser.parse(content);
  const states = elementsByName(doc, "state");
  const offsetState = states.find((e) => attr(e, "name") === "fn_offset");
  let fnOffset;
  if (offsetState) {
    fnOffset = parseInt(attr(offsetState, "value") || "0") + 1;
  }
  const context = new RenderingContext(lineLength);
  const tableIdState = states.find((e) => attr(e, "name") === "table_id");
  if (tableIdState) {
    const tableId = parseInt(attr(tableIdState, "value") || "");
    if (!isNaN(tableId)) {
      context.putProp("tableId", tableId);
    }
  }
  const withoutStates = doc.filter((e) => getElementName(e) !== "state");
  const renderer = new DitaRenderer(logger, fnOffset || 1);
  new CommonElements(renderer);
  new DitaTable(renderer, logger);
  new SyntaxDiagram(renderer, logger, noTm);
  let output = "";
  for (const e of withoutStates) {
    output += renderer.renderElement(e, context);
  }
  logger.debug("output");
  logger.debug(output || "");
  return output || "FAILED RENDERING ELEMENT";
}
function readOpt(params, name) {
  const re = new RegExp(`^--${name}=(.*)$`);
  let m;
  for (const p of params) {
    if (m = re.exec(p)) {
      return m[1];
    }
  }
}
function main() {
  const params = process.argv.slice(2);
  const positionalArgsOnly = params.filter((e) => !/^--/.test(e));
  const [srcFile, outputFile] = positionalArgsOnly;
  const logger = new Logger("info");
  if (!srcFile || !outputFile) {
    logger.error("Usage: <srcFile> <outputFile>");
    process.exit(99);
  }
  let content;
  try {
    content = (0, import_fs.readFileSync)(srcFile, "utf-8");
  } catch (error) {
    logger.error(`ERROR: Could not read ${srcFile}`);
    process.exit(2);
  }
  let lineLength = defaultLineLength;
  const lineLengthOpt = readOpt(params, "line-length");
  if (lineLengthOpt) {
    const m = /^(\d+)/.exec(lineLengthOpt);
    if (m) {
      lineLength = parseInt(m[1]);
      logger.debug(`INFO: Line length set by option to ${lineLength}`);
    } else {
      logger.warn(`WARN: Invalid line length. Number expected, got ${lineLengthOpt.substring(14)}`);
    }
  } else {
    logger.debug(`INFO: Using default line length: ${lineLength}`);
  }
  const tmOpt = readOpt(params, "no-tm");
  const tableAsText = convert(content, lineLength, logger, tmOpt === "yes" || tmOpt === "true");
  (0, import_fs.writeFileSync)(outputFile, tableAsText, "utf-8");
}
main();
/*! Bundled license information:

repeat-string/index.js:
  (*!
   * repeat-string <https://github.com/jonschlinkert/repeat-string>
   *
   * Copyright (c) 2014-2015, Jon Schlinkert.
   * Licensed under the MIT License.
   *)

longest/index.js:
  (*!
   * longest <https://github.com/jonschlinkert/longest>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   *)

align-text/index.js:
  (*!
   * align-text <https://github.com/jonschlinkert/align-text>
   *
   * Copyright (c) 2015-2017, Jon Schlinkert.
   * Released under the MIT License.
   *)
*/
