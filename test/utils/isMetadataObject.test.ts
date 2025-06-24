import { assert } from "@std/assert";
import { isMetadataObject } from "../../lib/utils/isMetadataObject.ts";



Deno.test('isMetaDataObject()', async (t) =>  {
  await t.step("Object with only '@id' passes", () => {
    assert(isMetadataObject({
      '@id': 'foo',
    }));
  });

  await t.step("Object with only '@id' and '@type' passes", () => {
    assert(isMetadataObject({
      '@id': 'foo',
      '@type': 'Bar',
    }));
  });

  await t.step("Object with a concrete value fails", () => {
    assert(!isMetadataObject({
      '@id': 'foo',
      '@type': 'Bar',
      fee: 'fie',
    }));
  });

  await t.step("Object with a JSON-LD @set fails", () => {
    assert(!isMetadataObject({
      '@id': 'foo',
      '@type': 'Bar',
      '@value': 'baz',
    }));
  });

  await t.step("Object with a JSON-LD @list fails", () => {
    assert(!isMetadataObject({
      '@id': 'foo',
      '@type': 'Bar',
      '@list': [],
    }));
  });

  await t.step("Object with a JSON-LD @set fails", () => {
    assert(!isMetadataObject({
      '@id': 'foo',
      '@type': 'Bar',
      '@set': [],
    }));
  });
})
