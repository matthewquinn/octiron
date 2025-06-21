import type { PresentComponent, TypeDefs } from "../types/octiron.ts";

/**
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
  firstPickComponent?: PresentComponent;
  fallbackComponent?: PresentComponent;
}): PresentComponent | undefined {
  if (typeof firstPickComponent !== "undefined") {
    return firstPickComponent;
  }

  if (
    typeof datatype !== "undefined" &&
    typeof typeDefs[datatype]?.[style] !== "undefined"
  ) {
    return typeDefs[datatype][style] as PresentComponent;
  }

  if (
    typeof type === "string" &&
    typeof typeDefs[type]?.[style] !== "undefined"
  ) {
    return typeDefs[type][style] as PresentComponent;
  }

  if (Array.isArray(type)) {
    for (const item of type) {
      if (
        typeof typeDefs[item]?.[style] !== "undefined"
      ) {
        return typeDefs[item][style] as PresentComponent;
      }
    }
  }

  if (typeof fallbackComponent !== "undefined") {
    return fallbackComponent as PresentComponent;
  }
}
