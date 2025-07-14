import { OctironStore } from "octiron";
import { AlternativesStateStore, EntitiesStateStore, LoadingStateStore } from "./types/store.ts";


enum InitialStateIds {
  Primary = 'octiron-primary',
  HTML = 'octiron-html',
};

export type StoreArgs = {
    rootIRI: string;
    vocab?: string;
    aliases?: Record<string, string>;
};

export class Store implements OctironStore {

    #rootIRI: string;
    #vocab?: string | undefined;
    #aliases: Record<string, string>;
    #primaryStore: EntitiesStateStore = {};
    #loadingStore: LoadingStateStore = {};
    #alternativesStore: AlternativesStateStore = {};

    constructor(args: StoreArgs) {
      this.#rootIRI = args.rootIRI;
      this.vocab = args.vocab;
      this.aliases = args.aliases ?? {};
    }

    static fromInitialState(): Store {
      document.querySelector(`[data-octiron-html][data-iri=""`)
    }

    public toInitialState(): string {
      let html = `<script id="${InitialStateIds.Primary}" type="application/json">${JSON.stringify(this.#primaryStore)}</script>\n`;

      for (const alternative of Object.values(this.#alternativesStore)) {
        for (const state of Object.values(alternative)) {
          if (state.type === 'html' && state.rendered) {
            
          }
        }
      }
      
      return html;
    }

}
