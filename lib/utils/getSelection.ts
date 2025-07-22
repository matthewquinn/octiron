
import type { JSONArray, JSONObject, JSONValue, Mutable } from '../types/common.ts';
import type { EntitySelectionResult, SelectionDetails, SelectionResult, ValueSelectionResult } from '../types/store.ts';
import { escapeJSONPointerParts } from './escapeJSONPointerParts.ts';
import { getIterableValue } from "./getIterableValue.ts";
import { isIRIObject } from "./isIRIObject.ts";
import { isIterable } from "./isIterable.ts";
import { isJSONObject } from './isJSONObject.ts';
import { isMetadataObject } from "./isMetadataObject.ts";
import { isValueObject } from "./isValueObject.ts";
import { parseSelectorString } from './parseSelectorString.ts';
import type { Store } from '../store.ts';

/**
 * A circular selection error occurs when two or more
 * entities contain no concrete values and their '@id'
 * values point to each other in a way that creates a
 * loop. The `getSelection` function will throw when
 * this scenario is detected to prevent an infinite
 * loop.
 */
export class CircularSelectionError extends Error {}

export type SelectorObject = {
  subject: string;
  filter?: string;
};

type SourceSelectionResults =
  | EntitySelectionResult
  | ValueSelectionResult
;

type ProcessingEntitySelectionResult = {
  // used to build the final key value.
  keySource: string;
} & Omit<EntitySelectionResult, 'key'>;

type ProcessingValueSelectionResult = {
  // used to build the final key value.
  keySource: string;
} & Omit<ValueSelectionResult, 'key'>;

type ProcessingSelectionDetails = SelectionDetails<
  | ProcessingEntitySelectionResult
  | ProcessingValueSelectionResult
>;


export function transformProcessedDetails<T extends SelectionResult>(
  processing: ProcessingSelectionDetails,
): SelectionDetails<T> {
  for (let index = 0; index < processing.result.length; index++) {
    const element = processing.result[index];

    (element as unknown as Mutable<SourceSelectionResults>).key = Symbol.for(element.keySource);

    // deno-lint-ignore no-explicit-any
    delete (element as any).keySource;
  }

  return processing as unknown as SelectionDetails<T>;
}

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
export function getSelection<T extends SelectionResult>({
  selector: selectorStr,
  value,
  actionValue,
  store,
}: {
  selector: string;
  value?: JSONObject;
  actionValue?: JSONObject;
  store: Store;
}): SelectionDetails<T> {
  const details: ProcessingSelectionDetails = {
    complete: false,
    hasErrors: false,
    hasMissing: false,
    required: [],
    dependencies: [],
    result: [],
  };

  if (typeof value === 'undefined') {
    const [{ subject: iri, filter }, ...selector] =
      parseSelectorString(selectorStr);

    selectEntity({
      keySource: '',
      pointer: '',
      iri,
      filter,
      selector: selector.length > 0 ? selector : undefined,
      store,
      details,
    });

    details.complete = details.required.length === 0;

    return transformProcessedDetails<T>(details);
  }

  const selector = parseSelectorString(selectorStr);

  traverseSelector({
    keySource: '',
    pointer: '',
    value,
    actionValue,
    selector,
    store,
    details,
  });

  details.complete = details.required.length === 0;

  for (let index = 0; index < details.result.length; index++) {
    const element = details.result[index];

    (element as unknown as Mutable<SourceSelectionResults>).key = Symbol.for(element.keySource);
  }

  return transformProcessedDetails<T>(details);
}

function makePointer(pointer: string, addition: string | number) {
  return `${pointer}/${escapeJSONPointerParts(addition.toString())}`;
}

/**
 * Filters apply to objects with `@type` properties. These can be strings or
 * arrays of strings and are considered a pass if any of the values match the
 * filter.
 *
 * If an object is provided which does not contain an `@type` property it is
 * considered a fail.
 */
function passesFilter({
  value,
  filter,
}: {
  value: JSONObject;
  filter?: string;
}): boolean {
  if (typeof filter !== 'string') {
    return true;
  }

  if (Array.isArray(value['@type'])) {
    return value['@type'].includes(filter);
  }

  return value['@type'] === filter;
}

/**
 * If a scala value is pulled before a selection is complete the branch
 * can exit early.
 */
function isTraversable(value: JSONValue): value is JSONObject | JSONArray {
  return (
    value !== null &&
    typeof value !== 'undefined' &&
    typeof value !== 'boolean' &&
    typeof value !== 'number' &&
    typeof value !== 'string'
  );
}


/**
 * Handles the final value found in a selection.
 * If a @id, @value jsonld object is provided further
 * recursion might be nessacary.
 */
function resolveValue({
  keySource,
  pointer,
  value,
  datatype,
  filter,
  // spec,
  // actionValue,
  store,
  details,
}: {
  keySource: string;
  pointer: string;
  value: JSONValue;
  spec?: JSONObject;
  actionValue?: JSONValue;
  datatype: string;
  filter?: string;
  store: Store;
  details: ProcessingSelectionDetails;
}) {
  if (value == null) {
    details.hasMissing = true;

    return;
  }

  // if (spec != null) {
  //   const pvs = resolvePropertyValueSpecification({
  //     spec,
  //     store,
  //   });

  //   details.result.push({
  //     pointer: pointer,
  //     type: 'action-value',
  //     datatype,
  //     value,
  //     actionValue,
  //     spec: pvs,
  //     readonly: pvs.readonlyValue,
  //   });

  //   return;
  // }

  if (!isTraversable(value)) {
    details.result.push({
      keySource: pointer,
      pointer: pointer,
      type: 'value',
      datatype,
      value,
    });

    return;
  } else if (isIterable(value)) {
    const list = getIterableValue(value);

    for (let index = 0; index < list.length; index++) {
      const item = list[index];

      if (!isIRIObject(item)) {
        keySource = makePointer(keySource, index);
      }

      resolveValue({
        keySource,
        pointer: makePointer(pointer, index),
        value: item,
        datatype,
        filter,
        store,
        details,
      });

      if (details.hasErrors || details.hasMissing) {
        return;
      }
    }

    return;
  }
  if (typeof filter === 'string' && !passesFilter({ value, filter })) {
    return;
  }

  if (isValueObject(value)) {
    resolveValue({
      keySource,
      pointer,
      value: value['@value'],
      datatype,
      store,
      details,
    });

    return;
  } else if (isMetadataObject(value)) {
    selectEntity({
      keySource,
      pointer,
      iri: value['@id'],
      filter,
      store,
      details,
    });

    return;
  }

  if (isIRIObject(value)) {
    const iri = value['@id'];

    details.result.push({
      keySource,
      pointer,
      type: 'entity',
      iri,
      ok: true,
      value,
    });

    return;
  }

  details.result.push({
    keySource,
    pointer,
    type: 'value',
    datatype,
    value,
  });
}

/**
 * Selects a type from a json value, handling invalid situations.
 */
function selectTypedValue({
  keySource,
  pointer,
  type,
  value,
  actionValue,
  filter,
  store,
  details,
}: {
  keySource: string;
  pointer: string;
  type: string;
  value: JSONValue;
  actionValue?: JSONObject;
  filter?: string;
  store: Store;
  details: ProcessingSelectionDetails;
}): void {
  pointer = makePointer(pointer, type);

  if (!isTraversable(value)) {
    return;
  }

  if (isIterable(value)) {
    const list = getIterableValue(value);

    for (let index = 0; index < list.length; index++) {
      const item = list[index];

      if (!isIRIObject(item)) {
        keySource = makePointer(keySource, index);
      }

      selectTypedValue({
        keySource,
        pointer: makePointer(pointer, index),
        type,
        value: item,
        actionValue,
        filter,
        store,
        details,
      });

      if (details.hasErrors || details.hasMissing) {
        return;
      }
    }

    return;
  }

  if (isMetadataObject(value) && isIRIObject(value)) {
    selectEntity({
      keySource,
      pointer,
      iri: value['@id'],
      selector: [{ subject: type, filter }],
      store,
      details,
    });

    return;
  } else if (isMetadataObject(value)) {
    return;
  }

  let spec: JSONObject | undefined;

  if (isJSONObject(actionValue?.[`${type}-input`])) {
    spec = actionValue[`${type}-input`] as JSONObject;
  }

  resolveValue({
    keySource,
    pointer,
    value: value[type],
    spec,
    actionValue: actionValue?.[type],
    datatype: type,
    filter,
    store,
    details,
  });
}

/**
 * Recurses through the selection until there are no further selection items.
 */
function traverseSelector({
  keySource,
  pointer,
  selector,
  value,
  actionValue,
  store,
  details,
}: {
  keySource: string;
  pointer: string;
  selector: SelectorObject[];
  value: JSONValue;
  actionValue?: JSONObject;
  store: Store;
  details: ProcessingSelectionDetails;
}): void {

  if (selector.length === 0) {
    return;
  } else if (!isTraversable(value)) {
    return;
  }

  if (isIterable(value)) {
    const list = getIterableValue(value);

    for (let index = 0; index < list.length; index++) {
      const item = list[index];

      if (!isIRIObject(item)) {
        keySource = makePointer(keySource, index);
      }

      // keep nesting on the full selector
      // as only objects can be subscripted
      // with terms
      traverseSelector({
        keySource,
        pointer: makePointer(pointer, index),
        selector,
        value: item,
        actionValue,
        store,
        details,
      });

      if (details.hasErrors || details.hasMissing) {
        return;
      }
    }

    return;
  } else if (isValueObject(value)) {
    traverseSelector({
      keySource,
      pointer,
      selector,
      value: value['@value'],
      actionValue,
      store,
      details,
    });
  }

  if (isMetadataObject(value) && isIRIObject(value)) {
    selectEntity({
      keySource,
      pointer,
      selector,
      iri: value['@id'],
      store,
      details,
    });

    return;
  }

  // edit selections are a special case in that an input
  // should render even when no value is present.
  if (isJSONObject(value) && actionValue !== undefined && value[selector[0].subject] == null) {
    value = { [selector[0].subject]: null };
  }

  const [next, ...rest] = selector;
  const { subject: type, filter } = next;

  if (value[type] == null) {
    details.hasMissing = true;

    return;
  }

  if (rest.length === 0) {
    selectTypedValue({
      keySource,
      pointer,
      type,
      filter,
      value,
      actionValue,
      store,
      details,
    });

    return;
  }

  if (typeof filter === 'string' && !passesFilter({ value, filter })) {
    return;
  }

  let traversedActionValue: JSONObject | undefined;

  if (isJSONObject(actionValue?.[type])) {
    traversedActionValue = actionValue[type];
  }

  traverseSelector({
    keySource: makePointer(keySource, type),
    pointer: makePointer(pointer, type),
    selector: rest,
    value: value[type],
    actionValue: traversedActionValue,
    store,
    details,
  });
}

/**
 * Selects an entity from the store and continues the selection
 * if the branch has not completed.
 */
function selectEntity({
  keySource,
  pointer,
  iri,
  filter,
  selector,
  store,
  details,
  handledIRIs,
}: {
  keySource: string;
  pointer: string;
  iri: string;
  filter?: string;
  selector?: SelectorObject[];
  store: Store;
  details: ProcessingSelectionDetails;
  handledIRIs?: Set<string>;
}): void {
  keySource = makePointer(keySource, iri);
  pointer = makePointer(pointer, iri);

  const cache = store.entity(iri)

  details.dependencies.push(iri);

  // if loading is required mark found as false
  if (typeof cache === 'undefined' || cache.loading) {
    if (!details.required.includes(iri)) {
      details.required.push(iri);
    }

    return;
  }

  if (!cache.ok) {
    details.hasErrors = true;

    if (typeof selector === 'undefined' || selector.length === 0) {
      return;
    }

    details.result.push({
      keySource,
      pointer,
      type: 'entity',
      iri: cache.iri,
      ok: false,
      status: cache.status,
      value: cache.value,
      reason: cache.reason,
    });

    return;
  }

  const value = cache.value;

  if (isMetadataObject(value)) {
    // in theory serveral entities could be metadata objects
    // referencing each other and end up looping around...
    if (handledIRIs == null) {
      handledIRIs = new Set([value['@id']]);
    } else if (!handledIRIs.has(value['@id'])) {
      handledIRIs.add(value['@id']);
    } else {
      throw new CircularSelectionError(`Circular selection loop detected`);
    }

    // select the entity this entity is referencing
    return selectEntity({
      keySource,
      pointer,
      iri: value['@id'],
      filter,
      selector,
      details,
      store,
      handledIRIs,
    });
  }

  // if the entity does not match the filter it is not relevant to the final selection
  if (typeof filter === 'string' && !passesFilter({ filter, value })) {
    return;
  }

  if (typeof selector === 'undefined') {
    details.result.push({
      keySource,
      pointer,
      type: 'entity',
      iri: cache.iri,
      ok: true,
      value: cache.value as JSONObject,
    });

    return;
  }

  traverseSelector({
    keySource,
    pointer,
    value,
    selector,
    store,
    details,
  });

  return;
}
