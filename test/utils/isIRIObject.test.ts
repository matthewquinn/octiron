import assert from "node:assert";
import { describe, it } from "node:test";
import { isIRIObject } from "../../lib/utils/isIRIObject.ts";


describe('isIRIObject()', () => {
  it('Plain object fails', () => {
    assert(!isIRIObject({ foo: 'baa' }));
  });

  it('A typed value fails', () => {
    assert(!isIRIObject({ '@type': 'Foo', '@value': 'baz' }));
  });

  it('An IRI object passes', () => {
    assert(isIRIObject({
      '@id': 'http://example.com',
      '@type': 'Foo',
      '@value': 'baz',
   }));
  });
});
