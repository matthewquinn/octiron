import type { JSONValue, Mutable } from "../types/common.ts";
import type {
  Octiron,
  OctironSelectArgs,
  OctironSelection,
  Selector,
  SelectView,
  TypeDefs,
} from "../types/octiron.ts";
import type {
  Failure,
  ReadonlySelectionResult,
  SelectionDetails,
} from "../types/store.ts";
import m from "mithril";
import { selectionFactory } from "../factories/selectionFactory.ts";
import { isJSONObject } from "../utils/isJSONObject.ts";
import { mithrilRedraw } from "../utils/mithrilRedraw.ts";
import type { Store } from "../store.ts";

export type SelectionRendererInternals = {
  store: Store;
  typeDefs: TypeDefs;
  parent?: Octiron;
  value?: JSONValue;
};

export type SelectionRendererAttrs = {
  selector: Selector;
  args: OctironSelectArgs;
  view: SelectView;
  internals: SelectionRendererInternals;
};

const preKey = Symbol.for('@pre');
const postKey = Symbol.for('@post');

function shouldReselect(
  next: SelectionRendererAttrs,
  prev: SelectionRendererAttrs,
) {
  return next.internals.store !== prev.internals.store ||
    next.selector !== prev.selector ||
    next.internals.value !== prev.internals.value;
}

/**
 * @description
 * Subscribes to a selection's result using the Octiron store. Each selection
 * result is feed to an Octiron instance and is only removed if a later
 * selection update does not include the same result. Selection results are
 * given a unique key in the form of a json-path.
 *
 * Once an Octiron instance is created using a selection, further changes via
 * the upstream internals object or user given args applied to the downstream
 * Octiron instances using their internal update hooks.
 */
export const SelectionRenderer: m.FactoryComponent<SelectionRendererAttrs> = (
  vnode,
) => {
  const key = Symbol(`SelectionRenderer`);
  let currentAttrs = vnode.attrs;
  let details: undefined | SelectionDetails<ReadonlySelectionResult>;

  const instances: Record<symbol, {
    octiron: OctironSelection;
    selectionResult: ReadonlySelectionResult;
  }> = {};

  function createInstances() {
    let hasChanges = false;

    const {
      store,
      typeDefs,
      parent,
    } = currentAttrs.internals;

    const nextKeys: Array<symbol> = [];

    if (details == null) {
      const prevKeys = Reflect.ownKeys(instances) as symbol[];

      for (const key of prevKeys) {
        if (!nextKeys.includes(key)) {
          hasChanges = true;

          delete instances[key];
        }
      }

      if (hasChanges) {
        mithrilRedraw();
      }

      return;
    }

    for (let index = 0; index < details.result.length; index++) {
      const selectionResult = details.result[index];
      const key = Symbol.for(selectionResult.pointer);

      nextKeys.push(key);

      if (Object.hasOwn(instances, key)) {
        const next = selectionResult;
        const prev = instances[key].selectionResult;

        if (
          prev.type === 'value' &&
          next.type === 'value' &&
          next.value === prev.value
        ) {
          continue;
        } else if (
          prev.type === 'entity' &&
          next.type === 'entity' &&
          (
            next.ok !== prev.ok ||
            next.status !== prev.status ||
            next.value !== prev.value
          )
        ) {
          continue;
        }
      }

      hasChanges = true;

      const octiron = selectionFactory({
        index,
        store,
        typeDefs,
        value: selectionResult.value,
        propType: selectionResult.type === 'entity' ? undefined : selectionResult.propType,
        parent,
      });

      instances[key] = {
        octiron,
        selectionResult,
      };
    }

    const prevKeys = Reflect.ownKeys(instances) as symbol[];

    for (const key of prevKeys) {
      if (!nextKeys.includes(key)) {
        hasChanges = true;

        delete instances[key];
      }
    }

    if (hasChanges) {
      mithrilRedraw();
    }
  }

  async function fetchRequired(required: string[]) {
    if (required.length === 0) {
      return;
    }

    // deno-lint-ignore no-explicit-any
    const promises: Promise<any>[] = [];

    for (const iri of required) {
      promises.push(currentAttrs.internals.store.fetch(iri));
    }

    await Promise.allSettled(promises);
  }

  function listener(next: SelectionDetails<ReadonlySelectionResult>) {
    let required: string[] = [];

    if (typeof details === 'undefined') {
      required = next.required;
    } else {
      for (const iri of next.required) {
        if (!details.required.includes(iri)) {
          required.push(iri);
        }
      }
    }

    details = next;

    if (required.length > 0) {
      fetchRequired(required);
    }

    createInstances();
  }

  function subscribe() {
    if (
      typeof currentAttrs.internals.value !== 'undefined' &&
      !isJSONObject(currentAttrs.internals.value)
    ) {
      currentAttrs.internals.store.unsubscribe(key);
      createInstances();

      return;
    }

    details = currentAttrs.internals.store.subscribe({
      key,
      selector: currentAttrs.selector,
      value: currentAttrs.internals.value,
      listener,
    });

    fetchRequired(details.required);

    createInstances();
  }

  return {
    oninit: ({ attrs }) => {
      currentAttrs = attrs;

      subscribe();
    },
    onbeforeupdate: ({ attrs }) => {
      const reselect = shouldReselect(attrs, currentAttrs);

      currentAttrs = attrs;

      if (reselect) {
        attrs.internals.store.unsubscribe(key);
        subscribe();
      }
    },
    onbeforeremove: ({ attrs }) => {
      currentAttrs = attrs;

      attrs.internals.store.unsubscribe(key);
    },
    view: ({ attrs }): m.Children => {
      if (details == null || !details.complete) {
        return attrs.args.loading;
      } else if ((details.hasErrors || details.hasMissing) && typeof attrs.args.fallback !== 'function') {
        return attrs.args.fallback;
      }

      const view = currentAttrs.view;
      const {
        pre,
        sep,
        post,
        start,
        end,
        predicate,
        fallback,
      } = currentAttrs.args;

      const children: m.Children = [];
      let list = Reflect.ownKeys(instances).map(((key) => {
        const instance = instances[key as symbol];

        (instance.octiron as Mutable<OctironSelection>).position = -1;

        return instance;
      }));

      if (start != null || end != null) {
        list = list.slice(
          start ?? 0,
          end,
        );
      }

      if (predicate != null) {
        list = list.filter(({ octiron }) => predicate(octiron));
      }

      if (pre != null) {
        children.push(m.fragment({ key: preKey }, [pre]));
      }

      for (let index = 0; index < list.length; index++) {
        const { selectionResult, octiron } = list[index];
        const { key } = selectionResult;

        (octiron as Mutable<OctironSelection>).position = index + 1;


        if (index !== 0) {
          children.push(m.fragment({ key: `@${Symbol.keyFor(key)}` }, [sep]));
        }

        if (selectionResult.type === 'value') {
          children.push(m.fragment({ key }, [view(octiron)]));
        } else if (!selectionResult.ok && typeof fallback === 'function') {
          children.push(
            m.fragment({ key }, [fallback(octiron, selectionResult.reason as Failure)]),
          );
        } else if (!selectionResult.ok) {
          children.push(m.fragment({ key }, [fallback as m.Children]));
        } else {
          children.push(m.fragment({ key }, [view(octiron)]));
        }
      }

      if (post != null) {
        children.push(m.fragment({ key: postKey }, [post]));
      }

      return children;
    },
  };
};
