import { StepPartState } from '../StepProgress/step-parts.ts';

/**
 * A step's state on a journey of steps, by its index and the current one's, both from 0: done
 * before it, current on it, upcoming after it. A current index past the last step has every step
 * done.
 */
export function stepStateAt(index: number, currentIndex: number): StepPartState {
  if (index < currentIndex) {
    return StepPartState.done;
  }
  return index === currentIndex ? StepPartState.current : StepPartState.upcoming;
}

/** The step the reader stands on, from 1, the last one once every step is done. */
export function stepPositionOf(currentIndex: number, count: number): number {
  return Math.min(Math.max(currentIndex, 0), count - 1) + 1;
}
