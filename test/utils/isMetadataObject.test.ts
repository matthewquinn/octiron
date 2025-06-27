import assert from "node:assert";
import { describe, it } from "node:test";
import { isMetadataObject } from "../../lib/utils/isMetadataObject.ts";


describe('isMetaDataObject()', () =>  {
  it("Object with only '@id' passes", () => {
    assert(isMetadataObject({
      '@id': 'foo',
    }));
  });

  it("Object with only '@id' and '@type' passes", () => {
    assert(isMetadataObject({
      '@id': 'foo',
      '@type': 'Bar',
    }));
  });

  it("Object with a concrete value fails", () => {
    assert(!isMetadataObject({
      '@id': 'foo',
      '@type': 'Bar',
      fee: 'fie',
    }));
  });

  it("Object with a JSON-LD @set fails", () => {
    assert(!isMetadataObject({
      '@id': 'foo',
      '@type': 'Bar',
      '@value': 'baz',
    }));
  });

  it("Object with a JSON-LD @list fails", () => {
    assert(!isMetadataObject({
      '@id': 'foo',
      '@type': 'Bar',
      '@list': [],
    }));
  });

  it("Object with a JSON-LD @set fails", () => {
    assert(!isMetadataObject({
      '@id': 'foo',
      '@type': 'Bar',
      '@set': [],
    }));
  });
})
