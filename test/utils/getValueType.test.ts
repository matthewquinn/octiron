import { assertEquals } from "@std/assert";
import { getValueType } from "../../lib/utils/getValueType.ts";


Deno.test('getValueType()', async (t) => {
  await t.step('It returns undefined for non objects', () => {
    assertEquals(getValueType(true), undefined);
    assertEquals(getValueType(1), undefined);
    assertEquals(getValueType('foo'), undefined);
    assertEquals(getValueType([]), undefined);
  });

  await t.step('It returns undefined for un-typed objects', () => {
    assertEquals(getValueType({}), undefined);
    assertEquals(getValueType({ foo: 'bar' }), undefined);
  });

  await t.step('It returns undefined for invalid typed objects', () => {
    assertEquals(getValueType({ '@type': 42 }), undefined);
    assertEquals(getValueType({ '@type': ['Foo', 42] }), undefined);
  });

  await t.step('It the type for typed objects', () => {
    assertEquals(getValueType({ '@type': 'Baz', foo: 'bar' }), 'Baz');
    assertEquals(getValueType({ '@type': ['Fee', 'Fi'], foo: 'bar' }), [
      'Fee', 'Fi',
    ]);
  });
});
