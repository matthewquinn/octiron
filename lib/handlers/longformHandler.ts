import { longform } from '@occultist/longform';
import type { ContentTypeHandler } from "../types/store.ts";

export const longformHandler: ContentTypeHandler = async ({
  res,
}) => {
  const text = await res.text();
  const result = longform(text);

  return {
    outputType: 'html-fragments',
    root: result.root,
    ided: result.ided,
    fragments: result.fragments,
  };
};
