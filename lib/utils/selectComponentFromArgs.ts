import type { AnyComponent, BaseAttrs, CommonParentArgs, EditComponent, OctironEditArgs, OctironPresentArgs, PresentComponent } from "../types/octiron.ts";
import { getComponent } from "./getComponent.ts";


/**
 * Selects the component and attrs to render with from args provided to an Octiron
 * factory instance or the render method.
 */
export const selectComponentFromArgs = <
  Style extends 'present' | 'edit',
  Args extends (
    Style extends 'present'
      ? OctironPresentArgs
      : OctironEditArgs
  ),
  Attrs extends BaseAttrs,
  Component extends (
    Style extends 'present'
      ? PresentComponent | AnyComponent
      : EditComponent | AnyComponent
  )
>(
  style: Style,
  parentArgs: CommonParentArgs,
  args?: Args,
  factoryArgs?: Args,
): [Attrs, Component | undefined] => {
  const attrs: Attrs = Object.assign({}, args?.attrs ?? factoryArgs?.attrs) as Attrs;
  // null for a component arg indicates this is being called by a `o.default()` method
  // which will cause infinite recursion if it ends up re-selecting itself via factory args.
  const firstPickComponent = (args?.component ?? args?.component !== null ? factoryArgs?.component : null) as Component;
  const fallbackComponent = (args?.fallbackComponent ?? args?.component !== null ? factoryArgs?.fallbackComponent : null) as Component;

  const component = getComponent({
    style,
    propType: parentArgs.parent?.propType,
    type: parentArgs.parent?.dataType,
    firstPickComponent,
    fallbackComponent,
    typeDefs: args?.typeDefs ?? parentArgs.typeDefs,
  });

  return [attrs, component];
}
