import type { EditComponent, PresentComponent } from "../../lib/types/octiron.ts";
import { makeTypeDefs } from "../../lib/utils/makeTypeDefs.ts";
import { getComponent } from "../../lib/utils/getComponent.ts";
import { assertNotEquals } from "@std/assert/not-equals";
import { assertEquals } from "@std/assert/equals";


Deno.test('getComponent()', async (t) => {
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
  const EditFoe: EditComponent<string> = () => {
    return {
      view() { return null },
    };
  };
  const PresentFum: PresentComponent<string> = () => {
    return {
      view() { return null },
    };
  };
  const EditFum: EditComponent<string> = () => {
    return {
      view() { return null },
    };
  };

  assertEquals(PresentFoo, PresentFoo);
  assertNotEquals(PresentFoo, PresentBar);
  assertNotEquals(PresentBar, PresentBaz);

  const typeDefs = makeTypeDefs(
    {
      type: 'fee',
      present: PresentFee,
    },
    {
      type: 'foe',
      present: PresentFoe,
      edit: EditFoe,
    },
    {
      type: 'fum',
      present: PresentFum,
      edit: EditFum,
    },
  );

  await t.step('It returns the first pick component if provided', () => {
    const component = getComponent({
      style: 'present',
      type: ['foe', 'fum'],
      typeDefs,
      datatype: 'fee',
      firstPickComponent: PresentBar,
      fallbackComponent: PresentBaz,
    });

    assertEquals(component, PresentBar);
  });

  await t.step('It returns the datatype on match when no first pick', () => {
    const component = getComponent({
      style: 'present',
      type: ['fee', 'fum'],
      typeDefs,
      datatype: 'foe',
      fallbackComponent: PresentBaz,
    });

    assertEquals(component, PresentFoe);
  });

  await t.step('It returns the edit component for the datatype on match when no first pick', () => {
    const component = getComponent({
      style: 'edit',
      type: ['fee', 'fum'],
      typeDefs,
      datatype: 'foe',
      fallbackComponent: PresentBaz,
    });

    assertEquals(component, EditFoe);
  });

  await t.step('It returns the first type on match when no better match', () => {
    const component = getComponent({
      style: 'present',
      type: ['fee', 'fum'],
      typeDefs,
      datatype: 'bar',
      fallbackComponent: PresentBaz,
    });

    assertEquals(component, PresentFee);
  });

  await t.step('It returns the second type on match when no better match', () => {
    const component = getComponent({
      style: 'present',
      type: ['baz', 'fum'],
      typeDefs,
      datatype: 'bar',
      fallbackComponent: PresentBaz,
    });

    assertEquals(component, PresentFum);
  });

  await t.step('It returns the second type on match when no better match', () => {
    const component = getComponent({
      style: 'present',
      type: ['baz', 'fum'],
      typeDefs,
      datatype: 'bar',
      fallbackComponent: PresentBaz,
    });

    assertEquals(component, PresentFum);
  });

  await t.step('It returns the edit component for the second type on match when no better match', () => {
    const component = getComponent({
      style: 'edit',
      type: ['baz', 'fum'],
      typeDefs,
      datatype: 'bar',
      fallbackComponent: PresentBaz,
    });

    assertEquals(component, EditFum);
  });

  await t.step('It returns the fallback pick component when no other match', () => {
    const component = getComponent({
      style: 'present',
      type: 'baz',
      typeDefs,
      datatype: 'bar',
      fallbackComponent: PresentBaz,
    });

    assertEquals(component, PresentBaz);
  });

    await t.step('It returns undefined when no fallback or other match', () => {
      const component = getComponent({
        style: 'present',
        type: 'baz',
        typeDefs,
        datatype: 'bar',
      });

      assertEquals(component, undefined);
    });
});
