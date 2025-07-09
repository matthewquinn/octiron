import type { JSONObject } from "./types/common.ts";
import type { EntityState, FailureEntityState, Method, OctironStore, ReadonlySelectionResult, SelectionDetails, SuccessEntityState } from './types/store.ts';
import { flattenIRIObjects } from './utils/flattenIRIObjects.ts';
import { getSelection } from './utils/getSelection.ts';
import { jsonLDHandler } from './handlers/jsonLDHandler.ts';
import { ContentHandlingFailure, HTTPFailure } from "./failures.ts";
import { isBrowserRender } from "./consts.ts";


export type Aliases = Record<string, string>;

export type Headers = Record<string, string>;

export type Origins = Record<string, Headers>;

export type OutputTypes =
  | 'jsonld'
  | 'problem-details'
;

export type ContentTypeHandler = (args: {
  res: Response;
  store: OctironStore;
}) => Promise<{
  value: JSONObject;
  outputType: OutputTypes;
}>;


export type Handlers = Record<string, ContentTypeHandler>;

export type FetcherArgs = {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
};

export type Fetcher = (iri: string, args: FetcherArgs) => Promise<Response>;

export type ResponseHook = (res: Promise<Response>) => void;


export function makeStore({
  rootIRI,
  vocab,
  responseHook,
  ...args
}: {
  rootIRI: string;
  vocab?: string;
  aliases?: Aliases;
  headers?: Headers;
  origins?: Origins;
  handlers?: Handlers;
  entities?: Record<string, EntityState>;
  fetcher?: Fetcher;
  responseHook?: ResponseHook;
}): OctironStore {
  const context: Record<string, string> = {};
  const headers = args.headers ?? {};
  const handlers: Handlers = args.handlers ?? {};
  const origins = new Map([
    [rootIRI, headers],
    ...Object.entries(Object.assign({}, args.origins)),
  ]);
  const entities = args.entities ?? {};
  const aliases = args.aliases ?? {};
  const fetcher = args.fetcher ?? fetch;


  if (typeof vocab === 'string') {
    context['@vocab'] = vocab;
  }

  if (typeof args.aliases !== 'undefined') {
    for (const [key, value] of Object.entries(args.aliases)) {
      context[key] = value;
    }
  }

  const store = {
    rootIRI,
    vocab,
    aliases,
    entities,
    context,
  } as OctironStore;

  if (handlers['application/ld+json'] == null) {
    handlers['application/ld+json'] = jsonLDHandler;
  }

  const dependentsMapper: Record<string, symbol[]> = {};
  const listenersMapper: Record<
    symbol,
    {
      key: symbol;
      selector?: string;
      value?: JSONObject;
      required: string[];
      dependencies: string[];
      listener: (details: SelectionDetails<ReadonlySelectionResult>) => void;
      cleanup: () => void;
    }
  > = {};

  function makeCleanupFn({
    key,
    details,
  }: {
    key: symbol;
    details: SelectionDetails;
  }) {
    return function cleanup() {
      delete listenersMapper[key];

      for (const dependency of details.dependencies) {
        if (typeof dependentsMapper[dependency] === 'undefined') {
          continue;
        }
        const index = dependentsMapper[dependency].indexOf(key);

        dependentsMapper[dependency].splice(index, 1);

        if (isBrowserRender && dependentsMapper[dependency].length === 0) {
          delete entities[dependency];
        }
      }
    };
  }

  function publish(iri: string) {
    const keys = [...(dependentsMapper[iri] || [])];

    for (const key of keys) {
      const { selector, value, listener } = listenersMapper[key];

      const details = getSelection<ReadonlySelectionResult>({
        selector,
        value,
        store,
      } as Parameters<typeof getSelection>[0]);
      const cleanup = makeCleanupFn({ key, details });

      // track each dependency using the key so updates can easliy be published
      for (const dependency of details.dependencies) {
        if (!Array.isArray(dependentsMapper[dependency])) {
          dependentsMapper[dependency] = [key];
        } else {
          dependentsMapper[dependency].push(key);
        }
      }

      listenersMapper[key].cleanup = cleanup;

      listener(details);
    }
  }

  async function callFetcher(iri: string, args: {
    method?: Method;
    headers?: Headers;
    body?: string;
  } = {}): Promise<void> {
    const url = new URL(iri);

    if (!origins.has(url.origin)) {
      // don't allow requests to un-configured servers
      throw new Error(`Unconfigured origin`);
    }

    if (entities[iri]) {
      return;
    }

    entities[iri] = {
      iri,
      loading: true,
    };

    const promise = new Promise<Response>((resolve) => {
      setTimeout(async () => {
        const res = await fetcher(iri, {
          method: args.method ?? 'get',
          headers: Object.assign({}, origins.get(iri), args.headers),
          body: args.body,
        });

        const contentType = res.headers.get('content-type')?.split(';')[0];

        if (contentType == null) {
          throw new Error('No content type');
        }

        if (
          contentType === null || handlers[contentType] === null
        ) {
          const error = new Error(`Unsupported content type ${contentType}`);
          const reason = new ContentHandlingFailure(error);

          entities[iri] = {
            iri,
            loading: false,
            ok: false,
            value: {},
            status: res.status,
            contentType,
            reason,
          };

          return;
        }

        try {
          const { outputType, value } = await handlers[contentType]({
            res,
            store,
          });

          const iris = [iri];

          if (res.ok) {
            entities[iri] = {
              iri,
              loading: false,
              ok: true,
              value,
              contentType,
            };
          } else {
            const reason = new HTTPFailure(res.status, res);

            entities[iri] = {
              iri,
              loading: false,
              ok: false,
              value,
              status: res.status,
              contentType,
              reason,
            };
          }

          if (outputType === 'jsonld') {
            for (const entity of flattenIRIObjects(value)) {
              if (iris.includes(entity['@id'])) {
                continue;
              }

              entities[entity['@id']] = {
                iri: entity['@id'],
                loading: false,
                ok: true,
                value: entity,
                contentType,
              };
            }
          }

          for (const iri of iris) {
            publish(iri);
          }
        } catch (err) {
          console.error(err);
        }

        resolve(res);
      });
    });

    if (typeof responseHook === 'function') {
      responseHook(promise);
    }

    await promise;
  };

  store.fetch = async function(iri: string) {
    await callFetcher(iri);

    return entities[iri] as SuccessEntityState | FailureEntityState;
  } satisfies OctironStore['fetch'];

  store.expand = function (term) {
    if (term.includes(':')) {
      const [alias, rest] = term.split(':');

      return `${aliases[alias]}${rest}`;
    } else if (typeof vocab !== 'string') {
      return term;
    }

    return `${vocab}${term}`;
  } satisfies OctironStore['expand'];

  store.select = (selector, value) => {
    return getSelection({
      selector,
      value,
      store,
    });
  };

  store.subscribe = function ({ key, selector, value, listener }) {
    const details = getSelection<ReadonlySelectionResult>({
      selector,
      value,
      store,
    });

    const cleanup = makeCleanupFn({ key, details });

    // track each dependency using the key so updates can easliy be published
    for (const dependency of details.dependencies) {
      if (!Array.isArray(dependentsMapper[dependency])) {
        dependentsMapper[dependency] = [key];
      } else {
        dependentsMapper[dependency].push(key);
      }
    }

    listenersMapper[key] = {
      key,
      selector,
      value,
      required: details.required,
      dependencies: details.dependencies,
      listener,
      cleanup,
    };

    return details;
  } satisfies OctironStore['subscribe'];

  store.unsubscribe = function (key: symbol) {
    listenersMapper[key]?.cleanup();
  } satisfies OctironStore['unsubscribe'];


  if (typeof vocab === 'string') {
    context['@vocab'] = vocab;
  }

  for (const [key, value] of Object.entries(aliases)) {
    context[key] = value;
  }

  if (headers.accept == null) {
    headers['accept'] = 'application/ld+json';
  }

  return store;
}
