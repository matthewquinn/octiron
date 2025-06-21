import { assert } from "@std/assert";
import { isJSONObject } from "../../lib/utils/isJSONObject.ts";


Deno.test('isJSONObject()', async (t) => {
  await t.step('JSON null fails', () => {
    assert(!isJSONObject(JSON.parse('null')),
      "A null value is not a JSON object.");
  });
  await t.step('JSON boolean fails', () => {
    assert(!isJSONObject(JSON.parse('true')),
      "A boolean is not a JSON object.");
  });

  await t.step('JSON number fails', () => {
    assert(!isJSONObject(JSON.parse('42')),
      "A number is not a JSON object.");
  });

  await t.step('JSON string fails', () => {
    assert(!isJSONObject(JSON.parse('"foo"')),
      "A string is not a JSON object.");
  });

  await t.step('JSON array fails', () => {
    assert(!isJSONObject(JSON.parse('[1, "foo", false]')),
      "An array is not a JSON object.");
  });

  await t.step('JSON object passes', () => {
    assert(isJSONObject(JSON.parse('{}')),
      "An object is a JSON object.");
  });
})
