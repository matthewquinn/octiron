import type m from 'mithril';
import { selectionFactory } from '../factories/selectionFactory.ts';
import type { OctironSelectArgs, OctironSelection, SelectView, TypeDefs } from '../types/octiron.ts';
import type { EntityState } from '../types/store.ts';
import type { Store } from "../store.ts";

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
      } else if (
        typeof submitResult === 'undefined' || typeof o !== 'function'
      ) {
        return null;
      }

      const shouldRender = (type === 'success' && submitResult.ok) ||
        (type === 'failure' && !submitResult.ok);

      if (shouldRender && selector != null && args != null && view != null) {
        return o.select(selector, args, view);
      } else if (shouldRender && typeof view === 'function') {
        return view(o);
      } else if (shouldRender && typeof args !== 'undefined') {
        return o.present(args);
      }

      return null;
    },
  };
};
