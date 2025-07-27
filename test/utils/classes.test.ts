import { assertEquals } from "@std/assert/equals";
import { classes } from "../../lib/utils/classes.ts";

Deno.test('classes()', async (t) => {
  await t.step('classes() resolves a list of classes', () => {
    const result = classes(
      'foo',
      ['bar'],
      {
        'baz': true,
      },
    );

    assertEquals(result, 'foo bar baz');
  });

  await t.step('classes() does not include classes with falsy object values', () => {
    const result = classes(
      'foo',
      ['bar'],
      {
        'baz': false,
      },
    );

    assertEquals(result, 'foo bar');
  });
});
