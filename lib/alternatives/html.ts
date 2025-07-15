import { isBrowserRender } from "consts";
import m from 'mithril';
import { AlternativeState } from "../types/store.ts";

export type AlternativeHandler<Alternative> = (res: Response) => Promise<Alternative>;
export type HTMLAlternativeOnRemove = () => void;
export type HTMLAlternativeOnCreate = (el: Element) => HTMLAlternativeOnRemove;

export type HTMLAlternativeComponentAttrs = {
  html: string;
  el?: Element;
  onCreate?: HTMLAlternativeOnCreate;
};

export type HTMLAlternativeComponentType = m.ComponentTypes<HTMLAlternativeComponentAttrs>;

export const HTMLAlternativeComponent: HTMLAlternativeComponentType = () => {
  let onRemove: HTMLAlternativeOnRemove | undefined;

  return {
    oncreate({ dom, attrs: { el, onCreate } }) {
      if (el != null) {
        dom.append(el);
      }

      if (onCreate != null) {
        onRemove = onCreate(el ?? dom)
      }
    },
    onbeforeremove() {
      if (onRemove != null) {
        onRemove();
      }
    },
    view({ attrs: { html, el }}) {
      if (el != null) {
        return null;
      }

      return m.trust(html);
    },
  }
};

export type HTMLAlternativeArgs = {
  iri: string;
  contentType: string;
  html: string;
  id?: string;
  el?: Element;
  onCreate?: HTMLAlternativeOnCreate;
};

export class HTMLAlternative implements AlternativeState {
  static type = 'html';

  #rendered: boolean = false;
  #iri: string;
  #contentType: string;
  #html: string;
  #id: string | undefined;
  #el: Element | undefined;
  #onCreate: HTMLAlternativeOnCreate | undefined;

  constructor({
    iri,
    contentType,
    html,
    onCreate,
    id,
    el,
  }: HTMLAlternativeArgs) {
    this.#iri = iri;
    this.#contentType = contentType;
    this.#html = html;
    this.#onCreate = onCreate;
    this.#id = id;
    this.#el = el;
  }

  public render() {
    if (!isBrowserRender && !this.#rendered) {
      this.#rendered = true;
    }

    return m(HTMLAlternativeComponent, {
      html: this.#html,
      el: this.#el,
      onCreate: this.#onCreate,
    });
  }

  public getStateInfo() {
    return {
      iri: this.#iri,
      contentType: this.#contentType,
      id: this.#id,
    };
  }

  public toInitialState(): string {
    if (this.#id != null && this.#rendered) {
      return '';
    }

    return `<template id="html:${this.#iri}|${this.#contentType}">${this.#html}</template>`;
  }

  static fromInitialState(
    iri: string,
    contentType: string,
    onCreate: HTMLAlternativeOnCreate,
    id?: string,
  ): HTMLAlternative | null {
    let el: Element | null = null;

    if (id != null) {
      el = document.getElementById(id);
    }

    if (el != null) {
      return new HTMLAlternative({
        iri,
        contentType,
        html: el.outerHTML,
        onCreate,
        id,
        el,
      });
    }

    el = document.getElementById(`html:${iri}|${contentType}`);

    if (el instanceof HTMLTemplateElement) {
      el = el.cloneNode(true) as HTMLElement;

      return new HTMLAlternative({
        iri,
        contentType,
        html: el.outerHTML,
        onCreate,
        id,
        el,
      });
    }

    return null;
  }

}
