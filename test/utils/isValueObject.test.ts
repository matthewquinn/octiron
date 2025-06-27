import assert from "node:assert";
import { describe, it } from "node:test";
import { isValueObject } from "../../lib/utils/isValueObject.ts";


describe('isValueObject()', () => {
  it('An object with a @value property passes', () => {
    assert(isValueObject({ '@value': 42 }));
  });
});
