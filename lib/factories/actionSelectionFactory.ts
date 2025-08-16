import { JsonPointer } from 'json-ptr';
import m from 'mithril';
import { ActionSelectionRenderer } from "../renderers/ActionSelectionRenderer.ts";
import type { JSONArray, JSONObject, JSONValue } from "../types/common.ts";
import type { ActionSelectionParentArgs, ActionSelectionRendererArgs, ActionSelectView, BaseAttrs, CommonParentArgs, CommonRendererArgs, EditComponent, Interceptor, Octiron, OctironAction, OctironActionSelection, OctironActionSelectionArgs, OctironEditArgs, OctironPresentArgs, OctironSelectArgs, OctironSelection, OnChange, PayloadValueMapper, Selector, SelectView, TypeDefs, UpdateArgs } from "../types/octiron.ts";
import { isJSONObject } from "../utils/isJSONObject.ts";
import { mithrilRedraw } from "../utils/mithrilRedraw.ts";
import { unravelArgs } from "../utils/unravelArgs.ts";
import { type ChildArgs, type CommonArgs, type InstanceHooks, octironFactory } from "./octironFactory.ts";
import { isIterable } from "../utils/isIterable.ts";
import { getIterableValue } from "../utils/getIterableValue.ts";
import { selectComponentFromArgs } from "../utils/selectComponentFromArgs.ts";


export type OnActionSelectionSubmit = () => Promise<void>;

export type OnActionSelectionUpdate = (
  pointer: string,
  value: JSONValue,
  args?: UpdateArgs,
) => void;


export function actionSelectionFactory<
  // deno-lint-ignore no-explicit-any
  Attrs extends Record<string, any> = Record<string, any>
>(
  args: OctironActionSelectionArgs<Attrs>,
  parentArgs: ActionSelectionParentArgs,
  rendererArgs: ActionSelectionRendererArgs,
): OctironActionSelection & InstanceHooks {
  const factoryArgs = Object.assign({}, args);
  const childArgs: Partial<ChildArgs> = {
    action: parentArgs.action,
    submitting: parentArgs.submitting,
    value: rendererArgs.value,
  };

  const self = octironFactory(
    'action-selection',
    factoryArgs as CommonArgs,
    parentArgs as CommonParentArgs,
    rendererArgs as CommonRendererArgs,
    childArgs as ChildArgs,
  );

  self.readonly = rendererArgs.spec == null ? true : (rendererArgs.spec.readonlyValue ?? false);
  self.inputName = rendererArgs.propType as string;
  self.submitting = parentArgs.submitting;
  self.action = parentArgs.action;

  childArgs.updatePointer = (
    pointer: string,
    value: JSONValue,
    args?: UpdateArgs,
    interceptor = factoryArgs.interceptor,
  ) => {
    const prev = self.value as JSONObject;

    if (!isJSONObject(prev)) {
      console.warn(`Non object action change intercepted.`);
      return;
    }

    let next: Partial<JSONObject> = Object.assign({}, prev);
    const ptr = JsonPointer.create(pointer);

    if (value == null) {
      ptr.unset(next);
    } else {
      ptr.set(next, value, true);
    }

    if (typeof interceptor === 'function') {
      next = interceptor(next, prev, rendererArgs.actionValue as JSONObject);
    }

    parentArgs.updatePointer(rendererArgs.pointer, next, args);
  }

  self.update = async (
    arg1: PayloadValueMapper<JSONObject> | JSONObject,
    args?: UpdateArgs,
  ): Promise<void> => {
    const value = self.value;

    if (!isJSONObject(value)) {
      throw new Error(`Cannot call update on a non object selection instance`);
    }

    if (typeof arg1 === 'function') {
      rendererArgs.update(arg1(value));
    } else if (arg1 != null) {
      rendererArgs.update(arg1);
    }

    if (args?.submit || args?.submitOnChange) {
      await parentArgs.submit();
    } else {
      mithrilRedraw();
    }
  };

  self.submit = (): Promise<void> => {
    return parentArgs.submit();
  };

  self.select = (
    arg1: Selector,
    arg2?: OctironActionSelectionArgs | ActionSelectView,
    arg3?: ActionSelectView,
  ): m.Children => {
    if (!isJSONObject(self.value)) {
      return null;
    }

    const [selector, args, view] = unravelArgs(arg1, arg2, arg3);

    return m(
      ActionSelectionRenderer,
      {
        parentArgs: childArgs as ActionSelectionParentArgs,
        selector,
        value: self.value,
        actionValue: rendererArgs.actionValue as JSONObject,
        args,
        view,
      },
    );
  };

  self.edit = (
    args?: OctironEditArgs<BaseAttrs>,
  ): m.Children => {
    if (self.readonly) {
      return self.present(args as OctironPresentArgs<BaseAttrs>);
    }

    const [attrs, component] = selectComponentFromArgs(
      'edit',
      parentArgs,
      args,
      factoryArgs as OctironEditArgs,
    );

    if (component == null) {
      return null;
    }

    return m(component as EditComponent<JSONValue, BaseAttrs>, {
      o: self as unknown as OctironActionSelection,
      required: true,
      readonly: false,
      renderType: "edit",
      name: self.inputName,
      value: self.value,
      attrs,
      onchange: rendererArgs.update,
      onChange: rendererArgs.update,
    });
  };

  self.present = self.edit;

  self.initial = (children: m.Children) => {
    return parentArgs.action.initial(children);
  };

  self.success = (
    arg1?: Selector | OctironSelectArgs | SelectView,
    arg2?: OctironSelectArgs | SelectView,
    arg3?: SelectView,
  ) => {
    return parentArgs.action.success(
      arg1 as Selector,
      arg2 as OctironSelectArgs,
      arg3 as SelectView,
    );
  };

  self.failure = (
    arg1?: Selector | OctironSelectArgs | SelectView,
    arg2?: OctironSelectArgs | SelectView,
    arg3?: SelectView,
  ) => {
    return parentArgs.action.failure(
      arg1 as Selector,
      arg2 as OctironSelectArgs,
      arg3 as SelectView,
    );
  };

  self.remove = (
    _args: UpdateArgs = {},
  ) => {
    if (rendererArgs.propType == null) {
      return;
    }

    const parentValue = parentArgs.parent.value as JSONObject;
    const value = parentValue[rendererArgs.propType];

    if (isIterable(value)) {
      const arrValue = getIterableValue(value);

      arrValue.splice(self.index, 1);

      if (arrValue.length === 0) {
        delete parentValue[rendererArgs.propType];
      }
    } else if (isJSONObject(value)) {
      delete parentValue[rendererArgs.propType];
    }

    mithrilRedraw()
    // internals.onUpdate(
    //   internals.pointer,
    //   null as unknown as JSONObject,
    //   args,
    // );
  };

  self.append = (
    termOrType: string,
    value: JSONValue = {},
    args: UpdateArgs = {},
  ) => {
    const type = parentArgs.store.expand(termOrType);

    if (isJSONObject(self.value)) {
      const prevValue = self.value[type];
      let nextValue: JSONArray = [];

      if (prevValue != null && !Array.isArray(prevValue)) {
        nextValue.push(prevValue);
      } else if (Array.isArray(prevValue)) {
        nextValue = [...prevValue.filter((value) => value != null)];
      }

      nextValue.push(value);
        return parentArgs.updatePointer(rendererArgs.pointer, {
        ...self.value,
        [type]: nextValue,
      }, args);
    }
  };

  return self as unknown as OctironActionSelection & InstanceHooks;
}
