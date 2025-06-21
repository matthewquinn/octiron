import { assert } from "@std/assert";
import { unravelArgs } from "../../lib/utils/unravelArgs.ts";
import { assertEquals } from "@std/assert/equals";



Deno.test('unravelArgs()', async (t) => {
  await t.step('Handles no arguments', () => {
    const [selector, args, view] = unravelArgs();

    assert(typeof selector === 'undefined');
    assertEquals(args, {});
    assert(typeof view === 'function');
  });

  await t.step('Handles single selector argument', () => {
    const [selector, args, view] = unravelArgs('foo bar baz');

    assertEquals(selector, 'foo bar baz');
    assertEquals(args, {});
    assert(typeof view === 'function');
  });

  await t.step('Handles single args argument', () => {
    const [selector, args, view] = unravelArgs({ sep: ',' });

    assert(typeof selector === 'undefined');
    assertEquals(args, { sep: ',' });
    assert(typeof view === 'function');
  });

  await t.step('Handles single view argument', () => {
    const testView = () => null;
    const [selector, args, view] = unravelArgs(testView);

    assert(typeof selector === 'undefined');
    assertEquals(args, {});
    assertEquals(view, testView);
  });

  await t.step('Handles selector and args argument', () => {
    const [selector, args, view] = unravelArgs('foo bar baz', { sep: ',' });

    assertEquals(selector, 'foo bar baz');
    assertEquals(args, { sep: ',' });
    assert(typeof view === 'function');
  });

  await t.step('Handles selector and view argument', () => {
    const testView = () => null;
    const [selector, args, view] = unravelArgs('foo bar baz', testView);

    assertEquals(selector, 'foo bar baz');
    assertEquals(args, {});
    assertEquals(view, testView);
  });

  await t.step('Handles all arguments', () => {
    const testView = () => null;
    const [selector, args, view] = unravelArgs(
      'foo bar baz',
      { sep: ',' },
      testView,
    );

    assertEquals(selector, 'foo bar baz');
    assertEquals(args, { sep: ',' });
    assertEquals(view, testView);
  });
});
