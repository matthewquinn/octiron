import type { OctironRoot, TypeDefs } from '../types/octiron.ts';
import type { Store } from "../store.ts";
import { octironFactory } from "./octironFactory.ts";

export type RootFactoryInternals = {
  store: Store;
  typeDefs: TypeDefs;
};

export function rootFactory(
  internals: RootFactoryInternals,
): OctironRoot {
  const self = octironFactory(
    'root',
    internals,
  );

  return self as unknown as OctironRoot;
}
