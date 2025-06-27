import type { PresentComponent, TypeDefs } from "../types/octiron.ts";

/**
 * @description
 * Returns a component based of Octiron's selection rules:
 *
 * 1. If the first pick component is given, return it.
 * 2. If a typedef is defined for the datatype (jsonld term or type)
 *    for the given style, return it.
 * 3. If a typedef is defined for the (or one of the) types (jsonld '@type')
 *    value for the given style, return it.
 * 4. If a fallback component is given, return it.
 *
 * @param args.style - The style of presentation.
 * @param args.datatype - The datatype the component should be configured to
 *                        handle.
 * @param args.type - The type the component should be configured to handle.
 * @param args.firstPickComponent - The component to use if passed by upstream.
 * @param args.fallbackComponent - The component to use if no other component
 *                                 is picked.
 */
export function getComponent({
  style,
  datatype,
  type,
  firstPickComponent,
  typeDefs,
  fallbackComponent,
}: {
  style: "present";
  datatype?: string;
  type?: string | string[];
  typeDefs: TypeDefs;
  // deno-lint-ignore no-explicit-any
  firstPickComponent?: PresentComponent<any>;
  // deno-lint-ignore no-explicit-any
  fallbackComponent?: PresentComponent<any>;
  // deno-lint-ignore no-explicit-any
}): PresentComponent<any> | undefined {
  if (typeof firstPickComponent !== "undefined") {
    return firstPickComponent;
  }

  if (
    typeof datatype !== "undefined" &&
    typeof typeDefs[datatype]?.[style] !== "undefined"
  ) {
    // deno-lint-ignore no-explicit-any
    return typeDefs[datatype][style] as PresentComponent<any>;
  }

  if (
    typeof type === "string" &&
    typeof typeDefs[type]?.[style] !== "undefined"
  ) {
    // deno-lint-ignore no-explicit-any
    return typeDefs[type][style] as PresentComponent<any>;
  }

  if (Array.isArray(type)) {
    for (const item of type) {
      if (
        typeof typeDefs[item]?.[style] !== "undefined"
      ) {
        // deno-lint-ignore no-explicit-any
        return typeDefs[item][style] as PresentComponent<any>;
      }
    }
  }

  if (typeof fallbackComponent !== "undefined") {
    // deno-lint-ignore no-explicit-any
    return fallbackComponent as PresentComponent<any>;
  }
}
