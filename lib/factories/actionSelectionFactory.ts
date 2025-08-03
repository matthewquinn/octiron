import m from 'mithril';
import type { JSONArray, JSONObject, JSONValue, SCMPropertyValueSpecification } from "../types/common.ts";
import type { ActionSelectView, BaseAttrs, Octiron, OctironAction, OctironActionSelection, OctironActionSelectionArgs, OctironDefaultArgs, OctironEditArgs, OctironPresentArgs, OctironSelectArgs, OctironSelection, PayloadValueMapper, Predicate, PresentComponent, Selector, SelectView, TypeDefs, UpdateArgs } from "../types/octiron.ts";
import type { Store } from "../store.ts";
import { octironFactory } from "./octironFactory.ts";
import { isJSONObject } from "../utils/isJSONObject.ts";
import { mithrilRedraw } from "../utils/mithrilRedraw.ts";
import { unravelArgs } from "../utils/unravelArgs.ts";
import { SelectionRenderer } from "../renderers/SelectionRenderer.ts";
import { getComponent } from "../utils/getComponent.ts";
import { getValueType } from "../utils/getValueType.ts";
import { ActionSelectionRenderer } from "../renderers/ActionSelectionRenderer.ts";


export type OnActionSelectionSubmit = () => Promise<void>;

export type OnActionSelectionUpdate = (
  pointer: string,
  value: JSONValue,
  args: UpdateArgs,
) => void;

export type ActionSelectionInternals = {
  submitting: boolean;
  type: string | string[];
  datatype: string;
  pointer: string;
  name: string;
  value: JSONValue;
  actionValue?: JSONValue;
  entity: Octiron;
  action: OctironAction;
  parent: OctironAction | OctironActionSelection;
  octiron: OctironSelection;
  store: Store;
  spec?: SCMPropertyValueSpecification;
  typeDefs: TypeDefs;
  onSubmit: OnActionSelectionSubmit;
  onUpdate: OnActionSelectionUpdate;
};

export type OctironActionSelectionHooks = {
  _updateArgs(args: OctironActionSelectionArgs): void;
  _updateInternals(internals: ActionSelectionInternals): void;
}

export function actionSelectionFactory<
  // deno-lint-ignore no-explicit-any
  Attrs extends Record<string, any> = Record<string, any>
>(
  internals: ActionSelectionInternals,
  args: OctironActionSelectionArgs<JSONValue, Attrs>,
): OctironActionSelection & OctironActionSelectionHooks {
  const factoryArgs = Object.assign({}, args);
  const uniqueId = internals.store.key();

  const refs = Object.assign({}, args);

  function onUpdate(value: JSONObject) {
    return internals.onUpdate(internals.pointer, value, {
      throttle: refs.throttle,
      debounce: refs.debounce,
      submitOnChange: refs.submitOnChange,
    });
  }

  const self = octironFactory<OctironActionSelection & OctironActionSelectionHooks>();

  self.octironType = 'action-selection';
  self.readonly = internals.spec == null ? true : (internals.spec.readonlyValue || false);
  self.store = internals.store;
  self.id = uniqueId;
  self.inputName = internals.datatype;
  self.submitting = internals.submitting;
  self.value = internals.value ?? args.initialValue;
  self.action = internals.action;
  // TODO: Probably not the correct instance
  self.actionValue = internals.parent;

  self.update = async function(
    arg1: PayloadValueMapper<JSONObject> | JSONObject,
    args?: UpdateArgs,
  ): Promise<void> {
    const value = self.value;

    if (!isJSONObject(value)) {
      throw new Error(`Cannot call update on a non object selection instance`);
    }

    if (typeof arg1 === 'function') {
      onUpdate(arg1(value));
    } else if (arg1 != null) {
      onUpdate(arg1);
    }

    if (args?.submit || args?.submitOnChange) {
      await internals.onSubmit();
    } else {
      mithrilRedraw();
    }
  };

  self.submit = function (): Promise<void> {
    return internals.onSubmit();
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

  self.select = function (
    arg1: Selector,
    arg2?: OctironActionSelectionArgs | ActionSelectView,
    arg3?: ActionSelectView,
  ): m.Children | null {
    if (!isJSONObject(self.value)) {
      return null;
    }

    const [selector, args, view] = unravelArgs(arg1, arg2, arg3);

    return m(
      ActionSelectionRenderer,
      {
        internals,
        selector,
        value: self.value,
        actionValue: internals.octiron.value as JSONObject,
        args,
        view,
      },
    );
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
    // deno-lint-ignore no-explicit-any
    args?: OctironPresentArgs<any, BaseAttrs>,
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
      type: getValueType(internals.value),
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

  self.edit = function(
    // deno-lint-ignore no-explicit-any
    args?: OctironEditArgs<any, BaseAttrs>,
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
      style: "edit",
      type: getValueType(internals.value),
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
      renderType: "edit",
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
    args?: OctironPresentArgs | OctironEditArgs,
  ): m.Children {
    return self.edit(args as OctironEditArgs);
  };

  self.initial = function (children: m.Children) {
    return internals.action.initial(children);
  };

  self.success = function (
    arg1?: Selector | OctironSelectArgs | SelectView,
    arg2?: OctironSelectArgs | SelectView,
    arg3?: SelectView,
  ) {
    return internals.action.success(
      arg1 as Selector,
      arg2 as OctironSelectArgs,
      arg3 as SelectView,
    );
  };

  self.failure = function (
    arg1?: Selector | OctironSelectArgs | SelectView,
    arg2?: OctironSelectArgs | SelectView,
    arg3?: SelectView,
  ) {
    return internals.action.failure(
      arg1 as Selector,
      arg2 as OctironSelectArgs,
      arg3 as SelectView,
    );
  };

  self.remove = function (
    args: UpdateArgs = {},
  ) {
    internals.onUpdate(
      internals.pointer,
      null as unknown as JSONObject,
      args,
    );
  };

  self.append = function (
    type: string,
    value: JSONValue = {},
    args: UpdateArgs = {},
  ) {
    if (isJSONObject(self.value)) {
      const prevValue = self.value[type];
      let nextValue: JSONArray = [];

      if (prevValue != null && !Array.isArray(prevValue)) {
        nextValue.push(prevValue);
      } else if (Array.isArray(prevValue)) {
        nextValue = [...prevValue];
      }

      nextValue.push(value);

      return internals.onUpdate(internals.pointer, {
        ...self.value,
        [type]: nextValue,
      }, args);
    }
  };

  self._updateInternals = function (args: ActionSelectionInternals) {
    for (const [key, value] of Object.entries(args)) {
      // deno-lint-ignore no-explicit-any
      (internals as Record<string, any>)[key] = value;
    }
  };

  self._updateArgs = function (args: OctironActionSelectionArgs) {
    for (const [key, value] of Object.entries(args)) {
      // deno-lint-ignore no-explicit-any
      (factoryArgs as Record<string, any>)[key] = value;
    }
  };

  return self as unknown as OctironActionSelection & OctironActionSelectionHooks;
}
