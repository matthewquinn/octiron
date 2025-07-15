import { isBrowserRender } from "consts";
import m from 'mithril';
import { AlternativeState } from "../types/store.ts";

export type AlternativeHandler<Alternative> = (res: Response) => Promise<Alternative>;
export type HTMLFragmentsAlternativeOnRemove = () => void;
export type HTMLFragmentsAlternativeOnCreate = (el: Element) => HTMLFragmentsAlternativeOnRemove;

export type HTMLFragmentsAlternativeComponentAttrs = {
  fragment?: string;
  rootHTML?: string;
  fragmentsHTML: Record<string, string>;
  rootEl?: Element;
  fragmentEls?: Record<string, Element>;
};

export type HTMLFragmentsAlternativeComponentType = m.ComponentTypes<HTMLFragmentsAlternativeComponentAttrs>;

export const HTMLFragmentsAlternativeComponent: HTMLFragmentsAlternativeComponentType = () => {
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

export type HTMLFragmentsAlternativeArgs = {
  iri: string;
  contentType: string;
  root?: string;
  ided?: Record<string, string>;
  anon?: Record<string, string>;
};

export class HTMLFragmentsAlternative implements AlternativeState {
  static type = 'html-fragments';

  #rendered: Set<string> = new Set();
  #iri: string;
  #fragment?: string;
  #contentType: string;
  #rootHTML?: string;
  #idedHTML: Record<string, string>;
  #anonHTML: Record<string, string>;
  #fragmentsHTML: Record<string, string>;

  constructor({
    iri,
    contentType,
    root,
    ided,
    anon,
  }: HTMLFragmentsAlternativeArgs) {
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

  public render() {
    return m(HTMLFragmentsAlternativeComponent, {
      rootHTML: this.#rootHTML,
      fragmentsHTML: this.#fragmentsHTML,
    });
  }

  public getStateInfo() {
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
      html += `<template id="htmlfrag:${this.#iri}|${this.#contentType}|${fragment}">${fragmentHTML}</template>\n`;
    }

    return html;
  }

  static fromInitialState(
    iri: string,
    contentType: string,
    hasRoot: boolean,
    ided: string[],
    anon: string[],
  ): HTMLFragmentAlternative | null {
    let el: Element | null;
    let rootHTML: string | undefined;
    const idedHTML: Record<string, string> = {};
    const anonHTML: Record<string, string> = {};

    if (hasRoot) {
      el = document.getElementById(`htmlfrag:${iri}|${contentType}`);

      if (el) {
        rootHTML = el.outerHTML;
      }
    }

    for (const fragment of ided) {
      el = document.getElementById(fragment) as HTMLElement;

      if (el instanceof HTMLTemplateElement) {
        const dom = el.cloneNode(true) as HTMLElement;
        idedHTML[fragment] = dom.innerHTML;
      } else {
        idedHTML[fragment] = el.innerHTML;
      }
    }

    for (const fragment of anon) {
      el = document.getElementById(`htmlfrag:${`)
    }

    return null;
  }

}
