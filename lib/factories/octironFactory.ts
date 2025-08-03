import type { Children } from "mithril";
import type { Octiron } from "@octiron/octiron";
import type { Mutable } from "../types/common.ts";
import type { OctironSelectArgs, Predicate, Selector, SelectView } from "../types/octiron.ts";
import { unravelArgs } from "../utils/unravelArgs.ts";


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

  return self;
}
