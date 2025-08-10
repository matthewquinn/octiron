var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
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
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// node_modules/.deno/uri-templates@0.2.0/node_modules/uri-templates/uri-templates.js
var require_uri_templates = __commonJS({
  "node_modules/.deno/uri-templates@0.2.0/node_modules/uri-templates/uri-templates.js"(exports, module) {
    (function(global, factory) {
      if (typeof define === "function" && define.amd) {
        define("uri-templates", [], factory);
      } else if (typeof module !== "undefined" && module.exports) {
        module.exports = factory();
      } else {
        global.UriTemplate = factory();
      }
    })(exports, function() {
      var uriTemplateGlobalModifiers = {
        "+": true,
        "#": true,
        ".": true,
        "/": true,
        ";": true,
        "?": true,
        "&": true
      };
      var uriTemplateSuffices = {
        "*": true
      };
      var urlEscapedChars = /[:/&?#]/;
      function notReallyPercentEncode(string) {
        return encodeURI(string).replace(/%25[0-9][0-9]/g, function(doubleEncoded) {
          return "%" + doubleEncoded.substring(3);
        });
      }
      function isPercentEncoded(string) {
        string = string.replace(/%../g, "");
        return encodeURIComponent(string) === string;
      }
      function uriTemplateSubstitution(spec) {
        var modifier = "";
        if (uriTemplateGlobalModifiers[spec.charAt(0)]) {
          modifier = spec.charAt(0);
          spec = spec.substring(1);
        }
        var separator = "";
        var prefix = "";
        var shouldEscape = true;
        var showVariables = false;
        var trimEmptyString = false;
        if (modifier == "+") {
          shouldEscape = false;
        } else if (modifier == ".") {
          prefix = ".";
          separator = ".";
        } else if (modifier == "/") {
          prefix = "/";
          separator = "/";
        } else if (modifier == "#") {
          prefix = "#";
          shouldEscape = false;
        } else if (modifier == ";") {
          prefix = ";";
          separator = ";", showVariables = true;
          trimEmptyString = true;
        } else if (modifier == "?") {
          prefix = "?";
          separator = "&", showVariables = true;
        } else if (modifier == "&") {
          prefix = "&";
          separator = "&", showVariables = true;
        }
        var varNames = [];
        var varList = spec.split(",");
        var varSpecs = [];
        var varSpecMap = {};
        for (var i = 0; i < varList.length; i++) {
          var varName = varList[i];
          var truncate = null;
          if (varName.indexOf(":") != -1) {
            var parts = varName.split(":");
            varName = parts[0];
            truncate = parseInt(parts[1]);
          }
          var suffices = {};
          while (uriTemplateSuffices[varName.charAt(varName.length - 1)]) {
            suffices[varName.charAt(varName.length - 1)] = true;
            varName = varName.substring(0, varName.length - 1);
          }
          var varSpec = {
            truncate,
            name: varName,
            suffices
          };
          varSpecs.push(varSpec);
          varSpecMap[varName] = varSpec;
          varNames.push(varName);
        }
        var subFunction = function(valueFunction) {
          var result = "";
          var startIndex = 0;
          for (var i2 = 0; i2 < varSpecs.length; i2++) {
            var varSpec2 = varSpecs[i2];
            var value = valueFunction(varSpec2.name);
            if (value == null || Array.isArray(value) && value.length == 0 || typeof value == "object" && Object.keys(value).length == 0) {
              startIndex++;
              continue;
            }
            if (i2 == startIndex) {
              result += prefix;
            } else {
              result += separator || ",";
            }
            if (Array.isArray(value)) {
              if (showVariables) {
                result += varSpec2.name + "=";
              }
              for (var j = 0; j < value.length; j++) {
                if (j > 0) {
                  result += varSpec2.suffices["*"] ? separator || "," : ",";
                  if (varSpec2.suffices["*"] && showVariables) {
                    result += varSpec2.name + "=";
                  }
                }
                result += shouldEscape ? encodeURIComponent(value[j]).replace(/!/g, "%21") : notReallyPercentEncode(value[j]);
              }
            } else if (typeof value == "object") {
              if (showVariables && !varSpec2.suffices["*"]) {
                result += varSpec2.name + "=";
              }
              var first = true;
              for (var key in value) {
                if (!first) {
                  result += varSpec2.suffices["*"] ? separator || "," : ",";
                }
                first = false;
                result += shouldEscape ? encodeURIComponent(key).replace(/!/g, "%21") : notReallyPercentEncode(key);
                result += varSpec2.suffices["*"] ? "=" : ",";
                result += shouldEscape ? encodeURIComponent(value[key]).replace(/!/g, "%21") : notReallyPercentEncode(value[key]);
              }
            } else {
              if (showVariables) {
                result += varSpec2.name;
                if (!trimEmptyString || value != "") {
                  result += "=";
                }
              }
              if (varSpec2.truncate != null) {
                value = value.substring(0, varSpec2.truncate);
              }
              result += shouldEscape ? encodeURIComponent(value).replace(/!/g, "%21") : notReallyPercentEncode(value);
            }
          }
          return result;
        };
        var guessFunction = function(stringValue, resultObj, strict) {
          if (prefix) {
            stringValue = stringValue.substring(prefix.length);
          }
          if (varSpecs.length == 1 && varSpecs[0].suffices["*"]) {
            var varSpec2 = varSpecs[0];
            var varName2 = varSpec2.name;
            var arrayValue = varSpec2.suffices["*"] ? stringValue.split(separator || ",") : [stringValue];
            var hasEquals = shouldEscape && stringValue.indexOf("=") != -1;
            for (var i2 = 1; i2 < arrayValue.length; i2++) {
              var stringValue = arrayValue[i2];
              if (hasEquals && stringValue.indexOf("=") == -1) {
                arrayValue[i2 - 1] += (separator || ",") + stringValue;
                arrayValue.splice(i2, 1);
                i2--;
              }
            }
            for (var i2 = 0; i2 < arrayValue.length; i2++) {
              var stringValue = arrayValue[i2];
              if (shouldEscape && stringValue.indexOf("=") != -1) {
                hasEquals = true;
              }
              var innerArrayValue = stringValue.split(",");
              if (innerArrayValue.length == 1) {
                arrayValue[i2] = innerArrayValue[0];
              } else {
                arrayValue[i2] = innerArrayValue;
              }
            }
            if (showVariables || hasEquals) {
              var objectValue = resultObj[varName2] || {};
              for (var j = 0; j < arrayValue.length; j++) {
                var innerValue = stringValue;
                if (showVariables && !innerValue) {
                  continue;
                }
                if (typeof arrayValue[j] == "string") {
                  var stringValue = arrayValue[j];
                  var innerVarName = stringValue.split("=", 1)[0];
                  var stringValue = stringValue.substring(innerVarName.length + 1);
                  if (shouldEscape) {
                    if (strict && !isPercentEncoded(stringValue)) {
                      return;
                    }
                    stringValue = decodeURIComponent(stringValue);
                  }
                  innerValue = stringValue;
                } else {
                  var stringValue = arrayValue[j][0];
                  var innerVarName = stringValue.split("=", 1)[0];
                  var stringValue = stringValue.substring(innerVarName.length + 1);
                  if (shouldEscape) {
                    if (strict && !isPercentEncoded(stringValue)) {
                      return;
                    }
                    stringValue = decodeURIComponent(stringValue);
                  }
                  arrayValue[j][0] = stringValue;
                  innerValue = arrayValue[j];
                }
                if (shouldEscape) {
                  if (strict && !isPercentEncoded(innerVarName)) {
                    return;
                  }
                  innerVarName = decodeURIComponent(innerVarName);
                }
                if (objectValue[innerVarName] !== void 0) {
                  if (Array.isArray(objectValue[innerVarName])) {
                    objectValue[innerVarName].push(innerValue);
                  } else {
                    objectValue[innerVarName] = [objectValue[innerVarName], innerValue];
                  }
                } else {
                  objectValue[innerVarName] = innerValue;
                }
              }
              if (Object.keys(objectValue).length == 1 && objectValue[varName2] !== void 0) {
                resultObj[varName2] = objectValue[varName2];
              } else {
                resultObj[varName2] = objectValue;
              }
            } else {
              if (shouldEscape) {
                for (var j = 0; j < arrayValue.length; j++) {
                  var innerArrayValue = arrayValue[j];
                  if (Array.isArray(innerArrayValue)) {
                    for (var k = 0; k < innerArrayValue.length; k++) {
                      if (strict && !isPercentEncoded(innerArrayValue[k])) {
                        return;
                      }
                      innerArrayValue[k] = decodeURIComponent(innerArrayValue[k]);
                    }
                  } else {
                    if (strict && !isPercentEncoded(innerArrayValue)) {
                      return;
                    }
                    arrayValue[j] = decodeURIComponent(innerArrayValue);
                  }
                }
              }
              if (resultObj[varName2] !== void 0) {
                if (Array.isArray(resultObj[varName2])) {
                  resultObj[varName2] = resultObj[varName2].concat(arrayValue);
                } else {
                  resultObj[varName2] = [resultObj[varName2]].concat(arrayValue);
                }
              } else {
                if (arrayValue.length == 1 && !varSpec2.suffices["*"]) {
                  resultObj[varName2] = arrayValue[0];
                } else {
                  resultObj[varName2] = arrayValue;
                }
              }
            }
          } else {
            var arrayValue = varSpecs.length == 1 ? [stringValue] : stringValue.split(separator || ",");
            var specIndexMap = {};
            for (var i2 = 0; i2 < arrayValue.length; i2++) {
              var firstStarred = 0;
              for (; firstStarred < varSpecs.length - 1 && firstStarred < i2; firstStarred++) {
                if (varSpecs[firstStarred].suffices["*"]) {
                  break;
                }
              }
              if (firstStarred == i2) {
                specIndexMap[i2] = i2;
                continue;
              } else {
                for (var lastStarred = varSpecs.length - 1; lastStarred > 0 && varSpecs.length - lastStarred < arrayValue.length - i2; lastStarred--) {
                  if (varSpecs[lastStarred].suffices["*"]) {
                    break;
                  }
                }
                if (varSpecs.length - lastStarred == arrayValue.length - i2) {
                  specIndexMap[i2] = lastStarred;
                  continue;
                }
              }
              specIndexMap[i2] = firstStarred;
            }
            for (var i2 = 0; i2 < arrayValue.length; i2++) {
              var stringValue = arrayValue[i2];
              if (!stringValue && showVariables) {
                continue;
              }
              var innerArrayValue = stringValue.split(",");
              var hasEquals = false;
              if (showVariables) {
                var stringValue = innerArrayValue[0];
                var varName2 = stringValue.split("=", 1)[0];
                var stringValue = stringValue.substring(varName2.length + 1);
                innerArrayValue[0] = stringValue;
                var varSpec2 = varSpecMap[varName2] || varSpecs[0];
              } else {
                var varSpec2 = varSpecs[specIndexMap[i2]];
                var varName2 = varSpec2.name;
              }
              for (var j = 0; j < innerArrayValue.length; j++) {
                if (shouldEscape) {
                  if (strict && !isPercentEncoded(innerArrayValue[j])) {
                    return;
                  }
                  innerArrayValue[j] = decodeURIComponent(innerArrayValue[j]);
                }
              }
              if ((showVariables || varSpec2.suffices["*"]) && resultObj[varName2] !== void 0) {
                if (Array.isArray(resultObj[varName2])) {
                  resultObj[varName2] = resultObj[varName2].concat(innerArrayValue);
                } else {
                  resultObj[varName2] = [resultObj[varName2]].concat(innerArrayValue);
                }
              } else {
                if (innerArrayValue.length == 1 && !varSpec2.suffices["*"]) {
                  resultObj[varName2] = innerArrayValue[0];
                } else {
                  resultObj[varName2] = innerArrayValue;
                }
              }
            }
          }
          return 1;
        };
        return {
          varNames,
          prefix,
          substitution: subFunction,
          unSubstitution: guessFunction
        };
      }
      function UriTemplate(template) {
        if (!(this instanceof UriTemplate)) {
          return new UriTemplate(template);
        }
        var parts = template.split("{");
        var textParts = [parts.shift()];
        var prefixes = [];
        var substitutions = [];
        var unSubstitutions = [];
        var varNames = [];
        while (parts.length > 0) {
          var part = parts.shift();
          var spec = part.split("}")[0];
          var remainder = part.substring(spec.length + 1);
          var funcs = uriTemplateSubstitution(spec);
          substitutions.push(funcs.substitution);
          unSubstitutions.push(funcs.unSubstitution);
          prefixes.push(funcs.prefix);
          textParts.push(remainder);
          varNames = varNames.concat(funcs.varNames);
        }
        this.fill = function(valueFunction) {
          if (valueFunction && typeof valueFunction !== "function") {
            var value = valueFunction;
            valueFunction = function(varName) {
              return value[varName];
            };
          }
          var result = textParts[0];
          for (var i = 0; i < substitutions.length; i++) {
            var substitution = substitutions[i];
            result += substitution(valueFunction);
            result += textParts[i + 1];
          }
          return result;
        };
        this.fromUri = function(substituted, options) {
          options = options || {};
          var result = {};
          for (var i = 0; i < textParts.length; i++) {
            var part2 = textParts[i];
            if (substituted.substring(0, part2.length) !== part2) {
              return;
            }
            substituted = substituted.substring(part2.length);
            if (i >= textParts.length - 1) {
              if (substituted == "") {
                break;
              } else {
                return;
              }
            }
            var prefix = prefixes[i];
            if (prefix && substituted.substring(0, prefix.length) !== prefix) {
              continue;
            }
            var nextPart = textParts[i + 1];
            var offset = i;
            while (true) {
              if (offset == textParts.length - 2) {
                var endPart = substituted.substring(substituted.length - nextPart.length);
                if (endPart !== nextPart) {
                  return;
                }
                var stringValue = substituted.substring(0, substituted.length - nextPart.length);
                substituted = endPart;
              } else if (nextPart) {
                var nextPartPos = substituted.indexOf(nextPart);
                var stringValue = substituted.substring(0, nextPartPos);
                substituted = substituted.substring(nextPartPos);
              } else if (prefixes[offset + 1]) {
                var nextPartPos = substituted.indexOf(prefixes[offset + 1]);
                if (nextPartPos === -1) nextPartPos = substituted.length;
                var stringValue = substituted.substring(0, nextPartPos);
                substituted = substituted.substring(nextPartPos);
              } else if (textParts.length > offset + 2) {
                offset++;
                nextPart = textParts[offset + 1];
                continue;
              } else {
                var stringValue = substituted;
                substituted = "";
              }
              break;
            }
            if (!unSubstitutions[i](stringValue, result, options.strict)) {
              return;
            }
          }
          return result;
        };
        this.varNames = varNames;
        this.template = template;
      }
      UriTemplate.prototype = {
        toString: function() {
          return this.template;
        },
        fillFromObject: function(obj) {
          return this.fill(obj);
        },
        test: function(uri, options) {
          return !!this.fromUri(uri, options);
        }
      };
      return UriTemplate;
    });
  }
});

// lib/factories/rootFactory.ts
import m6 from "mithril";

// lib/renderers/SelectionRenderer.ts
import m5 from "mithril";

// lib/factories/selectionFactory.ts
import m4 from "mithril";

// lib/utils/getComponent.ts
function getComponent({
  style,
  datatype,
  type,
  firstPickComponent,
  typeDefs,
  fallbackComponent
}) {
  var _a, _b, _c;
  if (firstPickComponent != null) {
    return firstPickComponent;
  }
  if (datatype != null && ((_a = typeDefs[datatype]) == null ? void 0 : _a[style]) != null) {
    return typeDefs[datatype][style];
  }
  if (typeof type === "string" && ((_b = typeDefs[type]) == null ? void 0 : _b[style]) != null) {
    return typeDefs[type][style];
  }
  if (Array.isArray(type)) {
    for (const item of type) {
      if (((_c = typeDefs[item]) == null ? void 0 : _c[style]) != null) {
        return typeDefs[item][style];
      }
    }
  }
  if (typeof fallbackComponent !== "undefined") {
    return fallbackComponent;
  }
}

// lib/utils/unravelArgs.ts
function unravelArgs(arg1, arg2, arg3) {
  let selector;
  let args = {};
  let view;
  if (typeof arg1 === "string") {
    selector = arg1;
  } else if (typeof arg1 === "function") {
    view = arg1;
  } else if (arg1 != null) {
    args = arg1;
  }
  if (typeof arg2 === "function") {
    view = arg2;
  } else if (arg2 != null) {
    args = arg2;
  }
  if (typeof arg3 === "function") {
    view = arg3;
  }
  if (typeof view === "undefined") {
    view = (o) => o.default(args);
  }
  return [
    selector,
    args,
    view
  ];
}

// lib/utils/isJSONObject.ts
function isJSONObject(value) {
  return typeof value === "object" && !Array.isArray(value) && value !== null;
}

// lib/utils/isTypedObject.ts
function isTypeObject(value) {
  if (!isJSONObject(value)) {
    return false;
  } else if (typeof value["@type"] === "string") {
    return true;
  } else if (!Array.isArray(value["@type"])) {
    return false;
  }
  for (const item of value["@type"]) {
    if (typeof item !== "string") {
      return false;
    }
  }
  return true;
}

// lib/utils/getValueType.ts
function getValueType(value) {
  if (isTypeObject(value)) {
    return value["@type"];
  }
}

// lib/factories/actionFactory.ts
import m3 from "mithril";

// node_modules/.deno/json-ptr@3.1.1/node_modules/json-ptr/dist/esm/index.js
function replace(source, find, repl) {
  let res = "";
  let rem = source;
  let beg = 0;
  let end = -1;
  while ((end = rem.indexOf(find)) > -1) {
    res += source.substring(beg, beg + end) + repl;
    rem = rem.substring(end + find.length, rem.length);
    beg += end + find.length;
  }
  if (rem.length > 0) {
    res += source.substring(source.length - rem.length, source.length);
  }
  return res;
}
function decodeFragmentSegments(segments) {
  let i = -1;
  const len = segments.length;
  const res = new Array(len);
  while (++i < len) {
    if (typeof segments[i] === "string") {
      res[i] = replace(replace(decodeURIComponent(segments[i]), "~1", "/"), "~0", "~");
    } else {
      res[i] = segments[i];
    }
  }
  return res;
}
function encodeFragmentSegments(segments) {
  let i = -1;
  const len = segments.length;
  const res = new Array(len);
  while (++i < len) {
    if (typeof segments[i] === "string") {
      res[i] = encodeURIComponent(replace(replace(segments[i], "~", "~0"), "/", "~1"));
    } else {
      res[i] = segments[i];
    }
  }
  return res;
}
function decodePointerSegments(segments) {
  let i = -1;
  const len = segments.length;
  const res = new Array(len);
  while (++i < len) {
    if (typeof segments[i] === "string") {
      res[i] = replace(replace(segments[i], "~1", "/"), "~0", "~");
    } else {
      res[i] = segments[i];
    }
  }
  return res;
}
function encodePointerSegments(segments) {
  let i = -1;
  const len = segments.length;
  const res = new Array(len);
  while (++i < len) {
    if (typeof segments[i] === "string") {
      res[i] = replace(replace(segments[i], "~", "~0"), "/", "~1");
    } else {
      res[i] = segments[i];
    }
  }
  return res;
}
function decodePointer(ptr) {
  if (typeof ptr !== "string") {
    throw new TypeError("Invalid type: JSON Pointers are represented as strings.");
  }
  if (ptr.length === 0) {
    return [];
  }
  if (ptr[0] !== "/") {
    throw new ReferenceError("Invalid JSON Pointer syntax. Non-empty pointer must begin with a solidus `/`.");
  }
  return decodePointerSegments(ptr.substring(1).split("/"));
}
function encodePointer(path) {
  if (!path || path && !Array.isArray(path)) {
    throw new TypeError("Invalid type: path must be an array of segments.");
  }
  if (path.length === 0) {
    return "";
  }
  return "/".concat(encodePointerSegments(path).join("/"));
}
function decodeUriFragmentIdentifier(ptr) {
  if (typeof ptr !== "string") {
    throw new TypeError("Invalid type: JSON Pointers are represented as strings.");
  }
  if (ptr.length === 0 || ptr[0] !== "#") {
    throw new ReferenceError("Invalid JSON Pointer syntax; URI fragment identifiers must begin with a hash.");
  }
  if (ptr.length === 1) {
    return [];
  }
  if (ptr[1] !== "/") {
    throw new ReferenceError("Invalid JSON Pointer syntax.");
  }
  return decodeFragmentSegments(ptr.substring(2).split("/"));
}
function encodeUriFragmentIdentifier(path) {
  if (!path || path && !Array.isArray(path)) {
    throw new TypeError("Invalid type: path must be an array of segments.");
  }
  if (path.length === 0) {
    return "#";
  }
  return "#/".concat(encodeFragmentSegments(path).join("/"));
}
var InvalidRelativePointerError = "Invalid Relative JSON Pointer syntax. Relative pointer must begin with a non-negative integer, followed by either the number sign (#), or a JSON Pointer.";
function decodeRelativePointer(ptr) {
  if (typeof ptr !== "string") {
    throw new TypeError("Invalid type: Relative JSON Pointers are represented as strings.");
  }
  if (ptr.length === 0) {
    throw new ReferenceError(InvalidRelativePointerError);
  }
  const segments = ptr.split("/");
  let first = segments[0];
  if (first[first.length - 1] == "#") {
    if (segments.length > 1) {
      throw new ReferenceError(InvalidRelativePointerError);
    }
    first = first.substr(0, first.length - 1);
  }
  let i = -1;
  const len = first.length;
  while (++i < len) {
    if (first[i] < "0" || first[i] > "9") {
      throw new ReferenceError(InvalidRelativePointerError);
    }
  }
  const path = decodePointerSegments(segments.slice(1));
  path.unshift(segments[0]);
  return path;
}
function toArrayIndexReference(arr, idx) {
  if (typeof idx === "number")
    return idx;
  const len = idx.length;
  if (!len)
    return -1;
  let cursor = 0;
  if (len === 1 && idx[0] === "-") {
    if (!Array.isArray(arr)) {
      return 0;
    }
    return arr.length;
  }
  while (++cursor < len) {
    if (idx[cursor] < "0" || idx[cursor] > "9") {
      return -1;
    }
  }
  return parseInt(idx, 10);
}
function compilePointerDereference(path) {
  let body = "if (typeof(it) !== 'undefined'";
  if (path.length === 0) {
    return (it) => it;
  }
  body = path.reduce((body2, _, i) => {
    return body2 + "\n	&& it !== null && typeof((it = it['" + replace(replace(path[i] + "", "\\", "\\\\"), "'", "\\'") + "'])) !== 'undefined'";
  }, "if (typeof(it) !== 'undefined'");
  body = body + ") {\n	return it;\n }";
  return new Function("it", body);
}
function setValueAtPath(target, val, path, force = false) {
  if (path.length === 0) {
    throw new Error("Cannot set the root object; assign it directly.");
  }
  if (typeof target === "undefined") {
    throw new TypeError("Cannot set values on undefined");
  }
  let it = target;
  const len = path.length;
  const end = path.length - 1;
  let step;
  let cursor = -1;
  let rem;
  let p;
  while (++cursor < len) {
    step = path[cursor];
    if (typeof step !== "string" && typeof step !== "number") {
      throw new TypeError("PathSegments must be a string or a number.");
    }
    if (
      // Reconsider this strategy. It disallows legitimate structures on
      // non - objects, or more precisely, on objects not derived from a class
      // or constructor function.
      step === "__proto__" || step === "constructor" || step === "prototype"
    ) {
      throw new Error("Attempted prototype pollution disallowed.");
    }
    if (Array.isArray(it)) {
      if (step === "-" && cursor === end) {
        it.push(val);
        return void 0;
      }
      p = toArrayIndexReference(it, step);
      if (it.length > p) {
        if (cursor === end) {
          rem = it[p];
          it[p] = val;
          break;
        }
        it = it[p];
      } else if (cursor === end && p === it.length) {
        if (force) {
          it.push(val);
          return void 0;
        }
      } else if (force) {
        it = it[p] = cursor === end ? val : {};
      }
    } else {
      if (typeof it[step] === "undefined") {
        if (force) {
          if (cursor === end) {
            it[step] = val;
            return void 0;
          }
          const n = Number(path[cursor + 1]);
          if (Number.isInteger(n) && toArrayIndexReference(it[step], n) !== -1) {
            it = it[step] = [];
            continue;
          }
          it = it[step] = {};
          continue;
        }
        return void 0;
      }
      if (cursor === end) {
        rem = it[step];
        it[step] = val;
        break;
      }
      it = it[step];
    }
  }
  return rem;
}
function unsetValueAtPath(target, path) {
  if (path.length === 0) {
    throw new Error("Cannot unset the root object; assign it directly.");
  }
  if (typeof target === "undefined") {
    throw new TypeError("Cannot unset values on undefined");
  }
  let it = target;
  const len = path.length;
  const end = path.length - 1;
  let step;
  let cursor = -1;
  let rem;
  let p;
  while (++cursor < len) {
    step = path[cursor];
    if (typeof step !== "string" && typeof step !== "number") {
      throw new TypeError("PathSegments must be a string or a number.");
    }
    if (step === "__proto__" || step === "constructor" || step === "prototype") {
      throw new Error("Attempted prototype pollution disallowed.");
    }
    if (Array.isArray(it)) {
      p = toArrayIndexReference(it, step);
      if (p >= it.length)
        return void 0;
      if (cursor === end) {
        rem = it[p];
        delete it[p];
        break;
      }
      it = it[p];
    } else {
      if (typeof it[step] === "undefined") {
        return void 0;
      }
      if (cursor === end) {
        rem = it[step];
        delete it[step];
        break;
      }
      it = it[step];
    }
  }
  return rem;
}
function looksLikeFragment(ptr) {
  return typeof ptr === "string" && ptr.length > 0 && ptr[0] === "#";
}
function pickDecoder(ptr) {
  return looksLikeFragment(ptr) ? decodeUriFragmentIdentifier : decodePointer;
}
function decodePtrInit(ptr) {
  return Array.isArray(ptr) ? ptr.slice(0) : pickDecoder(ptr)(ptr);
}
function isObject(value) {
  return typeof value === "object" && value !== null;
}
function shouldDescend(obj) {
  return isObject(obj) && !JsonReference.isReference(obj);
}
function descendingVisit(target, visitor, encoder) {
  const distinctObjects = /* @__PURE__ */ new Map();
  const q = [{ obj: target, path: [] }];
  while (q.length) {
    const { obj, path } = q.shift();
    visitor(encoder(path), obj);
    if (shouldDescend(obj)) {
      distinctObjects.set(obj, new JsonPointer(encodeUriFragmentIdentifier(path)));
      if (!Array.isArray(obj)) {
        const keys = Object.keys(obj);
        const len = keys.length;
        let i = -1;
        while (++i < len) {
          const it = obj[keys[i]];
          if (isObject(it) && distinctObjects.has(it)) {
            q.push({
              obj: new JsonReference(distinctObjects.get(it)),
              path: path.concat(keys[i])
            });
          } else {
            q.push({
              obj: it,
              path: path.concat(keys[i])
            });
          }
        }
      } else {
        let j = -1;
        const len = obj.length;
        while (++j < len) {
          const it = obj[j];
          if (isObject(it) && distinctObjects.has(it)) {
            q.push({
              obj: new JsonReference(distinctObjects.get(it)),
              path: path.concat([j + ""])
            });
          } else {
            q.push({
              obj: it,
              path: path.concat([j + ""])
            });
          }
        }
      }
    }
  }
}
var $ptr = Symbol("pointer");
var $frg = Symbol("fragmentId");
var $get = Symbol("getter");
var JsonPointer = class _JsonPointer {
  /**
   * Creates a new instance.
   * @param ptr a string representation of a JSON Pointer, or a decoded array of path segments.
   */
  constructor(ptr) {
    this.path = decodePtrInit(ptr);
  }
  /**
   * Factory function that creates a JsonPointer instance.
   *
   * ```ts
   * const ptr = JsonPointer.create('/deeply/nested/data/0/here');
   * ```
   * _or_
   * ```ts
   * const ptr = JsonPointer.create(['deeply', 'nested', 'data', 0, 'here']);
   * ```
   * @param pointer the pointer or path.
   */
  static create(pointer) {
    return new _JsonPointer(pointer);
  }
  /**
   * Determines if the specified `target`'s object graph has a value at the `pointer`'s location.
   *
   * ```ts
   * const target = {
   *   first: 'second',
   *   third: ['fourth', 'fifth', { sixth: 'seventh' }],
   *   eighth: 'ninth'
   * };
   *
   * console.log(JsonPointer.has(target, '/third/0'));
   * // true
   * console.log(JsonPointer.has(target, '/tenth'));
   * // false
   * ```
   *
   * @param target the target of the operation
   * @param pointer the pointer or path
   */
  static has(target, pointer) {
    if (typeof pointer === "string" || Array.isArray(pointer)) {
      pointer = new _JsonPointer(pointer);
    }
    return pointer.has(target);
  }
  /**
   * Gets the `target` object's value at the `pointer`'s location.
   *
   * ```ts
   * const target = {
   *   first: 'second',
   *   third: ['fourth', 'fifth', { sixth: 'seventh' }],
   *   eighth: 'ninth'
   * };
   *
   * console.log(JsonPointer.get(target, '/third/2/sixth'));
   * // seventh
   * console.log(JsonPointer.get(target, '/tenth'));
   * // undefined
   * ```
   *
   * @param target the target of the operation
   * @param pointer the pointer or path.
   */
  static get(target, pointer) {
    if (typeof pointer === "string" || Array.isArray(pointer)) {
      pointer = new _JsonPointer(pointer);
    }
    return pointer.get(target);
  }
  /**
   * Sets the `target` object's value, as specified, at the `pointer`'s location.
   *
   * ```ts
   * const target = {
   *   first: 'second',
   *   third: ['fourth', 'fifth', { sixth: 'seventh' }],
   *   eighth: 'ninth'
   * };
   *
   * console.log(JsonPointer.set(target, '/third/2/sixth', 'tenth'));
   * // seventh
   * console.log(JsonPointer.set(target, '/tenth', 'eleventh', true));
   * // undefined
   * console.log(JSON.stringify(target, null, ' '));
   * // {
   * // "first": "second",
   * // "third": [
   * //  "fourth",
   * //  "fifth",
   * //  {
   * //   "sixth": "tenth"
   * //  }
   * // ],
   * // "eighth": "ninth",
   * // "tenth": "eleventh"
   * // }
   * ```
   *
   * @param target the target of the operation
   * @param pointer the pointer or path
   * @param val a value to write into the object graph at the specified pointer location
   * @param force indications whether the operation should force the pointer's location into existence in the object graph.
   *
   * @returns the prior value at the pointer's location in the object graph.
   */
  static set(target, pointer, val, force = false) {
    if (typeof pointer === "string" || Array.isArray(pointer)) {
      pointer = new _JsonPointer(pointer);
    }
    return pointer.set(target, val, force);
  }
  /**
   * Removes the `target` object's value at the `pointer`'s location.
   *
   * ```ts
   * const target = {
   *   first: 'second',
   *   third: ['fourth', 'fifth', { sixth: 'seventh' }],
   *   eighth: 'ninth'
   * };
   *
   * console.log(JsonPointer.unset(target, '/third/2/sixth'));
   * // seventh
   * console.log(JsonPointer.unset(target, '/tenth'));
   * // undefined
   * console.log(JSON.stringify(target, null, ' '));
   * // {
   * // "first": "second",
   * // "third": [
   * //  "fourth",
   * //  "fifth",
   * //  {}
   * // ],
   * // "eighth": "ninth",
   * // }
   * ```
   * @param target the target of the operation
   * @param pointer the pointer or path
   *
   * @returns the value that was removed from the object graph.
   */
  static unset(target, pointer) {
    if (typeof pointer === "string" || Array.isArray(pointer)) {
      pointer = new _JsonPointer(pointer);
    }
    return pointer.unset(target);
  }
  /**
   * Decodes the specified pointer into path segments.
   * @param pointer a string representation of a JSON Pointer
   */
  static decode(pointer) {
    return pickDecoder(pointer)(pointer);
  }
  /**
   * Evaluates the target's object graph, calling the specified visitor for every unique pointer location discovered while walking the graph.
   * @param target the target of the operation
   * @param visitor a callback function invoked for each unique pointer location in the object graph
   * @param fragmentId indicates whether the visitor should receive fragment identifiers or regular pointers
   */
  static visit(target, visitor, fragmentId = false) {
    descendingVisit(target, visitor, fragmentId ? encodeUriFragmentIdentifier : encodePointer);
  }
  /**
   * Evaluates the target's object graph, returning a [[JsonStringPointerListItem]] for each location in the graph.
   * @param target the target of the operation
   */
  static listPointers(target) {
    const res = [];
    descendingVisit(target, (pointer, value) => {
      res.push({ pointer, value });
    }, encodePointer);
    return res;
  }
  /**
   * Evaluates the target's object graph, returning a [[UriFragmentIdentifierPointerListItem]] for each location in the graph.
   * @param target the target of the operation
   */
  static listFragmentIds(target) {
    const res = [];
    descendingVisit(target, (fragmentId, value) => {
      res.push({ fragmentId, value });
    }, encodeUriFragmentIdentifier);
    return res;
  }
  /**
   * Evaluates the target's object graph, returning a Record&lt;Pointer, unknown> populated with pointers and the corresponding values from the graph.
   * @param target the target of the operation
   * @param fragmentId indicates whether the results are populated with fragment identifiers rather than regular pointers
   */
  static flatten(target, fragmentId = false) {
    const res = {};
    descendingVisit(target, (p, v) => {
      res[p] = v;
    }, fragmentId ? encodeUriFragmentIdentifier : encodePointer);
    return res;
  }
  /**
   * Evaluates the target's object graph, returning a Map&lt;Pointer,unknown>  populated with pointers and the corresponding values form the graph.
   * @param target the target of the operation
   * @param fragmentId indicates whether the results are populated with fragment identifiers rather than regular pointers
   */
  static map(target, fragmentId = false) {
    const res = /* @__PURE__ */ new Map();
    descendingVisit(target, res.set.bind(res), fragmentId ? encodeUriFragmentIdentifier : encodePointer);
    return res;
  }
  /**
   * Gets the target object's value at the pointer's location.
   * @param target the target of the operation
   */
  get(target) {
    if (!this[$get]) {
      this[$get] = compilePointerDereference(this.path);
    }
    return this[$get](target);
  }
  /**
   * Sets the target object's value, as specified, at the pointer's location.
   *
   * If any part of the pointer's path does not exist, the operation aborts
   * without modification, unless the caller indicates that pointer's location
   * should be created.
   *
   * @param target the target of the operation
   * @param value the value to set
   * @param force indicates whether the pointer's location should be created if it doesn't already exist.
   */
  set(target, value, force = false) {
    return setValueAtPath(target, value, this.path, force);
  }
  /**
   * Removes the target object's value at the pointer's location.
   * @param target the target of the operation
   *
   * @returns the value that was removed from the object graph.
   */
  unset(target) {
    return unsetValueAtPath(target, this.path);
  }
  /**
   * Determines if the specified target's object graph has a value at the pointer's location.
   * @param target the target of the operation
   */
  has(target) {
    return typeof this.get(target) !== "undefined";
  }
  /**
   * Gets the value in the object graph that is the parent of the pointer location.
   * @param target the target of the operation
   */
  parent(target) {
    const p = this.path;
    if (p.length == 1)
      return void 0;
    const parent = new _JsonPointer(p.slice(0, p.length - 1));
    return parent.get(target);
  }
  /**
   * Creates a new JsonPointer instance, pointing to the specified relative location in the object graph.
   * @param ptr the relative pointer (relative to this)
   * @returns A new instance that points to the relative location.
   */
  relative(ptr) {
    const p = this.path;
    const decoded = decodeRelativePointer(ptr);
    const n = parseInt(decoded[0]);
    if (n > p.length)
      throw new Error("Relative location does not exist.");
    const r = p.slice(0, p.length - n).concat(decoded.slice(1));
    if (decoded[0][decoded[0].length - 1] == "#") {
      const name = r[r.length - 1];
      throw new Error(`We won't compile a pointer that will always return '${name}'. Use JsonPointer.rel(target, ptr) instead.`);
    }
    return new _JsonPointer(r);
  }
  /**
   * Resolves the specified relative pointer path against the specified target object, and gets the target object's value at the relative pointer's location.
   * @param target the target of the operation
   * @param ptr the relative pointer (relative to this)
   * @returns the value at the relative pointer's resolved path; otherwise undefined.
   */
  rel(target, ptr) {
    const p = this.path;
    const decoded = decodeRelativePointer(ptr);
    const n = parseInt(decoded[0]);
    if (n > p.length) {
      return void 0;
    }
    const r = p.slice(0, p.length - n).concat(decoded.slice(1));
    const other = new _JsonPointer(r);
    if (decoded[0][decoded[0].length - 1] == "#") {
      const name = r[r.length - 1];
      const parent = other.parent(target);
      return Array.isArray(parent) ? parseInt(name, 10) : name;
    }
    return other.get(target);
  }
  /**
   * Creates a new instance by concatenating the specified pointer's path onto this pointer's path.
   * @param ptr the string representation of a pointer, it's decoded path, or an instance of JsonPointer indicating the additional path to concatenate onto the pointer.
   */
  concat(ptr) {
    return new _JsonPointer(this.path.concat(ptr instanceof _JsonPointer ? ptr.path : decodePtrInit(ptr)));
  }
  /**
   * This pointer's JSON Pointer encoded string representation.
   */
  get pointer() {
    if (this[$ptr] === void 0) {
      this[$ptr] = encodePointer(this.path);
    }
    return this[$ptr];
  }
  /**
   * This pointer's URI fragment identifier encoded string representation.
   */
  get uriFragmentIdentifier() {
    if (!this[$frg]) {
      this[$frg] = encodeUriFragmentIdentifier(this.path);
    }
    return this[$frg];
  }
  /**
   * Emits the JSON Pointer encoded string representation.
   */
  toString() {
    return this.pointer;
  }
};
var $pointer = Symbol("pointer");
var JsonReference = class {
  /**
   * Creates a new instance.
   * @param pointer a JSON Pointer for the reference.
   */
  constructor(pointer) {
    this[$pointer] = pointer instanceof JsonPointer ? pointer : new JsonPointer(pointer);
    this.$ref = this[$pointer].uriFragmentIdentifier;
  }
  /**
   * Determines if the specified `candidate` is a JsonReference.
   * @param candidate the candidate
   */
  static isReference(candidate) {
    if (!candidate)
      return false;
    const ref = candidate;
    return typeof ref.$ref === "string" && typeof ref.resolve === "function";
  }
  /**
   * Resolves the reference against the `target` object, returning the value at
   * the referenced pointer's location.
   * @param target the target object
   */
  resolve(target) {
    return this[$pointer].get(target);
  }
  /**
   * Gets the reference's pointer.
   */
  pointer() {
    return this[$pointer];
  }
  /**
   * Gets the reference pointer's string representation (a URI fragment identifier).
   */
  toString() {
    return this.$ref;
  }
};

// lib/renderers/ActionStateRenderer.ts
var ActionStateRenderer = () => {
  let submitResult;
  let o;
  function setInstance(attrs) {
    if (typeof attrs.refs.submitResult === "undefined") {
      submitResult = void 0;
      o = void 0;
    } else if (typeof submitResult === "undefined" || attrs.refs.submitResult.ok !== submitResult.ok || attrs.refs.submitResult.status !== submitResult.status || attrs.refs.submitResult.value !== submitResult.value) {
      submitResult = attrs.refs.submitResult;
      o = selectionFactory({
        value: submitResult.value,
        store: attrs.refs.store,
        typeDefs: attrs.refs.typeDefs
      });
    }
  }
  return {
    oninit: ({ attrs }) => {
      setInstance(attrs);
    },
    onbeforeupdate: ({ attrs }) => {
      setInstance(attrs);
    },
    view: ({ attrs: { type, selector, args, view }, children }) => {
      if (type === "initial" && typeof submitResult === "undefined") {
        return children;
      } else if (typeof submitResult === "undefined" || typeof o !== "function") {
        return null;
      }
      const shouldRender = type === "success" && submitResult.ok || type === "failure" && !submitResult.ok;
      if (shouldRender && selector != null && args != null && view != null) {
        return o.select(selector, args, view);
      } else if (shouldRender && typeof view === "function") {
        return view(o);
      } else if (shouldRender && typeof args !== "undefined") {
        return o.present(args);
      }
      return null;
    }
  };
};

// lib/utils/getSubmitDetails.ts
var import_uri_templates = __toESM(require_uri_templates());
function getSubmitDetails({
  payload,
  action,
  store
}) {
  let urlTemplate;
  let body;
  let method = "get";
  let contentType;
  let encodingType;
  let target = action["https://schema.org/target"];
  if (Array.isArray(target)) {
    for (const item of target) {
      if (item === "string") {
        target = item;
        break;
      } else if (isJSONObject(target) && (target["https://schema.org/contentType"] == null || (target["https://schema.org/contentType"] === "mutipart/form-data" || target["https://schema.org/contentType"] === "application/ld+json"))) {
        target = item;
        break;
      }
    }
  }
  if (typeof target === "string") {
    urlTemplate = target;
  } else if (isJSONObject(target)) {
    if (typeof target["https://schema.org/urlTemplate"] === "string") {
      urlTemplate = target["https://schema.org/urlTemplate"];
    }
    if (typeof target["https://schema.org/httpMethod"] === "string") {
      method = target["https://schema.org/httpMethod"].toLowerCase();
    }
    if (typeof target["https://schema.org/contentType"] === "string") {
      contentType = target["https://schema.org/contentType"];
    }
    if (typeof target["https://schema.org/encodingType"] === "string") {
      encodingType = target["https://schema.org/encodingType"];
    }
  }
  if (typeof urlTemplate !== "string") {
    throw new Error("Action has invalid https://schema.org/target");
  }
  const template = (0, import_uri_templates.default)(urlTemplate);
  const url = template.fill(payload);
  if (method !== "get" && method !== "delete") {
    const json = {};
    for (const [key, value] of Object.entries(payload)) {
      json[store.expand(key)] = value;
    }
  }
  return {
    url,
    method,
    contentType,
    encodingType,
    body
  };
}

// lib/utils/mithrilRedraw.ts
import m from "mithril";

// lib/consts.ts
var isBrowserRender = typeof window !== "undefined";

// lib/utils/mithrilRedraw.ts
function mithrilRedraw() {
  if (isBrowserRender) {
    m.redraw();
  }
}

// lib/factories/actionSelectionFactory.ts
import m2 from "mithril";

// lib/factories/octironFactory.ts
function octironFactory() {
  const self = function(predicate, children) {
    const passes = predicate(self);
    if (passes) {
      return children;
    }
    return null;
  };
  self.isOctiron = true;
  self.not = function(predicate, children) {
    if (self == null) {
      return null;
    }
    const passes = predicate(self);
    if (!passes) {
      return children;
    }
    return null;
  };
  return self;
}

// lib/factories/actionSelectionFactory.ts
function actionSelectionFactory(internals, args) {
  var _a;
  const factoryArgs = Object.assign({}, args);
  const uniqueId = internals.store.key();
  const refs = Object.assign({}, args);
  function onUpdate(value) {
    return internals.onUpdate(internals.pointer, value, {
      throttle: refs.throttle,
      debounce: refs.debounce,
      submitOnChange: refs.submitOnChange
    });
  }
  const self = octironFactory();
  self.octironType = "action-selection";
  self.readonly = internals.spec == null ? true : internals.spec.readonlyValue || false;
  self.store = internals.store;
  self.id = uniqueId;
  self.inputName = internals.datatype;
  self.submitting = internals.submitting;
  self.value = (_a = internals.value) != null ? _a : args.initialValue;
  self.action = internals.action;
  function onSelectionUpdate(pointer, value, args2, interceptor) {
    const prev = self.value;
    if (!isJSONObject(prev)) {
      console.warn(`Non object action change intercepted.`);
      return;
    }
    let next = Object.assign({}, prev);
    const ptr = JsonPointer.create(pointer);
    if (value == null) {
      ptr.unset(next);
    } else {
      ptr.set(next, value, true);
    }
    if (typeof interceptor === "function") {
      next = interceptor(next, prev, internals.actionValue);
    }
    internals.onUpdate(internals.pointer, next, args2);
  }
  self.update = function(arg1, args2) {
    return __async(this, null, function* () {
      const value = self.value;
      if (!isJSONObject(value)) {
        throw new Error(`Cannot call update on a non object selection instance`);
      }
      if (typeof arg1 === "function") {
        onUpdate(arg1(value));
      } else if (arg1 != null) {
        onUpdate(arg1);
      }
      if ((args2 == null ? void 0 : args2.submit) || (args2 == null ? void 0 : args2.submitOnChange)) {
        yield internals.onSubmit();
      } else {
        mithrilRedraw();
      }
    });
  };
  self.submit = function() {
    return internals.onSubmit();
  };
  self.root = function(arg1, arg2, arg3) {
    let selector;
    const [childSelector, args2, view] = unravelArgs(arg1, arg2, arg3);
    if (childSelector == null) {
      selector = internals.store.rootIRI;
    } else {
      selector = `${internals.store.rootIRI} ${childSelector}`;
    }
    return m2(SelectionRenderer, {
      selector,
      args: args2,
      view,
      internals: {
        store: internals.store,
        typeDefs: (args2 == null ? void 0 : args2.typeDefs) || (factoryArgs == null ? void 0 : factoryArgs.typeDefs) || internals.typeDefs,
        parent: self
      }
    });
  };
  self.select = function(arg1, arg2, arg3) {
    if (!isJSONObject(self.value)) {
      return null;
    }
    const [selector, args2, view] = unravelArgs(arg1, arg2, arg3);
    const onUpdate2 = (pointer, value, updateArgs) => {
      onSelectionUpdate(
        pointer,
        value,
        updateArgs,
        args2.interceptor
      );
    };
    return m2(
      ActionSelectionRenderer,
      {
        internals: {
          submitting: internals.submitting,
          entity: internals.entity,
          action: internals.action,
          parent: self,
          store: internals.store,
          typeDefs: internals.typeDefs,
          onSubmit: internals.onSubmit,
          onUpdate: onUpdate2
        },
        selector,
        value: self.value,
        actionValue: internals.actionValue,
        args: args2,
        view
      }
    );
  };
  self.enter = function(arg1, arg2, arg3) {
    const [selector, args2, view] = unravelArgs(arg1, arg2, arg3);
    return m2(SelectionRenderer, {
      selector,
      args: args2,
      view,
      internals: {
        store: internals.store,
        typeDefs: (args2 == null ? void 0 : args2.typeDefs) || (factoryArgs == null ? void 0 : factoryArgs.typeDefs) || internals.typeDefs,
        parent: self
      }
    });
  };
  self.present = (args2) => {
    let attrs = {};
    let firstPickComponent;
    let fallbackComponent;
    if ((args2 == null ? void 0 : args2.attrs) != null) {
      attrs = args2.attrs;
    } else if ((factoryArgs == null ? void 0 : factoryArgs.attrs) != null) {
      attrs = factoryArgs.attrs;
    }
    if ((args2 == null ? void 0 : args2.component) != null) {
      firstPickComponent = args2.component;
    } else if ((args2 == null ? void 0 : args2.component) !== null && (factoryArgs == null ? void 0 : factoryArgs.component) != null) {
      firstPickComponent = factoryArgs.component;
    }
    if ((args2 == null ? void 0 : args2.fallbackComponent) != null) {
      fallbackComponent = args2.fallbackComponent;
    } else if ((factoryArgs == null ? void 0 : factoryArgs.fallbackComponent) != null) {
      fallbackComponent = factoryArgs.fallbackComponent;
    }
    const component = getComponent({
      style: "present",
      type: getValueType(internals.value),
      firstPickComponent,
      fallbackComponent,
      typeDefs: (args2 == null ? void 0 : args2.typeDefs) || internals.typeDefs || {}
    });
    if (component == null) {
      return null;
    }
    return m2(component, {
      o: self,
      renderType: "present",
      value: self.value,
      attrs
    });
  };
  self.edit = function(args2) {
    if (self.readonly) {
      return self.present(args2);
    }
    let attrs = {};
    let firstPickComponent;
    let fallbackComponent;
    if ((args2 == null ? void 0 : args2.attrs) != null) {
      attrs = args2.attrs;
    } else if ((factoryArgs == null ? void 0 : factoryArgs.attrs) != null) {
      attrs = factoryArgs.attrs;
    }
    if ((args2 == null ? void 0 : args2.component) != null) {
      firstPickComponent = args2.component;
    } else if ((args2 == null ? void 0 : args2.component) !== null && (factoryArgs == null ? void 0 : factoryArgs.component) != null) {
      firstPickComponent = factoryArgs.component;
    }
    if ((args2 == null ? void 0 : args2.fallbackComponent) != null) {
      fallbackComponent = args2.fallbackComponent;
    } else if ((factoryArgs == null ? void 0 : factoryArgs.fallbackComponent) != null) {
      fallbackComponent = factoryArgs.fallbackComponent;
    }
    const component = getComponent({
      style: "edit",
      datatype: internals.datatype,
      type: getValueType(self.value),
      firstPickComponent,
      fallbackComponent,
      typeDefs: (args2 == null ? void 0 : args2.typeDefs) || internals.typeDefs || {}
    });
    if (component == null) {
      return null;
    }
    const onChange = (value, args3) => {
      return internals.onUpdate(internals.pointer, value, args3);
    };
    return m2(component, {
      o: self,
      required: true,
      readonly: false,
      renderType: "edit",
      name: self.inputName,
      value: self.value,
      attrs,
      onchange: onChange,
      onChange
    });
  };
  self.default = function(args2) {
    return self.edit(Object.assign({ component: null }, args2));
  };
  self.initial = function(children) {
    return internals.action.initial(children);
  };
  self.success = function(arg1, arg2, arg3) {
    return internals.action.success(
      arg1,
      arg2,
      arg3
    );
  };
  self.failure = function(arg1, arg2, arg3) {
    return internals.action.failure(
      arg1,
      arg2,
      arg3
    );
  };
  self.remove = function(args2 = {}) {
    internals.onUpdate(
      internals.pointer,
      null,
      args2
    );
  };
  self.append = function(termOrType, value = {}, args2 = {}) {
    const type = internals.store.expand(termOrType);
    if (isJSONObject(self.value)) {
      const prevValue = self.value[type];
      let nextValue = [];
      if (prevValue != null && !Array.isArray(prevValue)) {
        nextValue.push(prevValue);
      } else if (Array.isArray(prevValue)) {
        nextValue = [...prevValue];
      }
      nextValue.push(value);
      return internals.onUpdate(internals.pointer, __spreadProps(__spreadValues({}, self.value), {
        [type]: nextValue
      }), args2);
    }
  };
  self._updateInternals = function(incomming) {
    for (const [key, value] of Object.entries(incomming)) {
      internals[key] = value;
    }
  };
  self._updateArgs = function(args2) {
    for (const [key, value] of Object.entries(args2)) {
      factoryArgs[key] = value;
    }
  };
  return self;
}

// lib/utils/escapeJSONPointerParts.ts
function escapeJSONPointerParts(...parts) {
  const escaped = parts.map((part) => part.replace(/~/g, "~0").replace(/\//g, "~1")).join("/");
  return `${escaped}`;
}

// lib/utils/getIterableValue.ts
function getIterableValue(value) {
  if (Array.isArray(value)) {
    return value;
  } else if (Array.isArray(value["@list"])) {
    return value["@list"];
  } else if (Array.isArray(value["@set"])) {
    return value["@set"];
  }
  return [];
}

// lib/utils/isIRIObject.ts
function isIRIObject(value) {
  return isJSONObject(value) && typeof value["@id"] === "string" && value["@id"] !== "";
}

// lib/utils/isIterable.ts
function isIterable(value) {
  if (Array.isArray(value)) {
    return true;
  } else if (isJSONObject(value)) {
    if (Array.isArray(value["@list"])) {
      return true;
    } else if (Array.isArray(value["@set"])) {
      return true;
    }
  }
  return false;
}

// lib/utils/isMetadataObject.ts
function isMetadataObject(value) {
  const keys = Object.keys(value);
  if (keys.length === 0) {
    return false;
  }
  for (const term of keys) {
    if (!term.startsWith("@") || term === "@value" || term === "@list" || term === "@set") {
      return false;
    }
  }
  return true;
}

// lib/utils/isValueObject.ts
function isValueObject(value) {
  return typeof value["@value"] !== "undefined";
}

// lib/utils/parseSelectorString.ts
var selectorRe = new RegExp("\\s*(?<subject>([^\\[\\s]+))(\\[(?<filter>([^\\]])+)\\])?\\s*", "g");
function parseSelectorString(selector, store) {
  var _a, _b;
  let match;
  const selectors = [];
  while (match = selectorRe.exec(selector)) {
    const subject = (_a = match.groups) == null ? void 0 : _a.subject;
    const filter = (_b = match.groups) == null ? void 0 : _b.filter;
    if (typeof filter === "string" && typeof subject === "string") {
      selectors.push({
        subject: store.expand(subject),
        filter
      });
    } else if (typeof subject === "string") {
      selectors.push({
        subject: store.expand(subject)
      });
    } else {
      throw new Error(`Invalid selector: ${selector}`);
    }
  }
  return selectors;
}

// lib/utils/resolvePropertyValueSpecification.ts
var httpRe = /^https?\:\/\//;
var scmCtxRe = /^https?\:\/\/schema\.org/;
var scmTypeRe = new RegExp("^https?\\:\\/\\/schema\\.org\\/(?<term>(readonlyValue|valueName|valueRequired|defaultValue|minValue|maxValue|stepValue|valuePattern|multipleValues|valueMinLength|valueMaxLength))");
function resolvePropertyValueSpecification({
  spec,
  store
}) {
  var _a;
  const pvs = {
    readonlyValue: false,
    valueRequired: false
  };
  let scmAlias;
  const scmVocab = store.vocab == null ? false : scmCtxRe.test(store.vocab);
  for (const [key, value] of Object.entries(store.aliases)) {
    if (scmCtxRe.test(value)) {
      scmAlias = [key, value];
      break;
    }
  }
  for (const [term, value] of Object.entries(spec)) {
    let type;
    if (!httpRe.test(term)) {
      if (scmVocab && !term.includes(":")) {
        type = `${store.vocab}${term}`;
      } else if (scmAlias && term.startsWith(`${scmAlias[0]}:`)) {
        type = term.replace(`${scmAlias[0]}:`, scmAlias[1]);
      }
    } else {
      type = term;
    }
    if (!type) {
      continue;
    }
    const result = scmTypeRe.exec(type);
    if ((_a = result == null ? void 0 : result.groups) == null ? void 0 : _a.term) {
      pvs[result.groups.term] = value;
    }
  }
  return pvs;
}

// lib/utils/getSelection.ts
var CircularSelectionError = class extends Error {
};
function transformProcessedDetails(processing) {
  for (let index = 0; index < processing.result.length; index++) {
    const element = processing.result[index];
    element.key = Symbol.for(element.keySource);
    delete element.keySource;
  }
  return processing;
}
function getSelection({
  selector: selectorStr,
  value,
  actionValue,
  store
}) {
  const details = {
    selector: selectorStr,
    complete: false,
    hasErrors: false,
    hasMissing: false,
    required: [],
    dependencies: [],
    result: []
  };
  if (value == null) {
    const [{ subject: iri, filter }, ...selector2] = parseSelectorString(selectorStr, store);
    selectEntity({
      keySource: "",
      pointer: "",
      iri,
      filter,
      selector: selector2.length > 0 ? selector2 : void 0,
      store,
      details
    });
    details.complete = details.required.length === 0;
    return transformProcessedDetails(details);
  }
  const selector = parseSelectorString(selectorStr, store);
  traverseSelector({
    keySource: "",
    pointer: "",
    value,
    actionValue,
    selector,
    store,
    details
  });
  details.complete = details.required.length === 0;
  for (let index = 0; index < details.result.length; index++) {
    const element = details.result[index];
    element.key = Symbol.for(element.keySource);
  }
  return transformProcessedDetails(details);
}
function makePointer(pointer, addition) {
  return `${pointer}/${escapeJSONPointerParts(addition.toString())}`;
}
function passesFilter({
  value,
  filter
}) {
  if (typeof filter !== "string") {
    return true;
  }
  if (Array.isArray(value["@type"])) {
    return value["@type"].includes(filter);
  }
  return value["@type"] === filter;
}
function isTraversable(value) {
  return value !== null && typeof value !== "undefined" && typeof value !== "boolean" && typeof value !== "number" && typeof value !== "string";
}
function resolveValue({
  keySource,
  pointer,
  value,
  datatype,
  filter,
  spec,
  actionValue,
  store,
  details
}) {
  if (value === void 0) {
    details.hasMissing = true;
    return;
  }
  if (spec != null && // hit the for loop below if the action value
  // has editable properties and the value is an
  // array
  (!isIterable(value) || !isJSONObject(actionValue))) {
    const pvs = resolvePropertyValueSpecification({
      spec,
      store
    });
    if (isJSONObject(value) && isValueObject(value)) {
      value = value["@value"];
    }
    details.result.push({
      keySource: pointer,
      pointer,
      type: "action-value",
      datatype,
      value,
      actionValue,
      spec: pvs,
      readonly: pvs.readonlyValue
    });
    return;
  }
  if (!isTraversable(value)) {
    details.result.push({
      keySource: pointer,
      pointer,
      type: "value",
      datatype,
      value
    });
    return;
  } else if (isIterable(value)) {
    const list = getIterableValue(value);
    for (let index = 0; index < list.length; index++) {
      const item = list[index];
      if (!isIRIObject(item)) {
        keySource = makePointer(keySource, index);
      }
      resolveValue({
        keySource,
        pointer: makePointer(pointer, index),
        value: item,
        spec,
        actionValue,
        datatype,
        filter,
        store,
        details
      });
      if (details.hasErrors || details.hasMissing) {
        return;
      }
    }
    return;
  }
  if (typeof filter === "string" && !passesFilter({ value, filter })) {
    return;
  }
  if (isValueObject(value)) {
    resolveValue({
      keySource,
      pointer,
      value: value["@value"],
      datatype,
      store,
      details
    });
    return;
  } else if (isMetadataObject(value)) {
    selectEntity({
      keySource,
      pointer,
      iri: value["@id"],
      filter,
      store,
      details
    });
    return;
  }
  if (isIRIObject(value)) {
    const iri = value["@id"];
    details.result.push({
      keySource,
      pointer,
      type: "entity",
      iri,
      ok: true,
      value
    });
    return;
  }
  details.result.push({
    keySource,
    pointer,
    type: "value",
    datatype,
    value
  });
}
function selectTypedValue({
  keySource,
  pointer,
  type,
  value,
  actionValue,
  filter,
  store,
  details
}) {
  pointer = makePointer(pointer, type);
  if (!isTraversable(value)) {
    return;
  }
  if (isIterable(value)) {
    const list = getIterableValue(value);
    for (let index = 0; index < list.length; index++) {
      const item = list[index];
      if (!isIRIObject(item)) {
        keySource = makePointer(keySource, index);
      }
      selectTypedValue({
        keySource,
        pointer: makePointer(pointer, index),
        type,
        value: item,
        actionValue,
        filter,
        store,
        details
      });
      if (details.hasErrors || details.hasMissing) {
        return;
      }
    }
    return;
  }
  if (isMetadataObject(value) && isIRIObject(value)) {
    selectEntity({
      keySource,
      pointer,
      iri: value["@id"],
      selector: [{ subject: type, filter }],
      store,
      details
    });
    return;
  } else if (isMetadataObject(value)) {
    return;
  }
  let spec;
  if (isJSONObject(actionValue) && actionValue[`${type}-input`] == null) {
    return;
  } else if (isJSONObject(actionValue)) {
    spec = actionValue[`${type}-input`];
  }
  resolveValue({
    keySource,
    pointer,
    value: value[type],
    spec,
    actionValue: actionValue == null ? void 0 : actionValue[type],
    datatype: type,
    filter,
    store,
    details
  });
}
function traverseSelector({
  keySource,
  pointer,
  selector,
  value,
  actionValue,
  store,
  details
}) {
  if (selector.length === 0) {
    return;
  } else if (!isTraversable(value)) {
    return;
  }
  if (isIterable(value)) {
    const list = getIterableValue(value);
    for (let index = 0; index < list.length; index++) {
      const item = list[index];
      if (!isIRIObject(item)) {
        keySource = makePointer(keySource, index);
      }
      traverseSelector({
        keySource,
        pointer: makePointer(pointer, index),
        selector,
        value: item,
        actionValue,
        store,
        details
      });
      if (details.hasErrors || details.hasMissing) {
        return;
      }
    }
    return;
  } else if (isValueObject(value)) {
    traverseSelector({
      keySource,
      pointer,
      selector,
      value: value["@value"],
      actionValue,
      store,
      details
    });
  }
  if (isMetadataObject(value) && isIRIObject(value)) {
    selectEntity({
      keySource,
      pointer,
      selector,
      iri: value["@id"],
      store,
      details
    });
    return;
  }
  if (isJSONObject(value) && actionValue !== void 0 && value[selector[0].subject] == null) {
    value = { [selector[0].subject]: null };
  }
  const [next, ...rest] = selector;
  const { subject: type, filter } = next;
  if (value[type] === void 0) {
    details.hasMissing = true;
    return;
  }
  if (rest.length === 0 && isJSONObject(actionValue == null ? void 0 : actionValue[type])) {
    pointer = makePointer(pointer, type);
    resolveValue({
      keySource: pointer,
      pointer,
      value: value[type],
      datatype: type,
      details,
      store,
      actionValue: actionValue == null ? void 0 : actionValue[type],
      spec: actionValue[`${type}-input`],
      filter
    });
    return;
  } else if (rest.length === 0) {
    selectTypedValue({
      keySource,
      pointer,
      type,
      filter,
      value,
      actionValue,
      store,
      details
    });
    return;
  }
  if (typeof filter === "string" && !passesFilter({ value, filter })) {
    return;
  }
  let traversedActionValue;
  if (isJSONObject(actionValue == null ? void 0 : actionValue[type])) {
    traversedActionValue = actionValue[type];
  }
  traverseSelector({
    keySource: makePointer(keySource, type),
    pointer: makePointer(pointer, type),
    selector: rest,
    value: value[type],
    actionValue: traversedActionValue,
    store,
    details
  });
}
function selectEntity({
  keySource,
  pointer,
  iri,
  filter,
  selector,
  store,
  details,
  handledIRIs
}) {
  keySource = makePointer(keySource, iri);
  pointer = makePointer(pointer, iri);
  const cache = store.entity(iri);
  details.dependencies.push(iri);
  if (cache == null || cache.loading) {
    if (!details.required.includes(iri)) {
      details.required.push(iri);
    }
    return;
  }
  if (!cache.ok) {
    details.hasErrors = true;
    if (selector == null || selector.length === 0) {
      return;
    }
    details.result.push({
      keySource,
      pointer,
      type: "entity",
      iri: cache.iri,
      ok: false,
      status: cache.status,
      value: cache.value,
      reason: cache.reason
    });
    return;
  }
  const value = cache.value;
  if (isMetadataObject(value)) {
    if (handledIRIs == null) {
      handledIRIs = /* @__PURE__ */ new Set([value["@id"]]);
    } else if (!handledIRIs.has(value["@id"])) {
      handledIRIs.add(value["@id"]);
    } else {
      throw new CircularSelectionError(`Circular selection loop detected`);
    }
    return selectEntity({
      keySource,
      pointer,
      iri: value["@id"],
      filter,
      selector,
      details,
      store,
      handledIRIs
    });
  }
  if (typeof filter === "string" && !passesFilter({ filter, value })) {
    return;
  }
  if (typeof selector === "undefined") {
    details.result.push({
      keySource,
      pointer,
      type: "entity",
      iri: cache.iri,
      ok: true,
      value: cache.value
    });
    return;
  }
  traverseSelector({
    keySource,
    pointer,
    value,
    selector,
    store,
    details
  });
  return;
}

// lib/renderers/ActionSelectionRenderer.ts
var ActionSelectionRenderer = (vnode) => {
  let currentAttrs = vnode.attrs;
  let details;
  const instances = {};
  function createInstances() {
    let hasChanges = false;
    const nextKeys = [];
    for (const selectionResult of details.result) {
      nextKeys.push(selectionResult.pointer);
      if (instances[selectionResult.pointer] != null) {
        const next = selectionResult;
        const prev = instances[selectionResult.pointer].selectionResult;
        if (next.value === prev.value) {
          continue;
        }
        const internals2 = Object.assign({}, instances[selectionResult.pointer].internals);
        internals2.name = selectionResult.datatype;
        internals2.type = selectionResult.type;
        internals2.datatype = selectionResult.datatype;
        internals2.pointer = selectionResult.pointer;
        internals2.value = selectionResult.value;
        internals2.actionValue = selectionResult.actionValue;
        if (selectionResult.spec != null) {
          internals2.spec = selectionResult.spec;
        }
        instances[selectionResult.pointer].octiron._updateInternals(internals2);
      }
      hasChanges = true;
      const selection = selectionFactory({
        store: currentAttrs.internals.store,
        typeDefs: currentAttrs.internals.typeDefs,
        datatype: selectionResult.datatype,
        value: selectionResult.value
      });
      const internals = __spreadProps(__spreadValues({}, currentAttrs.internals), {
        octiron: selection,
        name: selectionResult.datatype,
        type: selectionResult.type,
        datatype: selectionResult.datatype,
        pointer: selectionResult.pointer,
        spec: selectionResult.spec,
        value: selectionResult.value,
        actionValue: selectionResult.actionValue
      });
      const actionSelection = actionSelectionFactory(
        internals,
        currentAttrs.args
      );
      instances[selectionResult.pointer] = {
        internals,
        selection,
        octiron: actionSelection,
        selectionResult
      };
    }
    const prevKeys = Object.keys(instances);
    for (const key of prevKeys) {
      if (!nextKeys.includes(key)) {
        hasChanges = true;
        delete instances[key];
      }
    }
    if (hasChanges && typeof window !== "undefined") {
      mithrilRedraw();
    }
  }
  function updateSelection() {
    const { selector, value, actionValue } = currentAttrs;
    const { store } = currentAttrs.internals;
    if (!isJSONObject(value)) {
      return;
    }
    details = getSelection({
      selector,
      store,
      actionValue,
      value
    });
    createInstances();
  }
  return {
    oninit: ({ attrs }) => {
      currentAttrs = attrs;
      updateSelection();
    },
    onbeforeupdate: ({ attrs }) => {
      currentAttrs = attrs;
      for (const instance of Object.values(instances)) {
        instance.octiron._updateArgs(attrs.args);
        instance.octiron._updateInternals(attrs.internals);
      }
      updateSelection();
    },
    view: ({ attrs: { view, args } }) => {
      if (details == null) {
        return null;
      }
      const {
        pre,
        sep,
        post,
        fallback
      } = args;
      if (typeof view === "undefined") {
        return;
      }
      const list = Object.values(instances);
      const children = [pre];
      for (let index = 0; index < list.length; index++) {
        const { octiron: octiron2, selectionResult } = list[index];
        if (index !== 0) {
          children.push(sep);
        }
        if (selectionResult.value == null && typeof fallback === "function") {
          children.push(null);
        } else if (selectionResult.value == null && fallback != null) {
          children.push(fallback);
        } else {
          children.push(view(octiron2));
        }
      }
      children.push(post);
      return children;
    }
  };
};

// lib/factories/actionFactory.ts
function actionFactory(internals, args) {
  const factoryArgs = Object.assign({}, args);
  let payload = {};
  let submitResult;
  if (isJSONObject(args.initialPayload)) {
    for (const [key, value] of Object.entries(args.initialPayload)) {
      payload[internals.store.expand(key)] = value;
    }
  }
  const { url, method, body } = getSubmitDetails({
    payload,
    action: internals.octiron.value,
    store: internals.store
  });
  if (body == null) {
    submitResult = internals.store.entity(url);
  }
  const refs = {
    url,
    method,
    submitting: false,
    payload,
    store: internals.store,
    typeDefs: internals.typeDefs,
    submitResult
  };
  function onSubmit() {
    return __async(this, null, function* () {
      const { url: url2, method: method2, body: body2, contentType, encodingType } = getSubmitDetails({
        payload,
        action: internals.octiron.value,
        store: internals.store
      });
      try {
        refs.submitting = true;
        mithrilRedraw();
        refs.submitResult = yield internals.store.submit(url2, {
          method: method2,
          body: body2,
          contentType,
          encodingType
        });
      } catch (err) {
        console.error(err);
      }
      refs.submitting = false;
      mithrilRedraw();
    });
  }
  function onUpdate(value) {
    const prev = payload;
    const next = __spreadValues(__spreadValues({}, prev), value);
    if (typeof args.interceptor === "function") {
      payload = args.interceptor(
        next,
        prev,
        internals.octiron.value
      );
    } else {
      payload = next;
    }
    self.value = refs.payload = value;
    mithrilRedraw();
  }
  function onPointerUpdate(pointer, value) {
    const next = Object.assign({}, payload);
    const ptr = JsonPointer.create(pointer);
    if (typeof value === "undefined" || value === null) {
      ptr.unset(next);
    } else {
      ptr.set(next, value, true);
    }
    onUpdate(next);
  }
  const self = function self2(predicate, children) {
    const passes = predicate(self2);
    if (passes) {
      return children;
    }
    return null;
  };
  self.isOctiron = true;
  self.octironType = "action";
  self.readonly = false;
  self.value = refs.payload;
  self.action = internals.octiron;
  self.actionValue = internals.octiron;
  self.submit = function(arg1) {
    return __async(this, null, function* () {
      if (typeof arg1 === "function") {
        onUpdate(arg1(payload));
      } else if (arg1 != null) {
        onUpdate(arg1);
      }
      return yield onSubmit();
    });
  };
  self.update = function(arg1, args2) {
    return __async(this, null, function* () {
      if (typeof arg1 === "function") {
        onUpdate(arg1(payload));
      } else if (arg1 != null) {
        onUpdate(arg1);
      }
      if ((args2 == null ? void 0 : args2.submit) || (args2 == null ? void 0 : args2.submitOnChange)) {
        yield onSubmit();
      } else {
        mithrilRedraw();
      }
    });
  };
  self.not = function(predicate, children) {
    if (self == null) {
      return null;
    }
    const passes = predicate(self);
    if (!passes) {
      return children;
    }
    return null;
  };
  self.root = function(arg1, arg2, arg3) {
    let selector;
    const [childSelector, args2, view] = unravelArgs(arg1, arg2, arg3);
    if (childSelector == null) {
      selector = internals.store.rootIRI;
    } else {
      selector = `${internals.store.rootIRI} ${childSelector}`;
    }
    return m3(SelectionRenderer, {
      selector,
      args: args2,
      view,
      internals: {
        store: internals.store,
        typeDefs: (args2 == null ? void 0 : args2.typeDefs) || (factoryArgs == null ? void 0 : factoryArgs.typeDefs) || internals.typeDefs,
        parent: self
      }
    });
  };
  self.enter = function(arg1, arg2, arg3) {
    const [selector, args2, view] = unravelArgs(arg1, arg2, arg3);
    return m3(SelectionRenderer, {
      selector,
      args: args2,
      view,
      internals: {
        store: internals.store,
        typeDefs: (args2 == null ? void 0 : args2.typeDefs) || (factoryArgs == null ? void 0 : factoryArgs.typeDefs) || internals.typeDefs,
        parent: self
      }
    });
  };
  self.present = function(args2) {
    let attrs = {};
    let firstPickComponent;
    let fallbackComponent;
    if ((args2 == null ? void 0 : args2.attrs) != null) {
      attrs = args2.attrs;
    } else if ((factoryArgs == null ? void 0 : factoryArgs.attrs) != null) {
      attrs = factoryArgs.attrs;
    }
    if ((args2 == null ? void 0 : args2.component) != null) {
      firstPickComponent = args2.component;
    } else if ((factoryArgs == null ? void 0 : factoryArgs.component) != null) {
      firstPickComponent = factoryArgs.component;
    }
    if ((args2 == null ? void 0 : args2.fallbackComponent) != null) {
      fallbackComponent = args2.fallbackComponent;
    } else if ((factoryArgs == null ? void 0 : factoryArgs.fallbackComponent) != null) {
      fallbackComponent = factoryArgs.fallbackComponent;
    }
    const component = getComponent({
      style: "present",
      type: getValueType(internals.octiron.value),
      firstPickComponent,
      fallbackComponent,
      typeDefs: (args2 == null ? void 0 : args2.typeDefs) || internals.typeDefs || {}
    });
    if (component == null) {
      return null;
    }
    const { pre, sep, post, start, end, predicate } = Object.assign(
      {},
      factoryArgs,
      args2
    );
    return m3(component, {
      o: self,
      renderType: "present",
      value: self.value,
      attrs,
      pre,
      sep,
      post,
      start,
      end,
      predicate
    });
  };
  self.default = function(args2) {
    return self.present(args2);
  };
  self.initial = function(children) {
    return m3(
      ActionStateRenderer,
      {
        type: "initial",
        refs
      },
      children
    );
  };
  self.success = function(arg1, arg2, arg3) {
    const [selector, args2, view] = unravelArgs(arg1, arg2, arg3);
    return m3(ActionStateRenderer, {
      type: "success",
      selector,
      args: args2,
      view,
      refs
    });
  };
  self.failure = function(arg1, arg2, arg3) {
    const [selector, args2, view] = unravelArgs(arg1, arg2, arg3);
    return m3(ActionStateRenderer, {
      type: "failure",
      selector,
      args: args2,
      view,
      refs
    });
  };
  self.select = function(arg1, arg2, arg3) {
    const [selector, args2, view] = unravelArgs(arg1, arg2, arg3);
    return m3(
      ActionSelectionRenderer,
      {
        internals: {
          action: self,
          parent: self,
          entity: internals.octiron,
          store: internals.store,
          typeDefs: internals.typeDefs,
          onSubmit,
          onUpdate: onPointerUpdate,
          submitting: refs.submitting
        },
        selector,
        value: self.value,
        actionValue: internals.octiron.value,
        args: args2,
        view
      }
    );
  };
  self.perform = function(arg1, arg2, arg3) {
    const [selector, args2, view] = unravelArgs(arg1, arg2, arg3);
    return m3(PerformRenderer, {
      selector,
      args: args2,
      view,
      internals: {
        octiron: self,
        store: internals.store,
        typeDefs: internals.typeDefs
      }
    });
  };
  self.append = function(termOrType, value = {}, args2 = {}) {
    const type = internals.store.expand(termOrType);
    if (isJSONObject(self.value)) {
      const prevValue = self.value[type];
      let nextValue = [];
      if (prevValue != null && !Array.isArray(prevValue)) {
        nextValue.push(prevValue);
      } else if (Array.isArray(prevValue)) {
        nextValue = [...prevValue];
      }
      nextValue.push(value);
      return self.update(__spreadProps(__spreadValues({}, self.value), {
        [type]: nextValue
      }), args2);
    }
  };
  self._updateArgs = function(args2) {
    for (const [key, value] of Object.entries(args2)) {
      factoryArgs[key] = value;
    }
  };
  if (typeof window === "undefined" && args.submitOnInit && submitResult == null) {
    self.submit();
  } else if (typeof window !== "undefined" && args.submitOnInit) {
    self.submit();
  }
  return self;
}

// lib/renderers/PerformRenderer.ts
var PerformRenderer = ({ attrs }) => {
  const key = Symbol();
  let currentAttrs = attrs;
  let details;
  const instances = {};
  function createInstances() {
    let hasChanges = false;
    const nextKeys = [];
    for (const selectionResult of details.result) {
      nextKeys.push(selectionResult.pointer);
      if (Object.hasOwn(instances, selectionResult.pointer)) {
        const next = selectionResult;
        const prev = instances[selectionResult.pointer].selectionResult;
        if (prev.type === "value" && next.type === "value" && next.value === prev.value) {
          continue;
        } else if (prev.type === "entity" && next.type === "entity" && (next.ok !== prev.ok || next.status !== prev.status || next.value !== prev.value)) {
          continue;
        }
      }
      hasChanges = true;
      const octiron2 = selectionFactory({
        store: currentAttrs.internals.store,
        typeDefs: currentAttrs.internals.typeDefs,
        value: selectionResult.value
      });
      const action = actionFactory(currentAttrs.internals, currentAttrs.args);
      instances[selectionResult.pointer] = {
        action,
        octiron: octiron2,
        selectionResult
      };
    }
    const prevKeys = Object.keys(instances);
    for (const key2 of prevKeys) {
      if (!nextKeys.includes(key2)) {
        hasChanges = true;
        delete instances[key2];
      }
    }
    if (hasChanges) {
      mithrilRedraw();
    }
  }
  function fetchRequired(required) {
    return __async(this, null, function* () {
      if (required.length === 0) {
        return;
      }
      const promises = [];
      for (const iri of required) {
        promises.push(currentAttrs.internals.store.fetch(iri));
      }
      yield Promise.allSettled(promises);
    });
  }
  function listener(next) {
    let required = [];
    if (typeof details === "undefined") {
      required = next.required;
    } else {
      for (const iri of next.required) {
        if (!details.required.includes(iri)) {
          required.push(iri);
        }
      }
    }
    details = next;
    if (required.length > 0) {
      fetchRequired(required);
    }
    createInstances();
  }
  function subscribe() {
    const { selector, internals } = currentAttrs;
    if (typeof selector === "undefined") {
      let result;
      if (isIRIObject(internals.octiron.value)) {
        result = {
          pointer: "/local",
          key: Symbol.for("/local"),
          type: "entity",
          iri: internals.octiron.value["@id"],
          ok: true,
          value: internals.octiron.value
        };
      } else {
        result = {
          pointer: "/local",
          key: Symbol.for("/local"),
          type: "value",
          value: internals.octiron.value
        };
      }
      details = {
        selector: "",
        complete: true,
        hasErrors: false,
        hasMissing: false,
        dependencies: [],
        required: [],
        result: [result]
      };
    } else {
      details = internals.store.subscribe({
        key,
        selector,
        value: internals.octiron.value,
        listener
      });
      fetchRequired(details.required);
    }
    createInstances();
  }
  return {
    oninit: ({ attrs: attrs2 }) => {
      currentAttrs = attrs2;
      subscribe();
    },
    onbeforeupdate: ({ attrs: attrs2 }) => {
      if (attrs2.selector !== currentAttrs.selector) {
        attrs2.internals.store.unsubscribe(key);
        subscribe();
      }
      currentAttrs = attrs2;
      for (const instance of Object.values(instances)) {
        instance.action._updateArgs(attrs2.args);
      }
    },
    onbeforeremove: ({ attrs: attrs2 }) => {
      currentAttrs = attrs2;
      attrs2.internals.store.unsubscribe(key);
    },
    view: ({ attrs: { view, args } }) => {
      if (details == null || !details.complete) {
        return args.loading;
      }
      const {
        pre,
        sep,
        post,
        fallback
      } = args;
      if (typeof view === "undefined") {
        return;
      }
      const list = Object.values(instances);
      const children = [pre];
      for (let index = 0; index < list.length; index++) {
        const { selectionResult, action, octiron: octiron2 } = list[index];
        if (index !== 0) {
          children.push(sep);
        }
        if (selectionResult.type === "value") {
          children.push(view(action));
        } else if (!selectionResult.ok && typeof fallback === "function") {
          children.push(fallback(octiron2, selectionResult.reason));
        } else if (!selectionResult.ok) {
          children.push(fallback);
        } else {
          children.push(view(action));
        }
      }
      children.push(post);
      return children;
    }
  };
};

// lib/factories/selectionFactory.ts
function selectionFactory(internals, args) {
  const factoryArgs = Object.assign({}, args);
  const type = getValueType(internals.value);
  const refs = {
    isOctiron: true,
    octironType: "selection",
    value: internals.value
  };
  const self = Object.assign(
    (predicate, children) => {
      const passes = predicate(self);
      if (passes) {
        return children;
      }
      return null;
    },
    {
      isOctiron: true,
      octironType: "selection",
      readonly: true,
      id: internals.datatype,
      get value() {
        return refs.value;
      },
      get store() {
        return internals.store;
      },
      not: (predicate, children) => {
        const passes = predicate(self);
        if (!passes) {
          return children;
        }
        return null;
      },
      root: (arg1, arg2, arg3) => {
        let selector;
        const [childSelector, args2, view] = unravelArgs(arg1, arg2, arg3);
        if (childSelector == null) {
          selector = internals.store.rootIRI;
        } else {
          selector = `${internals.store.rootIRI} ${childSelector}`;
        }
        return m4(SelectionRenderer, {
          selector,
          args: args2,
          view,
          internals: {
            store: internals.store,
            typeDefs: (args2 == null ? void 0 : args2.typeDefs) || internals.typeDefs,
            parent: self
          }
        });
      },
      enter(arg1, arg2, arg3) {
        const [selector, args2, view] = unravelArgs(arg1, arg2, arg3);
        return m4(SelectionRenderer, {
          selector,
          args: args2,
          view,
          internals: {
            store: internals.store,
            typeDefs: (args2 == null ? void 0 : args2.typeDefs) || internals.typeDefs,
            parent: self
          }
        });
      },
      select: (arg1, arg2, arg3) => {
        const [selector, args2, view] = unravelArgs(arg1, arg2, arg3);
        if (!isJSONObject(internals.value)) {
          return null;
        }
        return m4(
          SelectionRenderer,
          {
            selector,
            args: args2,
            view,
            internals: {
              store: internals.store,
              typeDefs: (args2 == null ? void 0 : args2.typeDefs) || internals.typeDefs,
              value: internals.value,
              parent: self
            }
          }
        );
      },
      present(args2) {
        let attrs = {};
        let firstPickComponent;
        let fallbackComponent;
        if ((args2 == null ? void 0 : args2.attrs) != null) {
          attrs = args2.attrs;
        } else if ((factoryArgs == null ? void 0 : factoryArgs.attrs) != null) {
          attrs = factoryArgs.attrs;
        }
        if ((args2 == null ? void 0 : args2.component) != null) {
          firstPickComponent = args2.component;
        } else if ((factoryArgs == null ? void 0 : factoryArgs.component) != null) {
          firstPickComponent = factoryArgs.component;
        }
        if ((args2 == null ? void 0 : args2.fallbackComponent) != null) {
          fallbackComponent = args2.fallbackComponent;
        } else if ((factoryArgs == null ? void 0 : factoryArgs.fallbackComponent) != null) {
          fallbackComponent = factoryArgs.fallbackComponent;
        }
        const component = getComponent({
          style: "present",
          datatype: internals.datatype,
          type,
          firstPickComponent,
          fallbackComponent,
          typeDefs: (args2 == null ? void 0 : args2.typeDefs) || internals.typeDefs || {}
        });
        if (component == null) {
          return null;
        }
        const { pre, sep, post, start, end, predicate } = Object.assign(
          {},
          factoryArgs,
          args2
        );
        return m4(component, {
          o: self,
          renderType: "present",
          value: self.value,
          attrs,
          pre,
          sep,
          post,
          start,
          end,
          predicate
        });
      },
      default(arg1) {
        return self.present(arg1);
      },
      perform: (arg1, arg2, arg3) => {
        const [selector, args2, view] = unravelArgs(arg1, arg2, arg3);
        return m4(PerformRenderer, {
          selector,
          args: args2,
          view,
          internals: {
            octiron: self,
            store: internals.store,
            typeDefs: args2.typeDefs || internals.typeDefs
          }
        });
      },
      _updateArgs: (args2) => {
        for (const [key, value] of Object.entries(args2)) {
          factoryArgs[key] = value;
        }
      },
      _updateValue: (value) => {
        refs.value = value;
      }
    }
  );
  return self;
}

// lib/renderers/SelectionRenderer.ts
var preKey = Symbol.for("@pre");
var postKey = Symbol.for("@post");
function shouldReselect(next, prev) {
  return next.internals.store !== prev.internals.store || next.selector !== prev.selector || next.internals.value !== prev.internals.value;
}
var SelectionRenderer = (vnode) => {
  const key = Symbol(`SelectionRenderer`);
  let currentAttrs = vnode.attrs;
  let details;
  const instances = {};
  function createInstances() {
    let hasChanges = false;
    const {
      store,
      typeDefs,
      parent
    } = currentAttrs.internals;
    const nextKeys = [];
    if (details == null) {
      const prevKeys2 = Reflect.ownKeys(instances);
      for (const key2 of prevKeys2) {
        if (!nextKeys.includes(key2)) {
          hasChanges = true;
          delete instances[key2];
        }
      }
      if (hasChanges) {
        mithrilRedraw();
      }
      return;
    }
    for (const selectionResult of details.result) {
      const key2 = Symbol.for(selectionResult.pointer);
      nextKeys.push(key2);
      if (Object.hasOwn(instances, key2)) {
        const next = selectionResult;
        const prev = instances[key2].selectionResult;
        if (prev.type === "value" && next.type === "value" && next.value === prev.value) {
          continue;
        } else if (prev.type === "entity" && next.type === "entity" && (next.ok !== prev.ok || next.status !== prev.status || next.value !== prev.value)) {
          continue;
        }
      }
      hasChanges = true;
      let octiron2;
      if (selectionResult.type === "entity") {
        octiron2 = selectionFactory({
          store,
          typeDefs,
          value: selectionResult.value,
          parent
        });
      } else {
        octiron2 = selectionFactory({
          store,
          typeDefs,
          value: selectionResult.value,
          datatype: selectionResult.datatype,
          parent
        });
      }
      instances[key2] = {
        octiron: octiron2,
        selectionResult
      };
    }
    const prevKeys = Reflect.ownKeys(instances);
    for (const key2 of prevKeys) {
      if (!nextKeys.includes(key2)) {
        hasChanges = true;
        delete instances[key2];
      }
    }
    if (hasChanges) {
      mithrilRedraw();
    }
  }
  function fetchRequired(required) {
    return __async(this, null, function* () {
      if (required.length === 0) {
        return;
      }
      const promises = [];
      for (const iri of required) {
        promises.push(currentAttrs.internals.store.fetch(iri));
      }
      yield Promise.allSettled(promises);
    });
  }
  function listener(next) {
    let required = [];
    if (typeof details === "undefined") {
      required = next.required;
    } else {
      for (const iri of next.required) {
        if (!details.required.includes(iri)) {
          required.push(iri);
        }
      }
    }
    details = next;
    if (required.length > 0) {
      fetchRequired(required);
    }
    createInstances();
  }
  function subscribe() {
    if (typeof currentAttrs.internals.value !== "undefined" && !isJSONObject(currentAttrs.internals.value)) {
      currentAttrs.internals.store.unsubscribe(key);
      createInstances();
      return;
    }
    details = currentAttrs.internals.store.subscribe({
      key,
      selector: currentAttrs.selector,
      value: currentAttrs.internals.value,
      listener
    });
    fetchRequired(details.required);
    createInstances();
  }
  return {
    oninit: ({ attrs }) => {
      currentAttrs = attrs;
      subscribe();
    },
    onbeforeupdate: ({ attrs }) => {
      const reselect = shouldReselect(attrs, currentAttrs);
      currentAttrs = attrs;
      if (reselect) {
        attrs.internals.store.unsubscribe(key);
        subscribe();
      }
    },
    onbeforeremove: ({ attrs }) => {
      currentAttrs = attrs;
      attrs.internals.store.unsubscribe(key);
    },
    view: ({ attrs }) => {
      if (details == null || !details.complete) {
        return attrs.args.loading;
      } else if ((details.hasErrors || details.hasMissing) && typeof attrs.args.fallback !== "function") {
        return attrs.args.fallback;
      }
      const view = currentAttrs.view;
      const {
        pre,
        sep,
        post,
        start,
        end,
        predicate,
        fallback
      } = currentAttrs.args;
      if (typeof view === "undefined") {
        return;
      }
      const children = [];
      let list = Reflect.ownKeys(instances).map((key2) => instances[key2]);
      if (start != null || end != null) {
        list = list.slice(
          start != null ? start : 0,
          end
        );
      }
      if (predicate != null) {
        list = list.filter(({ octiron: octiron2 }) => predicate(octiron2));
      }
      if (pre != null) {
        children.push(m5.fragment({ key: preKey }, [pre]));
      }
      for (let index = 0; index < list.length; index++) {
        const { selectionResult, octiron: octiron2 } = list[index];
        const { key: key2 } = selectionResult;
        if (index !== 0) {
          children.push(m5.fragment({ key: `@${Symbol.keyFor(key2)}` }, [sep]));
        }
        if (selectionResult.type === "value") {
          children.push(m5.fragment({ key: key2 }, [view(octiron2)]));
        } else if (!selectionResult.ok && typeof fallback === "function") {
          children.push(
            m5.fragment({ key: key2 }, [fallback(octiron2, selectionResult.reason)])
          );
        } else if (!selectionResult.ok) {
          children.push(m5.fragment({ key: key2 }, [fallback]));
        } else {
          children.push(m5.fragment({ key: key2 }, [view(octiron2)]));
        }
      }
      if (post != null) {
        children.push(m5.fragment({ key: postKey }, [post]));
      }
      return children;
    }
  };
};

// lib/factories/rootFactory.ts
function rootFactory(internals) {
  const self = Object.assign(
    (predicate, children) => {
      return self.root((o) => o(predicate, children));
    },
    {
      octironType: "root",
      isOctiron: true,
      readonly: true,
      value: null,
      store: internals.store,
      not(predicate, children) {
        return self.root((o) => o.not(predicate, children));
      },
      root(arg1, arg2, arg3) {
        let selector;
        const [childSelector, args, view] = unravelArgs(arg1, arg2, arg3);
        if (childSelector == null) {
          selector = internals.store.rootIRI;
        } else {
          selector = `${internals.store.rootIRI} ${childSelector}`;
        }
        return m6(SelectionRenderer, {
          selector,
          args,
          view,
          internals: {
            store: internals.store,
            typeDefs: (args == null ? void 0 : args.typeDefs) || internals.typeDefs
          }
        });
      },
      select(arg1, arg2, arg3) {
        return self.root(arg1, arg2, arg3);
      },
      present(arg1, arg2) {
        return self.root(arg1, arg2);
      },
      default(arg1) {
        return self.root((o) => o.default(arg1));
      },
      perform(arg1, arg2, arg3) {
        if (typeof arg1 === "string") {
          return self.root(arg1, (o) => o.perform(
            arg2,
            arg3
          ));
        }
        return self.root((o) => o.perform(
          arg2,
          arg3
        ));
      }
    }
  );
  return self;
}

// lib/alternatives/htmlFragments.ts
import m7 from "mithril";
var HTMLFragmentsIntegrationComponent = () => {
  return {
    view({ attrs: { fragment, rootHTML, fragmentsHTML } }) {
      const html = fragment == null ? rootHTML : fragmentsHTML[fragment];
      if (html == null) {
        return null;
      }
      return m7.trust(html);
    }
  };
};
var _handler, _rendered, _iri, _fragment, _contentType, _rootHTML, _idedHTML, _anonHTML, _fragmentsHTML;
var _HTMLFragmentsIntegration = class _HTMLFragmentsIntegration {
  constructor(handler, {
    iri,
    contentType,
    root,
    ided,
    anon
  }) {
    __publicField(this, "integrationType", "html-fragments");
    __privateAdd(this, _handler);
    __privateAdd(this, _rendered, /* @__PURE__ */ new Set());
    __privateAdd(this, _iri);
    __privateAdd(this, _fragment);
    __privateAdd(this, _contentType);
    __privateAdd(this, _rootHTML);
    __privateAdd(this, _idedHTML);
    __privateAdd(this, _anonHTML);
    __privateAdd(this, _fragmentsHTML);
    __privateSet(this, _handler, handler);
    __privateSet(this, _iri, iri);
    __privateSet(this, _contentType, contentType);
    __privateSet(this, _rootHTML, root);
    __privateSet(this, _idedHTML, ided != null ? ided : {});
    __privateSet(this, _anonHTML, anon != null ? anon : {});
    __privateSet(this, _fragmentsHTML, __spreadValues(__spreadValues({}, anon), ided));
  }
  get iri() {
    return __privateGet(this, _iri);
  }
  get contentType() {
    return __privateGet(this, _contentType);
  }
  render(o) {
    return m7(HTMLFragmentsIntegrationComponent, {
      o,
      rootHTML: __privateGet(this, _rootHTML),
      fragmentsHTML: __privateGet(this, _fragmentsHTML)
    });
  }
  getStateInfo() {
    return {
      iri: __privateGet(this, _iri),
      contentType: __privateGet(this, _contentType),
      hasRoot: __privateGet(this, _rootHTML) != null,
      ided: Object.keys(__privateGet(this, _idedHTML)),
      anon: Object.keys(__privateGet(this, _anonHTML))
    };
  }
  toInitialState() {
    let html = "";
    if (__privateGet(this, _rootHTML) != null) {
      html += `<template id="htmlfrag:${__privateGet(this, _iri)}|${__privateGet(this, _contentType)}">${__privateGet(this, _rootHTML)}</template>
`;
    }
    for (const [fragment, fragmentHTML] of Object.entries(__privateGet(this, _idedHTML))) {
      if (!__privateGet(this, _rendered).has(fragment)) {
        html += `<template id="htmlfrag:${__privateGet(this, _iri)}|${__privateGet(this, _contentType)}|${fragment}">${fragmentHTML}</template>
`;
      }
    }
    for (const [fragment, fragmentHTML] of Object.entries(__privateGet(this, _anonHTML))) {
      html += `<template id="htmlfrag:${__privateGet(this, _iri)}#${fragment}|${__privateGet(this, _contentType)}">${fragmentHTML}</template>
`;
    }
    return html;
  }
  static fromInitialState(handler, {
    iri,
    contentType,
    hasRoot,
    ided,
    anon
  }) {
    let rootHTML;
    const idedHTML = {};
    const anonHTML = {};
    if (hasRoot) {
      const rootEl = document.getElementById(`htmlfrag:${iri}|${contentType}`);
      if (rootEl) {
        rootHTML = rootEl.outerHTML;
      }
    }
    for (const fragment of ided) {
      const el = document.getElementById(fragment);
      if (el instanceof HTMLTemplateElement) {
        const dom = el.cloneNode(true);
        idedHTML[fragment] = dom.innerHTML;
      } else {
        idedHTML[fragment] = el.innerHTML;
      }
    }
    for (const fragment of anon) {
      const el = document.getElementById(`htmlfrag:${iri}#${fragment}|${contentType}`);
      if (el instanceof HTMLTemplateElement) {
        const dom = el.cloneNode(true);
        idedHTML[fragment] = dom.innerHTML;
      } else {
        idedHTML[fragment] = el.innerHTML;
      }
    }
    return new _HTMLFragmentsIntegration(handler, {
      contentType,
      iri,
      root: rootHTML,
      ided: idedHTML,
      anon: anonHTML
    });
  }
};
_handler = new WeakMap();
_rendered = new WeakMap();
_iri = new WeakMap();
_fragment = new WeakMap();
_contentType = new WeakMap();
_rootHTML = new WeakMap();
_idedHTML = new WeakMap();
_anonHTML = new WeakMap();
_fragmentsHTML = new WeakMap();
__publicField(_HTMLFragmentsIntegration, "type", "html-fragments");
var HTMLFragmentsIntegration = _HTMLFragmentsIntegration;

// lib/alternatives/html.ts
import m8 from "mithril";
var HTMLIntegrationComponent = () => {
  let onRemove;
  return {
    oncreate({ dom, attrs: { o, el, handler } }) {
      if (el != null) {
        dom.append(el);
      }
      if (handler.onCreate != null) {
        onRemove = handler.onCreate({
          o,
          dom,
          addFragmentListener: () => {
          }
        });
      }
    },
    onbeforeremove() {
      if (onRemove != null) {
        onRemove();
      }
    },
    view({ attrs: { html, el } }) {
      if (el != null) {
        return null;
      }
      return m8.trust(html);
    }
  };
};
var _handler2, _rendered2, _iri2, _contentType2, _html, _id, _el;
var _HTMLIntegration = class _HTMLIntegration {
  constructor(handler, {
    iri,
    contentType,
    html,
    id,
    el
  }) {
    __publicField(this, "integrationType", "html");
    __privateAdd(this, _handler2);
    __privateAdd(this, _rendered2, false);
    __privateAdd(this, _iri2);
    __privateAdd(this, _contentType2);
    __privateAdd(this, _html);
    __privateAdd(this, _id);
    __privateAdd(this, _el);
    __privateSet(this, _handler2, handler);
    __privateSet(this, _iri2, iri);
    __privateSet(this, _contentType2, contentType);
    __privateSet(this, _html, html);
    __privateSet(this, _id, id);
    __privateSet(this, _el, el);
  }
  get iri() {
    return __privateGet(this, _iri2);
  }
  get contentType() {
    return __privateGet(this, _contentType2);
  }
  render(o) {
    if (!isBrowserRender && !__privateGet(this, _rendered2)) {
      __privateSet(this, _rendered2, true);
    }
    return m8(HTMLIntegrationComponent, {
      o,
      html: __privateGet(this, _html),
      el: __privateGet(this, _el),
      handler: __privateGet(this, _handler2)
    });
  }
  getStateInfo() {
    return {
      iri: __privateGet(this, _iri2),
      contentType: __privateGet(this, _contentType2),
      id: __privateGet(this, _id)
    };
  }
  toInitialState() {
    if (__privateGet(this, _id) != null && __privateGet(this, _rendered2)) {
      return "";
    }
    return `<template id="html:${__privateGet(this, _iri2)}|${__privateGet(this, _contentType2)}">${__privateGet(this, _html)}</template>
`;
  }
  static fromInitialState(handler, {
    iri,
    contentType,
    id
  }) {
    let el = null;
    if (id != null) {
      el = document.getElementById(id);
    }
    if (el != null) {
      return new _HTMLIntegration(handler, {
        iri,
        contentType,
        html: el.outerHTML,
        id,
        el
      });
    }
    el = document.getElementById(`html:${iri}|${contentType}`);
    if (el instanceof HTMLTemplateElement) {
      el = el.cloneNode(true);
      return new _HTMLIntegration(handler, {
        iri,
        contentType,
        html: el.outerHTML,
        id,
        el
      });
    }
    return null;
  }
};
_handler2 = new WeakMap();
_rendered2 = new WeakMap();
_iri2 = new WeakMap();
_contentType2 = new WeakMap();
_html = new WeakMap();
_id = new WeakMap();
_el = new WeakMap();
__publicField(_HTMLIntegration, "type", "html");
var HTMLIntegration = _HTMLIntegration;

// lib/failures.ts
var _status, _res;
var HTTPFailure = class {
  constructor(status, res) {
    __privateAdd(this, _status);
    __privateAdd(this, _res);
    __privateSet(this, _status, status);
    __privateSet(this, _res, res);
  }
  get status() {
    return __privateGet(this, _status);
  }
  get res() {
    return __privateGet(this, _res);
  }
  undefined() {
    return null;
  }
  http(arg) {
    if (typeof arg === "function") {
      return arg(__privateGet(this, _status));
    }
    return arg;
  }
  unparserable() {
    return null;
  }
};
_status = new WeakMap();
_res = new WeakMap();

// lib/utils/flattenIRIObjects.ts
function flattenIRIObjects(value, agg = []) {
  if (Array.isArray(value)) {
    for (const item of value) {
      flattenIRIObjects(item, agg);
    }
  } else if (isJSONObject(value)) {
    if (isMetadataObject(value)) {
      return agg;
    }
    if (isIRIObject(value)) {
      agg.push(value);
    }
    if (isValueObject(value)) {
      flattenIRIObjects(value["@value"], agg);
    } else if (isIterable(value)) {
      flattenIRIObjects(getIterableValue(value), agg);
    } else {
      for (const [term, item] of Object.entries(value)) {
        if (term.startsWith("@")) {
          continue;
        }
        flattenIRIObjects(item, agg);
      }
    }
  }
  return agg;
}

// lib/store.ts
var defaultAccept = "application/problem+json, application/ld+json, text/lf";
var integrationClasses = {
  [HTMLIntegration.type]: HTMLIntegration,
  [HTMLFragmentsIntegration.type]: HTMLFragmentsIntegration
};
function getJSONLdValues(vocab, aliases) {
  const aliasMap = /* @__PURE__ */ new Map();
  const context = {};
  if (vocab != null) {
    context["@vocab"] = vocab;
  }
  if (aliases == null) {
    return [aliasMap, context];
  }
  for (const [key, value] of Object.entries(aliases)) {
    context[key] = value;
    aliasMap.set(key, value);
  }
  return [aliasMap, context];
}
function getInternalHeaderValues(headers, origins) {
  const internalHeaders = new Headers([["accept", defaultAccept]]);
  const internalOrigins = /* @__PURE__ */ new Map();
  if (headers != null) {
    for (const [key, value] of Object.entries(headers)) {
      internalHeaders.set(key, value);
    }
  }
  if (origins != null) {
    for (const [origin, headers2] of Object.entries(origins)) {
      const internalHeaders2 = new Headers([["accept", defaultAccept]]);
      for (const [key, value] of Object.entries(headers2)) {
        internalHeaders2.set(key, value);
      }
      internalOrigins.set(origin, internalHeaders2);
    }
  }
  return [internalHeaders, internalOrigins];
}
var _rootIRI, _rootOrigin, _headers, _origins, _vocab, _aliases, _primary, _loading, _alternatives, _handlers, _keys, _context, _termExpansions, _fetcher, _responseHook, _dependencies, _listeners, _Store_instances, makeCleanupFn_fn, getLoadingKey_fn, publish_fn, handleJSONLD_fn, callFetcher_fn;
var _Store = class _Store {
  constructor(args) {
    __privateAdd(this, _Store_instances);
    __privateAdd(this, _rootIRI);
    __privateAdd(this, _rootOrigin);
    __privateAdd(this, _headers);
    __privateAdd(this, _origins);
    __privateAdd(this, _vocab);
    __privateAdd(this, _aliases);
    __privateAdd(this, _primary, /* @__PURE__ */ new Map());
    __privateAdd(this, _loading, /* @__PURE__ */ new Set());
    __privateAdd(this, _alternatives, /* @__PURE__ */ new Map());
    __privateAdd(this, _handlers);
    __privateAdd(this, _keys, /* @__PURE__ */ new Set());
    __privateAdd(this, _context);
    __privateAdd(this, _termExpansions, /* @__PURE__ */ new Map());
    __privateAdd(this, _fetcher);
    __privateAdd(this, _responseHook);
    __privateAdd(this, _dependencies, /* @__PURE__ */ new Map());
    __privateAdd(this, _listeners, /* @__PURE__ */ new Map());
    var _a, _b;
    __privateSet(this, _rootIRI, args.rootIRI);
    __privateSet(this, _rootOrigin, new URL(args.rootIRI).origin);
    __privateSet(this, _vocab, args.vocab);
    __privateSet(this, _fetcher, args.fetcher);
    __privateSet(this, _responseHook, args.responseHook);
    [__privateWrapper(this, _headers)._, __privateWrapper(this, _origins)._] = getInternalHeaderValues(args.headers, args.origins);
    [__privateWrapper(this, _aliases)._, __privateWrapper(this, _context)._] = getJSONLdValues(args.vocab, args.aliases);
    __privateSet(this, _handlers, new Map((_b = (_a = args.handlers) == null ? void 0 : _a.map) == null ? void 0 : _b.call(_a, (handler) => [handler.contentType, handler])));
    if (args.primary != null) {
      __privateSet(this, _primary, new Map(Object.entries(args.primary)));
    }
    if (!__privateGet(this, _headers).has("accept")) {
      __privateGet(this, _headers).set("accept", defaultAccept);
    }
    for (const origin of Object.values(__privateGet(this, _origins))) {
      if (!origin.has("accept")) {
        origin.set("accept", defaultAccept);
      }
    }
  }
  get rootIRI() {
    return __privateGet(this, _rootIRI);
  }
  entity(iri) {
    return __privateGet(this, _primary).get(iri);
  }
  get vocab() {
    return __privateGet(this, _vocab);
  }
  get aliases() {
    return Object.fromEntries(
      __privateGet(this, _aliases).entries().map(([key, value]) => [key.replace(/^/, ""), value])
    );
  }
  get context() {
    return __privateGet(this, _context);
  }
  /**
   * Expands a term to a type.
   *
   * If an already expanded JSON-ld type is given it will
   * return the input value.
   */
  expand(termOrType) {
    const sym = Symbol.for(termOrType);
    const cached = __privateGet(this, _termExpansions).get(sym);
    if (cached != null) {
      return cached;
    }
    let expanded;
    if (__privateGet(this, _vocab) != null && !/^[\w\d]+\:/.test(termOrType)) {
      expanded = __privateGet(this, _vocab) + termOrType;
    } else if (/https?:\/\//.test(termOrType)) {
      expanded = termOrType;
    } else {
      for (const [key, value] of __privateGet(this, _aliases)) {
        const reg = new RegExp(`^${key}:`);
        if (reg.test(termOrType)) {
          expanded = termOrType.replace(reg, value);
          break;
        }
      }
    }
    __privateGet(this, _termExpansions).set(sym, expanded != null ? expanded : termOrType);
    return expanded != null ? expanded : termOrType;
  }
  select(selector, value) {
    return getSelection({
      selector,
      value,
      store: this
    });
  }
  /**
   * Generates a unique key for server rendering only.
   */
  key() {
    while (true) {
      const key = Math.random().toString(36).slice(2, 7);
      if (!__privateGet(this, _keys).has(key)) {
        __privateGet(this, _keys).add(key);
        return key;
      }
    }
  }
  isLoading(iri) {
    const loadingKey = __privateMethod(this, _Store_instances, getLoadingKey_fn).call(this, iri, "get");
    return __privateGet(this, _loading).has(loadingKey);
  }
  handleResponse(_0) {
    return __async(this, arguments, function* (res, iri = res.url.toString()) {
      var _a, _b, _c;
      const contentType = (_c = (_b = (_a = res.headers.get("content-type")) == null ? void 0 : _a.split) == null ? void 0 : _b.call(_a, ";")) == null ? void 0 : _c[0];
      if (contentType == null) {
        throw new Error("Content type not specified in response");
      }
      const handler = __privateGet(this, _handlers).get(contentType);
      if (handler == null) {
        throw new Error(`No handler configured for content type "${contentType}"`);
      }
      if (handler.integrationType === "jsonld") {
        const output = yield handler.handler({
          res,
          store: this
        });
        __privateMethod(this, _Store_instances, handleJSONLD_fn).call(this, {
          iri,
          res,
          output
        });
      } else if (handler.integrationType === "problem-details") {
        throw new Error("Problem details response types not supported yet");
      } else if (handler.integrationType === "html") {
        const output = yield handler.handler({
          res,
          store: this
        });
        let integrations = __privateGet(this, _alternatives).get(contentType);
        if (integrations == null) {
          integrations = /* @__PURE__ */ new Map();
          __privateGet(this, _alternatives).set(contentType, integrations);
        }
        integrations.set(iri, new HTMLIntegration(handler, {
          iri,
          contentType,
          html: output.html,
          id: output.id
        }));
      } else if (handler.integrationType === "html-fragments") {
        const output = yield handler.handler({
          res,
          store: this
        });
        let integrations = __privateGet(this, _alternatives).get(contentType);
        if (integrations == null) {
          integrations = /* @__PURE__ */ new Map();
          __privateGet(this, _alternatives).set(contentType, integrations);
        }
        integrations.set(iri, new HTMLFragmentsIntegration(handler, {
          iri,
          contentType,
          root: output.html,
          ided: output.ided,
          anon: output.anon
        }));
      }
      if (handler.integrationType !== "jsonld") {
        __privateMethod(this, _Store_instances, publish_fn).call(this, iri, contentType);
      }
    });
  }
  subscribe({
    key,
    selector,
    value,
    listener
  }) {
    const details = getSelection({
      selector,
      value,
      store: this
    });
    const cleanup = __privateMethod(this, _Store_instances, makeCleanupFn_fn).call(this, key, details);
    for (const dependency of details.dependencies) {
      const depSet = __privateGet(this, _dependencies).get(dependency);
      if (depSet == null) {
        __privateGet(this, _dependencies).set(dependency, /* @__PURE__ */ new Set([key]));
      } else {
        depSet.add(key);
      }
    }
    __privateGet(this, _listeners).set(key, {
      key,
      selector,
      value,
      required: details.required,
      dependencies: details.dependencies,
      listener,
      cleanup
    });
    return details;
  }
  unsubscribe(key) {
    var _a;
    (_a = __privateGet(this, _listeners).get(key)) == null ? void 0 : _a.cleanup();
  }
  fetch(iri) {
    return __async(this, null, function* () {
      yield __privateMethod(this, _Store_instances, callFetcher_fn).call(this, iri);
      return __privateGet(this, _primary).get(iri);
    });
  }
  /**
   * Submits an action. Like fetch this will overwrite
   * entities in the store with any entities returned
   * in the reponse.
   *
   * @param {string} iri                The iri of the request.
   * @param {SubmitArgs} [args]         Arguments to pass to the fetch call.
   * @param {string} [args.method]      The http submit method.
   * @param {string} [args.contentType] The content type header value.
   * @param {string} [args.body]        The body of the request.
   */
  submit(iri, args) {
    return __async(this, null, function* () {
      yield __privateMethod(this, _Store_instances, callFetcher_fn).call(this, iri, args);
      return this.entity(iri);
    });
  }
  static fromInitialState({
    headers,
    origins,
    handlers = []
  }) {
    const el = document.getElementById("oct-state-info");
    const stateInfo = JSON.parse(el.innerText);
    const alternatives = /* @__PURE__ */ new Map();
    const handlersMap = handlers.reduce((acc, handler) => __spreadProps(__spreadValues({}, acc), {
      [handler.contentType]: handler
    }), {});
    for (const [integrationType, entities] of Object.entries(stateInfo.alternatives)) {
      for (const stateInfo2 of entities) {
        const handler = handlersMap[stateInfo2.contentType];
        const cls = integrationClasses[integrationType];
        if (cls.type !== handler.integrationType) {
          continue;
        }
        const state = cls.fromInitialState(handler, stateInfo2);
        if (state == null) {
          continue;
        }
        let integrations = alternatives.get(state.contentType);
        if (integrations == null) {
          integrations = /* @__PURE__ */ new Map();
          alternatives.set(state.contentType, integrations);
        }
        integrations.set(state.iri, state);
      }
    }
    return new _Store({
      handlers,
      alternatives,
      headers,
      origins,
      rootIRI: stateInfo.rootIRI,
      vocab: stateInfo.vocab,
      aliases: stateInfo.aliases,
      primary: stateInfo.primary
    });
  }
  toInitialState() {
    let html = "";
    const stateInfo = {
      rootIRI: __privateGet(this, _rootIRI),
      vocab: __privateGet(this, _vocab),
      aliases: Object.fromEntries(__privateGet(this, _aliases)),
      primary: Object.fromEntries(__privateGet(this, _primary)),
      alternatives: {}
    };
    for (const alternative of __privateGet(this, _alternatives).values()) {
      for (const integration of alternative.values()) {
        if (stateInfo.alternatives[integration.integrationType] == null) {
          stateInfo.alternatives[integration.integrationType] = [
            integration.getStateInfo()
          ];
        } else {
          stateInfo.alternatives[integration.integrationType].push(integration.getStateInfo());
        }
        html += integration.toInitialState();
      }
    }
    html += `<script id="oct-state-info" type="application/json">${JSON.stringify(stateInfo)}<\/script>`;
    return html;
  }
};
_rootIRI = new WeakMap();
_rootOrigin = new WeakMap();
_headers = new WeakMap();
_origins = new WeakMap();
_vocab = new WeakMap();
_aliases = new WeakMap();
_primary = new WeakMap();
_loading = new WeakMap();
_alternatives = new WeakMap();
_handlers = new WeakMap();
_keys = new WeakMap();
_context = new WeakMap();
_termExpansions = new WeakMap();
_fetcher = new WeakMap();
_responseHook = new WeakMap();
_dependencies = new WeakMap();
_listeners = new WeakMap();
_Store_instances = new WeakSet();
/**
 * Creates a cleanup function which should be called
 * when a subscriber unlistens.
 */
makeCleanupFn_fn = function(key, details) {
  return () => {
    __privateGet(this, _listeners).delete(key);
    for (const dependency of details.dependencies) {
      __privateGet(this, _dependencies).delete(dependency);
      if (isBrowserRender) {
        setTimeout(() => {
          var _a;
          if (((_a = __privateGet(this, _dependencies).get(dependency)) == null ? void 0 : _a.size) === 0) {
            __privateGet(this, _primary).delete(dependency);
          }
        }, 5e3);
      }
    }
  };
};
/**
 * Creates a unique key for the ir, method and accept headers
 * to be used to mark the request's loading status.
 */
getLoadingKey_fn = function(iri, method, accept) {
  var _a;
  accept = (_a = accept != null ? accept : __privateGet(this, _headers).get("accept")) != null ? _a : defaultAccept;
  return `${method == null ? void 0 : method.toLowerCase()}|${iri}|${accept.toLowerCase()}`;
};
/**
 * Called on change to an entity. All listeners with dependencies in their
 * selection for this entity have the latest selection result pushed to
 * their listener functions.
 */
publish_fn = function(iri, _contentType3) {
  const keys = __privateGet(this, _dependencies).get(iri);
  if (keys == null) {
    return;
  }
  for (const key of keys) {
    const listenerDetails = __privateGet(this, _listeners).get(key);
    if (listenerDetails == null) {
      continue;
    }
    const details = getSelection({
      selector: listenerDetails.selector,
      value: listenerDetails.value,
      store: this
    });
    const cleanup = __privateMethod(this, _Store_instances, makeCleanupFn_fn).call(this, key, details);
    for (const dependency of details.dependencies) {
      let depSet = __privateGet(this, _dependencies).get(dependency);
      if (depSet == null) {
        depSet = /* @__PURE__ */ new Set([key]);
        __privateGet(this, _dependencies).set(dependency, depSet);
      } else {
        depSet.add(key);
      }
    }
    listenerDetails.cleanup = cleanup;
    listenerDetails.listener(details);
  }
};
handleJSONLD_fn = function({
  iri,
  res,
  output
}) {
  const iris = [iri];
  if (res.ok) {
    __privateGet(this, _primary).set(iri, {
      iri,
      loading: false,
      ok: true,
      value: output.jsonld
    });
  } else {
    const reason = new HTTPFailure(res.status, res);
    __privateGet(this, _primary).set(iri, {
      iri,
      loading: false,
      ok: false,
      value: output.jsonld,
      status: res.status,
      reason
    });
  }
  for (const entity of flattenIRIObjects(output.jsonld)) {
    if (iris.includes(entity["@id"])) {
      continue;
    }
    __privateGet(this, _primary).set(entity["@id"], {
      iri: entity["@id"],
      loading: false,
      ok: true,
      value: entity
    });
  }
  for (const iri2 in iris) {
    __privateMethod(this, _Store_instances, publish_fn).call(this, iri2);
  }
};
callFetcher_fn = function(_0) {
  return __async(this, arguments, function* (iri, args = {}) {
    var _a, _b;
    let headers;
    const url = new URL(iri);
    const method = args.method || "get";
    const accept = (_b = (_a = args.accept) != null ? _a : __privateGet(this, _headers).get("accept")) != null ? _b : defaultAccept;
    const loadingKey = __privateMethod(this, _Store_instances, getLoadingKey_fn).call(this, iri, method, args.accept);
    if (url.origin === __privateGet(this, _rootOrigin)) {
      headers = new Headers(__privateGet(this, _headers));
    } else if (__privateGet(this, _origins).has(url.origin)) {
      headers = new Headers(__privateGet(this, _origins).get(url.origin));
    } else {
      throw new Error("Unconfigured origin");
    }
    if (accept != null) {
      headers.set("accept", accept);
    } else if (headers.get("accept") == null) {
      headers.set("accept", defaultAccept);
    }
    __privateGet(this, _loading).add(loadingKey);
    mithrilRedraw();
    const promise = new Promise((resolve) => {
      (() => __async(this, null, function* () {
        let res;
        if (__privateGet(this, _fetcher) != null) {
          res = yield __privateGet(this, _fetcher).call(this, iri, {
            method,
            headers,
            body: args.body
          });
        } else {
          res = yield fetch(iri, {
            method,
            headers,
            body: args.body
          });
        }
        yield this.handleResponse(res, iri);
        __privateGet(this, _loading).delete(loadingKey);
        mithrilRedraw();
        resolve(res);
      }))();
    });
    if (__privateGet(this, _responseHook) != null) {
      __privateGet(this, _responseHook).call(this, promise);
    }
    yield promise;
  });
};
var Store = _Store;

// lib/utils/makeTypeDefs.ts
function makeTypeDefs(storeOrTypeDef, ...typeDefs) {
  const config = {};
  if (storeOrTypeDef instanceof Store) {
    for (const typeDef of typeDefs) {
      config[storeOrTypeDef.expand(typeDef.type)] = typeDef;
    }
  } else {
    config[storeOrTypeDef.type] = storeOrTypeDef;
    for (const typeDef of typeDefs) {
      config[typeDef.type] = typeDef;
    }
  }
  return config;
}

// lib/utils/classes.ts
function classes(...classArgs) {
  const cls = [];
  for (const classArg of classArgs) {
    if (typeof classArg === "undefined" || classArg === null) {
      continue;
    } else if (typeof classArg === "string") {
      cls.push(classArg);
    } else if (Array.isArray(classArg)) {
      for (const name of classArg) {
        cls.push(name);
      }
    } else {
      for (const [name, active] of Object.entries(classArg)) {
        if (active) {
          cls.push(name);
        }
      }
    }
  }
  return cls.join(" ");
}

// lib/utils/makeTypeDef.ts
function makeTypeDef(typeDef) {
  return typeDef;
}

// lib/handlers/jsonLDHandler.ts
import jsonld from "jsonld";
var jsonLDHandler = {
  integrationType: "jsonld",
  contentType: "application/ld+json",
  handler: (_0) => __async(null, [_0], function* ({ res }) {
    const json = yield res.json();
    if (!isJSONObject(json) && !Array.isArray(json)) {
      throw new Error("JSON-LD Document should be an object");
    }
    const expanded = yield jsonld.expand(json, {
      documentLoader: (url) => __async(null, null, function* () {
        const res2 = yield fetch(url, {
          headers: {
            "accept": "application/ld+json"
          }
        });
        const document2 = yield res2.json();
        return {
          documentUrl: url,
          document: document2
        };
      })
    });
    const compacted = yield jsonld.compact(expanded, {});
    return {
      jsonld: compacted
    };
  })
};

// lib/components/OctironJSON.ts
import m9 from "mithril";
var OctironJSON = () => {
  function renderIRI(iri) {
    return m9("code", [
      m9("span.oct-json-quote", '"'),
      m9("a.oct-json-iri", {
        href: iri
      }, iri),
      m9("span.oct-json-quote", '"')
    ]);
  }
  function renderPrimitive(value) {
    const className = typeof value === "boolean" ? "oct-json-boolean" : typeof value === "number" ? "oct-json-number" : "oct-json-string";
    let presentValue;
    if (typeof value === "boolean" && value) {
      presentValue = "true";
    } else if (typeof value === "boolean") {
      presentValue === "false";
    } else if (typeof value === "string") {
      presentValue = [
        m9("span.oct-json-quote", '"'),
        value,
        m9("span.oct-json-quote", '"')
      ];
    } else {
      presentValue = value;
    }
    return m9("code", { className }, presentValue);
  }
  function renderArray(list, url, selector = "") {
    const children = [];
    for (let index = 0; index < list.length; index++) {
      const value = list[index];
      children.push(
        m9(
          "li.oct-json-arr-item",
          maybeRenderDetails(null, value, url, selector)
        )
      );
    }
    return m9("ul.oct-json-arr", children);
  }
  const terminalTypes = ["@id", "@type", "@context"];
  function renderObject(value, url, selector = "") {
    const items = [];
    const list = Object.entries(value).toSorted(
      (item) => item[0] === "@context" ? 1 : -1
    );
    for (let index = 0; index < list.length; index++) {
      const [term, value2] = list[index];
      let children;
      const summary = [
        m9("span.oct-json-quote", '"'),
        m9("span.oct-json-obj-key", term),
        m9("span.oct-json-quote", '"'),
        m9("span.oct-json-obj-colon", ": ")
      ];
      if (term === "@id") {
        children = [m9("code", summary), renderIRI(value2)];
      } else if (url == null || terminalTypes.includes(term)) {
        children = maybeRenderDetails(summary, value2);
      } else if (term.startsWith("@")) {
        children = maybeRenderDetails(summary, value2, url, selector);
      } else {
        const currentSelector = `${selector} ${term}`;
        const currentURL = new URL(url);
        currentURL.searchParams.set("selector", currentSelector);
        const summary2 = [
          m9("span.oct-json-quote", '"'),
          m9(
            "span.oct-json-obj-key",
            m9(
              "a",
              { href: currentURL },
              term
            )
          ),
          m9("span.oct-json-quote", '"'),
          m9("span.oct-json-obj-colon", ": ")
        ];
        children = maybeRenderDetails(summary2, value2, url, currentSelector);
      }
      items.push(m9("li.oct-json-obj-item", children));
    }
    return m9("ul.oct-json-obj", items);
  }
  function maybeRenderDetails(summary, value, url, selector = "") {
    if (isJSONObject(value)) {
      return [
        m9(
          "details.oct-json-details",
          { open: true },
          m9(
            "summary.oct-json-details-sum",
            m9("code", summary, m9("span.oct-json-obj-open", "{"))
          ),
          renderValue(value, url, selector)
        ),
        m9("code.oct-json-obj-close", "}")
      ];
    } else if (Array.isArray(value)) {
      return [
        m9(
          "details.oct-json-details",
          { open: true },
          m9(
            "summary.oct-json-details-sum",
            m9("code", summary, m9("span.oct-json-obj-open", "["))
          ),
          renderValue(value, url, selector)
        ),
        m9("code.oct-json-obj-close", "]")
      ];
    }
    return [m9("code", summary), renderValue(value, url, selector)];
  }
  function renderValue(value, url, selector = "") {
    if (isJSONObject(value)) {
      return renderObject(value, url, selector);
    } else if (Array.isArray(value)) {
      return renderArray(value, url, selector);
    }
    return renderPrimitive(value);
  }
  return {
    view: ({ attrs: { value, selector, location } }) => {
      const url = location != null ? new URL(location) : void 0;
      return m9(".oct-json", [
        maybeRenderDetails(
          null,
          value,
          url,
          typeof selector === "string" ? selector.trim() : void 0
        )
      ]);
    }
  };
};

// lib/components/OctironDebug.ts
import m10 from "mithril";
import * as jsonld2 from "jsonld";
var OctironDebug = ({
  attrs
}) => {
  let currentAttrs = attrs;
  let value = attrs.o.value;
  let rendered;
  let displayStyle = "value";
  function onRender(redraw = true) {
    return __async(this, null, function* () {
      const { o } = currentAttrs;
      if (displayStyle === "value") {
        rendered = m10(OctironJSON, { value, selector: currentAttrs.selector, location: currentAttrs.location });
      } else if (displayStyle === "action-value" && (o.octironType === "action" || o.octironType === "action-selection")) {
        rendered = m10(OctironJSON, { value: o.actionValue.value, selector: currentAttrs.selector, location: currentAttrs.location });
      } else if (displayStyle === "expanded") {
        const expanded = yield jsonld2.compact(value, attrs.o.store.context);
        rendered = m10(OctironJSON, {
          value: expanded,
          location: currentAttrs.location
        });
      } else if (displayStyle === "flattened") {
        const flattened = flattenIRIObjects(value);
        rendered = m10(OctironJSON, {
          value: flattened,
          selector: currentAttrs.selector,
          location: currentAttrs.location
        });
      }
      if (redraw) {
        mithrilRedraw();
      }
    });
  }
  function onSetValue(e) {
    e.redraw = false;
    displayStyle = "value";
    onRender();
  }
  function onSetActionValue(e) {
    e.redraw = false;
    displayStyle = "action-value";
    onRender();
  }
  function onSetComponent(e) {
    e.redraw = false;
    displayStyle = "component";
    onRender();
  }
  function onSetExpanded(e) {
    e.redraw = false;
    displayStyle = "expanded";
    onRender();
  }
  function onSetFlattened(e) {
    e.redraw = false;
    displayStyle = "flattened";
    onRender();
  }
  return {
    oninit: ({ attrs: attrs2 }) => {
      currentAttrs = attrs2;
      onRender(false);
    },
    onbeforeupdate: ({ attrs: attrs2 }) => {
      if (attrs2.o.value !== value) {
        value = attrs2.o.value;
        onRender(true);
      }
    },
    view: ({ attrs: { o } }) => {
      const actions = [];
      let children;
      let actionValueAction;
      if (displayStyle === "component") {
        children = m10(".oct-debug-body", o.default());
      } else {
        children = m10(".oct-debug-body", rendered);
      }
      if (o.octironType === "action" || o.octironType === "action-selection") {
        actionValueAction = m10("button.oct-button", { type: "button", onclick: onSetActionValue }, "Action value");
      }
      return m10(
        "aside.oct-debug",
        m10(
          ".oct-debug-controls",
          m10(
            ".oct-button-group",
            m10("button.oct-button", { type: "button", onclick: onSetValue }, "Value"),
            actionValueAction,
            m10("button.oct-button", { type: "button", onclick: onSetComponent }, "Component"),
            m10("button.oct-button", { type: "button", onclick: () => console.log(o) }, "Log"),
            ...actions
          )
        ),
        children
      );
    }
  };
};

// lib/components/OctironExplorer.ts
import m11 from "mithril";
var OctironExplorer = ({
  attrs
}) => {
  let value = attrs.selector || "";
  let previousSelector = value;
  let selector = value;
  let presentationStyle = attrs.presentationStyle || "debug";
  let onChange = attrs.onChange;
  const fallbackComponent = {
    view: ({ attrs: { o } }) => {
      return m11(OctironDebug, { o, location: attrs.location });
    }
  };
  function onSearch(evt) {
    value = evt.target.value;
  }
  function onEnter(evt) {
    if (evt.key === "Enter") {
      onApply();
    }
  }
  function onApply() {
    selector = value;
    if (typeof onChange === "function") {
      onChange(selector, presentationStyle);
    }
  }
  function onSetDebug() {
    presentationStyle = "debug";
    if (typeof onChange === "function") {
      onChange(selector, presentationStyle);
    }
  }
  function onSetComponents() {
    presentationStyle = "components";
    if (typeof onChange === "function") {
      onChange(selector, presentationStyle);
    }
  }
  return {
    oninit: ({ attrs: attrs2 }) => {
      onChange = attrs2.onChange;
    },
    onbeforeupdate: ({ attrs: attrs2 }) => {
      var _a;
      selector = (_a = attrs2.selector) != null ? _a : "";
      if (selector !== previousSelector) {
        value = previousSelector = selector;
      }
      onChange = attrs2.onChange;
    },
    view: ({ attrs: { autofocus, o } }) => {
      let children;
      if (selector.length !== 0 && presentationStyle === "debug") {
        children = o.root(selector, (o2) => m11(OctironDebug, { o: o2, selector, location: attrs.location }));
      } else if (selector.length !== 0) {
        children = o.root(
          selector,
          (o2) => m11("div", o2.default({ fallbackComponent, attrs: { selector } }))
        );
      } else if (presentationStyle === "debug") {
        children = o.root((o2) => m11(OctironDebug, { o: o2, selector, location: attrs.location }));
      } else {
        children = o.root(
          (o2) => m11("div", o2.default({ fallbackComponent, attrs: { selector } }))
        );
      }
      return m11(
        ".oct-explorer",
        m11(
          ".oct-explorer-controls",
          m11(".oct-form-group", [
            m11("input", {
              value,
              autofocus,
              oninput: onSearch,
              onkeypress: onEnter
            }),
            m11(
              "button.oct-button",
              {
                type: "button",
                disabled: selector === value,
                onclick: onApply
              },
              "Apply"
            )
          ]),
          m11(
            ".oct-button-group",
            m11(
              "button.oct-button",
              {
                type: "button",
                disabled: presentationStyle === "debug",
                onclick: onSetDebug
              },
              "Debug"
            ),
            m11(
              "button.oct-button",
              {
                type: "button",
                disabled: presentationStyle === "components",
                onclick: onSetComponents
              },
              "Components"
            )
          )
        ),
        m11("pre.oct-explorer-body", children)
      );
    }
  };
};

// lib/components/OctironForm.ts
import m12 from "mithril";
var OctironForm = (vnode) => {
  var _a;
  const o = vnode.attrs.o;
  const method = ((_a = o.method) == null ? void 0 : _a.toUpperCase()) || "POST";
  const enctypes = {
    GET: "application/x-www-form-urlencoded",
    POST: "multipart/form-data"
  };
  return {
    view: (_b) => {
      var _c = _b, { attrs: _d } = _c, _e = _d, { o: o2 } = _e, attrs = __objRest(_e, ["o"]), { children } = _c;
      return m12(
        "form.oct-form",
        __spreadProps(__spreadValues({}, attrs), {
          method,
          enctype: enctypes[method || "GET"],
          action: o2.url,
          onSubmit: (evt) => {
            evt.preventDefault();
            o2.submit();
          }
        }),
        children
      );
    }
  };
};

// lib/components/OctironSubmitButton.ts
import m13 from "mithril";
var OctironSubmitButton = () => {
  return {
    view: ({ attrs, children }) => {
      return m13(
        "button.oct-button.oct-submit-button",
        {
          id: attrs.id,
          type: "submit",
          class: classes(attrs.class)
        },
        children
      );
    }
  };
};

// lib/octiron.ts
function octiron(_a) {
  var _b = _a, {
    typeDefs
  } = _b, storeArgs = __objRest(_b, [
    "typeDefs"
  ]);
  const store = new Store(storeArgs);
  const config = typeDefs != null ? makeTypeDefs(store, ...typeDefs) : {};
  return rootFactory({
    store,
    typeDefs: config
  });
}
octiron.fromInitialState = (_a) => {
  var _b = _a, {
    typeDefs
  } = _b, storeArgs = __objRest(_b, [
    "typeDefs"
  ]);
  const store = Store.fromInitialState(__spreadValues({}, storeArgs));
  const config = typeDefs != null ? makeTypeDefs(store, ...typeDefs) : {};
  return rootFactory({
    store,
    typeDefs: config
  });
};
export {
  OctironDebug,
  OctironExplorer,
  OctironForm,
  OctironJSON,
  OctironSubmitButton,
  Store,
  classes,
  octiron as default,
  jsonLDHandler,
  makeTypeDef,
  makeTypeDefs
};
//# sourceMappingURL=octiron.js.map
