import { assertEquals } from "@std/assert";
import type { JSONObject } from "../../lib/types/common.ts";
import { flattenIRIObjects } from "../../lib/utils/flattenIRIObjects.ts";
import { assertArrayIncludes } from "@std/assert/array-includes";


Deno.test('flattenIRIObjects()', async (t) => {
  await t.step('It pulls all deeply nested IRI objects that contain values into a flattened array', () => {
    const value = {
      '@id': 'fee',
      fie: {
        '@list': [
          {
            '@id': 'doe',
            dum: 42,
          },
        ],
      },
      foe: { '@id': 'fee' }, // considered a metadata object
      fum: [
        { foo: 1, bar: 2 },
        {
          '@id': 'Fee',
          foo: 3, bar: 4,
        },
      ],
      foo: {
        bar: 'baz',
        lee: {
          '@id': 'laa',
          loo: 5,
        },
      },
    } as const;

    const result = flattenIRIObjects(value as unknown as JSONObject);

    // deno-lint-ignore no-explicit-any
    assertArrayIncludes(result as any[], [
      value,
      value.fie['@list'][0],
      value.fum[1],
      value.foo.lee,
    ]);

    assertEquals(result.length, 4);
  });
});
