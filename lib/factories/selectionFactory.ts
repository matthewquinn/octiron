import type { BaseAttrs, Octiron, OctironSelectArgs, OctironSelection, TypeDefs } from '../types/octiron.ts';
import type { Store } from "../store.ts";
import type { JSONValue } from "../types/common.ts";
import { type CommonArgs, type InstanceHooks, octironFactory } from "./octironFactory.ts";

export type SelectionFactoryInternals = {
  store: Store;
  typeDefs: TypeDefs;
  parent?: Octiron;
  value?: JSONValue;
  propType?: string;
  index?: number;
};

export function selectionFactory<Attrs extends BaseAttrs>(
  internals: SelectionFactoryInternals,
  args?: OctironSelectArgs<Attrs>,
): OctironSelection & InstanceHooks {
  const factoryArgs = Object.assign({}, args);
  const self = octironFactory(
    'selection',
    internals,
    factoryArgs as CommonArgs,
  );

  return self as OctironSelection & InstanceHooks;
}
