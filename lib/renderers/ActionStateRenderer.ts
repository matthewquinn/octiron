import type m from 'mithril';
import { selectionFactory } from '../factories/selectionFactory.ts';
import type { OctironSelectArgs, OctironSelection, SelectView, TypeDefs } from '../types/octiron.ts';
import type { EntityState } from '../types/store.ts';
import type { Store } from "../store.ts";
import type { Mutable } from "../types/common.ts";

export type ActionRendererRef = {
  submitting: boolean;
  submitResult?: EntityState;
  store: Store;
  typeDefs: TypeDefs;
};

export type ActionStateRendererAttrs = {
  type: 'initial' | 'success' | 'failure';
  children?: m.Children;
  selector?: string;
  args?: OctironSelectArgs;
  view?: SelectView;
  refs: ActionRendererRef;
};

export const ActionStateRenderer: m.ClosureComponent<ActionStateRendererAttrs> = () => {
  let submitResult: EntityState | undefined;
  let o: OctironSelection | undefined;

  function setInstance(attrs: ActionStateRendererAttrs) {
    if (typeof attrs.refs.submitResult === 'undefined') {
        submitResult = undefined;
      o = undefined;
    } else if (
      typeof submitResult === 'undefined' ||
      attrs.refs.submitResult.ok !== submitResult.ok ||
      attrs.refs.submitResult.status !== submitResult.status ||
      attrs.refs.submitResult.value !== submitResult.value
    ) {
      submitResult = attrs.refs.submitResult;

      o = selectionFactory({
        value: submitResult.value,
        store: attrs.refs.store,
        typeDefs: attrs.refs.typeDefs,
      });
    }
  }

  return {
    oninit: ({ attrs }) => {
      setInstance(attrs);
    },
    onbeforeupdate: ({ attrs }) => {
      setInstance(attrs);
    },
    view: ({ attrs: { type, selector, args, view }, children }) => {
      if (type === 'initial' && typeof submitResult === 'undefined') {
        return children;
      } else if (submitResult == null || o == null) {
        return null;
      }

      const shouldRender = (type === 'success' && submitResult.ok) ||
        (type === 'failure' && !submitResult.ok);

      (o as Mutable<OctironSelection>).position = 1;

      if (shouldRender && selector != null) {
        return o.select(selector, args as OctironSelectArgs, view as SelectView);
      } else if (shouldRender && view != null) {
        return view(o);
      } else if (shouldRender && args != null) {
        return o.present(args);
      }

      (o as Mutable<OctironSelection>).position = -1

      return null;
    },
  };
};
