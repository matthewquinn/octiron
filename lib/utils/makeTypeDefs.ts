import type { JSONValue } from "../types/common.ts";
import type { TypeDef } from '../types/octiron.ts';

export type TypeDefs<
  Model extends JSONValue = JSONValue,
  Type extends string = string,
  TypeDefList extends TypeDef<Model, Type> = TypeDef<Model, Type>,
> = {
  [TypeDef in TypeDefList as TypeDef['type']]: TypeDef;
};

/**
 * @description
 * Aggregates a list of type defs into an easier to access
 * type def config object.
 *
 * @param typeDefs The type defs to aggregate.
 */
export function makeTypeDefs<
  const Model extends JSONValue = JSONValue,
  const Type extends string = string,
  const TypeDefList extends TypeDef<Model, Type> = TypeDef<Model, Type>,
>(...typeDefs: Readonly<TypeDefList[]>): TypeDefs<Model, Type, TypeDefList> {
  const config = {} as TypeDefs<Model, Type, TypeDefList>;

  for (const typeDef of typeDefs) {
    // deno-lint-ignore no-explicit-any
    (config as any)[typeDef.type] = typeDef;
  }

  return config;
}
