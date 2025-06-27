import { assert } from "@std/assert";
import { isIRIObject } from "../../lib/utils/isIRIObject.ts";


Deno.test('isIRIObject()', async (t) => {
  await t.step('Plain object fails', () => {
    assert(!isIRIObject({ foo: 'baa' }));
  });

  await t.step('A typed value fails', () => {
    assert(!isIRIObject({ '@type': 'Foo', '@value': 'baz' }));
  });

  await t.step('An IRI object passes', () => {
    assert(isIRIObject({
      '@id': 'http://example.com',
      '@type': 'Foo',
      '@value': 'baz',
   }));
  });
});
