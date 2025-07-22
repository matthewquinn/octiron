import type { Attributes, Children, ComponentTypes } from 'mithril';
import type { JSONValue } from './common.ts'
import type { Store } from '../store.ts';
import type {
  ContentHandlingFailure,
  HTTPFailure,
  UndefinedFailure,
} from '../failures.ts';

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

export type PresentAttrs<
  Value extends JSONValue = JSONValue,
  Attrs extends BaseAttrs = BaseAttrs,
> = {
  renderType: 'present';
  o: Octiron;
  attrs: Attrs;
  value: Value;
};

export type PresentComponent<
  Value extends JSONValue = JSONValue,
  Attrs extends BaseAttrs = BaseAttrs,
> = ComponentTypes<PresentAttrs<Value, Attrs>>;

export type TypeDef<
  Value extends JSONValue = JSONValue,
  Type extends string = string,
> = {
  type: Type;
  present?: PresentComponent<Value>;
};

export type TypeDefs<
  Type extends string = string,
  // deno-lint-ignore no-explicit-any
  TypeDefList extends TypeDef<any, Type> = TypeDef<any, Type>,
> = {
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
export type FallbackView = (
  o: OctironSelection,
  err: UndefinedFailure | HTTPFailure | ContentHandlingFailure,
) => Children;

export type Fallback = FallbackView | Children;

/**
 * Arguments for all methods which afford fetching entities.
 */
export type FetchableArgs = {
  /*
   * Override the accept header
   */
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

export type PresentableArgs<
  Value extends JSONValue = JSONValue,
  Attrs extends BaseAttrs = BaseAttrs,
> = {
  attrs?: Attrs;
  component?: PresentComponent<Value, Attrs>;
  fallbackComponent?: PresentComponent<Value, Attrs>;
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

export type OctironSelectArgs<
  Value extends JSONValue = JSONValue,
  Attrs extends BaseAttrs = BaseAttrs,
> =
  & FetchableArgs
  & IterableArgs
  & PresentableArgs<Value, Attrs>;

export type OctironPresentArgs<
  Value extends JSONValue = JSONValue,
  Attrs extends BaseAttrs = BaseAttrs,
> = PresentableArgs<Value, Attrs>;

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
  // deno-lint-ignore no-explicit-any
  root(args: OctironSelectArgs<any>): Children;
  root(view: SelectView): Children;
  // deno-lint-ignore no-explicit-any
  root(selector: Selector, args: OctironSelectArgs<any>): Children;
  root(selector: Selector, view: SelectView): Children;
  // deno-lint-ignore no-explicit-any
  root(args: OctironSelectArgs<any>, view: SelectView): Children;
  // deno-lint-ignore no-explicit-any
  root(selector: Selector, args: OctironSelectArgs<any>, view: SelectView): Children;
}

export interface EntryPoint {
  enter(selector: Selector): Children;
  // deno-lint-ignore no-explicit-any
  enter(selector: Selector, args: OctironSelectArgs<any>): Children;
  enter(selector: Selector, view: SelectView): Children;
  enter(
    selector: Selector,
  // deno-lint-ignore no-explicit-any
    args: OctironSelectArgs<any>,
    view: SelectView,
  ): Children;
}

export interface Selectable {
  select(selector: Selector): Children;
  // deno-lint-ignore no-explicit-any
  select(selector: Selector, args: OctironSelectArgs<any>): Children;
  select(selector: Selector, view: SelectView): Children;
  select(
    selector: Selector,
  // deno-lint-ignore no-explicit-any
    args: OctironSelectArgs<any>,
    view: SelectView,
  ): Children;
}

export interface Presentable {
  present(): Children;
  present(args: OctironPresentArgs): Children;
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

export interface OctironRoot
  extends
    Origin,
    // EntryPoint,
    Selectable,
    Filterable,
    Presentable {
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

export interface OctironSelection
  extends
    Origin,
    EntryPoint,
    Selectable,
    Filterable,
    Presentable {
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

export type Octiron =
  | OctironRoot
  | OctironSelection;
