import m from 'mithril';
import { JsonPointer } from 'json-ptr';
import { ActionStateRenderer } from "../renderers/ActionStateRenderer.ts";
import type { Store } from "../store.ts";
import type { JSONArray, JSONObject, JSONValue, SCMAction } from "../types/common.ts";
import type { ActionSelectView, Octiron, OctironAction, OctironActionSelectionArgs, OctironPerformArgs, OctironSelectArgs, PayloadValueMapper, Predicate, PresentComponent, Selector, SelectView, TypeDefs, UpdateArgs } from "../types/octiron.ts";
import type { EntityState } from "../types/store.ts";
import { getSubmitDetails } from "../utils/getSubmitDetails.ts";
import { unravelArgs } from "../utils/unravelArgs.ts";
import { mithrilRedraw } from "../utils/mithrilRedraw.ts";
import { ActionSelectionRenderer } from "../renderers/ActionSelectionRenderer.ts";
import { isJSONObject } from "../utils/isJSONObject.ts";
import { type CommonArgs, type InstanceHooks, octironFactory } from "./octironFactory.ts";


export type ActionInternals = {
  octiron: Octiron;
  store: Store;
  typeDefs: TypeDefs;
  index?: number;
};

export type ActionRefs = {
  url?: string;
  method?: string;
  submitting: boolean;
  payload: JSONObject;
  store: Store;
  typeDefs: TypeDefs;
  submitResult?: EntityState;
};

export function actionFactory<
  // deno-lint-ignore no-explicit-any
  Attrs extends Record<string, any> = Record<string, any>,
>(
  internals: ActionInternals,
  args: OctironPerformArgs<Attrs>,
): OctironAction & InstanceHooks {
  const factoryArgs = Object.assign({}, args);
  let payload: JSONObject = {};
  let submitResult: EntityState | undefined;

  if (isJSONObject(args.initialPayload)) {
    for (const [key, value] of Object.entries(args.initialPayload)) {
      payload[internals.store.expand(key)] = value;
    }
  }

  let url: string | undefined;
  let method: string | undefined;
  let body: string | undefined
  // this object is passed into children which need to keep hold of the
  // original object but read the most recent value after mutations on
  // on its members.
  const refs: ActionRefs = {
    submitting: false,
    payload,
    store: internals.store,
    typeDefs: internals.typeDefs,
    submitResult,
  };

  try {
    const submitDetails = getSubmitDetails({
      payload,
      action: internals.octiron.value as SCMAction,
      store: internals.store,
    });
    refs.url = submitDetails.url;
    refs.method = submitDetails.method;
    body = submitDetails.body;
  } catch (err) {
    console.error(err);
  }

  if (body == null && url != null) {
    refs.submitResult = submitResult = internals.store.entity(url);
  }

  async function onSubmit() {
    const { url, method, body, contentType, encodingType } = getSubmitDetails({
      payload,
      action: internals.octiron.value as SCMAction,
      store: internals.store,
    });

    try {
      refs.submitting = true;

      mithrilRedraw();

      refs.submitResult = await internals.store.submit(url, {
        method,
        body,
        contentType,
        encodingType,
      });
    } catch (err) {
      console.error(err);
    }

    refs.submitting = false;

    mithrilRedraw();
  }

  function onUpdate(value: JSONObject) {
    const prev = payload;
    const next = {
      ...prev,
      ...value,
    };

    if (typeof args.interceptor === 'function') {
      payload = args.interceptor(
        next,
        prev,
        internals.octiron.value as SCMAction,
      );
    } else {
      payload = next;
    }
    // TODO: perform _updateArgs() when supported
    self.value = refs.payload = value;

    mithrilRedraw();
  }

  function onPointerUpdate(
    pointer: string,
    value: JSONValue,
  ) {
    const next: Partial<JSONObject> = Object.assign({}, payload);
    const ptr = JsonPointer.create(pointer);

    if (value == null) {
      ptr.unset(next);
    } else {
      ptr.set(next, value, true);
    }

    onUpdate(next);
  }

  const self = octironFactory(
    'action',
    internals,
    factoryArgs as CommonArgs,
  );

  self.value = refs.payload;
  self.action = internals.octiron;
  self.actionValue = internals.octiron;

  self.submit = async function (
    arg1?: PayloadValueMapper<JSONObject> | JSONObject
  ): Promise<void> {
    if (typeof arg1 === 'function') {
      onUpdate(arg1(payload));
    } else if (arg1 != null) {
      onUpdate(arg1);
    }

    return await onSubmit();
  } as OctironAction['submit'];

  self.update = async function (
    arg1: PayloadValueMapper<JSONObject> | JSONObject,
    args?: UpdateArgs,
  ): Promise<void> {
    if (typeof arg1 === 'function') {
      onUpdate(arg1(payload));
    } else if (arg1 != null) {
      onUpdate(arg1);
    }

    if (args?.submit || args?.submitOnChange) {
      await onSubmit();
    } else {
      mithrilRedraw();
    }
  } as OctironAction['update'];

  self.initial = function (
    children: m.Children
  ): m.Children {
    return m(
      ActionStateRenderer,
      {
        type: 'initial',
        refs,
      },
      children,
    );
  };

  self.success = function (
    arg1?: Selector | OctironSelectArgs | SelectView,
    arg2?: OctironSelectArgs | SelectView,
    arg3?: SelectView,
  ): m.Children {
    const [selector, args, view] = unravelArgs(arg1, arg2, arg3);

    return m(ActionStateRenderer, {
      type: 'success',
      selector,
      args,
      view,
      refs,
    });
  };

  self.failure = function (
    arg1?: Selector | OctironSelectArgs | SelectView,
    arg2?: OctironSelectArgs | SelectView,
    arg3?: SelectView,
  ) {
    const [selector, args, view] = unravelArgs(arg1, arg2, arg3);

    return m(ActionStateRenderer, {
      type: 'failure',
      selector,
      args,
      view,
      refs,
    });
  };

  self.select = function (
    arg1: Selector,
    arg2?: OctironActionSelectionArgs | ActionSelectView,
    arg3?: ActionSelectView,
  ): m.Children | null {
    const [selector, args, view] = unravelArgs(arg1, arg2, arg3);

    return m(
      ActionSelectionRenderer,
      {
        internals: {
          action: self as unknown as OctironAction,
          parent: self as unknown as OctironAction,
          entity: internals.octiron,
          store: internals.store,
          typeDefs: internals.typeDefs,
          onSubmit,
          onUpdate: onPointerUpdate,
          submitting: refs.submitting,
        },
        selector,
        value: self.value,
        actionValue: internals.octiron.value as JSONObject,
        args,
        view,
      }
    );
  };

  self.append = function (
    termOrType: string,
    value: JSONValue = {},
    args: UpdateArgs = {},
  ) {
    const type = internals.store.expand(termOrType);

    if (!isJSONObject(self.value)) {
      return;
    }
    const prevValue = self.value[type];
    let nextValue: JSONArray = [];

    if (prevValue != null && !Array.isArray(prevValue)) {
      nextValue.push(prevValue);
    } else if (Array.isArray(prevValue)) {
      nextValue = [...prevValue.filter((value) => value != undefined)];
    }

    nextValue.push(value);

    return self.update({
      ...self.value,
      [type]: nextValue,
    }, args);
  };

  if (
    typeof window === 'undefined' && args.submitOnInit &&
    submitResult == null
  ) {
    self.submit();
  } else if (typeof window !== 'undefined' && args.submitOnInit) {
    self.submit();
  }

  return self as OctironAction & InstanceHooks;
}
