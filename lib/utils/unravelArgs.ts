import type { Octiron, OctironPresentArgs, OctironSelectArgs, Selector, SelectView } from '../types/octiron.ts';

type AllArgs =
  | OctironSelectArgs
  | OctironPresentArgs
;

/**
 * @description
 * Numerious Octiron view functions take a combination of string selector,
 * object args and function view arguments.
 *
 * This `unravelArgs` identifies which arguments are present and returns
 * defaults for the missing arguments.
 *
 * @param arg1 - A selector string, args object or view function if present.
 * @param arg2 - An args object or view function if present.
 * @param arg3 - A view function if present.
 */
export function unravelArgs(
  arg1?: Selector | OctironSelectArgs | SelectView,
  arg2?: OctironSelectArgs | SelectView,
  arg3?: SelectView,
): [Selector, OctironSelectArgs, SelectView];

/**
 * @description
 * Numerious Octiron view functions take a combination of string selector,
 * object args and function view arguments.
 *
 * This `unravelArgs` identifies which arguments are present and returns
 * defaults for the missing arguments.
 *
 * @param arg1 - A selector string, args object or view function if present.
 * @param arg2 - An args object or view function if present.
 * @param arg3 - A view function if present.
 */
export function unravelArgs(
  arg1?: Selector | OctironPresentArgs,
  arg2?: OctironPresentArgs,
): [Selector, OctironSelectArgs];

/**
 * @description
 * Numerious Octiron view functions take a combination of string selector,
 * object args and function view arguments.
 *
 * This `unravelArgs` identifies which arguments are present and returns
 * defaults for the missing arguments.
 *
 * @param arg1 - A selector string, args object or view function if present.
 * @param arg2 - An args object or view function if present.
 * @param arg3 - A view function if present.
 */
export function unravelArgs(
  arg1?: Selector | AllArgs | SelectView,
  arg2?: AllArgs | SelectView,
  arg3?: SelectView,
): [Selector | undefined, AllArgs, SelectView] | [Selector | undefined, AllArgs] {
  let selector: Selector | undefined;
  let args: AllArgs = {};
  let view: SelectView | undefined;

  if (typeof arg1 === "string") {
    selector = arg1;
  } else if (typeof arg1 === "function") {
    view = arg1 as SelectView;
  } else if (arg1 != null) {
    args = arg1;
  }

  if (typeof arg2 === 'function') {
    view = arg2 as SelectView;
  } else if (arg2 != null) {
    args = arg2;
  }

  if (typeof arg3 === 'function') {
    view = arg3;
  }

  if (view == null) {
    view = (o: Octiron) => o.present(args);
  }

  return [
    selector,
    args,
    view,
  ];
}
