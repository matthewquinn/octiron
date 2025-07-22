import type { OctironRoot, TypeDef } from "./types/octiron.ts";
import { rootFactory } from "./factories/rootFactory.ts";
import { makeTypeDefs } from "./utils/makeTypeDefs.ts";
import { Store } from "./store.ts";

export * from './types/common.ts';
export * from './types/store.ts';
export * from './types/octiron.ts';
export * from './store.ts';
export * from './utils/makeTypeDef.ts';
export * from './utils/makeTypeDefs.ts';

/**
 * Creates a root octiron instance.
 */
export default function octiron({
  typeDefs,
  ...storeArgs
}: ConstructorParameters<typeof Store>[0] & {
  // deno-lint-ignore no-explicit-any
  typeDefs?: TypeDef<any>[];
}): OctironRoot {
  const config = typeDefs != null
    ? makeTypeDefs(...typeDefs)
    : {};

  const store = new Store(storeArgs);

  return rootFactory({
    store,
    typeDefs: config,
  });
}

octiron.fromInitialState = ({
  typeDefs,
  ...storeArgs
}: Parameters<typeof Store.fromInitialState>[0] & {
  // deno-lint-ignore no-explicit-any
  typeDefs?: TypeDef<any>[];
}) => {
  const config = typeDefs != null
    ? makeTypeDefs(...typeDefs)
    : {};

  const store = Store.fromInitialState({
    ...storeArgs,
  });

  return rootFactory({
    store,
    typeDefs: config,
  });
}