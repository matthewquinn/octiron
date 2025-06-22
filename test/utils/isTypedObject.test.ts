import { assert } from "@std/assert";
import { isTypeObject } from "../../lib/utils/isTypedObject.ts";


Deno.test('isTypedObject()', async (t) => {
  await t.step('Plain object is not a typed object', () => {
    assert(!isTypeObject({ foo: 'baa' }));
  });

  await t.step('A value object is not typed object', () => {
    assert(!isTypeObject({ '@value': 'baz' }));
  });

  await t.step('An @type object with a string value is a typed object', () => {
    assert(isTypeObject({ '@type': 'MyType', foo: 'baa' }));
  });

  await t.step('An @type object with an array of string values is a typed object', () => {
    assert(isTypeObject({ '@type': ['MyTypeFoo', 'MyTypeBar'], '@value': 'baz' }));
  });

  await t.step('An @type object with non string values is not a typed object', () => {
    assert(!isTypeObject({ '@type': 42, foo: 'baa' }));
  });

  await t.step('An @type object with array of non string values is not a typed object', () => {
    assert(!isTypeObject({ '@type': ['MyTypeFoo', 42], foo: 'baa' }));
  });
});
