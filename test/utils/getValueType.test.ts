import assert from "node:assert";
import { describe, it } from "node:test";
import { getValueType } from "../../lib/utils/getValueType.ts";


describe('getValueType()', () => {
  it('It returns undefined for non objects', () => {
    assert.deepEqual(getValueType(true), undefined);
    assert.deepEqual(getValueType(1), undefined);
    assert.deepEqual(getValueType('foo'), undefined);
    assert.deepEqual(getValueType([]), undefined);
  });

  it('It returns undefined for un-typed objects', () => {
    assert.deepEqual(getValueType({}), undefined);
    assert.deepEqual(getValueType({ foo: 'bar' }), undefined);
  });

  it('It returns undefined for invalid typed objects', () => {
    assert.deepEqual(getValueType({ '@type': 42 }), undefined);
    assert.deepEqual(getValueType({ '@type': ['Foo', 42] }), undefined);
  });

  it('It the type for typed objects', () => {
    assert.deepEqual(getValueType({ '@type': 'Baz', foo: 'bar' }), 'Baz');
    assert.deepEqual(getValueType({ '@type': ['Fee', 'Fi'], foo: 'bar' }), [
      'Fee', 'Fi',
    ]);
  });
});
