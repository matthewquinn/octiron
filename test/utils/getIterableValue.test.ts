import type { IterableJSONLD } from "../../lib/types/common.ts";
import { assertEquals } from "@std/assert";
import { getIterableValue } from "../../lib/utils/getIterableValue.ts";


Deno.test('getIterableValue', async (t) => {
  await t.step('When given an array it returns the array', () => {
    const input = [1, 2, ['fee', 'fie', 'foe', 'fum']];
    const result = getIterableValue(input);

    assertEquals(input, result);
  });

  await t.step('When given a JSON-LD @list object it returns the @list value', () => {
    const input: IterableJSONLD = {
      '@list': [1, 2, ['fee', 'fie', 'foe', 'fum']],
    };

    const result = getIterableValue(input);

    assertEquals(input['@list'], result);
  });

  await t.step('When given a JSON-LD @set object it returns the @set value', () => {
    const input: IterableJSONLD = {
      '@set': [1, 2, ['fee', 'fie', 'foe', 'fum']],
    };

    const result = getIterableValue(input);

    assertEquals(input['@set'], result);
  });
});
