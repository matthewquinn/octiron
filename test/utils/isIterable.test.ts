import assert from "node:assert";
import { describe, it } from "node:test";
import { isIterable } from "../../lib/utils/isIterable.ts";


describe('isIterable()', () => {
  it('Passes when given an array', () => {
    assert(isIterable([1, 2, 3]));
  });

  it('Passes when given a JSON-LD @list object', () => {
    assert(isIterable({ '@list': [1, 2, 3] }));
  });

  it('Passes when given a JSON-LD @set object', () => {
    assert(isIterable({ '@set': [1, 2, 3] }));
  });
});
