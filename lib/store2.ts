import { AlternativesStateStore, EntitiesStateStore, Handlers, IntegrationState, IntegrationStateInfo, IntegrationType, LoadingStateStore } from "./types/store.ts";
import { ContentTypes } from "./contentTypes.ts";
import { JSONArray, JSONObject, JSONValue } from "types/common";
import { HTMLFragmentsIntegration } from "./alternatives/htmlFragments.ts";
import { HTMLIntegration } from "./alternatives/html.ts";

const accept = 'application/problem+json, application/ld+json, text/lf';
const integrations = {
  [HTMLIntegration.type]: HTMLIntegration,
  [HTMLFragmentsIntegration.type]: HTMLFragmentsIntegration,
};


type StateInfo = {
  rootIRI: string;
  accept: string;
  vocab?: string;
  aliases?: Record<string, string>;
  primary: EntitiesStateStore;
  alternatives: Record<string, IntegrationStateInfo[]>;
};

export type StoreArgs = {
  /**
   * Root endpoint of the API.
   */
  rootIRI: string;

  /**
   * The default accept header to use when making requests.
   */
  accept?: string;
  vocab?: string;
  aliases?: Record<string, string>;
  contentTypes?: ContentTypes;
  primary?: EntitiesStateStore;
  alternatives?: AlternativesStateStore;
};

export class Store implements OctironStore {

    #rootIRI: string;
    #accept: string;
    #vocab?: string | undefined;
    #aliases: Record<string, string>;
    #primary: EntitiesStateStore = {};
    #loadingStore: LoadingStateStore = {};
    #alternatives: AlternativesStateStore = {};

    constructor(args: StoreArgs) {
      this.#rootIRI = args.rootIRI;
      this.#accept = args.accept ?? accept;
      this.#vocab = args.vocab;
      this.#aliases = args.aliases ?? {};
    }

    static readStateInfo(): StateInfo {
      const el = document.getElementById('oct-state-info') as HTMLScriptElement;

      return JSON.parse(el.innerText) as StateInfo;
    }

    static fromInitialState(...handlers: Handlers[]): Store {
      const stateInfo = Store.readStateInfo();
      const alternatives: AlternativesStateStore = {};
      const handlersMap: Record<string, Handlers> = handlers.reduce((acc, handler) => ({
        ...acc,
        [handler.contentType]: handler,
      }), {});

      for (const [integrationType, entities] of Object.entries(stateInfo.alternatives)) {
        for (const stateInfo of entities) {
          const handler = handlersMap[stateInfo.contentType];
          const cls = integrations[integrationType as IntegrationType];

          if (cls.type !== handler.integrationType) {
            continue;
          }

          // deno-lint-ignore no-explicit-any
          const state = cls.fromInitialState(handler as any, stateInfo as any);

          if (state == null) {
            continue;
          }

          if (alternatives[state.contentType] == null) {
            alternatives[state.contentType] = { [state.iri]: state };
          } else {
            alternatives[state.contentType][state.iri] = state;
          }
        }
      }


      return new Store({
        rootIRI: stateInfo.rootIRI,
        accept: stateInfo.accept,
        vocab: stateInfo.vocab,
        aliases: stateInfo.aliases,
        primary: stateInfo.primary,
        alternatives,
      })
    }

    public toInitialState(): string {
      let html = '';
      const stateInfo: StateInfo = {
        rootIRI: this.#rootIRI,
        accept: this.#accept,
        vocab: this.#vocab,
        aliases: this.#aliases,
        primary: this.#primary,
        alternatives: {},
      };

      for (const alternative of Object.values(this.#alternatives)) {
        for (const integration of Object.values(alternative)) {
          if (stateInfo.alternatives[integration.integrationType] == null) {
            stateInfo.alternatives[integration.integrationType] = [
              integration.getStateInfo(),
            ];
          } else {
            stateInfo.alternatives[integration.integrationType].push(integration.getStateInfo());
          }

          html += integration.toInitialState();
        }
      }

      html += `<script id="oct-state-info" type="application/json">${JSON.stringify(stateInfo)}</script>`

      return html;
    }

}
