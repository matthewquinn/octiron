import m from "mithril";
import type { OctironRoot, OctironSelection, Predicate, SelectView, OctironSelectArgs, Selector, TypeDefs, OctironPerformArgs, PerformView, OctironDefaultArgs } from '../types/octiron.ts';
import { SelectionRenderer } from "../renderers/SelectionRenderer.ts";
import { unravelArgs } from "../utils/unravelArgs.ts";
import type { Store } from "../store.ts";

export type RootFactoryInternals = {
  store: Store;
  typeDefs: TypeDefs;
};

/**
 * @description
 * An internal factory function for creating `OctironRoot` objects.
 *
 * @param internals Internally held values from upstream.
 */
export function rootFactory(
  internals: RootFactoryInternals,
): OctironRoot {
  const self: OctironRoot = Object.assign(
    (predicate: Predicate, children: m.Children) => {
      return self.root((o: OctironSelection) => o(predicate, children));
    },
    {
      octironType: "root",
      isOctiron: true,
      readonly: true,
      value: null,
      store: internals.store,
      index: 0,

      not(
        predicate: Predicate,
        children: m.Children,
      ) {
        return self.root((o: OctironSelection) => o.not(predicate, children));
      },

      root(
        arg1?: Selector | OctironSelectArgs | SelectView,
        arg2?: OctironSelectArgs | SelectView,
        arg3?: SelectView,
      ) {
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
            typeDefs: args?.typeDefs || internals.typeDefs,
          },
        });
      },

      select(
        arg1: Selector,
        arg2?: OctironSelectArgs | SelectView,
        arg3?: SelectView,
      ) {
        return self.root(arg1, arg2 as OctironSelectArgs, arg3 as SelectView);
      },

      present(
        arg1?: OctironSelectArgs | SelectView,
        arg2?: SelectView,
      ) {
        return self.root(arg1 as OctironSelectArgs, arg2 as SelectView);
      },

      default(
        arg1?: OctironDefaultArgs
      ) {
        return self.root(o => o.default(arg1 as OctironSelectArgs));
      },

      perform(
        arg1?: Selector | OctironPerformArgs | PerformView,
        arg2?: OctironPerformArgs | PerformView,
        arg3?: PerformView,
      ) {
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
      },

    } as const,
  ) satisfies OctironRoot;

  return self;
}
