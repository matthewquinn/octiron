import { OctironStore } from "octiron";
import { AlternativesStateStore, EntitiesStateStore, LoadingStateStore } from "./types/store.ts";
import { ContentTypes } from "./contentTypes.ts";


enum InitialStateIds {
  Primary = 'octiron-primary',
  HTML = 'octiron-html',
};

export type StoreArgs = {
  rootIRI: string;
  vocab?: string;
  aliases?: Record<string, string>;
  contentTypes?: ContentTypes;
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
    }

    public toInitialState(): string {

    }

}
