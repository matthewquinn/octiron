import { assert } from "@std/assert";
import { isJSONObject } from "../../lib/utils/isJSONObject.ts";


Deno.test('isJSONObject()', async (t) => {
  await t.step('JSON null fails', () => {
    assert(!isJSONObject(JSON.parse('null')));
  });
  await t.step('JSON boolean fails', () => {
    assert(!isJSONObject(JSON.parse('true')));
  });

  await t.step('JSON number fails', () => {
    assert(!isJSONObject(JSON.parse('42')));
  });

  await t.step('JSON string fails', () => {
    assert(!isJSONObject(JSON.parse('"foo"')));
  });

  await t.step('JSON array fails', () => {
    assert(!isJSONObject(JSON.parse('[1, "foo", false]')));
  });

  await t.step('JSON object passes', () => {
    assert(isJSONObject(JSON.parse('{}')));
  });
});
