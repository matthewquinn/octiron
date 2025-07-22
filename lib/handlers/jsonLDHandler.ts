import type { JSONObject } from '../types/common.ts';
import type { Handler } from "../types/store.ts";
import { isJSONObject } from '../utils/isJSONObject.ts';
import jsonld from 'jsonld';


export const jsonLDHandler: Handler = {
  integrationType: 'jsonld',
  contentType: 'application/ld+json',
  handler: async ({ res, store }) => {
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
      jsonld: value,
    };
  },
};
