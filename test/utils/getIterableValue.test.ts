import assert from "node:assert";
import type { IterableJSONLD } from "../../lib/types/common.ts";
import { getIterableValue } from "../../lib/utils/getIterableValue.ts";
import { describe, it } from "node:test";


describe('getIterableValue', () => {
  it('When given an array it returns the array', () => {
    const input = [1, 2, ['fee', 'fie', 'foe', 'fum']];
    const result = getIterableValue(input);

    assert.equal(input, result);
  });

  it('When given a JSON-LD @list object it returns the @list value', () => {
    const input: IterableJSONLD = {
      '@list': [1, 2, ['fee', 'fie', 'foe', 'fum']],
    };

    const result = getIterableValue(input);

    assert.equal(input['@list'], result);
  });

  it('When given a JSON-LD @set object it returns the @set value', () => {
    const input: IterableJSONLD = {
      '@set': [1, 2, ['fee', 'fie', 'foe', 'fum']],
    };

    const result = getIterableValue(input);

    assert.equal(input['@set'], result);
  });
});
