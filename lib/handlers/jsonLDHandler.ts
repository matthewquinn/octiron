import type { ContentTypeHandler } from '../store.ts';
import type { JSONObject } from '../types/common.ts';
import jsonld from 'jsonld';
import { isJSONObject } from '../utils/isJSONObject.ts';


export const jsonLDHandler: ContentTypeHandler = async ({
  res,
  store,
}) => {
  const json = await res.json();

  // cannot use json-ld ops on scalar types
  if (!isJSONObject(json) && !Array.isArray(json)) {
    throw new Error('JSON-LD Document should be an object');
  }

  const expanded = await jsonld.expand(json, {
    documentLoader: async (url: string) => {
      const res = await fetch(url, {
        headers: {
          'accept': 'application/ld+json',
        }
      });
      const document = await res.json();

      return {
        documentUrl: url,
        document,
      };
    }
  });

  const value = await jsonld.compact(expanded, store.context) as JSONObject;

  return {
    value,
    outputType: 'jsonld',
  };
}
