import type { JSONValue } from '../types/common.ts';
import type { TypeDef } from '../types/octiron.ts';

/**
 * @description
 * Utility for creating a well typed typeDef.
 *
 * @param typeDef An object to property define the types for.
 */
export function makeTypeDef<
  const Model extends JSONValue = JSONValue,
  const Type extends string = string,
>(
  typeDef: TypeDef<Model, Type>,
): TypeDef<Model, Type> {
  return typeDef;
}
