
type ClassArg =
  | undefined
  | null
  | string
  | string[]
  | Record<string, boolean | undefined>
;

/**
 * Merges arguments into a single css class string
 */
export function classes(...classArgs: ClassArg[]) {
  const cls: string[] = [];

  for (const classArg of classArgs) {
    if (typeof classArg === 'undefined' || classArg === null) {
      continue;
    } else if (typeof classArg === 'string') {
      cls.push(classArg);
    } else if (Array.isArray(classArg)) {
      for (const name of classArg) {
        cls.push(name);
      }
    } else {
      for (const [name, active] of Object.entries(classArg)) {
        if (active) {
          cls.push(name);
        }
      }
    }
  }

  return cls.join(' ');
}
