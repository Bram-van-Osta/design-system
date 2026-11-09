import { useEffect, useRef } from 'react';
import { isNoted, type NotedPoint } from './noted-point.ts';

/** Between two points one reading notes, in the column's order. */
export const ARRIVAL_STAGGER_MILLISECONDS = 80;

const NO_DELAY = 0;

/**
 * The delay of each point's arrival: the points noted since the last render come one after the
 * other, 80 ms apart; the others have none.
 */
export function useArrivalDelays(points: readonly NotedPoint[]): (id: string) => number {
  const notedBefore = useRef<ReadonlySet<string>>(new Set());
  const noted = points.filter(isNoted).map((point) => point.id);
  const arriving = noted.filter((id) => !notedBefore.current.has(id));

  useEffect(() => {
    notedBefore.current = new Set(noted);
  });

  return (id) => {
    const order = arriving.indexOf(id);
    return order === -1 ? NO_DELAY : order * ARRIVAL_STAGGER_MILLISECONDS;
  };
}
