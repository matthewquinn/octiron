import type { PresentComponent } from "../../lib/types/octiron.ts";
import { makeTypeDefs } from "../../lib/utils/makeTypeDefs.ts";
import { getComponent } from "../../lib/utils/getComponent.ts";
import { describe, it } from "node:test";
import assert from "node:assert";


describe('getComponent()', () => {
  const PresentFoo: PresentComponent<string> = () => {
    return {
      view() { return null },
    };
  };
  const PresentBar: PresentComponent<string> = () => {
    return {
      view() { return null },
    };
  };
  const PresentBaz: PresentComponent<string> = () => {
    return {
      view() { return null },
    };
  };
  const PresentFee: PresentComponent<string> = () => {
    return {
      view() { return null },
    };
  };
  const PresentFoe: PresentComponent<string> = () => {
    return {
      view() { return null },
    };
  };

  const PresentFum: PresentComponent<string> = () => {
    return {
      view() { return null },
    };
  };

  assert.equal(PresentFoo, PresentFoo);
  assert.notEqual(PresentFoo, PresentBar);
  assert.notEqual(PresentBar, PresentBaz);

  const typeDefs = makeTypeDefs(
    {
      type: 'fee',
      present: PresentFee,
    },
    {
      type: 'foe',
      present: PresentFoe,
    },
    {
      type: 'fum',
      present: PresentFum,
    },
  );

  it('It returns the first pick component if provided', () => {
    const component = getComponent({
      style: 'present',
      type: ['foe', 'fum'],
      typeDefs,
      datatype: 'fee',
      firstPickComponent: PresentBar,
      fallbackComponent: PresentBaz,
    });

    assert.equal(component, PresentBar);
  });

  it('It returns the datatype on match when no first pick', () => {
    const component = getComponent({
      style: 'present',
      type: ['fee', 'fum'],
      typeDefs,
      datatype: 'foe',
      fallbackComponent: PresentBaz,
    });

    assert.equal(component, PresentFoe);
  });

  it('It returns the first type on match when no better match', () => {
    const component = getComponent({
      style: 'present',
      type: ['fee', 'fum'],
      typeDefs,
      datatype: 'bar',
      fallbackComponent: PresentBaz,
    });

    assert.equal(component, PresentFee);
  });

  it('It returns the second type on match when no better match', () => {
    const component = getComponent({
      style: 'present',
      type: ['baz', 'fum'],
      typeDefs,
      datatype: 'bar',
      fallbackComponent: PresentBaz,
    });

    assert.equal(component, PresentFum);
  });

  it('It returns the fallback pick component when no other match', () => {
    const component = getComponent({
      style: 'present',
      type: 'baz',
      typeDefs,
      datatype: 'bar',
      fallbackComponent: PresentBaz,
    });

    assert.equal(component, PresentBaz);
  });

  it('It returns undefined when no fallback or other match', () => {
    const component = getComponent({
      style: 'present',
      type: 'baz',
      typeDefs,
      datatype: 'bar',
    });

    assert.equal(component, undefined);
  });
});
