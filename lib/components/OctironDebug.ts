import m from 'mithril';
import * as jsonld from 'jsonld';
import { mithrilRedraw } from "../utils/mithrilRedraw.ts";
import type { JSONObject } from "../types/common.ts";
import type { Octiron } from "../types/octiron.ts";
import { OctironJSON } from "./OctironJSON.ts";
import { flattenIRIObjects } from "../utils/flattenIRIObjects.ts";

export type OctironDebugAttrs = {
  o: Octiron;
  selector?: string;
  location?: URL;
};

export const OctironDebug: m.ClosureComponent<OctironDebugAttrs> = ({
  attrs,
}) => {
  let currentAttrs = attrs;
  let value = attrs.o.value as JSONObject;
  let rendered: m.Children;
  let displayStyle: 'value' | 'action-value' | 'component' | 'expanded' | 'flattened' = 'value';

  async function onRender(redraw: boolean = true) {
    const { o } = currentAttrs;
    if (displayStyle === 'value') {
      rendered = m(OctironJSON, { value, selector: currentAttrs.selector, location: currentAttrs.location });
    } else if (
      displayStyle === 'action-value' && (
        o.octironType === 'action' ||
        o.octironType === 'action-selection'
      )
    ) {
      rendered = m(OctironJSON, { value: o.actionValue.value, selector: currentAttrs.selector, location: currentAttrs.location })
    } else if (displayStyle === 'expanded') {
      const expanded = await jsonld.compact(value, attrs.o.store.context);

      rendered = m(OctironJSON, {
        value: expanded,
        location: currentAttrs.location,
      });
      // rendered = JSON.stringify(renderValue, null, 2);
    } else if (displayStyle === 'flattened') {
      const flattened = flattenIRIObjects(value);
      rendered = m(OctironJSON, {
        value: flattened,
        selector: currentAttrs.selector,
        location: currentAttrs.location,
      });
    }

    if (redraw) {
      mithrilRedraw();
    }
  }

  function onSetValue(e: MouseEvent & { redraw: boolean }) {
    e.redraw = false;
    displayStyle = 'value';

    onRender();
  }

  function onSetActionValue(e: MouseEvent & { redraw: boolean }) {
    e.redraw = false;
    displayStyle = 'action-value';

    onRender();
  }

  function onSetComponent(e: MouseEvent & { redraw: boolean }) {
    e.redraw = false;
    displayStyle = 'component';

    onRender();
  }

  function onSetExpanded(e: MouseEvent & { redraw: boolean }) {
    e.redraw = false;
    displayStyle = 'expanded';

    onRender();
  }

  function onSetFlattened(e: MouseEvent & { redraw: boolean }) {
    e.redraw = false;
    displayStyle = 'flattened';

    onRender();
  }

  return {
    oninit: ({ attrs }) => {
      currentAttrs = attrs;

      onRender(false);
    },
    onbeforeupdate: ({ attrs }) => {
      if (attrs.o.value !== value) {
        value = attrs.o.value as JSONObject;

        onRender(true);
      }
    },
    view: ({ attrs: { o } }) => {
      const actions: m.Children[] = [];
      let children: m.Children;
      let actionValueAction: m.Children;

      if (displayStyle === 'component') {
        children = m('.oct-debug-body', o.default());
      } else {
        children = m('.oct-debug-body', rendered);
      }

      if (o.octironType === 'action' || o.octironType === 'action-selection') {
        actionValueAction = m('button.oct-button', { type: 'button', onclick: onSetActionValue }, 'Action value');
      }

      return m(
        'aside.oct-debug',
        m(
          '.oct-debug-controls',
          m(
            '.oct-button-group',
            m('button.oct-button', { type: 'button', onclick: onSetValue }, 'Value'),
            actionValueAction,
            m('button.oct-button', { type: 'button', onclick: onSetComponent }, 'Component'),
            m('button.oct-button', { type: 'button', onclick: () => console.debug(o) }, 'Log'),
            ...actions,
          ),
        ),
        children,
      );
    },
  };
};
