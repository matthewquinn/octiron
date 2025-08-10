declare module "types/common" {
    export type Mutable<T> = {
        -readonly [K in keyof T]: T[K];
    };
    export type EmptyObject = {};
    export type JSONPrimitive = string | number | boolean | null | undefined;
    export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
    export type JSONObject = {
        [member: string]: JSONValue;
    };
    export interface JSONArray extends Array<JSONValue> {
    }
    export type IRIObject<Properties extends JSONObject = JSONObject> = Properties & {
        '@id': string;
    };
    export type TypeObject<Properties extends JSONObject = JSONObject> = Properties & {
        '@type': string | string[];
    };
    export type ValueObject<Properties extends JSONObject = JSONObject> = Properties & {
        '@value': JSONValue;
    };
    export type IterableJSONLD<Properties extends JSONObject = JSONObject> = JSONArray | (Properties & {
        '@list': JSONArray;
    }) | (Properties & {
        '@set': JSONArray;
    });
    export type SCMEntryPoint = {
        contentType: string;
        encodingType?: string;
        httpMethod: string;
        urlTemplate: string;
    };
    export type SCMAction = JSONObject & {
        target: string | SCMEntryPoint;
    };
    export type SCMPropertyValueSpecification = {
        readonlyValue: boolean;
        valueName?: string;
        valueRequired: boolean;
        defaultValue?: JSONValue;
        minValue?: JSONPrimitive;
        maxValue?: JSONPrimitive;
        stepValue?: number;
        valuePattern?: string;
        multipleValues?: boolean;
        valueMinLength?: number;
        valueMaxLength?: number;
    };
}
declare module "types/store" {
    import type { Children, ComponentTypes } from 'mithril';
    import type { JSONObject, JSONValue, SCMPropertyValueSpecification } from "types/common";
    import type { Store } from "store";
    import type { Octiron } from "types/octiron";
    export type Aliases = Record<string, string>;
    export type Origins = Record<string, Headers>;
    export type Context = {
        '@vocab'?: string;
    } & {
        [vocab: string]: string;
    };
    export type IntegrationType = 'html' | 'html-fragments';
    export type HandlerArgs = {
        res: Response;
        store: Store;
    };
    export type RequestHandler<T extends Record<string, JSONValue>> = (args: HandlerArgs) => Promise<T> | T;
    export type JSONLDContentTypeResult = {
        value: JSONObject;
    };
    export type JSONLDHandlerResult = {
        jsonld: JSONObject;
    };
    export type JSONLDHandler = {
        integrationType: 'jsonld';
        contentType: string;
        handler: RequestHandler<JSONLDHandlerResult>;
    };
    export type ProblemDetailsHandlerResult = {
        problemDetails: JSONObject;
    };
    export type ProblemDetailsHandler = {
        integrationType: 'problem-details';
        contentType: string;
        handler: RequestHandler<ProblemDetailsHandlerResult>;
    };
    export type HTMLHandlerResult = {
        id?: string;
        selector?: string;
        html: string;
    };
    export type FragmentListener = (fragment: string) => void;
    export type AddFragmentListener = (listener: FragmentListener) => void;
    export type HTMLCleanupFn = () => void;
    export type HTMLOnCreateArgs = {
        o: Octiron;
        dom: Element;
        fragment?: string;
        addFragmentListener: AddFragmentListener;
    };
    export type HTMLOnCreate = (args: HTMLOnCreateArgs) => HTMLCleanupFn;
    export type HTMLHandler = {
        integrationType: 'html';
        contentType: string;
        handler: RequestHandler<HTMLHandlerResult>;
        onCreate?: HTMLOnCreate;
    };
    export type HTMLFragmentsHandlerResult = {
        selector?: string;
        html?: string;
        ided: Record<string, string>;
        anon: Record<string, string>;
    };
    export type HTMLFragmentsCleanupFn = () => void;
    export type HTMLFragmentsOnCreateArgs = {
        o: Octiron;
        dom: Element;
        fragment?: string;
    };
    export type HTMLFragmentsOnCreate = (args: HTMLFragmentsOnCreateArgs) => HTMLFragmentsCleanupFn;
    export type HTMLFragmentsHandler = {
        integrationType: 'html-fragments';
        contentType: string;
        handler: RequestHandler<HTMLFragmentsHandlerResult>;
        onCreate?: HTMLFragmentsOnCreate;
    };
    export type Handler = JSONLDHandler | ProblemDetailsHandler | HTMLHandler | HTMLFragmentsHandler;
    export type FetcherArgs = {
        method?: string;
        body?: string;
        headers?: Headers;
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
    };
    export type ActionSelectionResult = {
        /**
         * A unique json pointer for identifing this selection result.
         * Useful for caching objects and performing updates on it's value.
         */
        readonly pointer: string;
        /**
         * The type of the selection result. Value 'entity' indicates
         * the value has an iri and can be fetched. The value `value`
         * indicates the value is found in the body of an entity.
         */
        readonly type: 'action-value';
        /**
         * The object key (type, or term in json-ld lingo) used when
         * retrieving this value from the parent object.
         */
        readonly datatype: string;
        /**
         * The selection value.
         */
        readonly value: JSONValue;
        /**
         * The point on the action definition describing the value.
         */
        readonly actionValue?: JSONValue;
        /**
         * An action selection can be readonly if the selected spec
         * has readonly set to true. Or if the payload has entities
         * or unspecifed values on it which the selection selects into.
         */
        readonly readonly: boolean;
        /**
         * The spec related to the value.
         *
         * This can be null if the payload has entities or unspecifed
         * values on it which the selection selects into.
         */
        readonly spec?: SCMPropertyValueSpecification;
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
    export type ReadonlySelectionResult = EntitySelectionResult | ValueSelectionResult;
    export type SelectionResult = EntitySelectionResult | ValueSelectionResult | ActionSelectionResult;
    export type SelectionDetails<T = SelectionResult> = {
        selector: string;
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
    };
    export type EntityState = LoadingEntityState | SuccessEntityState | FailureEntityState;
    export type IntegrationStateInfo = {
        contentType: string;
        [key: string]: JSONValue;
    };
    export interface IntegrationState {
        iri: string;
        integrationType: IntegrationType;
        contentType: string;
        render(o: Octiron): Children;
        getStateInfo(): IntegrationStateInfo;
        toInitialState(): string;
    }
    export type PrimaryState = Map<string, EntityState>;
    export type AlternativesState = Map<string, Map<string, IntegrationState>>;
    export type Method = string | 'get' | 'query' | 'post' | 'put' | 'patch' | 'delete';
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
}
declare module "alternatives/htmlFragments" {
    import m from 'mithril';
    import type { HTMLFragmentsHandler, IntegrationState } from "types/store";
    import type { Octiron } from "types/octiron";
    export type HTMLFragmentsIntegrationComponentAttrs = {
        o: Octiron;
        fragment?: string;
        rootHTML?: string;
        fragmentsHTML: Record<string, string>;
        rootEl?: Element;
        fragmentEls?: Record<string, Element>;
    };
    export type HTMLFragmentsIntegrationComponentType = m.ComponentTypes<HTMLFragmentsIntegrationComponentAttrs>;
    export const HTMLFragmentsIntegrationComponent: HTMLFragmentsIntegrationComponentType;
    export type HTMLFragmentsIntegrationArgs = {
        iri: string;
        contentType: string;
        root?: string;
        ided?: Record<string, string>;
        anon?: Record<string, string>;
    };
    type HTMLFragmentsStateInfo = {
        iri: string;
        contentType: string;
        hasRoot: boolean;
        ided: string[];
        anon: string[];
    };
    export class HTMLFragmentsIntegration implements IntegrationState {
        #private;
        static type: "html-fragments";
        readonly integrationType: "html-fragments";
        constructor(handler: HTMLFragmentsHandler, { iri, contentType, root, ided, anon, }: HTMLFragmentsIntegrationArgs);
        get iri(): string;
        get contentType(): string;
        render(o: Octiron): any;
        getStateInfo(): HTMLFragmentsStateInfo;
        toInitialState(): string;
        static fromInitialState(handler: HTMLFragmentsHandler, { iri, contentType, hasRoot, ided, anon, }: HTMLFragmentsStateInfo): HTMLFragmentsIntegration | null;
    }
}
declare module "consts" {
    export const isBrowserRender: boolean;
}
declare module "alternatives/html" {
    import m from 'mithril';
    import type { HTMLHandler, IntegrationState } from "types/store";
    import type { Octiron } from "types/octiron";
    export type HTMLIntegrationComponentAttrs = {
        o: Octiron;
        html: string;
        el?: Element;
        handler: HTMLHandler;
    };
    export type HTMLIntegrationComponentType = m.ComponentTypes<HTMLIntegrationComponentAttrs>;
    export const HTMLIntegrationComponent: HTMLIntegrationComponentType;
    export type HTMLIntegrationArgs = {
        iri: string;
        contentType: string;
        html: string;
        id?: string;
        el?: Element;
    };
    export class HTMLIntegration implements IntegrationState {
        #private;
        static type: "html";
        readonly integrationType: "html";
        constructor(handler: HTMLHandler, { iri, contentType, html, id, el, }: HTMLIntegrationArgs);
        get iri(): string;
        get contentType(): string;
        render(o: Octiron): any;
        getStateInfo(): {
            iri: string;
            contentType: string;
            id: string;
        };
        toInitialState(): string;
        static fromInitialState(handler: HTMLHandler, { iri, contentType, id, }: {
            iri: string;
            contentType: string;
            id?: string;
        }): HTMLIntegration | null;
    }
}
declare module "failures" {
    import type { Children } from 'mithril';
    import type { Failure, HTTPErrorView, ContentParsingView } from "types/store";
    export class UndefinedFailure implements Failure {
        undefined(children: Children): Children;
        http(children: Children): Children;
        http(view: HTTPErrorView): Children;
        unparserable(children: Children): Children;
        unparserable(view: ContentParsingView): Children;
    }
    export class HTTPFailure implements Failure {
        #private;
        constructor(status: number, res: Response);
        get status(): number;
        get res(): Response;
        undefined(): Children;
        http(children: Children): Children;
        http(view: HTTPErrorView): Children;
        unparserable(children: Children): Children;
        unparserable(view: ContentParsingView): Children;
    }
    export class ContentHandlingFailure implements Failure {
        #private;
        constructor(error: Error);
        get error(): Error;
        undefined(): Children;
        http(children: Children): Children;
        http(view: HTTPErrorView): Children;
        unparserable(children: Children): Children;
        unparserable(view: ContentParsingView): Children;
    }
}
declare module "utils/getIterableValue" {
    import type { IterableJSONLD, JSONArray } from "types/common";
    /**
     * @description
     * Returns true if a json-ld value is an array or has an iterable value,
     * i.e.: an object with an `@list` or `@set` array value.
     *
     * This function returns an empty array in the cases where a non-iterable value
     * is given.
     *
     * @param {JSONValue} value - A json-ld value
     */
    export function getIterableValue(value: IterableJSONLD): JSONArray;
}
declare module "utils/isJSONObject" {
    import type { JSONObject, JSONValue } from "types/common";
    /**
     * @description
     * Returns true if the input value is an object.
     *
     * @param value Any value which should come from a JSON source.
     */
    export function isJSONObject(value: JSONValue): value is JSONObject;
}
declare module "utils/isIRIObject" {
    import type { IRIObject, JSONObject, JSONValue } from "types/common";
    /**
     * @description
     * Returns true if the given value is a JSON object with a JSON-ld @id value.
     *
     * @param value Any value which should come from a JSON source.
     */
    export function isIRIObject<Properties extends JSONObject = JSONObject>(value: JSONValue): value is IRIObject<Properties>;
}
declare module "utils/isIterable" {
    import type { IterableJSONLD, JSONValue } from "types/common";
    /**
     * @description
     * Returns true if a json-ld value is an array or has an iterable value,
     * i.e.: an object with an `@list` or `@set` array value.
     *
     * @param {JSONValue} value - A json-ld value
     */
    export function isIterable(value: JSONValue): value is IterableJSONLD;
}
declare module "utils/isMetadataObject" {
    import type { IRIObject, JSONObject } from "types/common";
    /**
     * @description
     * Some JSON-ld objects contain special JSON-ld values, such as @type which
     * can inform the software on what to expect when retrieving the object but
     * otherwise require fetching an entity from an endpoint to get the values
     * they relate to. For Octiron's purposes these are considered metadata objects.
     *
     * Objects containing `@value`, `@list`, `@set` are not considered metadata
     * objects as these properties references concrete values.
     *
     * @param value - The JSON object to check for non special properties in.
     */
    export function isMetadataObject(value: JSONObject): value is IRIObject;
}
declare module "utils/isValueObject" {
    import type { JSONObject, ValueObject } from "types/common";
    /**
     * @description
     * A value object contains a `@value` value. Often this is used to provide
     * further information about the value like what `@type` it holds, allowing
     * filters to be applied to the referenced value.
     *
     * @param value - A JSON value.
     */
    export function isValueObject(value: JSONObject): value is ValueObject;
}
declare module "utils/flattenIRIObjects" {
    import type { IRIObject, JSONValue } from "types/common";
    /**
     * @description
     * Locates all IRI objects in a potentially deeply nested JSON-ld structure and
     * returns an array of the located IRI objects.
     *
     * Objects identified as IRI objects are not modified beyond being placed in
     * an array together.
     *
     * @param value - The value to flatten.
     * @param agg - An array to fill with the flattened IRI objects.
     *              This is required for the internal recursing performed by this
     *              function and isn't required by upstream callers.
     */
    export function flattenIRIObjects(value: JSONValue, agg?: IRIObject[]): IRIObject[];
}
declare module "utils/escapeJSONPointerParts" {
    /**
     * @description
     * Espects a list of json pointer parts and returns a json pointer.
     */
    export function escapeJSONPointerParts(...parts: string[]): string;
}
declare module "utils/parseSelectorString" {
    import type { Store } from "store";
    export type SelectorObject = {
        subject: string;
        filter?: string;
    };
    /**
     * @description
     * Parses a selector string producing a selector list
     * The subject value of a selector could be an iri or a type depending on the
     * outer context.
     *
     * @param selector - The selector string to parse.
     */
    export function parseSelectorString(selector: string, store: Store): SelectorObject[];
}
declare module "utils/resolvePropertyValueSpecification" {
    import type { Store } from "store";
    import type { JSONObject, SCMPropertyValueSpecification } from "types/common";
    export function resolvePropertyValueSpecification({ spec, store, }: {
        spec: JSONObject;
        store: Store;
    }): SCMPropertyValueSpecification;
}
declare module "utils/getSelection" {
    import type { JSONObject } from "types/common";
    import type { ActionSelectionResult, EntitySelectionResult, SelectionDetails, SelectionResult, ValueSelectionResult } from "types/store";
    import type { Store } from "store";
    /**
     * A circular selection error occurs when two or more
     * entities contain no concrete values and their '@id'
     * values point to each other in a way that creates a
     * loop. The `getSelection` function will throw when
     * this scenario is detected to prevent an infinite
     * loop.
     */
    export class CircularSelectionError extends Error {
    }
    export type SelectorObject = {
        subject: string;
        filter?: string;
    };
    type ProcessingEntitySelectionResult = {
        keySource: string;
    } & Omit<EntitySelectionResult, 'key'>;
    type ProcessingValueSelectionResult = {
        keySource: string;
    } & Omit<ValueSelectionResult, 'key'>;
    type ProcessingActionSelectionResult = {
        keySource: string;
    } & Omit<ActionSelectionResult, 'key'>;
    type ProcessingSelectionDetails = SelectionDetails<ProcessingEntitySelectionResult | ProcessingValueSelectionResult | ProcessingActionSelectionResult>;
    export function transformProcessedDetails<T extends SelectionResult>(processing: ProcessingSelectionDetails): SelectionDetails<T>;
    /**
     * @description
     * Selects from the given context value and store state.
     *
     * If no `value` is provided the `selector` is assumed to begin with an iri
     * instead of a type. An entity will be selected from the store using the iri,
     * if it exists, to begin the selection.
     *
     * A type selector selects values from the context of a provided value
     * and will pull from the store if any iri objects are selected in the process.
     *
     * @param {string} args.selector          Selector string begining with a type.
     * @param {JSONObject} [args.value]       Context object to begin the selection from.
     * @param {JSONObject} [args.actionValue] The action, or point in the action definition which describes this value.
     * @param {Store} args.store       Octiron store to search using.
     * @returns {SelectionDetails}            Selection contained in a details object.
     */
    export function getSelection<T extends SelectionResult>({ selector: selectorStr, value, actionValue, store, }: {
        selector: string;
        value?: JSONObject;
        actionValue?: JSONObject;
        store: Store;
    }): SelectionDetails<T>;
}
declare module "utils/mithrilRedraw" {
    /**
     * @description
     * Calls Mithril's redraw function if the window object exists.
     */
    export function mithrilRedraw(): void;
}
declare module "store" {
    import type { AlternativesState, Context, Fetcher, Handler, ReadonlySelectionResult, ResponseHook, SelectionDetails, SelectionListener, EntityState, SubmitArgs, Aliases } from "types/store";
    import type { JSONObject } from "types/common";
    import type { FailureEntityState, SuccessEntityState } from "types/store";
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
         * or are configured in the origins object. Appart
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
        #private;
        constructor(args: StoreArgs);
        get rootIRI(): string;
        entity(iri: string): any;
        get vocab(): string | undefined;
        get aliases(): Aliases;
        get context(): Context;
        /**
         * Expands a term to a type.
         *
         * If an already expanded JSON-ld type is given it will
         * return the input value.
         */
        expand(termOrType: string): string;
        select(selector: string, value?: JSONObject): SelectionDetails;
        /**
         * Generates a unique key for server rendering only.
         */
        key(): string;
        isLoading(iri: string): boolean;
        handleResponse(res: Response, iri?: string): Promise<void>;
        subscribe({ key, selector, value, listener, }: {
            key: symbol;
            selector: string;
            value?: JSONObject;
            listener: SelectionListener;
        }): SelectionDetails<ReadonlySelectionResult>;
        unsubscribe(key: symbol): void;
        fetch(iri: string): Promise<SuccessEntityState | FailureEntityState>;
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
        submit(iri: string, args: SubmitArgs): Promise<SuccessEntityState | FailureEntityState>;
        static fromInitialState({ headers, origins, handlers, }: {
            headers?: Record<string, string>;
            origins?: Record<string, Record<string, string>>;
            handlers?: Handler[];
        }): Store;
        toInitialState(): string;
    }
}
declare module "types/octiron" {
    import type { Attributes, Children, ComponentTypes } from 'mithril';
    import type { JSONObject, JSONPrimitive, JSONValue } from "types/common";
    import type { Store } from "store";
    import type { ContentHandlingFailure, HTTPFailure, UndefinedFailure } from "failures";
    /**
     * An iri (see url) to an entity.
     * In theory this could use other protocols (see 'tel:*') but http is the only
     * one currently supported.
     */
    export type IRI = `http:${string}` | `https://${string}`;
    /**
     * A un-compacted semantic web type.
     */
    export type Type = IRI;
    /**
     * A term, which could be a type, but for brevity is probably a term
     * under the configured vocab or alias.
     */
    export type Term = Type | string;
    /**
     * A string consisting of a list of terms. When using `o.enter()` it should
     * start with an iri to the desired entity and followed with optional terms.
     */
    export type Selector = string;
    export type BaseAttrs = Attributes;
    export type PresentAttrs<Value extends JSONValue = JSONValue, Attrs extends BaseAttrs = BaseAttrs> = {
        renderType: 'present';
        o: Octiron;
        attrs: Attrs;
        value: Value;
    };
    export type UpdateArgs = {
        submit?: boolean;
        throttle?: number;
        debounce?: number;
        submitOnChange?: boolean;
    };
    export type OnChange<Value extends JSONValue = JSONValue> = (value: Value | null, args?: UpdateArgs) => void;
    export type EditAttrs<Value extends JSONValue = JSONValue, Attrs extends BaseAttrs = BaseAttrs> = {
        renderType: 'edit';
        o: OctironActionSelection;
        attrs: Attrs;
        value: Value;
        name: string;
        required: boolean;
        readonly: boolean;
        min?: JSONPrimitive;
        max?: JSONPrimitive;
        step?: number;
        pattern?: string;
        multiple?: boolean;
        minLength?: number;
        maxLength?: number;
        onchange: OnChange;
        onChange: OnChange;
    };
    export type AnyAttrs<Value extends JSONValue = JSONValue, Attrs extends BaseAttrs = BaseAttrs> = PresentAttrs<Value, Attrs> | EditAttrs<Value, Attrs>;
    export type PresentComponent<Value extends JSONValue = JSONValue, Attrs extends BaseAttrs = BaseAttrs> = ComponentTypes<PresentAttrs<Value, Attrs>>;
    export type EditComponent<Value extends JSONValue = JSONValue, Attrs extends BaseAttrs = BaseAttrs> = ComponentTypes<EditAttrs<Value, Attrs>>;
    export type AnyComponent<Value extends JSONValue = JSONValue, Attrs extends BaseAttrs = BaseAttrs> = ComponentTypes<AnyAttrs<Value, Attrs>>;
    export type TypeDef<Value extends JSONValue = JSONValue, Type extends string = string> = {
        type: Type;
        present?: PresentComponent<Value> | AnyComponent<Value>;
        edit?: EditComponent<Value> | AnyComponent<Value>;
    };
    export type TypeDefs<Type extends string = string, TypeDefList extends TypeDef<any, Type> = TypeDef<any, Type>> = {
        [TypeDef in TypeDefList as TypeDef["type"]]: TypeDef;
    };
    /**
     * A view which is rendered in the following situations:
     *  - A selection attempts to select values not available
     *    in the representation context.
     *  - When non-successful http statuses are returned.
     *  - An error occurs parsing a response body.
     *
     * If the content-type is recognized the value is made available via the
     * injected Octiron selection.
     */
    export type FallbackView = (o: OctironSelection, err: UndefinedFailure | HTTPFailure | ContentHandlingFailure) => Children;
    export type Fallback = FallbackView | Children;
    /**
     * Arguments for all methods which afford fetching entities.
     */
    export type FetchableArgs = {
        accept?: string;
        /**
         * Optional URL fragment which can be accessed by the content-type handler function.
         */
        fragment?: string;
        /**
         * Forces the retrieval of the latest representation even if the entity is in
         * the Octiron store.
         */
        forceFetch?: boolean;
        /**
         * Loading state rendered while a fetch is in progress.
         */
        loading?: Children;
        /**
         * Fallback state rendered if the fetch fails.
         */
        fallback?: Fallback;
    };
    export type PresentableArgs<Attrs extends BaseAttrs = BaseAttrs> = {
        attrs?: Attrs;
        component?: PresentComponent<any, Attrs> | AnyComponent<any, Attrs>;
        fallbackComponent?: PresentComponent<any, Attrs>;
        typeDefs?: TypeDefs;
        store?: Store;
    };
    export type IterablePeridcate = (octiron: Octiron) => boolean;
    export type IterableArgs = {
        start?: number;
        end?: number;
        pre?: Children;
        post?: Children;
        sep?: Children;
        predicate?: IterablePeridcate;
    };
    export type EditableArgs = {
        readonly?: boolean;
        required?: boolean;
        min?: JSONPrimitive;
        max?: JSONPrimitive;
        step?: JSONPrimitive;
        pattern?: string;
        multiple?: boolean;
        minLength?: number;
        maxLength?: number;
        typeDefs?: TypeDefs;
        store?: Store;
    };
    export type OctironSelectArgs<Attrs extends BaseAttrs = BaseAttrs> = FetchableArgs & IterableArgs & PresentableArgs<Attrs>;
    export type OctironPresentArgs<Attrs extends BaseAttrs = BaseAttrs> = PresentableArgs<Attrs>;
    export type OctironPerformArgs<Attrs extends BaseAttrs = BaseAttrs> = FetchableArgs & IterableArgs & SubmittableArgs & InterceptableArgs & UpdateableArgs<Attrs> & PresentableArgs<Attrs>;
    export type OctironActionSelectionArgs<Attrs extends BaseAttrs = BaseAttrs> = FetchableArgs & IterableArgs & InterceptableArgs & UpdateableArgs<Attrs>;
    export type OctironEditArgs<Attrs extends BaseAttrs = BaseAttrs> = UpdateableArgs<Attrs> & EditableArgs;
    export type OctironDefaultArgs<Attrs extends BaseAttrs = BaseAttrs> = OctironPresentArgs<Attrs> | OctironEditArgs<Attrs>;
    /**
     * A function that intercepts changes to an action
     * payload value and allows the intercepter to transform
     * the value before the payload is updated.
     *
     * Action selectors can have intercepters specified on them.
     * Note that they intercept the value at the root of the selection
     * and not the final value of the selection.
     *
     * @param next The changed value.
     * @param prev The previous value.
     * @param actionValue The action, or point in the action, which
     *                    relates to the edited value.
     */
    export type Interceptor = (
    /**
     * The incoming intercepted value
     */
    next: JSONObject, 
    /**
     * The value held before the intercepted change.
     */
    prev: JSONObject, 
    /**
     * The action or value which specifies the root of the selection.
     */
    actionValue: JSONObject) => JSONObject;
    export type InterceptableArgs = {
        interceptor?: Interceptor;
    };
    export type OnSubmit = () => void;
    export type OnSubmitSuccess = () => void;
    export type OnSubmitFailure = () => void;
    export type SubmittableArgs = {
        submitOnInit?: boolean;
        submitOnChange?: boolean;
        initialPayload?: JSONObject;
        onSubmit?: OnSubmit;
        onSubmitSuccess?: OnSubmitSuccess;
        onSubmitFailure?: OnSubmitFailure;
    };
    export type UpdateableArgs<Attrs extends BaseAttrs = BaseAttrs> = {
        initialValue?: JSONValue;
        throttle?: number;
        debounce?: number;
        submitOnChange?: boolean;
        attrs?: Attrs;
        component?: EditComponent<any, Attrs> | AnyComponent<any, Attrs>;
        fallbackComponent?: AnyComponent<any, Attrs>;
        typeDefs?: TypeDefs;
        store?: Store;
    };
    export interface OctironView {
        (octiron: Octiron): Children;
    }
    export interface SelectView {
        (octiron: OctironSelection): Children;
    }
    export interface Origin {
        /**
         * Fetches the root entity and presents it using the type defs.
         */
        root(): Children;
        root(selector: Selector): Children;
        root(args: OctironSelectArgs<any>): Children;
        root(view: SelectView): Children;
        root(selector: Selector, args: OctironSelectArgs<any>): Children;
        root(selector: Selector, view: SelectView): Children;
        root(args: OctironSelectArgs<any>, view: SelectView): Children;
        root(selector: Selector, args: OctironSelectArgs<any>, view: SelectView): Children;
    }
    export interface EntryPoint {
        enter(selector: Selector): Children;
        enter(selector: Selector, args: OctironSelectArgs<any>): Children;
        enter(selector: Selector, view: SelectView): Children;
        enter(selector: Selector, args: OctironSelectArgs<any>, view: SelectView): Children;
    }
    export interface Selectable {
        select(selector: Selector): Children;
        select<Attrs extends BaseAttrs = BaseAttrs>(selector: Selector, args: OctironSelectArgs<Attrs>): Children;
        select(selector: Selector, view: SelectView): Children;
        select<Attrs extends BaseAttrs = BaseAttrs>(selector: Selector, args: OctironSelectArgs<Attrs>, view: SelectView): Children;
    }
    export interface Presentable {
        present(): Children;
        present<Attrs extends BaseAttrs = BaseAttrs>(args: OctironPresentArgs<Attrs>): Children;
    }
    export interface PerformView {
        (octiron: OctironAction): Children;
    }
    export interface Performable {
        perform(): Children;
        perform(selector: Selector): Children;
        perform(args: OctironPerformArgs): Children;
        perform(view: PerformView): Children;
        perform(selector: Selector, view: PerformView): Children;
        perform(selector: Selector, args: OctironPerformArgs): Children;
        perform(args: OctironPerformArgs, view: PerformView): Children;
        perform(selector: Selector, args: OctironPerformArgs, view: PerformView): Children;
    }
    export interface ActionSelectView {
        (octiron: OctironActionSelection): Children;
    }
    export type PayloadValueMapper<Value extends JSONValue = JSONValue> = (payloadValue: Value) => Value;
    export interface Performable {
        perform(): Children;
        perform(selector: Selector): Children;
        perform(args: OctironPerformArgs): Children;
        perform(view: PerformView): Children;
        perform(selector: Selector, view: PerformView): Children;
        perform(selector: Selector, args: OctironPerformArgs): Children;
        perform(args: OctironPerformArgs, view: PerformView): Children;
        perform(selector: Selector, args: OctironPerformArgs, view: PerformView): Children;
    }
    export interface Appendable {
        remove(args?: UpdateArgs): void;
        replace(type: string, index: number, value: JSONValue, args?: UpdateArgs): void;
        append(type: string, value?: JSONValue, args?: UpdateArgs): void;
    }
    export interface Editable {
        edit(): Children;
        edit<Attrs extends BaseAttrs = BaseAttrs>(args: OctironEditArgs<Attrs>): Children;
    }
    export interface Submitable<Value extends JSONValue = JSONValue> {
        /**
         * True if the action is currently being submitted.
         */
        readonly submitting: boolean;
        /**
         * Overrides the current payload value.
         */
        update(payloadValue: Value, args?: UpdateArgs): Promise<void>;
        /**
         * Overrides the current payload value using the result of the action.
         */
        update(mapper: PayloadValueMapper<Value>, args?: UpdateArgs): Promise<void>;
        /**
         * Submits the action.
         */
        submit(): Promise<void>;
        /**
         * Overrides any current payload value and submits the action.
         */
        submit(payload: Value): Promise<void>;
        /**
         * Overrides any current payload value with the result of the mapper and
         * submits the action.
         */
        submit(mapper: PayloadValueMapper): Promise<void>;
        initial(children: Children): Children;
        success(args: OctironSelectArgs): Children;
        success(): Children;
        success(selector: Selector): Children;
        success(view: SelectView): Children;
        success(selector: Selector, args: OctironSelectArgs): Children;
        success(selector: Selector, view: SelectView): Children;
        success(selector: Selector, args: OctironSelectArgs, view: SelectView): Children;
        failure(): Children;
        failure(selector: Selector): Children;
        failure(args: OctironSelectArgs): Children;
        failure(view: SelectView): Children;
        failure(selector: Selector, args: OctironSelectArgs): Children;
        failure(selector: Selector, view: SelectView): Children;
        failure(selector: Selector, args: OctironSelectArgs, view: SelectView): Children;
    }
    export interface ActionSelectable {
        select(selector: Selector): Children;
        select<Attrs extends BaseAttrs = BaseAttrs>(selector: Selector, args: OctironActionSelectionArgs<Attrs>): Children;
        select(selector: Selector, view: ActionSelectView): Children;
        select<Attrs extends BaseAttrs = BaseAttrs>(selector: Selector, args: OctironActionSelectionArgs<Attrs>, view: ActionSelectView): Children;
    }
    export interface Default {
        /**
         * For readonly instances calls `o.present()`.
         *
         * For non-readonly instances calls `o.edit()`.
         */
        default(): Children;
        /**
         * For readonly instances calls `o.present()`.
         *
         * For non-readonly instances calls `o.edit()`.
         *
         * @param {OctironDefaultArgs} args - Arguments to pass to called method.
         */
        default<Attrs extends BaseAttrs = BaseAttrs>(args: OctironDefaultArgs<Attrs>): Children;
    }
    export type Predicate = (octiron: Octiron) => boolean;
    export interface Filterable {
        /**
         * Renders the children if the predicate passes.
         *
         * @params {Predicate} predicate - A function which takes an Octiron instance
         *                                 returns a boolean.
         * @params {Children} children   - Mithril children to render if the predicate
         *                                 passes.
         */
        (predicate: Predicate, children: Children): Children;
        /**
         * Renders the children if the predicate fails.
         *
         * @params {Predicate} predicate - A function which takes an Octiron instance
         *                                 returns a boolean.
         * @params {Children} children   - Mithril children to render if the predicate
         *                                 fails.
         */
        not(predicate: Predicate, children: Children): Children;
    }
    export interface OctironRoot extends Default, Origin, Selectable, Filterable, Presentable, Performable {
        /**
         * The Octiron instance type.
         */
        readonly octironType: 'root';
        /**
         * Octiron predicate flag.
         */
        readonly isOctiron: true;
        /**
         * Unique instance id.
         */
        readonly id?: string;
        /**
         * Only action-selection and edit instances can be editable.
         */
        readonly readonly: true;
        /**
         * The value held by this instance
         */
        readonly value: null;
        /**
         * The octiron store used for this value.
         */
        readonly store: Store;
    }
    export interface OctironSelection extends Default, Origin, EntryPoint, Selectable, Filterable, Presentable, Performable {
        /**
         * The Octiron instance type.
         */
        readonly octironType: 'selection';
        /**
         * Octiron predicate flag.
         */
        readonly isOctiron: true;
        /**
         * Unique instance id.
         */
        readonly id?: string;
        /**
         * Only action-selection and edit instances can be editable.
         */
        readonly readonly: true;
        /**
         * The value held by this instance
         */
        readonly value: JSONValue;
        /**
         * The octiron store used for this value.
         */
        readonly store: Store;
    }
    export interface OctironAction extends Default, Origin, EntryPoint, ActionSelectable, Presentable, Submitable<JSONObject>, Filterable, Performable, Appendable {
        /**
         * The Octiron instance type.
         */
        readonly octironType: 'action';
        /**
         * Octiron predicate flag.
         */
        readonly isOctiron: true;
        /**
         * Unique instance id.
         */
        readonly id?: string;
        /**
         * Only action-selection and edit instances can be editable.
         */
        readonly readonly: false;
        /**
         * The value held by this instance
         */
        readonly value: JSONObject;
        /**
         * The http method of the action.
         */
        readonly method: string;
        /**
         * The URL of the action.
         *
         * This can only be set if the initial parameters + uri template
         * allow a valid url to be set.
         */
        readonly url?: URL;
        /**
         * The octiron store used for this value.
         */
        readonly store: Store;
        readonly action: Octiron;
        readonly actionValue: Octiron;
    }
    export interface OctironActionSelection extends Default, Origin, EntryPoint, ActionSelectable, Presentable, Submitable<JSONObject>, Editable, Filterable, Performable, Appendable {
        /**
         * The Octiron instance type.
         */
        readonly octironType: 'action-selection';
        /**
         * Octiron predicate flag.
         */
        readonly isOctiron: true;
        /**
         * Unique instance id that can optionally be used
         * to set ids in HTML elements.
         */
        readonly id: string;
        /**
         * The HTML input elements name. Mostly useful if
         * making form submissions compatible with multi-part
         * requests.
         */
        readonly inputName: string;
        /**
         * Only action-selection and edit instances can be editable.
         */
        readonly readonly: boolean;
        /**
         * The value held by this instance
         */
        readonly value: JSONValue;
        /**
         * The octiron store used for this value.
         */
        readonly store: Store;
        readonly action: Octiron;
        readonly actionValue: Octiron;
    }
    export type Octiron = OctironRoot | OctironSelection | OctironAction | OctironActionSelection;
}
declare module "utils/getComponent" {
    import type { AnyComponent, EditComponent, PresentComponent, TypeDefs } from "types/octiron";
    /**
     * @description
     * Returns a component based of Octiron's selection rules:
     *
     * 1. If the first pick component is given, return it.
     * 2. If a typedef is defined for the datatype (jsonld term or type)
     *    for the given style, return it.
     * 3. If a typedef is defined for the (or one of the) types (jsonld '@type')
     *    value for the given style, return it.
     * 4. If a fallback component is given, return it.
     *
     * @param args.style - The style of presentation.
     * @param args.datatype - The datatype the component should be configured to
     *                        handle.
     * @param args.type - The type the component should be configured to handle.
     * @param args.firstPickComponent - The component to use if passed by upstream.
     * @param args.fallbackComponent - The component to use if no other component
     *                                 is picked.
     */
    export function getComponent({ style, datatype, type, firstPickComponent, typeDefs, fallbackComponent, }: {
        style: "present" | "edit";
        datatype?: string;
        type?: string | string[];
        typeDefs: TypeDefs;
        firstPickComponent?: PresentComponent<any>;
        fallbackComponent?: PresentComponent<any>;
    }): PresentComponent<any> | EditComponent<any> | AnyComponent<any> | undefined;
}
declare module "utils/unravelArgs" {
    import type { ActionSelectView, OctironActionSelectionArgs, OctironDefaultArgs, OctironEditArgs, OctironPerformArgs, OctironPresentArgs, OctironSelectArgs, PerformView, Selector, SelectView } from "types/octiron";
    /**
     * @description
     * Numerous Octiron view functions take a combination of string selector,
     * object args and function view arguments.
     *
     * This `unravelArgs` identifies which arguments are present and returns
     * defaults for the missing arguments.
     *
     * @param arg1 - A selector string, args object or view function if present.
     * @param arg2 - An args object or view function if present.
     * @param arg3 - A view function if present.
     */
    export function unravelArgs(arg1?: Selector | OctironSelectArgs | SelectView, arg2?: OctironSelectArgs | SelectView, arg3?: SelectView): [Selector, OctironSelectArgs, SelectView];
    /**
     * @description
     * Numerous Octiron view functions take a combination of string selector,
     * object args and function view arguments.
     *
     * This `unravelArgs` identifies which arguments are present and returns
     * defaults for the missing arguments.
     *
     * @param arg1 - A selector string, args object or view function if present.
     * @param arg2 - An args object or view function if present.
     * @param arg3 - A view function if present.
     */
    export function unravelArgs(arg1?: Selector | OctironPerformArgs | PerformView, arg2?: OctironPerformArgs | PerformView, arg3?: PerformView): [Selector, OctironPerformArgs, PerformView];
    /**
     * @description
     * Numerous Octiron view functions take a combination of string selector,
     * object args and function view arguments.
     *
     * This `unravelArgs` identifies which arguments are present and returns
     * defaults for the missing arguments.
     *
     * @param arg1 - A selector string, args object or view function if present.
     * @param arg2 - An args object or view function if present.
     * @param arg3 - A view function if present.
     */
    export function unravelArgs(arg1?: Selector, arg2?: OctironActionSelectionArgs | ActionSelectView, arg3?: ActionSelectView): [Selector, OctironActionSelectionArgs, ActionSelectView];
    /**
     * @description
     * Numerous Octiron view functions take a combination of string selector,
     * object args and function view arguments.
     *
     * This `unravelArgs` identifies which arguments are present and returns
     * defaults for the missing arguments.
     *
     * @param arg1 - A selector string, args object or view function if present.
     * @param arg2 - An args object or view function if present.
     */
    export function unravelArgs(arg1?: Selector | OctironPresentArgs, arg2?: OctironPresentArgs): [Selector, OctironSelectArgs];
    /**
     * @description
     * Numerous Octiron view functions take a combination of string selector,
     * object args and function view arguments.
     *
     * This `unravelArgs` identifies which arguments are present and returns
     * defaults for the missing arguments.
     *
     * @param arg1 - A selector string, args object or view function if present.
     * @param arg2 - An args object or view function if present.
     */
    export function unravelArgs(arg1?: Selector | OctironEditArgs, arg2?: OctironEditArgs): [Selector, OctironEditArgs];
    /**
     * @description
     * Numerous Octiron view functions take a combination of string selector,
     * object args and function view arguments.
     *
     * This `unravelArgs` identifies which arguments are present and returns
     * defaults for the missing arguments.
     *
     * @param arg1 - A selector string, args object or view function if present.
     * @param arg2 - An args object or view function if present.
     */
    export function unravelArgs(arg1?: Selector | OctironDefaultArgs, arg2?: OctironDefaultArgs): [Selector, OctironDefaultArgs];
}
declare module "utils/isTypedObject" {
    import type { JSONObject, JSONValue, TypeObject } from "types/common";
    /**
     * @description
     * Returns true if the given value is a JSON object with a JSON-ld @type value.
     *
     * @param value Any value which should come from a JSON source.
     */
    export function isTypeObject<Properties extends JSONObject = JSONObject>(value: JSONValue): value is TypeObject<Properties>;
}
declare module "utils/getValueType" {
    import type { JSONValue } from "types/common";
    /**
     * @description
     * Returns the type value of the input if it is a type object.
     *
     * @param value A JSON value which might be a typed JSON-ld object.
     */
    export function getValueType(value: JSONValue): string | string[] | undefined;
}
declare module "renderers/ActionStateRenderer" {
    import type m from 'mithril';
    import type { OctironSelectArgs, SelectView, TypeDefs } from "types/octiron";
    import type { EntityState } from "types/store";
    import type { Store } from "store";
    export type ActionRendererRef = {
        submitting: boolean;
        submitResult?: EntityState;
        store: Store;
        typeDefs: TypeDefs;
    };
    export type ActionStateRendererAttrs = {
        type: 'initial' | 'success' | 'failure';
        children?: m.Children;
        selector?: string;
        args?: OctironSelectArgs;
        view?: SelectView;
        refs: ActionRendererRef;
    };
    export const ActionStateRenderer: m.ClosureComponent<ActionStateRendererAttrs>;
}
declare module "utils/getSubmitDetails" {
    import type { Store } from "store";
    import type { JSONObject, SCMAction } from "types/common";
    export type SubmitDetails = {
        url: string;
        method: string;
        contentType?: string;
        encodingType?: string;
        body?: string;
    };
    /**
     * Gets the details on how to perform a submission
     * based off an action, payload and other context.
     *
     * @param args.payload The current payload value.
     * @param args.action The schema.org styled action object.
     * @param args.store The Octiron store.
     */
    export function getSubmitDetails({ payload, action, store, }: {
        payload: JSONObject;
        action: SCMAction;
        store: Store;
    }): SubmitDetails;
}
declare module "factories/octironFactory" {
    import type { Octiron } from "@octiron/octiron";
    import type { Mutable } from "types/common";
    export function octironFactory<O extends Octiron>(): Mutable<O>;
}
declare module "factories/actionSelectionFactory" {
    import type { Store } from "store";
    import type { JSONValue, SCMPropertyValueSpecification } from "types/common";
    import type { Octiron, OctironAction, OctironActionSelection, OctironActionSelectionArgs, OctironSelection, TypeDefs, UpdateArgs } from "types/octiron";
    export type OnActionSelectionSubmit = () => Promise<void>;
    export type OnActionSelectionUpdate = (pointer: string, value: JSONValue, args?: UpdateArgs) => void;
    export type ActionSelectionInternals = {
        submitting: boolean;
        type: string | string[];
        datatype: string;
        pointer: string;
        name: string;
        value: JSONValue;
        actionValue?: JSONValue;
        entity: Octiron;
        action: OctironAction;
        parent: OctironAction | OctironActionSelection;
        octiron: OctironSelection;
        store: Store;
        spec?: SCMPropertyValueSpecification;
        typeDefs: TypeDefs;
        onSubmit: OnActionSelectionSubmit;
        onUpdate: OnActionSelectionUpdate;
    };
    export type OctironActionSelectionHooks = {
        _updateArgs(args: OctironActionSelectionArgs): void;
        _updateInternals(internals: Partial<ActionSelectionInternals>): void;
    };
    export function actionSelectionFactory<Attrs extends Record<string, any> = Record<string, any>>(internals: ActionSelectionInternals, args: OctironActionSelectionArgs<Attrs>): OctironActionSelection & OctironActionSelectionHooks;
}
declare module "renderers/ActionSelectionRenderer" {
    import type m from "mithril";
    import { type ActionSelectionInternals } from "factories/actionSelectionFactory";
    import type { ActionSelectView, OctironActionSelectionArgs, Selector } from "types/octiron";
    import type { JSONObject } from "types/common";
    export type ActionSelectionRendererAttrs = {
        value: JSONObject;
        actionValue: JSONObject;
        selector: Selector;
        internals: Omit<ActionSelectionInternals, 'name' | 'type' | 'datatype' | 'pointer' | 'spec' | 'value' | 'actionValue' | 'octiron'>;
        args: OctironActionSelectionArgs;
        view: ActionSelectView;
    };
    export const ActionSelectionRenderer: m.FactoryComponent<ActionSelectionRendererAttrs>;
}
declare module "factories/actionFactory" {
    import type { Store } from "store";
    import type { JSONObject } from "types/common";
    import type { Octiron, OctironAction, OctironPerformArgs, TypeDefs } from "types/octiron";
    import type { EntityState } from "types/store";
    export interface OctironActionHooks {
        _updateArgs(args: OctironPerformArgs): void;
    }
    export type ActionInternals = {
        octiron: Octiron;
        store: Store;
        typeDefs: TypeDefs;
    };
    export type ActionRefs = {
        url?: string;
        method: string;
        submitting: boolean;
        payload: JSONObject;
        store: Store;
        typeDefs: TypeDefs;
        submitResult?: EntityState;
    };
    export function actionFactory<Attrs extends Record<string, any> = Record<string, any>>(internals: ActionInternals, args: OctironPerformArgs<Attrs>): OctironAction & OctironActionHooks;
}
declare module "renderers/PerformRenderer" {
    import type m from 'mithril';
    import { type ActionInternals } from "factories/actionFactory";
    import type { OctironPerformArgs, PerformView, Selector } from "types/octiron";
    export type PerformRendererAttrs = {
        internals: ActionInternals;
        selector?: Selector;
        args: OctironPerformArgs;
        view: PerformView;
    };
    export const PerformRenderer: m.FactoryComponent<PerformRendererAttrs>;
}
declare module "factories/selectionFactory" {
    import type { JSONValue } from "types/common";
    import type { BaseAttrs, Octiron, OctironSelectArgs, OctironSelection, TypeDefs } from "types/octiron";
    import type { Store } from "store";
    export type SelectionFactoryInternals = {
        store: Store;
        typeDefs: TypeDefs;
        parent?: Octiron;
        value?: JSONValue;
        datatype?: string;
    };
    export interface OctironHooks {
        _updateArgs(args: OctironSelectArgs): void;
        _updateValue(value: JSONValue): void;
    }
    /**
     * @description
     * An internal factory function for creating `OctironSelection` objects.
     *
     * @param internals Internally held values from upstream.
     * @param args User given arguments.
     */
    export function selectionFactory<Attrs extends BaseAttrs = {}>(internals: SelectionFactoryInternals, args?: OctironSelectArgs<Attrs>): OctironSelection & OctironHooks;
}
declare module "renderers/SelectionRenderer" {
    import type { JSONValue } from "types/common";
    import type { Octiron, OctironSelectArgs, Selector, SelectView, TypeDefs } from "types/octiron";
    import m from "mithril";
    import type { Store } from "store";
    export type SelectionRendererInternals = {
        store: Store;
        typeDefs: TypeDefs;
        parent?: Octiron;
        value?: JSONValue;
    };
    export type SelectionRendererAttrs = {
        selector: Selector;
        args: OctironSelectArgs;
        view: SelectView;
        internals: SelectionRendererInternals;
    };
    /**
     * @description
     * Subscribes to a selection's result using the Octiron store. Each selection
     * result is feed to an Octiron instance and is only removed if a later
     * selection update does not include the same result. Selection results are
     * given a unique key in the form of a json-path.
     *
     * Once an Octiron instance is created using a selection, further changes via
     * the upstream internals object or user given args applied to the downstream
     * Octiron instances using their internal update hooks.
     */
    export const SelectionRenderer: m.FactoryComponent<SelectionRendererAttrs>;
}
declare module "factories/rootFactory" {
    import type { OctironRoot, TypeDefs } from "types/octiron";
    import type { Store } from "store";
    export type RootFactoryInternals = {
        store: Store;
        typeDefs: TypeDefs;
    };
    /**
     * @description
     * An internal factory function for creating `OctironRoot` objects.
     *
     * @param internals Internally held values from upstream.
     */
    export function rootFactory(internals: RootFactoryInternals): OctironRoot;
}
declare module "utils/makeTypeDefs" {
    import { Store } from "store";
    import type { TypeDef, TypeDefs } from "types/octiron";
    export function makeTypeDefs<const Type extends string = string, const TypeDefList extends TypeDef<any, Type> = TypeDef<any, Type>>(store: Store, ...typeDefs: Readonly<TypeDefList[]>): TypeDefs<Type, TypeDefList>;
    export function makeTypeDefs<const Type extends string = string, const TypeDefList extends TypeDef<any, Type> = TypeDef<any, Type>>(...typeDefs: Readonly<TypeDefList[]>): TypeDefs<Type, TypeDefList>;
}
declare module "utils/classes" {
    type ClassArg = undefined | null | string | string[] | Record<string, boolean | undefined>;
    /**
     * Merges arguments into a single css class string
     */
    export function classes(...classArgs: ClassArg[]): string;
}
declare module "utils/makeTypeDef" {
    import type { JSONValue } from "types/common";
    import type { TypeDef } from "types/octiron";
    /**
     * @description
     * Utility for creating a well typed typeDef.
     *
     * @param typeDef An object to property define the types for.
     */
    export function makeTypeDef<const Model extends JSONValue = JSONValue, const Type extends string = string>(typeDef: TypeDef<Model, Type>): TypeDef<Model, Type>;
}
declare module "handlers/jsonLDHandler" {
    import type { Handler } from "types/store";
    export const jsonLDHandler: Handler;
}
declare module "components/OctironJSON" {
    import m from 'mithril';
    import type { JSONValue } from "types/common";
    export type OctironJSONAttrs = {
        selector?: string;
        value: JSONValue;
        location?: URL;
    };
    export const OctironJSON: m.ClosureComponent<OctironJSONAttrs>;
}
declare module "components/OctironDebug" {
    import m from 'mithril';
    import type { Octiron } from "types/octiron";
    export type OctironDebugAttrs = {
        o: Octiron;
        selector?: string;
        location?: URL;
    };
    export const OctironDebug: m.ClosureComponent<OctironDebugAttrs>;
}
declare module "components/OctironExplorer" {
    import m from 'mithril';
    import type { Octiron } from "types/octiron";
    export type OctironExplorerAttrs = {
        selector?: string;
        presentationStyle?: 'debug' | 'components';
        autofocus?: boolean;
        onChange?: (selector: string, presentationStyle: 'debug' | 'components') => void;
        location?: URL;
        o: Octiron;
    };
    export const OctironExplorer: m.ClosureComponent<OctironExplorerAttrs>;
}
declare module "components/OctironForm" {
    import m from 'mithril';
    import type { OctironAction } from "types/octiron";
    export type OctironFormAttrs = {
        o: OctironAction;
        id?: string;
        class?: string;
    };
    export const OctironForm: m.ClosureComponent<OctironFormAttrs>;
}
declare module "components/OctironSubmitButton" {
    import m from 'mithril';
    import type { OctironAction } from "types/octiron";
    export type OctironSubmitButtonAttrs = {
        o: OctironAction;
        id?: string;
        class?: string;
    };
    export const OctironSubmitButton: m.ClosureComponent<OctironSubmitButtonAttrs>;
}
declare module "octiron" {
    import type { OctironRoot, TypeDef } from "types/octiron";
    import { Store } from "store";
    export * from "types/common";
    export * from "types/store";
    export * from "types/octiron";
    export * from "store";
    export * from "utils/classes";
    export * from "utils/makeTypeDef";
    export * from "utils/makeTypeDefs";
    export * from "handlers/jsonLDHandler";
    export * from "components/OctironJSON";
    export * from "components/OctironDebug";
    export * from "components/OctironExplorer";
    export * from "components/OctironForm";
    export * from "components/OctironSubmitButton";
    /**
     * Creates a root octiron instance.
     */
    declare function octiron({ typeDefs, ...storeArgs }: ConstructorParameters<typeof Store>[0] & {
        typeDefs?: TypeDef<any>[];
    }): OctironRoot;
    declare namespace octiron {
        var fromInitialState: ({ typeDefs, ...storeArgs }: Parameters<typeof Store.fromInitialState>[0] & {
            typeDefs?: TypeDef<any>[];
        }) => OctironRoot;
    }
    export default octiron;
}
