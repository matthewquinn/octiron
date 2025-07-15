import type { Children, ComponentTypes } from 'mithril';
import type { JSONObject, JSONValue } from './common.ts';


export type Aliases = Record<string, string>;

export type Headers = Record<string, string>;

export type Origins = Record<string, Headers>;

export type ContentTypeOutputs =
  | 'jsonld'
  | 'problem-details'
  | 'html'
  | 'html-fragments'
;

export type ContentTypeHandlerArgs = {
  res: Response;
  store: OctironStore;
};

export type CleanupFn = () => void;

export type HandlerCallback = (el: HTMLElement) => CleanupFn;

export type JSONLDContentTypeResult = {
  outputType: 'jsonld';
  value: JSONObject;
};

export type ProblemDetailsContentTypeResult = {
  outputType: 'problem-details';
  value: JSONObject;
};

export type HTMLContentTypeResult = {
  outputType: 'html';
  id: string;
  html: string;
  callback?: HandlerCallback;
};

export type HTMLFragmentsContentTypeResult = {
  outputType: 'html-fragments';
  rootId?: string;
  root?: string;
  ided: Record<string, string>;
  anon: Record<string, string>;
  callback?: HandlerCallback;
};

export type ContentTypeResult =
  | JSONLDContentTypeResult
  | ProblemDetailsContentTypeResult
  | HTMLContentTypeResult
  | HTMLFragmentsContentTypeResult
;

export type ContentTypeHandler = (args: ContentTypeHandlerArgs) => Promise<ContentTypeResult>;


export type Handlers = Record<string, ContentTypeHandler>;

export type FetcherArgs = {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
};

export type Fetcher = (iri: string, args: FetcherArgs) => Promise<Response>;

export type ResponseHook = (res: Promise<Response>) => void;



export type HTTPErrorView = (status: number) => Children;

export type ContentParsingView = (error: Error) => Children;

export type AlternativeContentProps = {
  fragment?: string;
};

export type AlternativeContentComponent = ComponentTypes<AlternativeContentProps>;

export interface Failure {

  /**
   * Returns the given children if the error is
   * of the undefined variety.
   */
  undefined(children: Children): Children;

  /**
   * Returns the given children if the error is
   * of the http variety.
   */
  http(children: Children): Children;

  /**
   * Returns the given children if the error is
   * of the http variety.
   */
  http(view: HTTPErrorView): Children;

  /**
   * Returns the given children if the error is
   * of the content parsing variety.
   */
  unparserable(children: Children): Children;

  /**
   * Returns the given chidlren if the error is
   * of the content parsing variety.
   */
  unparserable(view: ContentParsingView): Children;
}

export type EntitySelectionResult = {
  /**
   * A unique key for identifing this selection result.
   * Useful for caching objects which use the result.
   */
  readonly key: symbol;

  /**
   * A json pointer referencing the item within the parent value.
   */
  readonly pointer: string;

  /**
   * The type of the selection result. Value 'entity' indicates
   * the value has an iri and can be fetched. The value `value`
   * indicates the value is found in the body of an entity.
   */
  readonly type: 'entity';

  /**
   * The IRI of the entity.
   */
  readonly iri: string;

  /**
   * Indicates if the request responded with a success or error status.
   */
  readonly ok: boolean;

  /**
   * The response status. Only used for failure responses.
   */
  readonly status?: number;

  /**
   * The current value of the entity.
   */
  readonly value?: JSONObject;

  /**
   * The content type of the response.
   */
  readonly contentType: string | null;

  /**
   * The error type.
   */
  readonly reason?: Failure;
};

export type ValueSelectionResult = {
  /**
   * A unique key for identifing this selection result.
   * Useful for caching objects which use the result.
   */
  readonly key: symbol;

  /**
   * A json pointer referencing the item within the parent value.
   */
  readonly pointer: string;

  /**
   * The type of the selection result. Value 'entity' indicates
   * the value has an iri and can be fetched. The value `value`
   * indicates the value is found in the body of an entity.
   */
  readonly type: 'value';

  /**
   * The object key (type, or term in json-ld lingo) used when
   * retrieving this value from the parent object.
   */
  readonly datatype?: string;

  /**
   * The selection value.
   */
  readonly value: JSONValue;

  /**
   * The content type of the response.
   */
  readonly contentType?: undefined;
};

export type AlternativeTypeResult = {
  readonly key: symbol;

  readonly pointer: string;

  readonly type: 'alt';

  readonly datatype?: undefined;

  readonly value?: undefined;

  readonly contentType: string;

  readonly component: AlternativeContentComponent;
};

export type ReadonlySelectionResult =
  | EntitySelectionResult
  | ValueSelectionResult
  | AlternativeTypeResult
;

export type SelectionResult =
  | EntitySelectionResult
  | ValueSelectionResult
  | AlternativeTypeResult
;

export type SelectionDetails<T = SelectionResult> = {
  /**
   * True if the selection does not require fetching any depencencies.
   * A selection can be complete while having errors.
   */
  complete: boolean;

  /**
   * True if any entities the selection traverses are in an error state.
   */
  hasErrors: boolean;

  /**
   * True if any selections are not defined in the data.
   */
  hasMissing: boolean;

  /**
   * The result of the selection.
   */
  result: Array<Readonly<T>>;

  /**
   * List of IRIs which are yet to be loaded which this result set requires.
   */
  required: string[];

  /**
   * A list of IRIs which this selection depends on.
   * If the state of any of the dependencies changes the selection result should
   * be considered stale.
   */
  dependencies: string[];
};

export type ActionSelectionDetails = SelectionDetails<SelectionResult>;

export type LoadingEntityState = {
  /**
   * True if this entity has an in progress request.
   */
  readonly loading: true;

  /**
   * Indicates if the request responded with a success or error status.
   */
  readonly ok?: undefined;

  /**
   * The IRI of the entity.
   */
  readonly iri: string;

  /**
   * The current value of the entity.
   */
  readonly value?: undefined;

  /**
   * The response status. Only used for failure responses.
   */
  readonly status?: undefined;

  /**
   * The content type of the response.
   */
  readonly contentType?: undefined;
};

export type SuccessEntityState = {
  /**
   * True if this entity has an in progress request.
   */
  readonly loading: false;

  /**
   * Indicates if the request responded with a success or error status.
   */
  readonly ok: true;

  /**
   * The IRI of the entity.
   */
  readonly iri: string;

  /**
   * The current value of the entity.
   */
  readonly value: JSONObject;

  /**
   * The response status. Only used for failure responses.
   */
  readonly status?: undefined;

  /**
   * The content type of the response.
   */
  readonly contentType: string;
};

export type FailureEntityState = {
  /**
   * True if this entity has an in progress request.
   */
  readonly loading: false;

  /**
   * Indicates if the request responded with a success or error status.
   */
  readonly ok: false;

  /**
   * The IRI of the entity.
   */
  readonly iri: string;

  /**
   * The current value of the entity.
   */
  readonly value?: JSONObject;

  /**
   * The response status. Only used for failure responses.
   */
  readonly status: number;

  /**
   * The content type of the response.
   */
  readonly contentType?: string;

  /**
   * An object describing the reason and source of the failure.
   */
  readonly reason: Failure;

  /**
   * Component to render if the returned content type is
   * not jsonld or problem detail types.
   */
  readonly component?: AlternativeContentComponent;
};

export type AlternativeContentLoadingState = Record<string, Record<string, LoadingEntityState>>;

export type LoadingResult = {
  contentType: string;
}

export type LoadingAlternativeAcceptState = Record<string, true | LoadingResult>;

export type EntityState =
  | LoadingEntityState
  | SuccessEntityState
  | FailureEntityState;

export type ProblemDetailsState = {
  type: 'problem-details';
  iri: string;
  contentType: string;
  value: JSONObject;
};

export type HTMLState = {
  type: 'html';
  iri: string;
  contentType: string;
  value: string;
  rendered?: boolean;
  callback?: HandlerCallback;
};

export type LooseFragementsState = {
  contentType: string;
  rendered: boolean;
  html: string;
};

export type HTMLFragmentsState = {
  type: 'html-fragments';
  rootRendered: boolean;
  root?: string;
  ided: Record<string, LooseFragementsState>;
  anon: Record<string, LooseFragementsState>;
};

export interface AlternativeState {
  render(): Children;
  getStateInfo(): JSONObject;
  toInitialState(): string;
};


export type ContentTypeState =
  | ProblemDetailsState
  | HTMLState
  | HTMLFragmentsState
;

export type EntitiesStateStore = Record<string, EntityState>;
export type LoadingStateStore = Record<string, LoadingAlternativeAcceptState>;
export type AlternativesStateStore = Record<string, Record<string, ContentTypeState>>;

export type Method =
  | 'get'
  | 'query'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
;

export type SubmitArgs = {
  /**
   * The http method of the request.
   */
  method?: Method;

  /**
   * The content type header value.
   */
  contentType?: string;

  /**
   * The encoding type header value.
   */
  encodingType?: string;

  /**
   * The body of the request.
   */
  body?: string;
};

/**
 * A function which receives updates to an Octiron store selection.
 *
 * @param {SelectionDetails} details         The details of the selection update.
 * @param {boolean} details.complete         True if the selection does not require fetching
 *                                           any depencencies. A selection can be complete
 *                                           while having errors.
 * @param {boolean} details.hasErrors        True if any entities the selection traverses
 *                                           are in an error state.
 * @param {SelectionResult[]} details.result The result of the selection.
 * @param {string[]} details.required        List of IRIs which are yet to be loaded which
 *                                           this result set requires.
 * @param {string[]} details.dependencies    A list of IRIs which this selection depends on.
 */
export type SelectionListener = (details: Readonly<SelectionDetails<ReadonlySelectionResult>>) => void;

export type SubscribeArgs = {
  /**
   * Unique symbol used to identify the subsciber.
   */
  key: symbol;

  /**
   * Selector string.
   */
  selector: string;

  /**
   * Value to being the selection from. If left undefined
   * the selection is assumed to begin with an iri to an
   * entity.
   */
  value?: JSONObject;

  /**
   * Function which will receive selection updates.
   */
  listener: SelectionListener;
};

export interface OctironStore {
  /**
   * The root IRI or endpoint this store is configured with.
   */
  readonly rootIRI: string;

  /**
   * Vocab used in the json-ld context.
   */
  readonly vocab?: string;

  /**
   * Aliases used in the json-ld context.
   */
  readonly aliases: Record<string, string>;

  /**
   * A json-ld context object which can be used to expand and compact
   * json-ld data.
   */
  readonly context: Record<string, string>;

  /**
   * Object mapping all fetched entities to their IRIs.
   */
  readonly entities: Record<string, EntityState>;

  /**
   * Expands a term using the store's configured json-ld context.
   *
   * @param {string} term The term to expand.
   */
  expand(term: string): string;

  /**
   * Fetches an entity and adds it and all child entities
   * to the store. This will overwrite any existing copies
   * of the fetched entities if they are already local.
   *
   * @param {string} iri       The IRI of the entity to fetch.
   */
  fetch(iri: string): Promise<SuccessEntityState | FailureEntityState>;

  /**
   * Performs a selection against the store returning
   * the selected value within a selection details object.
   *
   * If no value object is provided the selection is assumed
   * to be against an entity and should begin with an IRI.
   *
   * @param {string} selector    Selector to apply to the store.
   * @param {JSONObject} [value] The value to start the selection from if
   *                             not selection in the context of an entity.
   */
  select(selector: string, value?: JSONObject): SelectionDetails<
    ReadonlySelectionResult
  >;

  /**
   * Subscribes to updates to an selector.
   * Each time any value in the selection or dependency of the
   * selected values is changed an updated selection details
   * object will be passed to the given listener function.
   *
   * @param {symbol} args.key         A unique symbol used to identity the subscriber.
   * @param {string} args.selector    The selector being subscribed to.
   * @param {JSONObject} [args.value] The value to start the selection from if
   *                                  not selecting in the context of an entity.
   * @param {Function} args.listener  Listener function which recieves selection
   *                                  details updates.
   */
  subscribe(args: SubscribeArgs): SelectionDetails<ReadonlySelectionResult>;

  /**
   * Unsubscribes a subscriber.
   *
   * @param {symbol} key The unique sybmol used to identify the subscriber.
   */
  unsubscribe(key: symbol): void;

  stateToHTML(): string;
};
