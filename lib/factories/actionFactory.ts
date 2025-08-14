import m from 'mithril';
import { JsonPointer } from 'json-ptr';
import { ActionStateRenderer } from "../renderers/ActionStateRenderer.ts";
import { PerformRenderer } from "../renderers/PerformRenderer.ts";
import { SelectionRenderer } from "../renderers/SelectionRenderer.ts";
import type { Store } from "../store.ts";
import type { JSONArray, JSONObject, JSONValue, Mutable, SCMAction } from "../types/common.ts";
import type { ActionSelectView, BaseAttrs, Octiron, OctironAction, OctironActionSelectionArgs, OctironDefaultArgs, OctironPerformArgs, OctironPresentArgs, OctironSelectArgs, PayloadValueMapper, PerformView, Predicate, PresentComponent, Selector, SelectView, TypeDefs, UpdateArgs } from "../types/octiron.ts";
import type { EntityState } from "../types/store.ts";
import { getComponent } from "../utils/getComponent.ts";
import { getSubmitDetails } from "../utils/getSubmitDetails.ts";
import { getValueType } from "../utils/getValueType.ts";
import { unravelArgs } from "../utils/unravelArgs.ts";
import { mithrilRedraw } from "../utils/mithrilRedraw.ts";
import { ActionSelectionRenderer } from "../renderers/ActionSelectionRenderer.ts";
import { isJSONObject } from "../utils/isJSONObject.ts";

export interface OctironActionHooks {
  _updateArgs(args: OctironPerformArgs): void;
}

export type ActionInternals = {
  octiron: Octiron;
  store: Store;
  typeDefs: TypeDefs;
  index: number;
};

export type ActionRefs = {
  url?: string;
  method: string;
  submitting: boolean;
  payload: JSONObject;
  store: Store;
  typeDefs: TypeDefs;
  submitResult?: EntityState;
};

export function actionFactory<
  // deno-lint-ignore no-explicit-any
  Attrs extends Record<string, any> = Record<string, any>,
>(
  internals: ActionInternals,
  args: OctironPerformArgs<Attrs>,
): OctironAction & OctironActionHooks {
  const factoryArgs = Object.assign({}, args);
  let payload: JSONObject = {};
  let submitResult: EntityState | undefined;

  if (isJSONObject(args.initialPayload)) {
    for (const [key, value] of Object.entries(args.initialPayload)) {
      payload[internals.store.expand(key)] = value;
    }
  }

  const { url, method, body } = getSubmitDetails({
    payload,
    action: internals.octiron.value as SCMAction,
    store: internals.store,
  });

  if (body == null) {
    submitResult = internals.store.entity(url);
  }

  // this object is passed into children which need to keep hold of the
  // original object but read the most recent value after mutations on
  // on its members.
  const refs: ActionRefs = {
    url,
    method,
    submitting: false,
    payload,
    store: internals.store,
    typeDefs: internals.typeDefs,
    submitResult,
  };

  async function onSubmit() {
    const { url, method, body, contentType, encodingType } = getSubmitDetails({
      payload,
      action: internals.octiron.value as SCMAction,
      store: internals.store,
    });

    try {
      refs.submitting = true;

      mithrilRedraw();

      refs.submitResult = await internals.store.submit(url, {
        method,
        body,
        contentType,
        encodingType,
      });
    } catch (err) {
      console.error(err);
    }

    refs.submitting = false;

    mithrilRedraw();
  }

  function onUpdate(value: JSONObject) {
    const prev = payload;
    const next = {
      ...prev,
      ...value,
    };

    if (typeof args.interceptor === 'function') {
      payload = args.interceptor(
        next,
        prev,
        internals.octiron.value as SCMAction,
      );
    } else {
      payload = next;
    }
    // TODO: perform _updateArgs() when supported
    self.value = refs.payload = value;

    mithrilRedraw();
  }

  function onPointerUpdate(
    pointer: string,
    value: JSONValue,
  ) {
    const next: Partial<JSONObject> = Object.assign({}, payload);
    const ptr = JsonPointer.create(pointer);

    if (typeof value === 'undefined' || value === null) {
      ptr.unset(next) as Partial<JSONObject>;
    } else {
      ptr.set(next, value, true) as Partial<JSONObject>;
    }

    onUpdate(next);
  }

  const self: Mutable<OctironAction & OctironActionHooks> = function self(
    predicate: Predicate,
    children?: m.Children,
  ) {
    const passes = predicate(self as OctironAction);

    if (passes) {
      return children;
    }

    return null;
  } as OctironAction & OctironActionHooks;

  self.isOctiron = true;
  self.octironType = 'action';
  self.index = internals.index;
  self.readonly = false;
  self.value = refs.payload;
  self.action = internals.octiron;
  self.actionValue = internals.octiron;

  self.get = (termOrType) => {
    if (!isJSONObject(self.value)) {
      return null;
    }

    const type = self.store.expand(termOrType);

    return self.value[type] ?? null;
  }

  self.submit = async function (
    arg1?: PayloadValueMapper<JSONObject> | JSONObject
  ): Promise<void> {
    if (typeof arg1 === 'function') {
      onUpdate(arg1(payload));
    } else if (arg1 != null) {
      onUpdate(arg1);
    }

    return await onSubmit();
  } as OctironAction['submit'];

  self.update = async function (
    arg1: PayloadValueMapper<JSONObject> | JSONObject,
    args?: UpdateArgs,
  ): Promise<void> {
    if (typeof arg1 === 'function') {
      onUpdate(arg1(payload));
    } else if (arg1 != null) {
      onUpdate(arg1);
    }

    if (args?.submit || args?.submitOnChange) {
      await onSubmit();
    } else {
      mithrilRedraw();
    }
  } as OctironAction['update'];


  self.not = function(
    predicate: Predicate,
    children: m.Children,
  ): m.Children {
    if (self == null) {
      return null;
    }

    const passes = predicate(self as unknown as OctironAction);

    if (!passes) {
      return children;
    }

    return null;
  };

  self.root = function (
    arg1?: Selector | OctironSelectArgs | SelectView,
    arg2?: OctironSelectArgs | SelectView,
    arg3?: SelectView,
  ): m.Children {
    let selector: string;
    const [childSelector, args, view] = unravelArgs(arg1, arg2, arg3);

    if (childSelector == null) {
      selector = internals.store.rootIRI;
    } else {
      selector = `${internals.store.rootIRI} ${childSelector}`;
    }

    return m(SelectionRenderer, {
      selector,
      args,
      view,
      internals: {
        store: internals.store,
        typeDefs: args?.typeDefs || factoryArgs?.typeDefs || internals.typeDefs,
        parent: self as unknown as OctironAction,
      },
    });
  };

  self.enter = function(
    arg1: Selector,
    arg2?: OctironSelectArgs | SelectView,
    arg3?: SelectView,
  ): m.Children {
    const [selector, args, view] = unravelArgs(arg1, arg2, arg3);

    return m(SelectionRenderer, {
      selector,
      args,
      view,
      internals: {
        store: internals.store,
        typeDefs: args?.typeDefs || factoryArgs?.typeDefs || internals.typeDefs,
        parent: self as unknown as OctironAction,
      },
    });
  };

  self.present = function(
    args?: OctironPresentArgs<BaseAttrs>,
  ): m.Children {
    let attrs: BaseAttrs = {} as BaseAttrs;
    let firstPickComponent: PresentComponent<JSONObject, BaseAttrs> | undefined;
    let fallbackComponent: PresentComponent<JSONObject> | undefined;

    if (args?.attrs != null) {
      attrs = args.attrs as BaseAttrs;
    } else if (factoryArgs?.attrs != null) {
      attrs = factoryArgs.attrs as unknown as BaseAttrs;
    }

    if (args?.component != null) {
      firstPickComponent = args.component as PresentComponent<JSONObject, BaseAttrs>;
    } else if (factoryArgs?.component != null) {
      firstPickComponent = factoryArgs.component as unknown as PresentComponent<
        JSONObject,
        BaseAttrs
      >;
    }

    if (args?.fallbackComponent != null) {
      fallbackComponent = args.fallbackComponent as unknown as PresentComponent<JSONObject>;
    } else if (factoryArgs?.fallbackComponent != null) {
      fallbackComponent = factoryArgs.fallbackComponent as unknown as PresentComponent<JSONObject>;
    }

    const component = getComponent({
      style: "present",
      type: getValueType(internals.octiron.value),
      firstPickComponent: firstPickComponent as unknown as PresentComponent,
      fallbackComponent: fallbackComponent as unknown as PresentComponent,
      typeDefs: args?.typeDefs || internals.typeDefs || {},
    });

    if (component == null) {
      return null;
    }

    const { pre, sep, post, start, end, predicate } = Object.assign(
      {},
      factoryArgs,
      args,
    );

    // deno-lint-ignore no-explicit-any
    return m(component as any, {
      o: self,
      renderType: "present",
      value: self.value,
      attrs,
      pre,
      sep,
      post,
      start,
      end,
      predicate,
    });
  };

  self.default = function (
    args?: OctironDefaultArgs,
  ): m.Children {
    return self.present(args as OctironPresentArgs);
  };

  self.initial = function (
    children: m.Children
  ): m.Children {
    return m(
      ActionStateRenderer,
      {
        type: 'initial',
        refs,
      },
      children,
    );
  };

  self.success = function (
    arg1?: Selector | OctironSelectArgs | SelectView,
    arg2?: OctironSelectArgs | SelectView,
    arg3?: SelectView,
  ): m.Children {
    const [selector, args, view] = unravelArgs(arg1, arg2, arg3);

    return m(ActionStateRenderer, {
      type: 'success',
      selector,
      args,
      view,
      refs,
    });
  };

  self.failure = function (
    arg1?: Selector | OctironSelectArgs | SelectView,
    arg2?: OctironSelectArgs | SelectView,
    arg3?: SelectView,
  ) {
    const [selector, args, view] = unravelArgs(arg1, arg2, arg3);

    return m(ActionStateRenderer, {
      type: 'failure',
      selector,
      args,
      view,
      refs,
    });
  };

  self.select = function (
    arg1: Selector,
    arg2?: OctironActionSelectionArgs | ActionSelectView,
    arg3?: ActionSelectView,
  ): m.Children | null {
    const [selector, args, view] = unravelArgs(arg1, arg2, arg3);

    return m(
      ActionSelectionRenderer,
      {
        internals: {
          action: self as unknown as OctironAction,
          parent: self as unknown as OctironAction,
          entity: internals.octiron,
          store: internals.store,
          typeDefs: internals.typeDefs,
          onSubmit,
          onUpdate: onPointerUpdate,
          submitting: refs.submitting,
        },
        selector,
        value: self.value,
        actionValue: internals.octiron.value as JSONObject,
        args,
        view,
      }
    );
  };

  self.perform = function (
    arg1?: Selector | OctironPerformArgs | PerformView,
    arg2?: OctironPerformArgs | PerformView,
    arg3?: PerformView,
  ): m.Children {
    const [selector, args, view] = unravelArgs(arg1, arg2, arg3);

    return m(PerformRenderer, {
      selector,
      args,
      view,
      internals: {
        octiron: self as unknown as OctironAction,
        store: internals.store,
        typeDefs: internals.typeDefs,
      },
    });
  };

  self.append = function (
    termOrType: string,
    value: JSONValue = {},
    args: UpdateArgs = {},
  ) {
    const type = internals.store.expand(termOrType);

    if (isJSONObject(self.value)) {
      const prevValue = self.value[type];
      let nextValue: JSONArray = [];

      if (prevValue != null && !Array.isArray(prevValue)) {
        nextValue.push(prevValue);
      } else if (Array.isArray(prevValue)) {
        nextValue = [...prevValue];
      }

      nextValue.push(value);

      return self.update({
        ...self.value,
        [type]: nextValue,
      }, args);
    }
  };

  self._updateArgs = function (
    args: OctironPerformArgs,
  ) {
    for (const [key, value] of Object.entries(args)) {
      // deno-lint-ignore no-explicit-any
      (factoryArgs as Record<string, any>)[key] = value;
    }
  };

  if (
    typeof window === 'undefined' && args.submitOnInit &&
    submitResult == null
  ) {
    self.submit();
  } else if (typeof window !== 'undefined' && args.submitOnInit) {
    self.submit();
  }

  return self as OctironAction & OctironActionHooks;
}
