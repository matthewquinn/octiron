import m from 'mithril';
import type { AnyComponent, Octiron } from "../types/octiron.ts";
import { OctironDebug } from "./OctironDebug.ts";


export type OctironExplorerAttrs = {
  autofocus?: boolean;
  selector?: string;
  presentationStyle?: 'debug' | 'components';
  childControls?: boolean;
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
  let value: string = attrs.selector || '';
  let previousSelector: string = value;
  let selector: string = value;
  let presentationStyle: 'debug' | 'components' = attrs.presentationStyle || 'debug';
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

  function onSetDebug(evt: Event) {
    evt.preventDefault();
    presentationStyle = 'debug';

    if (typeof onChange === 'function') {
      onChange(selector, presentationStyle);
    }
  }

  function onSetComponents(evt: Event) {
    evt.preventDefault();
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
      let upURL: URL;
      let debugURL: URL;
      let componentsURL: URL;

      if (selector.length !== 0 && presentationStyle === 'debug') {
        children = o.root(selector, (o) => m(OctironDebug, {
          o,
          selector,
          location: attrs.location,
          initialPresentaionStyle: attrs.presentationStyle,
          availableControls: !!attrs.childControls == false ? undefined : [],
        }));
      } else if (selector.length !== 0) {
        children = o.root(
          selector,
          (o) =>
            m('div', o.default({ fallbackComponent, attrs: { selector } })),
        );
      } else if (presentationStyle === 'debug') {
        children = o.root((o) => m(OctironDebug, {
          o, selector,
          location: attrs.location,
          initialPresentaionStyle: attrs.presentationStyle,
          availableControls: !!attrs.childControls ? undefined : [],
        }));
      } else {
        children = o.root((o) =>
          m('div', o.default({ fallbackComponent, attrs: { selector } }))
        );
      }

      if (attrs.location != null && selector.length !== 0) {
        const upSelector =
          attrs.selector.trim().includes(' ')
            ? attrs.selector.replace(/\s+([^\s]+)$/, '')
            : '';
        
        upURL = new URL(attrs.location);
        if (upSelector != null) {
          upURL.searchParams.set('selector', upSelector);
        } else {
          upURL.searchParams.delete('selector');
        }
      }

      if (attrs.location != null) {
        debugURL = new URL(attrs.location);
        componentsURL = new URL(attrs.location);

        debugURL.searchParams.set('presentationStyle', 'debug');
        componentsURL.searchParams.set('presentationStyle', 'components');
      }

      return m('.oct-explorer', m('.oct-explorer-controls',
          m('form.oct-form-group', {
            action: attrs.location?.toString?.(),
            onsubmit: (evt: Event) => {
              evt.preventDefault();

              onApply();
            },
          }, [
            upURL != null
              ? m('a.oct-button', { href: upURL.toString() }, 'Up')
              : m('button.oct-button', { type: 'button', disabled: true }, 'Up'),
            m('input', {
              name: 'selector',
              value,
              autofocus,
              oninput: onSearch,
              onkeypress: onEnter,
            }),
            m(
              'button.oct-button',
              {
                type: 'submit',
                disabled: selector === value && typeof window !== 'undefined',
              },
              'Apply',
            ),
          ]),

          m('.oct-button-group',
            presentationStyle === 'debug' || debugURL == null
              ? m('button.oct-button', {
                  type: 'button',
                  disabled: typeof window === 'undefined',
                  onclick: onSetDebug,
                }, 'Debug')
              : m('a.oct-button', {
                  href: debugURL.toString(),
                  onclick: onSetDebug,
                }, 'Debug'),

            presentationStyle === 'components' || componentsURL == null
              ? m('button.oct-button', {
                  type: 'button',
                  disabled: typeof window === 'undefined',
                  onclick: onSetComponents,
                }, 'Components')
              : m('a.oct-button', {
                  href: componentsURL.toString(),
                  onclick: onSetComponents,
                }, 'Components'),
          ),
        ),
        m('pre.oct-explorer-body', children),
      ); },
  };
};
