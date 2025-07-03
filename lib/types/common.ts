
export type Mutable<T> = { -readonly [K in keyof T]: T[K] };

// deno-lint-ignore ban-types
export type EmptyObject = {};

export type JSONPrimitive = string | number | boolean | null | undefined;

export type JSONValue = JSONPrimitive | JSONObject | JSONArray;

export type JSONObject = { [member: string]: JSONValue };

export interface JSONArray extends Array<JSONValue> {}

export type IRIObject<Properties extends JSONObject = JSONObject> =
  & Properties
  & {
    '@id': string;
  };

export type TypeObject<Properties extends JSONObject = JSONObject> =
  & Properties
  & {
    '@type': string | string[];
  };

export type ValueObject<Properties extends JSONObject = JSONObject> =
  & Properties
  & {
    '@value': JSONValue;
  };

export type IterableJSONLD<Properties extends JSONObject = JSONObject> =
  | JSONArray
  | (Properties & { '@list': JSONArray })
  | (Properties & { '@set': JSONArray });
