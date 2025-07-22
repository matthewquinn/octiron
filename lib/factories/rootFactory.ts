import type { OctironRoot, OctironSelection, Predicate, SelectView, OctironSelectArgs, Selector, TypeDefs } from '../types/octiron.ts';
import m from "mithril";
import { SelectionRenderer } from "../renderers/SelectionRenderer.ts";
import { unravelArgs } from "../utils/unravelArgs.ts";
import type { Store } from "../store.ts";

export type RootFactoryInternals = {
  store: Store;
  typeDefs?: TypeDefs;
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
            typeDefs: internals.typeDefs,
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

    } as const,
  ) satisfies OctironRoot;

  return self;
}
