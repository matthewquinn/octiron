import type m from "mithril";
import { actionSelectionFactory, type OctironActionSelectionHooks, type ActionSelectionInternals } from '../factories/actionSelectionFactory.ts';
import type { ActionSelectView, OctironActionSelection, OctironActionSelectionArgs, OctironSelection, Selector } from '../types/octiron.ts';
import type { ActionSelectionResult, SelectionDetails } from '../types/store.ts';
import { getSelection } from '../utils/getSelection.ts';
import { isJSONObject } from '../utils/isJSONObject.ts';
import { mithrilRedraw } from '../utils/mithrilRedraw.ts';
import type { JSONObject } from '../types/common.ts';
import { selectionFactory } from '../factories/selectionFactory.ts';


export type ActionSelectionRendererAttrs = {
  value: JSONObject;
  actionValue: JSONObject;
  selector: Selector;
  internals: Omit<
    ActionSelectionInternals,
    | 'name'
    | 'type'
    | 'datatype'
    | 'pointer'
    | 'spec'
    | 'value'
    | 'actionValue'
    | 'octiron'
  >;
  args: OctironActionSelectionArgs;
  view: ActionSelectView;
};

export const ActionSelectionRenderer: m.FactoryComponent<ActionSelectionRendererAttrs> = (
  vnode,
) => {
  let currentAttrs = vnode.attrs;
  let details: SelectionDetails<ActionSelectionResult>;

  const instances: Record<string, {
    internals: ActionSelectionInternals;
    selection: OctironSelection;
    octiron: OctironActionSelection & OctironActionSelectionHooks;
    selectionResult: ActionSelectionResult;
  }> = {};

  function createInstances() {
    let hasChanges = false;

    const nextKeys: Array<string> = [];

    for (const selectionResult of details.result) {
      nextKeys.push(selectionResult.pointer);

      if (instances[selectionResult.pointer] != null) {
        const next = selectionResult;
        const prev = instances[selectionResult.pointer].selectionResult;

        if (
          next.value === prev.value
        ) {
          continue;
        }

        const internals = instances[selectionResult.pointer].internals

        internals.name = selectionResult.datatype;
        internals.type = selectionResult.type;
        internals.datatype = selectionResult.datatype;
        internals.pointer = selectionResult.pointer;
        internals.value = selectionResult.value;
        internals.actionValue = selectionResult.actionValue;

        if (selectionResult.spec != null) {
          internals.spec = selectionResult.spec;
        }
      }

      hasChanges = true;

      const selection = selectionFactory({
        store: currentAttrs.internals.store,
        typeDefs: currentAttrs.internals.typeDefs,
        datatype: selectionResult.datatype,
        value: selectionResult.value,
      });

      const internals: ActionSelectionInternals = {
        ...currentAttrs.internals,
        octiron: selection,
        name: selectionResult.datatype,
        type: selectionResult.type,
        datatype: selectionResult.datatype,
        pointer: selectionResult.pointer,
        spec: selectionResult.spec,
        value: selectionResult.value,
        actionValue: selectionResult.actionValue,
      };

      const actionSelection = actionSelectionFactory(
        internals,
        currentAttrs.args,
      );

      instances[selectionResult.pointer] = {
        internals,
        selection,
        octiron: actionSelection,
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

  function updateSelection() {
    const { selector, actionValue, value } = currentAttrs;
    const { store } = currentAttrs.internals;

    if (!isJSONObject(value)) {
      return;
    }

    details = getSelection<ActionSelectionResult>({
      selector,
      store,
      actionValue,
      value,
    });

    createInstances();
  }

  return {
    oninit: ({ attrs }) => {
      currentAttrs = attrs;

      updateSelection();
    },
    onbeforeupdate: ({ attrs }) => {
      currentAttrs = attrs;

      for (const instance of Object.values(instances)) {
        instance.octiron._updateArgs(attrs.args);
        instance.octiron._updateInternals(attrs.internals);
      }

      updateSelection();
    },
    view: ({ attrs: { view, args } }) => {
      if (details == null) {
        return null;
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
        const { octiron, selectionResult } = list[index];

        if (index !== 0) {
          children.push(sep);
        }

        if (selectionResult.value == null && typeof fallback === 'function') {
          children.push(fallback(octiron));
        } else if (selectionResult.value == null && fallback != null) {
          children.push(fallback);
        } else {
          children.push(view(octiron));
        }
      }

      children.push(post);

      return children;
    },
  };
};
