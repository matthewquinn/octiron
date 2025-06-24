import { assert } from "@std/assert";
import { isIterable } from "../../lib/utils/isIterable.ts";


Deno.test('isIterable()', async (t) => {
  await t.step('Passes when given an array', () => {
    assert(isIterable([1, 2, 3]));
  });

  await t.step('Passes when given a JSON-LD @list object', () => {
    assert(isIterable({ '@list': [1, 2, 3] }));
  });

  await t.step('Passes when given a JSON-LD @set object', () => {
    assert(isIterable({ '@set': [1, 2, 3] }));
  });
});
