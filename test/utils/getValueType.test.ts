import { assertEquals } from "@std/assert";
import { getDataType } from "../../lib/utils/getValueType.ts";


Deno.test('getValueType()', async (t) => {
  await t.step('It returns undefined for non objects', () => {
    assertEquals(getDataType(true), undefined);
    assertEquals(getDataType(1), undefined);
    assertEquals(getDataType('foo'), undefined);
    assertEquals(getDataType([]), undefined);
  });

  await t.step('It returns undefined for un-typed objects', () => {
    assertEquals(getDataType({}), undefined);
    assertEquals(getDataType({ foo: 'bar' }), undefined);
  });

  await t.step('It returns undefined for invalid typed objects', () => {
    assertEquals(getDataType({ '@type': 42 }), undefined);
    assertEquals(getDataType({ '@type': ['Foo', 42] }), undefined);
  });

  await t.step('It the type for typed objects', () => {
    assertEquals(getDataType({ '@type': 'Baz', foo: 'bar' }), 'Baz');
    assertEquals(getDataType({ '@type': ['Fee', 'Fi'], foo: 'bar' }), [
      'Fee', 'Fi',
    ]);
  });
});
