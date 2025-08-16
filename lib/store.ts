import type { AlternativesState, Context, PrimaryState, Fetcher, Handler, IntegrationStateInfo, IntegrationType, JSONLDHandlerResult, ReadonlySelectionResult, ResponseHook, SelectionDetails, SelectionListener, EntityState, SubmitArgs, Aliases, EntitySelectionResult, ValueSelectionResult } from "./types/store.ts";
import { HTMLFragmentsIntegration } from "./alternatives/htmlFragments.ts";
import { HTMLIntegration } from "./alternatives/html.ts";
import { isBrowserRender } from "./consts.ts";
import type { JSONObject } from "./types/common.ts";
import { HTTPFailure } from "./failures.ts";
import { flattenIRIObjects } from "./utils/flattenIRIObjects.ts";
import { getSelection } from './utils/getSelection.ts';
import type { FailureEntityState, SuccessEntityState } from "./types/store.ts";
import { mithrilRedraw } from "./utils/mithrilRedraw.ts";

const defaultAccept = 'application/problem+json, application/ld+json, text/lf';
const integrationClasses = {
  [HTMLIntegration.type]: HTMLIntegration,
  [HTMLFragmentsIntegration.type]: HTMLFragmentsIntegration,
};

type StateInfo = {
  primary: Record<string, EntityState>;
  alternatives: Record<string, IntegrationStateInfo[]>;
};

type Dependencies = Map<string, Set<symbol>>;
type Listener = (details: SelectionDetails<ReadonlySelectionResult>) => void;
type ListenerDetails = {
  key: symbol;
  selector?: string;
  value?: JSONObject;
  required: string[];
  dependencies: string[];
  listener: Listener;
  cleanup: () => void;
};
type Listeners = Map<symbol, ListenerDetails>;

function getJSONLdValues(vocab?: string, aliases?: Record<string, string>): [Map<string, string>, Context] {
  const aliasMap: Map<string, string> = new Map<string, string>();
  const context: Context = {};

  if (vocab != null) {
    context['@vocab'] = vocab;
  }

  if (aliases == null) {
    return [aliasMap, context];
  }

  for (const [key, value] of Object.entries(aliases)) {
    context[key] = value;
    aliasMap.set(key, value);
  }

  return [aliasMap, context];
}

function getInternalHeaderValues(
  headers?: Record<string, string>,
  origins?: Record<string, Record<string, string>>,
): [Headers, Map<string, Headers>] {
  const internalHeaders = new Headers([['accept', defaultAccept ]]);
  const internalOrigins = new Map<string, Headers>();

  if (headers != null) {
    for (const [key, value] of Object.entries(headers)) {
      internalHeaders.set(key, value);
    }
  }

  if (origins != null) {
    for (const [origin, headers] of Object.entries(origins)) {
      const internalHeaders = new Headers([['accept', defaultAccept]]);

      for (const [key, value] of Object.entries(headers)) {
        internalHeaders.set(key, value);
      }

      internalOrigins.set(origin, internalHeaders);
    }
  }

  return [internalHeaders, internalOrigins];
}

export type StoreArgs = {
  /**
   * Root endpoint of the API.
   */
  rootIRI: string;

  /**
   * Headers to send when making requests to endpoints
   * sharing origins with the `rootIRI`.
   */
  headers?: Record<string, string>;

  /**
   * A map of origins and the headers to use when sending
   * requests to them. Octiron will only send requests
   * to endpoints which share origins with the `rootIRI`
   * or are configured in the origins object. Aside
   * from the accept header which has a common default
   * value, headers are not shared between origins.
   */
  origins?: Record<string, Record<string, string>>;

  /**
   * The JSON-ld @vocab to use for octiron selectors.
   */
  vocab?: string;

  /**
   * Map of JSON-ld aliases to their values.
   */
  aliases?: Record<string, string>;

  /**
   * Primary initial state.
   */
  primary?: Record<string, EntityState>;

  /**
   * Alternatives initial state.
   */
  alternatives?: AlternativesState;

  /**
   * Handler objects.
   */
  handlers: Handler[];

  /**
   * Function which performs fetch.
   */
  fetcher?: Fetcher;

  /**
   * Hook used by SSR for awaiting response promises.
   */
  responseHook?: ResponseHook;
};

export class Store {

    #rootIRI: string;
    #rootOrigin: string;
    #headers: Headers;
    #origins: Map<string, Headers>;
    #vocab?: string | undefined;
    #aliases: Map<string, string>;
    #primary: PrimaryState = new Map();
    #loading: Set<string> = new Set();
    #alternatives: AlternativesState = new Map();
    #handlers: Map<string, Handler>;
    #keys: Set<string> = new Set();
    #context: Context;
    #termExpansions: Map<symbol, string | null> = new Map();
    #fetcher?: Fetcher;
    #responseHook?: ResponseHook;
    #dependencies: Dependencies = new Map();
    #listeners: Listeners = new Map();

    constructor(args: StoreArgs) {
      this.#rootIRI = args.rootIRI;
      this.#rootOrigin = new URL(args.rootIRI).origin;
      this.#vocab = args.vocab;
      this.#fetcher = args.fetcher;
      this.#responseHook = args.responseHook;

      [this.#headers, this.#origins] = getInternalHeaderValues(args.headers, args.origins);
      [this.#aliases, this.#context] = getJSONLdValues(args.vocab, args.aliases);

      this.#handlers = new Map(args.handlers?.map?.((handler) => [handler.contentType, handler]));

      if (args.primary != null) {
        this.#primary = new Map(Object.entries(args.primary));
      }

      if (!this.#headers.has('accept')) {
        this.#headers.set('accept', defaultAccept);
      }

      for (const origin of Object.values(this.#origins)) {
        if (!origin.has('accept')) {
          origin.set('accept', defaultAccept);
        }
      }
    }

    public get rootIRI() {
      return this.#rootIRI;
    }

    public entity(iri: string) {
      return this.#primary.get(iri);
    }

    public get vocab(): string | undefined {
      return this.#vocab;
    }

    public get aliases(): Aliases {
      return Object.fromEntries(
        this.#aliases.entries()
          .map(([key, value]) => [key.replace(/^/, ''), value])
      );
    }


    public get context(): Context {
      return this.#context;
    }

    /**
     * Expands a term to a type.
     *
     * If an already expanded JSON-ld type is given it will
     * return the input value.
     */
    public expand(termOrType: string): string {
      const sym = Symbol.for(termOrType);
      const cached = this.#termExpansions.get(sym);

      if (cached != null) {
        return cached;
      }

      let expanded: string | undefined;

      if (this.#vocab != null && !/^[\w\d]+\:/.test(termOrType)) {
        expanded = this.#vocab + termOrType;
      } else if (/https?:\/\//.test(termOrType)) {
        // is a type
        expanded = termOrType;
      } else {
        for (const [key, value] of this.#aliases) {
          const reg = new RegExp(`^${key}:`);
          if (reg.test(termOrType)) {
            expanded = termOrType.replace(reg, value);
            break;
          }
        }
      }

      this.#termExpansions.set(sym, expanded ?? termOrType);

      return expanded ?? termOrType;
    }

    public select(selector: string, value?: JSONObject): SelectionDetails {
      return getSelection({
        selector,
        value,
        store: this,
      });
    }

    /**
     * Generates a unique key for server rendering only.
     */
    public key(): string {
      while (true) {
        const key = `oct-${Math.random().toString(36).slice(2, 7)}`;

        if (!this.#keys.has(key)) {
          this.#keys.add(key);

          return key;
        }
      }
    }

    /**
     * Creates a cleanup function which should be called
     * when a subscriber unlistens.
     */
    #makeCleanupFn(key: symbol, details: SelectionDetails) {
      return () => {
        this.#listeners.delete(key);

        for (const dependency of details.dependencies) {
          this.#dependencies.delete(dependency);

          if (isBrowserRender) {
            setTimeout(() => {
              if (this.#dependencies.get(dependency)?.size === 0) {
                this.#primary.delete(dependency);
              }
            }, 5000);
          }
        }
      }
    }

    /**
     * Creates a unique key for the ir, method and accept headers
     * to be used to mark the request's loading status.
     */
    #getLoadingKey(iri: string, method: string, accept?: string): string {
      accept = accept ?? this.#headers.get('accept') ?? defaultAccept;

      return `${method?.toLowerCase()}|${iri}|${accept.toLowerCase()}`;
    }

    public isLoading(iri: string): boolean {
      const loadingKey = this.#getLoadingKey(iri, 'get');

      return this.#loading.has(loadingKey);
    }

    /**
     * Called on change to an entity. All listeners with dependencies in their
     * selection for this entity have the latest selection result pushed to
     * their listener functions.
     */
    #publish(iri: string, _contentType?: string): void {
      const keys = this.#dependencies.get(iri);

      if (keys == null) {
        return;
      }

      for (const key of keys) {
        const listenerDetails = this.#listeners.get(key);

        if (listenerDetails == null) {
          continue;
        }

        const details = getSelection<EntitySelectionResult | ValueSelectionResult>({
          selector: listenerDetails.selector,
          value: listenerDetails.value,
          store: this,
        } as Parameters<typeof getSelection>[0]);
        const cleanup = this.#makeCleanupFn(key, details);

        for (const dependency of details.dependencies) {
          let depSet = this.#dependencies.get(dependency);

          if (depSet == null) {
            depSet = new Set([key]);

            this.#dependencies.set(dependency, depSet);
          } else {
            depSet.add(key);
          }
        }

        listenerDetails.cleanup = cleanup;
        listenerDetails.listener(details);
      }
    }

    #handleJSONLD({
      iri,
      res,
      output,
    }: {
      iri: string;
      res: Response;
      output: JSONLDHandlerResult,
    }): void {
      const iris = [iri];

      if (res.ok) {
        this.#primary.set(iri, {
          iri,
          loading: false,
          ok: true,
          value: output.jsonld,
        })
      } else {
        const reason = new HTTPFailure(res.status, res);

        this.#primary.set(iri, {
          iri,
          loading: false,
          ok: false,
          value: output.jsonld,
          status: res.status,
          reason,
        });
      }

      for (const entity of flattenIRIObjects(output.jsonld)) {
        if (iris.includes(entity['@id'])) {
          continue;
        }

        this.#primary.set(entity['@id'], {
          iri: entity['@id'],
          loading: false,
          ok: true,
          value: entity,
        });
      }

      for (const iri of iris) {
        this.#publish(iri);
      }
    }

    async handleResponse(res: Response, iri: string = res.url.toString()) {
      const contentType = res.headers.get('content-type')?.split?.(';')?.[0];

      if (contentType == null) {
        throw new Error('Content type not specified in response');
      }

      const handler = this.#handlers.get(contentType);

      if (handler == null) {
        throw new Error(`No handler configured for content type "${contentType}"`);
      }

      if (handler.integrationType === 'jsonld') {
        const output = await handler.handler({
          res,
          store: this,
        });

        this.#handleJSONLD({
          iri,
          res,
          output,
        });
      } else if (handler.integrationType === 'problem-details') {
        throw new Error('Problem details response types not supported yet');
      } else if (handler.integrationType === 'html') {
        const output = await handler.handler({
          res,
          store: this,
        });
        let integrations = this.#alternatives.get(contentType);

        if (integrations == null) {
          integrations = new Map();

          this.#alternatives.set(contentType, integrations);
        }

        integrations.set(iri, new HTMLIntegration(handler, {
          iri,
          contentType,
          html: output.html,
          id: output.id,
        }));
      } else if (handler.integrationType === 'html-fragments') {
        const output = await handler.handler({
          res,
          store: this,
        });
        let integrations = this.#alternatives.get(contentType);

        if (integrations == null) {
          integrations = new Map();

          this.#alternatives.set(contentType, integrations);
        }

        integrations.set(iri, new HTMLFragmentsIntegration(handler, {
          iri,
          contentType,
          root: output.html,
          ided: output.ided,
          anon: output.anon,
        }));
      }

      if (handler.integrationType !== 'jsonld') {
        this.#publish(iri, contentType);
      }
    }

    async #callFetcher(iri: string, args: {
      method?: string;
      accept?: string;
      body?: string;
    } = {}): Promise<void> {
      let headers: Headers;
      const url = new URL(iri);
      const method = args.method || 'get';
      const accept = args.accept ?? this.#headers.get('accept') ?? defaultAccept;
      const loadingKey = this.#getLoadingKey(iri, method, args.accept);

      if (url.origin === this.#rootOrigin) {
        headers = new Headers(this.#headers);
      } else if (this.#origins.has(url.origin)) {
        headers = new Headers(this.#origins.get(url.origin));
      } else {
        throw new Error('Unconfigured origin');
      }

      if (accept != null) {
        headers.set('accept', accept);
      } else if (headers.get('accept') == null) {
        headers.set('accept', defaultAccept);
      }

      this.#loading.add(loadingKey);

      mithrilRedraw();

      // This promise wrapping is so SSR can hook in and await the promise.
      const promise = new Promise<Response>((resolve) => {
        (async () => {
          let res: Response;

          if (this.#fetcher != null) {
            res =  await this.#fetcher(iri, {
              method,
              headers,
              body: args.body,
            });
          } else {
            res = await fetch(iri, {
              method,
              headers,
              body: args.body,
            });
          }

          await this.handleResponse(res, iri);

          this.#loading.delete(loadingKey);

          mithrilRedraw();

          resolve(res);
        })();
      });

      if (this.#responseHook != null) {
        this.#responseHook(promise);
      }

      await promise;
    }

    public subscribe({
      key,
      selector,
      value,
      listener,
    }: {
      key: symbol;
      selector: string;
      value?: JSONObject;
      listener: SelectionListener;
    }) {
      const details = getSelection<ReadonlySelectionResult>({
        selector,
        value,
        store: this,
      });

      const cleanup = this.#makeCleanupFn(key, details);

      for (const dependency of details.dependencies) {
        const depSet = this.#dependencies.get(dependency);

        if (depSet == null) {
          this.#dependencies.set(dependency, new Set([key]));
        } else {
          depSet.add(key);
        }
      }

      this.#listeners.set(key, {
        key,
        selector,
        value,
        required: details.required,
        dependencies: details.dependencies,
        listener,
        cleanup,
      });

      return details;
    }

    public unsubscribe(key: symbol) {
      this.#listeners.get(key)?.cleanup();
    }

    public async fetch(iri: string): Promise<SuccessEntityState | FailureEntityState> {
      await this.#callFetcher(iri);

      return this.#primary.get(iri) as SuccessEntityState | FailureEntityState;
    }

    /**
     * Submits an action. Like fetch this will overwrite
     * entities in the store with any entities returned
     * in the reponse.
     *
     * @param {string} iri                The iri of the request.
     * @param {SubmitArgs} [args]         Arguments to pass to the fetch call.
     * @param {string} [args.method]      The http submit method.
     * @param {string} [args.contentType] The content type header value.
     * @param {string} [args.body]        The body of the request.
     */
    public async submit(iri: string, args: SubmitArgs): Promise<SuccessEntityState | FailureEntityState> {
      await this.#callFetcher(iri, args);

      return this.entity(iri) as SuccessEntityState | FailureEntityState;
    }

    /**
     * Creates an Octiron store from initial state written to the page's HTML.
     *
     * @param rootIRI       The root endpoint of the API.
     * @param [disableLogs] Disables warning and error logs if the initial state
     *                      is not present or corrupt.
     * @param [vocab]       The JSON-ld @vocab to use for Octiron selectors.
     * @param [aliases]     The JSON-ld aliases to use for Octiron selectors.
     * @param [headers]     Headers to send when making requests to endpoints sharing
     *                      origins with the `rootIRI`.
     * @param [origins]     A map of origins and the headers to use when sending
     *                      requests to them. Octiron will only send requests
     *                      to endpoints which share origins with the `rootIRI`
     *                      or are configured in the origins object. Aside
     *                      from the accept header, which has a common default
     *                      value, headers are not shared between origins.
     */
    static fromInitialState({
      disableLogs,
      rootIRI,
      vocab,
      aliases,
      headers,
      origins,
      handlers = [],
    }: {
      disableLogs?: boolean;
      rootIRI: string;
      vocab?: string;
      aliases?: Record<string, string>;
      headers?: Record<string, string>;
      origins?: Record<string, Record<string, string>>;
      handlers?: Handler[];
    }): Store {
      const storeArgs = {
        rootIRI,
        vocab,
        aliases,
        handlers,
        headers,
        origins,
      };

      try {
        const el = document.getElementById('oct-state') as HTMLScriptElement;

        if (el == null) {
          if (!disableLogs) {
            console.warn('Failed to construct Octiron state from initial state');
          }

          return new Store(storeArgs);
        }

        const stateInfo = JSON.parse(el.innerText) as StateInfo;
        const alternatives: AlternativesState = new Map();
        const handlersMap: Record<string, Handler> = handlers.reduce((acc, handler) => ({
          ...acc,
          [handler.contentType]: handler,
        }), {});

        for (const [integrationType, entities] of Object.entries(stateInfo.alternatives)) {
          for (const stateInfo of entities) {
            const handler = handlersMap[stateInfo.contentType];
            const cls = integrationClasses[integrationType as IntegrationType];

            if (cls.type !== handler.integrationType) {
              continue;
            }

            // deno-lint-ignore no-explicit-any
            const state = cls.fromInitialState(handler as any, stateInfo as any);

            if (state == null) {
              continue;
            }

            let integrations = alternatives.get(state.contentType);

            if (integrations == null) {
              integrations = new Map();

              alternatives.set(state.contentType, integrations);
            }

            integrations.set(state.iri, state);
          }
        }

        return new Store({
          ...storeArgs,
          alternatives,
          primary: stateInfo.primary,
        });
      } catch (err) {
        if (!disableLogs) {
          console.warn('Failed to construct Octiron state from initial state');
          console.error(err)
        }

        return new Store(storeArgs);
      }
    }

    /**
     * Writes the Octiron store's state to a string to be embedded
     * near the end of a HTML document. Ideally this is placed before
     * the closing of the document's body tag. Octiron uses ids prefixed
     * with `oct-`, avoid using these ids to prevent id collision.
     */
    public toInitialState(): string {
      let html = '';
      const stateInfo: StateInfo = {
        primary: Object.fromEntries(this.#primary),
        alternatives: {},
      };

      for (const alternative of this.#alternatives.values()) {
        for (const integration of alternative.values()) {
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

      html += `<script id="oct-state" type="application/json">${JSON.stringify(stateInfo)}</script>`

      return html;
    }

}
