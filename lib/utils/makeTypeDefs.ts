import type { TypeDef, TypeDefs } from "../types/octiron.ts";

/**
 * @description
 * Aggregates a list of type defs into an easier to access
 * type def config object.
 *
 * @param typeDefs The type defs to aggregate.
 */
export function makeTypeDefs<
  const Type extends string = string,
  // deno-lint-ignore no-explicit-any
  const TypeDefList extends TypeDef<any, Type> = TypeDef<any, Type>,
>(...typeDefs: Readonly<TypeDefList[]>): TypeDefs<Type, TypeDefList> {
  const config = {} as TypeDefs<Type, TypeDefList>;

  for (const typeDef of typeDefs) {
    // deno-lint-ignore no-explicit-any
    (config as any)[typeDef.type] = typeDef;
  }

  return config;
}
