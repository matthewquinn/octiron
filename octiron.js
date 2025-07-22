var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
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

// lib/utils/makeTypeDefs.ts
function makeTypeDefs(...typeDefs) {
  const config = {};
  for (const typeDef of typeDefs) {
    config[typeDef.type] = typeDef;
  }
  return config;
}

// lib/alternatives/htmlFragments.ts
import m5 from "mithril";
var HTMLFragmentsIntegrationComponent = () => {
  return {
    view({ attrs: { fragment, rootHTML, fragmentsHTML } }) {
      const html = fragment == null ? rootHTML : fragmentsHTML[fragment];
      if (html == null) {
        return null;
      }
      return m5.trust(html);
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
    return m5(HTMLFragmentsIntegrationComponent, {
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
import m6 from "mithril";
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
      return m6.trust(html);
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
    return m6(HTMLIntegrationComponent, {
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
  const cache = store.entity(iri);
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
    aliasMap.set(`^${key}:`, value);
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
    var _a;
    __privateSet(this, _rootIRI, args.rootIRI);
    __privateSet(this, _rootOrigin, new URL(args.rootIRI).origin);
    __privateSet(this, _vocab, args.vocab);
    __privateSet(this, _fetcher, (_a = args.fetcher) != null ? _a : fetch);
    __privateSet(this, _responseHook, args.responseHook);
    [__privateWrapper(this, _headers)._, __privateWrapper(this, _origins)._] = getInternalHeaderValues(args.headers, args.origins);
    [__privateWrapper(this, _aliases)._, __privateWrapper(this, _context)._] = getJSONLdValues(args.vocab, args.aliases);
    __privateSet(this, _handlers, new Map(args.handlers.map((handler) => [handler.contentType, handler])));
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
    if (__privateGet(this, _vocab) != null && termOrType.startsWith(__privateGet(this, _vocab))) {
      expanded = termOrType.replace(__privateGet(this, _vocab), "");
    } else if (/https?:\/\//.test(termOrType)) {
      expanded = termOrType;
    } else {
      for (const [key, value] of __privateGet(this, _aliases)) {
        const reg = new RegExp(key);
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
    if (isBrowserRender) {
      return "";
    }
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
  handleResponse(res) {
    return __async(this, null, function* () {
      var _a, _b, _c;
      const iri = res.url.toString();
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
  accept = accept || __privateGet(this, _headers).get("accept") || defaultAccept;
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
    const url = new URL(iri);
    const method = args.method || "get";
    const accept = args.accept || __privateGet(this, _headers).get("accept") || defaultAccept;
    const loadingKey = __privateMethod(this, _Store_instances, getLoadingKey_fn).call(this, iri, method, args.accept);
    const headers = new Headers(__privateGet(this, _headers));
    headers.set("accept", accept);
    if (url.origin !== __privateGet(this, _rootOrigin) && !__privateGet(this, _origins).has(url.origin)) {
      throw new Error("Unconfigured origin");
    }
    __privateGet(this, _loading).add(loadingKey);
    mithrilRedraw();
    const promise = new Promise((resolve) => {
      (() => __async(this, null, function* () {
        const res = yield __privateGet(this, _fetcher).call(this, iri, {
          method,
          headers,
          body: args.body
        });
        yield this.handleResponse(res);
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
  const store = new Store(storeArgs);
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
  const config = typeDefs != null ? makeTypeDefs(...typeDefs) : {};
  const store = Store.fromInitialState(__spreadValues({}, storeArgs));
  return rootFactory({
    store,
    typeDefs: config
  });
};
export {
  Store,
  octiron as default,
  makeTypeDef,
  makeTypeDefs
};
