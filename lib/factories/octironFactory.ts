import type { Children } from "mithril";
import type { Octiron } from "@octiron/octiron";
import type { Mutable } from "../types/common.ts";
import type { Predicate } from "../types/octiron.ts";
import { isJSONObject } from "../utils/isJSONObject.ts";


export function octironFactory<O extends Octiron>() {
  const self: Mutable<O> = function(
    predicate: Predicate,
    children: Children,
  ): Children {
    const passes = predicate(self as O);

    if (passes) {
      return children;
    }

    return null;
  } as O;

  self.isOctiron = true;

  self.not = function(
    predicate: Predicate,
    children: Children,
  ): Children {
    if (self == null) {
      return null;
    }

    const passes = predicate(self as O);

    if (!passes) {
      return children;
    }

    return null;
  };

  self.get = (termOrType) => {
    if (!isJSONObject(self.value)) {
      return null;
    }

    const type = self.store.expand(termOrType);

    return self.value[type] ?? null;
  }

  return self;
}
