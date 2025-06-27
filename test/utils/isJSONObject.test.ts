import assert from "node:assert";
import { describe, it } from "node:test";
import { isJSONObject } from "../../lib/utils/isJSONObject.ts";


describe('isJSONObject()', () => {
  it('JSON null fails', () => {
    assert(!isJSONObject(JSON.parse('null')));
  });
  it('JSON boolean fails', () => {
    assert(!isJSONObject(JSON.parse('true')));
  });

  it('JSON number fails', () => {
    assert(!isJSONObject(JSON.parse('42')));
  });

  it('JSON string fails', () => {
    assert(!isJSONObject(JSON.parse('"foo"')));
  });

  it('JSON array fails', () => {
    assert(!isJSONObject(JSON.parse('[1, "foo", false]')));
  });

  it('JSON object passes', () => {
    assert(isJSONObject(JSON.parse('{}')));
  });
});
