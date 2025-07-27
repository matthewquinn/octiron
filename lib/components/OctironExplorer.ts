import m from 'mithril';
import type { AnyComponent, Octiron } from "../types/octiron.ts";
import { OctironDebug } from "./OctironDebug.ts";


export type OctironExplorerAttrs = {
  selector?: string;
  presentationStyle?: 'debug' | 'components';
  autofocus?: boolean;
  onChange?: (
    selector: string,
    presentationStyle: 'debug' | 'components',
  ) => void;
  location?: URL;
  o: Octiron;
};

export const OctironExplorer: m.ClosureComponent<OctironExplorerAttrs> = ({
  attrs,
}) => {
  let value: string = (attrs.selector ??= '');
  let previousSelector: string = value;
  let selector: string = value;
  let presentationStyle: 'debug' | 'components' =
    (attrs.presentationStyle ??= 'debug');
  let onChange = attrs.onChange;
  const fallbackComponent: AnyComponent = {
    view: ({ attrs: { o } }) => {
      return m(OctironDebug, { o, location: attrs.location });
    },
  };

  function onSearch(evt: KeyboardEvent) {
    value = (evt.target as HTMLInputElement).value;
  }

  function onEnter(evt: KeyboardEvent) {
    if (evt.key === 'Enter') {
      onApply();
    }
  }

  function onApply() {
    selector = value;

    if (typeof onChange === 'function') {
      onChange(selector, presentationStyle);
    }
  }

  function onSetDebug() {
    presentationStyle = 'debug';

    if (typeof onChange === 'function') {
      onChange(selector, presentationStyle);
    }
  }

  function onSetComponents() {
    presentationStyle = 'components';

    if (typeof onChange === 'function') {
      onChange(selector, presentationStyle);
    }
  }

  return {
    oninit: ({ attrs }) => {
      onChange = attrs.onChange;
    },
    onbeforeupdate: ({ attrs }) => {
      selector = attrs.selector ?? '';

      if (selector !== previousSelector) {
        value = previousSelector = selector;
      }
      
      onChange = attrs.onChange;
    },
    view: ({ attrs: { autofocus, o } }) => {
      let children: m.Children;

      if (selector.length !== 0 && presentationStyle === 'debug') {
        children = o.root(selector, (o) => m(OctironDebug, { o, selector, location: attrs.location }));
      } else if (selector.length !== 0) {
        children = o.root(
          selector,
          (o) =>
            m('div', o.default({ fallbackComponent, attrs: { selector } })),
        );
      } else if (presentationStyle === 'debug') {
        children = o.root((o) => m(OctironDebug, { o, selector, location: attrs.location }));
      } else {
        children = o.root((o) =>
          m('div', o.default({ fallbackComponent, attrs: { selector } }))
        );
      }

      return m('.oct-explorer', m('.oct-explorer-controls',
          m('.oct-form-group', [
            m('input', {
              value,
              autofocus,
              oninput: onSearch,
              onkeypress: onEnter,
            }),
            m(
              'button.oct-button',
              {
                disabled: selector === value,
                onclick: onApply,
              },
              'Apply',
            ),
          ]),
          m('.oct-button-group',
            m(
              'button.oct-button',
              {
                disabled: presentationStyle === 'debug',
                onclick: onSetDebug,
              },
              'Debug',
            ),
            m(
              'button.oct-button',
              {
                disabled: presentationStyle === 'components',
                onclick: onSetComponents,
              },
              'Components',
            ),
          ),
        ),
        m('pre.oct-explorer-body', children),
      );
    },
  };
};
