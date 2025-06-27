
/**
 * @description
 * Espects a list of json pointer parts and returns a json pointer.
 */
export function escapeJSONPointerParts(...parts: string[]): string {
  const escaped = parts
    .map((part) => part.replace(/~/, '~0').replace(/\//, '~1'))
    .join('/');

  return `${escaped}`;
}
