import type m from 'mithril';
import { actionFactory, type ActionInternals } from '../factories/actionFactory.ts';
import { selectionFactory } from '../factories/selectionFactory.ts';
import type { JSONObject, Mutable, SCMAction } from '../types/common.ts';
import type { OctironAction, OctironPerformArgs, OctironSelection, PerformView, Selector } from '../types/octiron.ts';
import type { Failure, ReadonlySelectionResult, SelectionDetails } from '../types/store.ts';
import { isIRIObject } from '../utils/isIRIObject.ts';
import { mithrilRedraw } from '../utils/mithrilRedraw.ts';
import type { InstanceHooks } from "../factories/octironFactory.ts";

export type PerformRendererAttrs = {
  internals: ActionInternals;
  selector?: Selector;
  args: OctironPerformArgs;
  view: PerformView;
};

export const PerformRenderer: m.FactoryComponent<PerformRendererAttrs> = ({ attrs }) => {
  const key = Symbol('PerformRenderer');
  let currentAttrs = attrs;
  let details: SelectionDetails<ReadonlySelectionResult>;

  const instances: Record<string, {
    octiron: OctironSelection;
    action: OctironAction & InstanceHooks;
    selectionResult: ReadonlySelectionResult;
  }> = {};

  function createInstances() {
    let hasChanges = false;

    const nextKeys: Array<string> = [];

    for (let index = 0; index < details.result.length; index++) {
      const selectionResult = details.result[index];

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

      const octiron = selectionFactory({
        index,
        store: currentAttrs.internals.store,
        typeDefs: currentAttrs.internals.typeDefs,
        value: selectionResult.value as SCMAction,
      });
      const action = actionFactory({
        ...currentAttrs.internals,
        octiron,
      }, currentAttrs.args);

      instances[selectionResult.pointer] = {
        action,
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
    const { selector, internals } = currentAttrs;

    if (typeof selector === 'undefined') {
      // The value is the action
      let result: ReadonlySelectionResult;

      if (isIRIObject(internals.octiron.value)) {
        result = {
          pointer: '/local',
          key: Symbol.for('/local'),
          type: 'entity',
          iri: internals.octiron.value['@id'],
          ok: true,
          value: internals.octiron.value,
        };
      } else {
        result = {
          pointer: '/local',
          key: Symbol.for('/local'),
          type: 'value',
          value: internals.octiron.value,
        };
      }

      details = {
        selector: '',
        complete: true,
        hasErrors: false,
        hasMissing: false,
        dependencies: [],
        required: [],
        result: [result],
      };
    } else {
      // Perform needs to select the action value
      details = internals.store.subscribe({
        key,
        selector: selector,
        value: internals.octiron.value as JSONObject,
        listener,
      });

      fetchRequired(details.required);
    }

    createInstances();
  }

  return {
    oninit: ({ attrs }) => {
      currentAttrs = attrs;

      subscribe();
    },
    onbeforeupdate: ({ attrs }) => {
      if (attrs.selector !== currentAttrs.selector) {
        attrs.internals.store.unsubscribe(key);

        subscribe();
      }

      currentAttrs = attrs;

      for (const instance of Object.values(instances)) {
        instance.action._updateArgs(attrs.args);
      }
    },
    onbeforeremove: ({ attrs }) => {
      currentAttrs = attrs;

      attrs.internals.store.unsubscribe(key);
    },
    view: ({ attrs: { view, args } }): m.Children => {
      if (details == null || !details.complete) {
        return args.loading;
      }

      const {
        pre,
        sep,
        post,
        fallback,
      } = args;

      if (typeof view === 'undefined') {
        return;
      }

      const list = Object.values(instances);
      const children = [pre];

      for (let index = 0; index < list.length; index++) {
        const { selectionResult, action, octiron } = list[index];

        (action as Mutable<OctironAction>).position = index + 1;

        if (index !== 0) {
          children.push(sep);
        }

        if (selectionResult.type === 'value') {
          children.push(view(action));
        } else if (!selectionResult.ok && typeof fallback === 'function') {
          children.push(fallback(octiron, selectionResult.reason as Failure));
        } else if (!selectionResult.ok) {
          children.push(fallback as m.Children);
        } else {
          children.push(view(action));
        }
      }

      children.push(post);

      return children;
    },
  };
};
