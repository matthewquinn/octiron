import m from 'mithril';
import * as jsonld from 'jsonld';
import { flattenIRIObjects } from "utils/flattenIRIObjects";
import { mithrilRedraw } from "utils/mithrilRedraw";
import type { JSONObject, JSONValue } from "../types/common.ts";
import type { Octiron } from "../types/octiron.ts";
import { OctironJSON } from "./OctironJSON.ts";

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
  let displayStyle: 'value' | 'component' | 'expanded' | 'flattened' = 'value';

  async function onRender(redraw: boolean = true) {
    if (displayStyle === 'value') {
      rendered = m(OctironJSON, { value, selector: currentAttrs.selector, location: currentAttrs.location });
    } else if (displayStyle === 'expanded') {
      const expanded = (await jsonld.expand({
        '@context': currentAttrs.o.store.context,
        ...(value as JSONObject),
      })) as JSONValue;

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

      if (displayStyle === 'component') {
        children = m('.oct-debug-body', o.default());
      } else {
        children = m('.oct-debug-body', rendered);
      }

      return m(
        'aside.oct-debug',
        m(
          '.oct-debug-controls',
          m(
            '.oct-button-group',
            m('button.oct-button', { onclick: onSetValue }, 'Value'),
            m('button.oct-button', { onclick: onSetComponent }, 'Component'),
            m('button.oct-button', { onclick: onSetExpanded }, 'Expanded'),
            m('button.oct-button', { onclick: onSetFlattened }, 'Flattened'),
            ...actions,
          ),
        ),
        children,
      );
    },
  };
};
