import m from 'mithril';
import type { HTMLFragmentsHandler, IntegrationState } from "../types/store.ts";
import type { Octiron } from "../types/octiron.ts";

export type HTMLFragmentsIntegrationComponentAttrs = {
  o: Octiron;
  fragment?: string;
  rootHTML?: string;
  fragmentsHTML: Record<string, string>;
  rootEl?: Element;
  fragmentEls?: Record<string, Element>;
};

export type HTMLFragmentsIntegrationComponentType = m.ComponentTypes<HTMLFragmentsIntegrationComponentAttrs>;

export const HTMLFragmentsIntegrationComponent: HTMLFragmentsIntegrationComponentType = () => {
  return {
    view({ attrs: { fragment, rootHTML, fragmentsHTML }}) {
      const html = fragment == null ? rootHTML : fragmentsHTML[fragment];

      if (html == null) {
        return null;
      }

      return m.trust(html);
    },
  }
};

export type HTMLFragmentsIntegrationArgs = {
  iri: string;
  contentType: string;
  root?: string;
  ided?: Record<string, string>;
  anon?: Record<string, string>;
};

type HTMLFragmentsStateInfo = {
  iri: string,
  contentType: string,
  hasRoot: boolean;
  ided: string[];
  anon: string[];
};

export class HTMLFragmentsIntegration implements IntegrationState {
  static type = 'html-fragments' as const;

  readonly integrationType = 'html-fragments' as const;
  #handler: HTMLFragmentsHandler;
  #rendered: Set<string> = new Set();
  #iri: string;
  #fragment?: string;
  #contentType: string;
  #rootHTML?: string;
  #idedHTML: Record<string, string>;
  #anonHTML: Record<string, string>;
  #fragmentsHTML: Record<string, string>;

  constructor(handler: HTMLFragmentsHandler, {
    iri,
    contentType,
    root,
    ided,
    anon,
  }: HTMLFragmentsIntegrationArgs) {
    this.#handler = handler;
    this.#iri = iri;
    this.#contentType = contentType;
    this.#rootHTML = root;
    this.#idedHTML = ided ?? {};
    this.#anonHTML = anon ?? {};
    this.#fragmentsHTML = {
      ...anon,
      ...ided,
    };
  }

  get iri(): string {
    return this.#iri;
  }

  get contentType(): string {
    return this.#contentType;
  }

  public render(o: Octiron) {
    return m(HTMLFragmentsIntegrationComponent, {
      o,
      rootHTML: this.#rootHTML,
      fragmentsHTML: this.#fragmentsHTML,
    });
  }

  public getStateInfo(): HTMLFragmentsStateInfo {
    return {
      iri: this.#iri,
      contentType: this.#contentType,
      hasRoot: this.#rootHTML != null,
      ided: Object.keys(this.#idedHTML),
      anon: Object.keys(this.#anonHTML),
    };
  }

  public toInitialState(): string {
    let html = '';

    if (this.#rootHTML != null) {
      html += `<template id="htmlfrag:${this.#iri}|${this.#contentType}">${this.#rootHTML}</template>\n`;
    }

    for (const [fragment, fragmentHTML] of Object.entries(this.#idedHTML)) {
      if (!this.#rendered.has(fragment)) {
        html += `<template id="htmlfrag:${this.#iri}|${this.#contentType}|${fragment}">${fragmentHTML}</template>\n`;
      }
    }

    for (const [fragment, fragmentHTML] of Object.entries(this.#anonHTML)) {
      html += `<template id="htmlfrag:${this.#iri}#${fragment}|${this.#contentType}">${fragmentHTML}</template>\n`;
    }

    return html;
  }

  static fromInitialState(handler: HTMLFragmentsHandler, {
    iri,
    contentType,
    hasRoot,
    ided,
    anon,
  }: HTMLFragmentsStateInfo): HTMLFragmentsIntegration | null {
    let rootHTML: string | undefined;
    const idedHTML: Record<string, string> = {};
    const anonHTML: Record<string, string> = {};

    if (hasRoot) {
      const rootEl = document.getElementById(`htmlfrag:${iri}|${contentType}`);

      if (rootEl) {
        rootHTML = rootEl.outerHTML;
      }
    }

    for (const fragment of ided) {
      const el = document.getElementById(fragment) as HTMLElement | SVGElement;

      if (el instanceof HTMLTemplateElement) {
        const dom = el.cloneNode(true) as HTMLElement | SVGAElement;

        idedHTML[fragment] = dom.innerHTML;
      } else {
        idedHTML[fragment] = el.innerHTML;
      }
    }

    for (const fragment of anon) {
      const el = document.getElementById(`htmlfrag:${iri}#${fragment}|${contentType}`) as HTMLElement | SVGElement;

      if (el instanceof HTMLTemplateElement) {
        const dom = el.cloneNode(true) as HTMLElement | SVGAElement;

        idedHTML[fragment] = dom.innerHTML;
      } else {
        idedHTML[fragment] = el.innerHTML;
      }
    }

    return new HTMLFragmentsIntegration(handler, {
      contentType,
      iri,
      root: rootHTML,
      ided: idedHTML,
      anon: anonHTML,
    });
  }
}
