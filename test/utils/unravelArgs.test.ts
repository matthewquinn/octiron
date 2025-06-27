import assert from "node:assert";
import { describe, it } from "node:test";
import { unravelArgs } from "../../lib/utils/unravelArgs.ts";


describe('unravelArgs()', () => {
  it('Handles no arguments', () => {
    const [selector, args, view] = unravelArgs();

    assert(typeof selector === 'undefined');
    assert.deepEqual(args, {});
    assert(typeof view === 'function');
  });

  it('Handles single selector argument', () => {
    const [selector, args, view] = unravelArgs('foo bar baz');

    assert.deepEqual(selector, 'foo bar baz');
    assert.deepEqual(args, {});
    assert(typeof view === 'function');
  });

  it('Handles single args argument', () => {
    const [selector, args, view] = unravelArgs({ sep: ',' });

    assert(typeof selector === 'undefined');
    assert.deepEqual(args, { sep: ',' });
    assert(typeof view === 'function');
  });

  it('Handles single view argument', () => {
    const testView = () => null;
    const [selector, args, view] = unravelArgs(testView);

    assert(typeof selector === 'undefined');
    assert.deepEqual(args, {});
    assert.deepEqual(view, testView);
  });

  it('Handles selector and args argument', () => {
    const [selector, args, view] = unravelArgs('foo bar baz', { sep: ',' });

    assert.deepEqual(selector, 'foo bar baz');
    assert.deepEqual(args, { sep: ',' });
    assert(typeof view === 'function');
  });

  it('Handles selector and view argument', () => {
    const testView = () => null;
    const [selector, args, view] = unravelArgs('foo bar baz', testView);

    assert.deepEqual(selector, 'foo bar baz');
    assert.deepEqual(args, {});
    assert.deepEqual(view, testView);
  });

  it('Handles all arguments', () => {
    const testView = () => null;
    const [selector, args, view] = unravelArgs(
      'foo bar baz',
      { sep: ',' },
      testView,
    );

    assert.deepEqual(selector, 'foo bar baz');
    assert.deepEqual(args, { sep: ',' });
    assert.deepEqual(view, testView);
  });
});
