import assert from "node:assert";
import { describe, it } from "node:test";
import { isTypeObject } from "../../lib/utils/isTypedObject.ts";


describe('isTypedObject()', () => {
  it('Plain object is not a typed object', () => {
    assert(!isTypeObject({ foo: 'baa' }));
  });

  it('A value object is not a typed object', () => {
    assert(!isTypeObject({ '@value': 'baz' }));
  });

  it('An @type object with a string value is a typed object', () => {
    assert(isTypeObject({ '@type': 'MyType', foo: 'baa' }));
  });

  it('An @type object with an array of string values is a typed object', () => {
    assert(isTypeObject({ '@type': ['MyTypeFoo', 'MyTypeBar'], '@value': 'baz' }));
  });

  it('An @type object with non string values is not a typed object', () => {
    assert(!isTypeObject({ '@type': 42, foo: 'baa' }));
  });

  it('An @type object with array of non string values is not a typed object', () => {
    assert(!isTypeObject({ '@type': ['MyTypeFoo', 42], foo: 'baa' }));
  });
});
