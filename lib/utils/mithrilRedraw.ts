import m from 'mithril';

/**
 * @description
 * Calls Mithril's redraw function if the window object exists.
 */
export function mithrilRedraw() {
  if (typeof window !== 'undefined') {
    m.redraw();
  }
}
