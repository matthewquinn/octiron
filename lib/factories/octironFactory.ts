import m from 'mithril';
import type { Octiron } from "@octiron/octiron";
import type { JSONValue, Mutable } from "../types/common.ts";
import type { AnyAttrs, AnyComponent, BaseAttrs, EditAttrs, EditComponent, OctironAction, OctironActionSelection, OctironActionSelectionArgs, OctironDefaultArgs, OctironEditArgs, OctironPerformArgs, OctironPresentArgs, OctironRoot, OctironSelectArgs, OctironSelection, PerformView, Predicate, PresentAttrs, PresentComponent, Selector, SelectView, TypeDefs } from "../types/octiron.ts";
import { isJSONObject } from "../utils/isJSONObject.ts";
import { unravelArgs } from "../utils/unravelArgs.ts";
import type { Store } from "../store.ts";
import { SelectionRenderer } from "../renderers/SelectionRenderer.ts";
import { getDataType } from "../utils/getValueType.ts";
import { isIterable } from "../utils/isIterable.ts";
import { getIterableValue } from "../utils/getIterableValue.ts";
import { PerformRenderer } from "../renderers/PerformRenderer.ts";
import { selectComponentFromArgs } from "../utils/selectComponentFromArgs.ts";

const TypeKeys = {
  'root': 0,
  'selection': 1,
  'action': 2,
  'action-selection': 3,
} as const;

export type CommonInternals = {
  index?: number;
  propType?: string;
  value?: JSONValue;
  store: Store;
  typeDefs: TypeDefs;
  octiron?: Octiron;
};

export type CommonArgs = {
  pre?: m.Children,
  sep?: m.Children,
  post?: m.Children,
  start?: number,
  end?: number,
  predicate?: Predicate,
  store?: Store,
  typeDefs?: TypeDefs,
  attrs?: PresentAttrs | EditAttrs | AnyAttrs,
  component?: PresentComponent | EditComponent | AnyComponent,
  fallbackComponent?: AnyComponent,
};

export type InstanceHooks = {
  _updateArgs: (args: OctironSelectArgs | OctironPerformArgs | OctironActionSelectionArgs) => void;
}

export function octironFactory(
  octironType: 'root',
  internals: CommonInternals,
): Mutable<OctironRoot>;

export function octironFactory(
  octironType: 'selection',
  internals: CommonInternals,
  args?: CommonArgs,
): Mutable<OctironSelection & InstanceHooks>;

export function octironFactory(
  octironType: 'action',
  internals: CommonInternals,
  args?: CommonArgs,
): Mutable<OctironAction & InstanceHooks>;

export function octironFactory(
  octironType: 'action-selection',
  internals: CommonInternals,
  args?: CommonArgs,
): Mutable<OctironActionSelection & InstanceHooks>;

export function octironFactory<O extends Octiron>(
  octironType: 'root' | 'selection' | 'action' | 'action-selection',
  internals: CommonInternals,
  factoryArgs: CommonArgs = {},
): Mutable<O> {
  const typeKey = TypeKeys[octironType];
  const self: Mutable<O & InstanceHooks> = function(
    predicate: Predicate,
    children: m.Children,
  ): m.Children {
    const passes = predicate(self as O);

    if (passes) {
      return children;
    }

    return null;
  } as O & InstanceHooks;

  self.id = internals.store.key();
  self.isOctiron = true;
  self.octironType = octironType;
  self.readonly = true;
  self.value = internals.value ?? null;
  self.store = internals.store;
  self.index = internals.index ?? 0;
  self.position = -1;

  if (typeKey !== TypeKeys['root']) {
    self.propType = internals.propType;
    self.dataType = getDataType(self.value);
  }

  self.not = (
    predicate: Predicate,
    children: m.Children,
  ): m.Children => {
    if (self == null) {
      return null;
    }

    const passes = predicate(self as O);

    if (!passes) {
      return children;
    }

    return null;
  };

  self.get = (termOrType) => {
    if (!isJSONObject(self.value)) {
      return null;
    }

    const type = self.store.expand(termOrType);
    const value = self.value[type] ?? null;

    if (isIterable(value)) {
      return getIterableValue(value);
    }

    return self.value[type] ?? null;
  }

  self.enter = (
    arg1: Selector,
    arg2?: OctironSelectArgs | SelectView,
    arg3?: SelectView,
  ): m.Children => {
    const [selector, args, view] = unravelArgs(arg1, arg2, arg3);

    return m(SelectionRenderer, {
      selector,
      args,
      view,
      internals: {
        store: internals.store,
        typeDefs: args?.typeDefs ?? factoryArgs?.typeDefs ?? internals.typeDefs,
        parent: self as unknown as OctironAction,
      },
    });
  };

  self.root = (
    arg1?: Selector | OctironSelectArgs | SelectView,
    arg2?: OctironSelectArgs | SelectView,
    arg3?: SelectView,
  ): m.Children => {
    let selector: string;
    const [childSelector, args, view] = unravelArgs(arg1, arg2, arg3);

    if (childSelector == null) {
      selector = internals.store.rootIRI;
    } else {
      selector = `${internals.store.rootIRI} ${childSelector}`;
    }

    return self.enter(selector, args, view);
  };

  // action and action selection define their own select method
  switch (typeKey) {
    case TypeKeys['root']:
      self.select = self.root;
      break;
    case TypeKeys['selection']:
      self.select = (
        arg1: Selector,
        arg2?: OctironSelectArgs | SelectView,
        arg3?: SelectView,
      ): m.Children => {
        const [selector, args, view] = unravelArgs(arg1, arg2, arg3);

        if (!isJSONObject(internals.value)) {
          return null;
        }

        return m(
          SelectionRenderer,
          {
            selector,
            args,
            view,
            internals: {
              store: internals.store,
              typeDefs: args?.typeDefs || internals.typeDefs,
              value: internals.value,
              parent: self as unknown as OctironSelection,
            },
          },
        );
      };
  }

  switch (typeKey) {
    case TypeKeys['root']:
      self.present = self.root;
      break;
    default:
      self.present = (
        args?: OctironPresentArgs<BaseAttrs>,
      ): m.Children => {
        const [attrs, component] = selectComponentFromArgs(
          'present',
          internals,
          args,
          factoryArgs as OctironPresentArgs,
        );

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
  }

  self.default = (
    args?: OctironDefaultArgs,
  ) => {
    return self.present(Object.assign({ component: null }, args));
  };
  // self.default = self.present;

  switch (typeKey) {
    case TypeKeys['root']:
      self.perform = (
        arg1?: Selector | OctironPerformArgs | PerformView,
        arg2?: OctironPerformArgs | PerformView,
        arg3?: PerformView,
      ) => {
        if (typeof arg1 === 'string') {
          return self.root(arg1, (o) => o.perform(
            arg2 as OctironPerformArgs,
            arg3 as PerformView,
          ));
        }

        return self.root((o) => o.perform(
          arg2 as OctironPerformArgs,
          arg3 as PerformView,
        ));
      };
      break;
    default:
      self.perform = (
        arg1?: Selector | OctironPerformArgs | PerformView,
        arg2?: OctironPerformArgs | PerformView,
        arg3?: PerformView,
      ) => {
        const [selector, args, view] = unravelArgs(arg1, arg2, arg3);

        return m(PerformRenderer, {
          selector,
          args,
          view,
          internals: {
            octiron: self as unknown as OctironSelection,
            store: args.store ?? internals.store,
            typeDefs: args.typeDefs ?? internals.typeDefs,
          },
        });
      };
      break;
  }

  if (typeKey !== TypeKeys['root']) {
    const updateArgs: InstanceHooks['_updateArgs'] = (args) => {
      for (const [key, value] of Object.entries(args)) {
        // deno-lint-ignore no-explicit-any
        (factoryArgs as Record<string, any>)[key] = value;
      }
    };

    // deno-lint-ignore no-explicit-any
    self._updateArgs = updateArgs as any;
  }

  return self;
}
