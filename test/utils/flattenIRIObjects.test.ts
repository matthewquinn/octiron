import { describe, it } from "node:test";
import type { JSONObject } from "../../lib/types/common.ts";
import { flattenIRIObjects } from "../../lib/utils/flattenIRIObjects.ts";
import assert from "node:assert";


describe('flattenIRIObjects()', () => {
  it('It pulls all deeply nested IRI objects that contain values into a flattened array', () => {
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

    assert(result.includes(value as any));
    assert(result.includes(value.fie['@list'][0] as any));
    assert(result.includes(value.fum[1] as any));
    assert(result.includes(value.foo.lee as any));

    assert.equal(result.length, 4);
  });
});
