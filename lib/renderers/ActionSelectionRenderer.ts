import type m from "mithril";
import { actionSelectionFactory } from '../factories/actionSelectionFactory.ts';
import type { ActionSelectionParentArgs, ActionSelectionRendererArgs, ActionSelectView, CommonRendererArgs, OctironActionSelection, OctironActionSelectionArgs, OctironSelectArgs, OctironSelection, SelectionParentArgs, Selector, Update, UpdatePointer } from '../types/octiron.ts';
import type { ActionSelectionResult, SelectionDetails } from '../types/store.ts';
import { getSelection } from '../utils/getSelection.ts';
import { isJSONObject } from '../utils/isJSONObject.ts';
import { mithrilRedraw } from '../utils/mithrilRedraw.ts';
import type { JSONObject, Mutable } from '../types/common.ts';
import { selectionFactory } from '../factories/selectionFactory.ts';
import type { InstanceHooks } from "../factories/octironFactory.ts";


export type ActionSelectionRendererAttrs = {
  value: JSONObject;
  actionValue: JSONObject;
  selector: Selector;
  parentArgs: ActionSelectionParentArgs;
  args: OctironActionSelectionArgs;
  view: ActionSelectView;
  selectionArgs?: OctironActionSelectionArgs;
};

export const ActionSelectionRenderer: m.FactoryComponent<ActionSelectionRendererAttrs> = (
  vnode,
) => {
  let currentAttrs = vnode.attrs;
  let details: SelectionDetails<ActionSelectionResult>;

  const instances: Record<string, {
    rendererArgs: ActionSelectionRendererArgs;
    selection: OctironSelection;
    octiron: OctironActionSelection & InstanceHooks;
    selectionResult: ActionSelectionResult;
  }> = {};

  function createInstances() {
    let hasChanges = false;
    const { parentArgs, selectionArgs } = currentAttrs;

    const nextKeys: Array<string> = [];

    for (let index = 0; index < details.result.length; index++) {
      const selectionResult = details.result[index];

      nextKeys.push(selectionResult.pointer);

      if (instances[selectionResult.pointer] != null) {
        const next = selectionResult;
        const prev = instances[selectionResult.pointer].selectionResult;

        if (
          next.value === prev.value
        ) {
          continue;
        }

        const { rendererArgs, octiron } = instances[selectionResult.pointer];

        const update: Update = (value) => {
          return parentArgs.updatePointer(
            selectionResult.pointer,
            value,
            selectionArgs,
          );
        };

        octiron.value = next.value;
        rendererArgs.value = next.value;
        rendererArgs.spec = next.spec;
        rendererArgs.update = update;

        continue;
      }

      hasChanges = true;

      const update: Update = (value) => {
        return parentArgs.updatePointer(
          selectionResult.pointer,
          value,
          selectionArgs,
        );
      };

      const actionValueRendererArgs: CommonRendererArgs = {
        index,
        value: selectionResult.actionValue,
        propType: selectionResult.propType,
      }

      const actionValue = selectionFactory(
        currentAttrs.args as OctironSelectArgs,
        parentArgs as unknown as SelectionParentArgs,
        actionValueRendererArgs,
      );

      const rendererArgs: ActionSelectionRendererArgs = {
        index,
        update,
        actionValue,
        pointer: selectionResult.pointer,
        propType: selectionResult.propType,
        value: selectionResult.value,
        spec: selectionResult.spec,
      };

      const actionSelection = actionSelectionFactory(
        currentAttrs.args,
        parentArgs,
        rendererArgs,
      );

      instances[selectionResult.pointer] = {
        rendererArgs,
        selection: actionValue,
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
    const { selector, value, actionValue } = currentAttrs;
    const { store } = currentAttrs.parentArgs;

    if (!isJSONObject(value)) {
      return;
    }

    details = getSelection<ActionSelectionResult>({
      selector,
      store,
      actionValue,
      value,
      defaultValue: currentAttrs.args.initialValue,
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
        instance.octiron._updateArgs('args', attrs.args);
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

        (octiron as Mutable<OctironActionSelection>).position = index + 1;

        if (index !== 0) {
          children.push(sep);
        }

        if (selectionResult.value == null && typeof fallback === 'function') {
          children.push(null)
          // children.push(fallback(octiron));
        } else if (selectionResult.value == null && fallback != null) {
          children.push(fallback as m.Children);
        } else {
          children.push(view(octiron));
        }
      }

      children.push(post);

      return children;
    },
  };
};
