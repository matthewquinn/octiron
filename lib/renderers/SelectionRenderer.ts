import type { JSONValue } from '../types/common.ts';
import type { Octiron, OctironSelectArgs, OctironSelection, Selector, SelectView, TypeDefs } from '../types/octiron.ts';
import type { Failure, OctironStore, ReadonlySelectionResult, SelectionDetails } from '../types/store.ts';
import m from 'mithril';
import { selectionFactory } from '../factories/selectionFactory.ts';
import { isJSONObject } from '../utils/isJSONObject.ts';
import { mithrilRedraw } from '../utils/mithrilRedraw.ts';

export type SelectionRendererInternals = {
  store: OctironStore;
  typeDefs: TypeDefs;
  parent?: OctironSelection;
  value?: JSONValue;
};

export type SelectionRendererAttrs = {
  selector: Selector;
  args: OctironSelectArgs;
  view: SelectView;
  internals: SelectionRendererInternals;
};

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

  const instances: Record<string, {
    octiron: OctironSelection;
    selectionResult: ReadonlySelectionResult;
  }> = {};

  function createInstances() {
    let hasChanges = false;

    const {
      store,
      typeDefs,
    } = currentAttrs.internals;

    const nextKeys: Array<string> = [];

    if (details == null) {
      const prevKeys = Object.keys(instances);

      for (const key of prevKeys) {
        if (!nextKeys.includes(key)) {
          hasChanges = true;

          delete instances[key];
        }
      }

      if (hasChanges && typeof window !== 'undefined') {
        mithrilRedraw();
      }

      return;
    }

    for (const selectionResult of details.result) {
      nextKeys.push(selectionResult.pointer);

      if (Object.hasOwn(instances, selectionResult.pointer)) {
        const next = selectionResult;
        const prev = instances[selectionResult.pointer].selectionResult;

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

      let octiron: Octiron;

      if (selectionResult.type === 'entity') {
        octiron = selectionFactory({
          store,
          typeDefs,
          value: selectionResult.value,
        });
      } else {
        octiron = selectionFactory({
          store,
          typeDefs,
          value: selectionResult.value,
          datatype: selectionResult.datatype,
        });
      }

      instances[selectionResult.pointer] = {
        octiron,
        selectionResult,
      };
    }

    const prevKeys = Object.keys(instances);

    for (const key of prevKeys) {
      if (!nextKeys.includes(key)) {
        hasChanges = true;

        delete instances[key];
      }
    }

    if (hasChanges && typeof window !== 'undefined') {
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
      if (typeof details === 'undefined' || !details.complete) {
        return attrs.args.loading;
      }

      const view = currentAttrs.view;
      const {
        pre,
        sep,
        post,
        fallback,
      } = currentAttrs.args;

      if (typeof view === 'undefined') {
        return;
      }

      const list = Object.values(instances);
      const children = [m.fragment({ key: '@pre' }, [pre])];

      for (let index = 0; index < list.length; index++) {
        const { selectionResult, octiron } = list[index];
        const { pointer } = selectionResult;

        if (index !== 0) {
          children.push(m.fragment({ key: pointer }, [sep]));
        }

        if (selectionResult.type === 'value') {
          children.push(m.fragment({ key: pointer }, [view(octiron)]));
        } else if (!selectionResult.ok && typeof fallback === 'function') {
          children.push(
            m.fragment({ key: pointer }, [fallback(octiron, selectionResult.reason as Failure)]),
          );
        } else if (!selectionResult.ok) {
          children.push(m.fragment({ key: pointer }, [fallback as m.Children]));
        } else {
          children.push(m.fragment({ key: pointer }, [view(octiron)]));
        }
      }

      children.push(m.fragment({ key: '@post' }, [post]));

      return children;
    },
  };
};
