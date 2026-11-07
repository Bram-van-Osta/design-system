import type { StepPartState } from '../StepProgress/step-parts.ts';

// A step's bar: done in Delft, current in pale Delft, upcoming in the line color.
export const STEP_BAR_COLOR_CLASSES: Readonly<Record<StepPartState, string>> = {
  done: 'bg-delft',
  current: 'bg-delft-pale',
  upcoming: 'bg-line',
};

export function stepBarClassesOf(state: StepPartState): string {
  return `block h-progress-bar-height ${STEP_BAR_COLOR_CLASSES[state]}`;
}
