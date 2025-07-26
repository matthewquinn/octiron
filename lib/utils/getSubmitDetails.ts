import uriTemplates from 'uri-templates';
import type { Store } from "../store.ts";
import type { JSONObject, JSONValue, SchemaAction } from '../types/common.ts';
import { isJSONObject } from './isJSONObject.ts';


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
export function getSubmitDetails({
  payload,
  action,
  store,
}: {
  payload: JSONObject;
  action: SchemaAction;
  store: Store;
}): SubmitDetails {
  let urlTemplate: string | undefined;
  let body: string | undefined;
  let method: string = 'get';
  let contentType: string | undefined;
  let encodingType: string | undefined;
  const target = action['scm:target'];

  if (typeof target === 'string') {
    urlTemplate = target;
  } else if (isJSONObject(target)) {
    if (typeof target['scm:urlTemplate'] === 'string') {
      urlTemplate = target['scm:urlTemplate'];
    }

    if (typeof target['scm:httpMethod'] === 'string') {
      method = target['scm:httpMethod'].toLowerCase();
    }

    if (typeof target['scm:contentType'] === 'string') {
      contentType = target['scm:contentType'];
    }

    if (typeof target['scm:encodingType'] === 'string') {
      encodingType = target['scm:encodingType'];
    }
  }

  if (typeof urlTemplate !== 'string') {
    throw new Error('Action has invalid scm:target');
  }

  const template = uriTemplates(urlTemplate);

  // deno-lint-ignore no-explicit-any
  const url: string = template.fill(payload as any);

  // only add body if supporting HTTP method
  if (method !== 'get' && method !== 'delete') {
    const json: Record<string, JSONValue> = {};
    payload['@context'] = store.context;
    
    for (const [key, value] of Object.entries(payload)) {
      json[store.expand(key)] = value;
    }
  }

  return {
    url,
    method,
    contentType,
    encodingType,
    body,
  };
}
