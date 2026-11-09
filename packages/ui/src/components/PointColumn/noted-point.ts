import type { ReactNode } from 'react';

/** One fixed place of the column, in a fixed order: what to tell, then what was noted of it. */
export interface NotedPoint {
  /** The point, which its passage in the text shares to be emphasized with it. */
  readonly id: string;
  /** Its name, in mono over its value: "Your activity". */
  readonly label: ReactNode;
  /** What to tell, in grey while nothing is noted: "E.g. a bakery, a plumber, a cottage". */
  readonly example: ReactNode;
  /** What was noted, `null` while nothing is. */
  readonly value: ReactNode | null;
  /** The name of the cross that removes a noted value, in the app's words: "Remove: your activity". Without it, no cross. */
  readonly removeLabel?: string;
}

/** Whether the point holds a noted value. */
export function isNoted(point: NotedPoint): boolean {
  return point.value !== null;
}
