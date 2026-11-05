/** Where the row's visible part starts and ends on the screen, inside its padding, and its scroll. */
export interface ScrollBox {
  readonly left: number;
  readonly right: number;
  readonly scrollLeft: number;
}

/** Where a tab starts and ends on the screen. */
export interface TabSpan {
  readonly left: number;
  readonly right: number;
}

/**
 * The scroll that brings the tab inside the box, its start first when it is wider; null when it is
 * already there.
 */
export function scrollLeftShowing(box: ScrollBox, tab: TabSpan): number | null {
  const cutAtStart = box.left - tab.left;
  if (cutAtStart > 0) {
    return box.scrollLeft - cutAtStart;
  }
  const cutAtEnd = tab.right - box.right;
  if (cutAtEnd > 0) {
    return box.scrollLeft + Math.min(cutAtEnd, -cutAtStart);
  }
  return null;
}

/** A tab newly open glides into view, unless the system asks for less motion. */
export function scrollBehaviorOf(isReducedMotion: boolean): ScrollBehavior {
  return isReducedMotion ? 'instant' : 'smooth';
}
