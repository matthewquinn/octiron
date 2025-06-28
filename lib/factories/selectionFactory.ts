import type { JSONValue } from '../types/common.ts';
import type { OctironStore } from "../types/store.ts";
import type { OctironSelectArgs, OctironSelection, Predicate, PresentComponent, Selector, SelectView, TypeDefs } from '../types/octiron.ts';
import m from "mithril";
import { SelectionRenderer } from "../renderers/SelectionRenderer.ts";
import { getComponent } from '../utils/getComponent.ts';
import { unravelArgs } from "../utils/unravelArgs.ts";
import { getValueType } from "../utils/getValueType.ts";
import { isJSONObject } from "../utils/isJSONObject.ts";

export type SelectionFactoryInternals = {
  store: OctironStore;
  typeDefs?: TypeDefs;
  parent?: OctironSelection;
  value?: JSONValue;
  datatype?: string;
};

/* Internal hooks for upstream to provide updates */
export interface OctironHooks {
  _updateArgs(args: OctironSelectArgs): void;
  _updateValue(value: JSONValue): void;
}

/**
 * @description
 * An internal factory function for creating `OctironSelection` objects.
 *
 * @param internals Internally held values from upstream.
 * @param args User given arguments.
 */
export function selectionFactory<Attrs extends object = object>(
  internals: SelectionFactoryInternals,
  args?: OctironSelectArgs<JSONValue, Attrs>,
): OctironSelection & OctironHooks {
  const factoryArgs = Object.assign({}, args);
  const type = getValueType(internals.value);

  const refs = {
    isOctiron: true,
    octironType: 'selection',
    value: internals.value,
  };

  const self: OctironSelection & OctironHooks = Object.assign(
    (predicate: Predicate, children?: m.Children) => {
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
      octironType: 'selection',
      readonly: true,
      id: internals.datatype,

      get value() {
        return refs.value;
      },

      get store() {
        return internals.store;
      },

      not: (predicate: Predicate, children: m.Children) => {
        if (internals.parent == null) {
          return null;
        }

        const passes = predicate(internals.parent);

        if (!passes) {
          return children;
        }
        return null;
      },

      root: (
        arg1?: Selector | OctironSelectArgs | SelectView,
        arg2?: OctironSelectArgs | SelectView,
        arg3?: SelectView,
      ) => {
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
            typeDefs: internals.typeDefs,
          },
        });
      },

      enter(
        arg1: Selector,
        arg2?: OctironSelectArgs | SelectView,
        arg3?: SelectView,
      ) {
        const [selector, args, view] = unravelArgs(arg1, arg2, arg3);

        return m(SelectionRenderer, {
          selector,
          args,
          view,
          internals: {
            store: internals.store,
            typeDefs: internals.typeDefs,
          },
        });
      },

      select: (
        arg1: Selector,
        arg2?: OctironSelectArgs | SelectView,
        arg3?: SelectView,
      ): m.Children | null => {
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
              typeDefs: internals.typeDefs,
              value: internals.value,
            },
          },
        );
      },

      present() {
        let attrs: Attrs = {} as Attrs;
        let firstPickComponent: PresentComponent<JSONValue, Attrs> | undefined;
        let fallbackComponent: PresentComponent<JSONValue> | undefined;

        if (typeof args?.attrs !== "undefined") {
          attrs = args.attrs;
        } else if (typeof factoryArgs?.attrs !== "undefined") {
          attrs = factoryArgs.attrs as unknown as Attrs;
        }

        if (typeof args?.component !== "undefined") {
          firstPickComponent = args.component as PresentComponent<JSONValue, Attrs>;
        } else if (typeof factoryArgs?.component !== "undefined") {
          firstPickComponent = factoryArgs.component as unknown as PresentComponent<
            JSONValue,
            Attrs
          >;
        }

        if (args?.fallbackComponent != null) {
          fallbackComponent = args.fallbackComponent as unknown as PresentComponent<JSONValue>;
        } else if (typeof factoryArgs?.fallbackComponent !== "undefined") {
          fallbackComponent = factoryArgs.fallbackComponent as unknown as PresentComponent<JSONValue>;
        }

        const component = getComponent({
          style: "present",
          datatype: internals.datatype,
          type,
          firstPickComponent: firstPickComponent as unknown as PresentComponent,
          fallbackComponent: fallbackComponent as unknown as PresentComponent,
          typeDefs: internals.typeDefs ?? {},
        });

        if (typeof component === "undefined") {
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
      },

      _updateArgs: (args: OctironSelectArgs) => {
        for (const [key, value] of Object.entries(args)) {
          // deno-lint-ignore no-explicit-any
          (factoryArgs as Record<string, any>)[key] = value;
        }
      },

      _updateValue: (value: JSONValue) => {
        refs.value = value;
      },

    } as const,
  ) satisfies OctironSelection & OctironHooks;

  return self;
}
