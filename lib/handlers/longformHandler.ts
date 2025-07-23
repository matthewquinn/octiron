import { longform } from '@occultist/longform';
import type { Handler } from "../types/store.ts";

export const longformHandler: Handler = {
  integrationType: 'html-fragments',
  contentType: 'text/lf',
  handler: async ({ res }) => {
    const text = await res.text();
    const result = longform(text);

    return {
      root: result.root,
      ided: result.ident,
      anon: result.anon,
    };
  },
};
