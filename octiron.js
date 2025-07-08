var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __typeError = (msg) => {
  throw TypeError(msg);
};
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
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
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

// lib/factories/rootFactory.ts
import m4 from "mithril";

// lib/renderers/SelectionRenderer.ts
import m3 from "mithril";

// lib/factories/selectionFactory.ts
import m from "mithril";

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
  if (typeof firstPickComponent !== "undefined") {
    return firstPickComponent;
  }
  if (typeof datatype !== "undefined" && typeof ((_a = typeDefs[datatype]) == null ? void 0 : _a[style]) !== "undefined") {
    return typeDefs[datatype][style];
  }
  if (typeof type === "string" && typeof ((_b = typeDefs[type]) == null ? void 0 : _b[style]) !== "undefined") {
    return typeDefs[type][style];
  }
  if (Array.isArray(type)) {
    for (const item of type) {
      if (typeof ((_c = typeDefs[item]) == null ? void 0 : _c[style]) !== "undefined") {
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
  if (view == null) {
    view = (o) => o.present(args);
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
      if (internals.parent == null) {
        return null;
      }
      const passes = predicate(internals.parent);
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
        if (internals.parent == null) {
          return null;
        }
        const passes = predicate(internals.parent);
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
        return m(SelectionRenderer, {
          selector,
          args: args2,
          view,
          internals: {
            store: internals.store,
            typeDefs: internals.typeDefs
          }
        });
      },
      enter(arg1, arg2, arg3) {
        const [selector, args2, view] = unravelArgs(arg1, arg2, arg3);
        return m(SelectionRenderer, {
          selector,
          args: args2,
          view,
          internals: {
            store: internals.store,
            typeDefs: internals.typeDefs
          }
        });
      },
      select: (arg1, arg2, arg3) => {
        const [selector, args2, view] = unravelArgs(arg1, arg2, arg3);
        if (!isJSONObject(internals.value)) {
          return null;
        }
        return m(
          SelectionRenderer,
          {
            selector,
            args: args2,
            view,
            internals: {
              store: internals.store,
              typeDefs: internals.typeDefs,
              value: internals.value
            }
          }
        );
      },
      // deno-lint-ignore no-explicit-any
      present(args2) {
        var _a;
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
          typeDefs: (_a = internals.typeDefs) != null ? _a : {}
        });
        if (component == null) {
          return null;
        }
        const { pre, sep, post, start, end, predicate } = Object.assign(
          {},
          factoryArgs,
          args2
        );
        return m(component, {
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

// lib/utils/mithrilRedraw.ts
import m2 from "mithril";

// lib/consts.ts
var isBrowserRender = typeof window !== "undefined";

// lib/utils/mithrilRedraw.ts
function mithrilRedraw() {
  if (isBrowserRender) {
    m2.redraw();
  }
}

// lib/renderers/SelectionRenderer.ts
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
      typeDefs
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
      nextKeys.push(selectionResult.key);
      if (Object.hasOwn(instances, selectionResult.key)) {
        const next = selectionResult;
        const prev = instances[selectionResult.key].selectionResult;
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
          value: selectionResult.value
        });
      } else {
        octiron2 = selectionFactory({
          store,
          typeDefs,
          value: selectionResult.value,
          datatype: selectionResult.datatype
        });
      }
      instances[selectionResult.key] = {
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
        children.push(m3.fragment({ key: preKey }, [pre]));
      }
      for (let index = 0; index < list.length; index++) {
        const { selectionResult, octiron: octiron2 } = list[index];
        const { key: key2 } = selectionResult;
        if (index !== 0) {
          children.push(m3.fragment({ key: `@${Symbol.keyFor(key2)}` }, [sep]));
        }
        if (selectionResult.type === "value") {
          children.push(m3.fragment({ key: key2 }, [view(octiron2)]));
        } else if (!selectionResult.ok && typeof fallback === "function") {
          children.push(
            m3.fragment({ key: key2 }, [fallback(octiron2, selectionResult.reason)])
          );
        } else if (!selectionResult.ok) {
          children.push(m3.fragment({ key: key2 }, [fallback]));
        } else {
          children.push(m3.fragment({ key: key2 }, [view(octiron2)]));
        }
      }
      if (post != null) {
        children.push(m3.fragment({ key: postKey }, [post]));
      }
      return children;
    }
  };
};
var preKey = Symbol.for("@pre");
var postKey = Symbol.for("@post");

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
        return m4(SelectionRenderer, {
          selector,
          args,
          view,
          internals: {
            store: internals.store,
            typeDefs: internals.typeDefs
          }
        });
      },
      select(arg1, arg2, arg3) {
        return self.root(arg1, arg2, arg3);
      },
      present(arg1, arg2) {
        return self.root(arg1, arg2);
      }
    }
  );
  return self;
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

// lib/utils/escapeJSONPointerParts.ts
function escapeJSONPointerParts(...parts) {
  const escaped = parts.map((part) => part.replace(/~/, "~0").replace(/\//, "~1")).join("/");
  return `${escaped}`;
}

// lib/utils/parseSelectorString.ts
var selectorRe = new RegExp("\\s*(?<subject>([^\\[\\s]+))(\\[(?<filter>([^\\]])+)\\])?\\s*", "g");
function parseSelectorString(selector) {
  var _a, _b;
  let match;
  const selectors = [];
  while (match = selectorRe.exec(selector)) {
    const subject = (_a = match.groups) == null ? void 0 : _a.subject;
    const filter = (_b = match.groups) == null ? void 0 : _b.filter;
    if (typeof filter === "string" && typeof subject === "string") {
      selectors.push({
        subject,
        filter
      });
    } else if (typeof subject === "string") {
      selectors.push({
        subject
      });
    } else {
      throw new Error(`Invalid selector: ${selector}`);
    }
  }
  return selectors;
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
    complete: false,
    hasErrors: false,
    hasMissing: false,
    required: [],
    dependencies: [],
    result: []
  };
  if (typeof value === "undefined") {
    const [{ subject: iri, filter }, ...selector2] = parseSelectorString(selectorStr);
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
  const selector = parseSelectorString(selectorStr);
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
  // spec,
  // actionValue,
  store,
  details
}) {
  if (value == null) {
    details.hasMissing = true;
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
    const contentType = store.entities[iri].contentType;
    details.result.push({
      keySource,
      pointer,
      type: "entity",
      iri,
      ok: true,
      value,
      contentType
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
  if (isJSONObject(actionValue == null ? void 0 : actionValue[`${type}-input`])) {
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
  if (value[type] == null) {
    details.hasMissing = true;
    return;
  }
  if (rest.length === 0) {
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
  const cache = store.entities[iri];
  details.dependencies.push(iri);
  if (typeof cache === "undefined" || cache.loading) {
    if (!details.required.includes(iri)) {
      details.required.push(iri);
    }
    return;
  }
  if (!cache.ok) {
    details.hasErrors = true;
    if (typeof selector === "undefined" || selector.length === 0) {
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
      contentType: cache.contentType,
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
      value: cache.value,
      contentType: cache.contentType
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

// lib/handlers/jsonLDHandler.ts
import jsonld from "jsonld";
var jsonLDHandler = (_0) => __async(null, [_0], function* ({
  res,
  store
}) {
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
      const document = yield res2.json();
      return {
        documentUrl: url,
        document
      };
    })
  });
  const value = yield jsonld.compact(expanded, store.context);
  return {
    value,
    purpose: "json-ld"
  };
});

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
var _error;
var ContentHandlingFailure = class {
  constructor(error) {
    __privateAdd(this, _error);
    __privateSet(this, _error, error);
  }
  get error() {
    return __privateGet(this, _error);
  }
  undefined() {
    return null;
  }
  http() {
    return null;
  }
  unparserable(arg) {
    if (typeof arg === "function") {
      return arg(__privateGet(this, _error));
    }
    return arg;
  }
};
_error = new WeakMap();

// lib/store.ts
function makeStore(_a) {
  var _b = _a, {
    rootIRI,
    vocab,
    responseHook
  } = _b, args = __objRest(_b, [
    "rootIRI",
    "vocab",
    "responseHook"
  ]);
  var _a2, _b2, _c, _d, _e;
  const context = {};
  const headers = (_a2 = args.headers) != null ? _a2 : {};
  const handlers = (_b2 = args.handlers) != null ? _b2 : {};
  const origins = new Map([
    [rootIRI, headers],
    ...Object.entries(Object.assign({}, args.origins))
  ]);
  const entities = (_c = args.entities) != null ? _c : {};
  const aliases = (_d = args.aliases) != null ? _d : {};
  const fetcher = (_e = args.fetcher) != null ? _e : fetch;
  if (typeof vocab === "string") {
    context["@vocab"] = vocab;
  }
  if (typeof args.aliases !== "undefined") {
    for (const [key, value] of Object.entries(args.aliases)) {
      context[key] = value;
    }
  }
  const store = {
    rootIRI,
    vocab,
    aliases,
    entities,
    context
  };
  if (handlers["application/ld+json"] == null) {
    handlers["application/ld+json"] = jsonLDHandler;
  }
  const dependentsMapper = {};
  const listenersMapper = {};
  function makeCleanupFn({
    key,
    details
  }) {
    return function cleanup() {
      delete listenersMapper[key];
      for (const dependency of details.dependencies) {
        if (typeof dependentsMapper[dependency] === "undefined") {
          continue;
        }
        const index = dependentsMapper[dependency].indexOf(key);
        dependentsMapper[dependency].splice(index, 1);
        if (isBrowserRender && dependentsMapper[dependency].length === 0) {
          delete entities[dependency];
        }
      }
    };
  }
  function publish(iri) {
    const keys = [...dependentsMapper[iri] || []];
    for (const key of keys) {
      const { selector, value, listener } = listenersMapper[key];
      const details = getSelection({
        selector,
        value,
        store
      });
      const cleanup = makeCleanupFn({ key, details });
      for (const dependency of details.dependencies) {
        if (!Array.isArray(dependentsMapper[dependency])) {
          dependentsMapper[dependency] = [key];
        } else {
          dependentsMapper[dependency].push(key);
        }
      }
      listenersMapper[key].cleanup = cleanup;
      listener(details);
    }
  }
  function callFetcher(_0) {
    return __async(this, arguments, function* (iri, args2 = {}) {
      const url = new URL(iri);
      if (!origins.has(url.origin)) {
        throw new Error(`Unconfigured origin`);
      }
      if (entities[iri]) {
        return;
      }
      entities[iri] = {
        iri,
        loading: true
      };
      const promise = new Promise((resolve) => {
        setTimeout(() => __async(null, null, function* () {
          var _a3, _b3;
          const res = yield fetcher(iri, {
            method: (_a3 = args2.method) != null ? _a3 : "get",
            headers: Object.assign({}, origins.get(iri), args2.headers),
            body: args2.body
          });
          const contentType = (_b3 = res.headers.get("content-type")) == null ? void 0 : _b3.split(";")[0];
          if (contentType == null) {
            throw new Error("No content type");
          }
          if (contentType === null || handlers[contentType] === null) {
            const error = new Error(`Unsupported content type ${contentType}`);
            const reason = new ContentHandlingFailure(error);
            entities[iri] = {
              iri,
              loading: false,
              ok: false,
              value: {},
              status: res.status,
              contentType,
              reason
            };
            return;
          }
          try {
            const { purpose, value } = yield handlers[contentType]({
              res,
              store
            });
            const iris = [iri];
            if (res.ok) {
              entities[iri] = {
                iri,
                loading: false,
                ok: true,
                value,
                contentType
              };
            } else {
              const reason = new HTTPFailure(res.status, res);
              entities[iri] = {
                iri,
                loading: false,
                ok: false,
                value,
                status: res.status,
                contentType,
                reason
              };
            }
            if (purpose === "json-ld") {
              for (const entity of flattenIRIObjects(value)) {
                if (iris.includes(entity["@id"])) {
                  continue;
                }
                entities[entity["@id"]] = {
                  iri: entity["@id"],
                  loading: false,
                  ok: true,
                  value: entity,
                  contentType
                };
              }
            }
            for (const iri2 of iris) {
              publish(iri2);
            }
          } catch (err) {
            console.error(err);
          }
          resolve(res);
        }));
      });
      if (typeof responseHook === "function") {
        responseHook(promise);
      }
      yield promise;
    });
  }
  ;
  store.fetch = function(iri) {
    return __async(this, null, function* () {
      yield callFetcher(iri);
      return entities[iri];
    });
  };
  store.expand = function(term) {
    if (term.includes(":")) {
      const [alias, rest] = term.split(":");
      return `${aliases[alias]}${rest}`;
    } else if (typeof vocab !== "string") {
      return term;
    }
    return `${vocab}${term}`;
  };
  store.select = (selector, value) => {
    return getSelection({
      selector,
      value,
      store
    });
  };
  store.subscribe = function({ key, selector, value, listener }) {
    const details = getSelection({
      selector,
      value,
      store
    });
    const cleanup = makeCleanupFn({ key, details });
    for (const dependency of details.dependencies) {
      if (!Array.isArray(dependentsMapper[dependency])) {
        dependentsMapper[dependency] = [key];
      } else {
        dependentsMapper[dependency].push(key);
      }
    }
    listenersMapper[key] = {
      key,
      selector,
      value,
      required: details.required,
      dependencies: details.dependencies,
      listener,
      cleanup
    };
    return details;
  };
  store.unsubscribe = function(key) {
    var _a3;
    (_a3 = listenersMapper[key]) == null ? void 0 : _a3.cleanup();
  };
  if (typeof vocab === "string") {
    context["@vocab"] = vocab;
  }
  for (const [key, value] of Object.entries(aliases)) {
    context[key] = value;
  }
  if (headers.accept == null) {
    headers["accept"] = "application/ld+json";
  }
  return store;
}

// lib/utils/makeTypeDefs.ts
function makeTypeDefs(...typeDefs) {
  const config = {};
  for (const typeDef of typeDefs) {
    config[typeDef.type] = typeDef;
  }
  return config;
}

// lib/utils/makeTypeDef.ts
function makeTypeDef(typeDef) {
  return typeDef;
}

// lib/octiron.ts
function octiron(_a) {
  var _b = _a, {
    typeDefs
  } = _b, storeArgs = __objRest(_b, [
    "typeDefs"
  ]);
  const config = typeDefs != null ? makeTypeDefs(...typeDefs) : {};
  const store = makeStore(storeArgs);
  return rootFactory({
    store,
    typeDefs: config
  });
}
export {
  octiron as default,
  makeStore,
  makeTypeDef,
  makeTypeDefs
};
