import { JsonPointer } from 'json-ptr';
import m from 'mithril';
import { ActionSelectionRenderer } from "../renderers/ActionSelectionRenderer.ts";
import type { Store } from "../store.ts";
import type { JSONArray, JSONObject, JSONValue, SCMPropertyValueSpecification } from "../types/common.ts";
import type { ActionSelectView, BaseAttrs, EditComponent, Interceptor, Octiron, OctironAction, OctironActionSelection, OctironActionSelectionArgs, OctironEditArgs, OctironPresentArgs, OctironSelectArgs, OctironSelection, OnChange, PayloadValueMapper, Selector, SelectView, TypeDefs, UpdateArgs } from "../types/octiron.ts";
import { isJSONObject } from "../utils/isJSONObject.ts";
import { mithrilRedraw } from "../utils/mithrilRedraw.ts";
import { unravelArgs } from "../utils/unravelArgs.ts";
import { type CommonArgs, type InstanceHooks, octironFactory } from "./octironFactory.ts";
import { isIterable } from "../utils/isIterable.ts";
import { getIterableValue } from "../utils/getIterableValue.ts";
import { selectComponentFromArgs } from "../utils/selectComponentFromArgs.ts";


export type OnActionSelectionSubmit = () => Promise<void>;

export type OnActionSelectionUpdate = (
  pointer: string,
  value: JSONValue,
  args?: UpdateArgs,
) => void;

export type ActionSelectionInternals = {
  submitting: boolean;
  type: string | string[];
  propType: string;
  index: number;
  pointer: string;
  name: string;
  value: JSONValue;
  actionValue?: JSONValue;
  entity: Octiron;
  action: OctironAction;
  parent: OctironAction | OctironActionSelection;
  octiron: OctironSelection;
  store: Store;
  spec?: SCMPropertyValueSpecification;
  typeDefs: TypeDefs;
  onSubmit: OnActionSelectionSubmit;
  onUpdate: OnActionSelectionUpdate;
};

export function actionSelectionFactory<
  // deno-lint-ignore no-explicit-any
  Attrs extends Record<string, any> = Record<string, any>
>(
  internals: ActionSelectionInternals,
  args: OctironActionSelectionArgs<Attrs>,
): OctironActionSelection & InstanceHooks {
  const factoryArgs = Object.assign({}, args);
  const refs = Object.assign({}, args);

  function onUpdate(value: JSONObject) {
    return internals.onUpdate(internals.pointer, value, {
      throttle: refs.throttle,
      debounce: refs.debounce,
      submitOnChange: refs.submitOnChange,
    });
  }

  const self = octironFactory(
    'action-selection',
    internals,
    factoryArgs as CommonArgs,
  );

  self.readonly = internals.spec == null ? true : (internals.spec.readonlyValue ?? false);
  self.inputName = internals.propType;
  self.submitting = internals.submitting;
  // self.value = internals.value ?? args.initialValue;
  self.action = internals.action;

  function onSelectionUpdate(
    pointer: string,
    value: JSONValue,
    args?: UpdateArgs,
    interceptor?: Interceptor,
  ) {
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
      next = interceptor(next, prev, internals.actionValue as JSONObject);
    }

    internals.onUpdate(internals.pointer, next, args);
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
      onUpdate(arg1(value));
    } else if (arg1 != null) {
      onUpdate(arg1);
    }

    if (args?.submit || args?.submitOnChange) {
      await internals.onSubmit();
    } else {
      mithrilRedraw();
    }
  };

  self.submit = (): Promise<void> => {
    return internals.onSubmit();
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

    const onUpdate: OnActionSelectionUpdate = (
      pointer,
      value,
      updateArgs,
    ) => {
      onSelectionUpdate(
        pointer,
        value,
        updateArgs,
        args.interceptor,
      );
    }

    return m(
      ActionSelectionRenderer,
      {
        internals: {
          submitting: internals.submitting,
          entity: internals.entity,
          action: internals.action,
          parent: self as unknown as OctironActionSelection,
          store: internals.store,
          typeDefs: internals.typeDefs,
          onSubmit: internals.onSubmit,
          onUpdate,
        },
        selector,
        value: self.value,
        actionValue: internals.actionValue as JSONObject,
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
      internals,
      args,
      factoryArgs as OctironEditArgs,
    );

    if (component == null) {
      return null;
    }

    // don't apply intercepter fn to edit calls.
    // deno-lint-ignore no-explicit-any
    const onChange: OnChange<any> = (value, args) => {
      return internals.onUpdate(internals.pointer, value, args);
    }

    return m(component as EditComponent<JSONValue, BaseAttrs>, {
      o: self as unknown as OctironActionSelection,
      required: true,
      readonly: false,
      renderType: "edit",
      name: self.inputName,
      value: self.value,
      attrs,
      onchange: onChange,
      onChange,
    });
  };

  self.present = self.edit;

  self.initial = (children: m.Children) => {
    return internals.action.initial(children);
  };

  self.success = (
    arg1?: Selector | OctironSelectArgs | SelectView,
    arg2?: OctironSelectArgs | SelectView,
    arg3?: SelectView,
  ) => {
    return internals.action.success(
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
    return internals.action.failure(
      arg1 as Selector,
      arg2 as OctironSelectArgs,
      arg3 as SelectView,
    );
  };

  self.remove = (
    args: UpdateArgs = {},
  ) => {
    const parentValue = internals.parent.value as JSONObject;
    const value = parentValue[internals.propType];

    if (isIterable(value)) {
      const arrValue = getIterableValue(value);

      arrValue.splice(self.index, 1);

      if (arrValue.length === 0) {
        delete parentValue[internals.propType];
      }
    } else if (isJSONObject(value)) {
      delete parentValue[internals.propType];
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
    const type = internals.store.expand(termOrType);

    if (isJSONObject(self.value)) {
      const prevValue = self.value[type];
      let nextValue: JSONArray = [];

      if (prevValue != null && !Array.isArray(prevValue)) {
        nextValue.push(prevValue);
      } else if (Array.isArray(prevValue)) {
        nextValue = [...prevValue.filter((value) => value != null)];
      }

      nextValue.push(value);

      return internals.onUpdate(internals.pointer, {
        ...self.value,
        [type]: nextValue,
      }, args);
    }
  };

  return self as unknown as OctironActionSelection & InstanceHooks;
}
