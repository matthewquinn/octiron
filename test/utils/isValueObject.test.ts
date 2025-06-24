import { assert } from "@std/assert";
import { isValueObject } from "../../lib/utils/isValueObject.ts";


Deno.test('isValueObject()', async (t) => {
  await t.step('An object with a @value property passes', () => {
    assert(isValueObject({ '@value': 42 }));
  });
});
