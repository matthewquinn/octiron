import type { TypeDef } from "./types/octiron.ts";
import { rootFactory } from "./factories/rootFactory.ts";
import { makeStore } from "./store.ts";
import { makeTypeDefs } from "./utils/makeTypeDefs.ts";

export default function octiron({
  typeDefs,
  ...storeArgs
}: Omit<Parameters<typeof makeStore>[0], 'rootIRI'> & {
  rootIRI: string;
  // deno-lint-ignore no-explicit-any
  typeDefs?: TypeDef<any>[];
}) {
  const config = typeof typeDefs !== 'undefined'
    ? makeTypeDefs(...typeDefs)
    : {};

  const store = makeStore(storeArgs);

  return rootFactory({
    store,
    typeDefs: config,
  });
}
