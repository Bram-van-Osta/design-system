import type { MessageKey } from '../../i18n/messages.ts';

export const StepPartState = {
  done: 'done',
  current: 'current',
  upcoming: 'upcoming',
} as const;
export type StepPartState = (typeof StepPartState)[keyof typeof StepPartState];

/** A part's state in words, for screen readers, after its name. */
export const STEP_PART_STATE_MESSAGES = {
  done: 'stepProgress.done',
  current: 'stepProgress.current',
  upcoming: 'stepProgress.upcoming',
} as const satisfies Readonly<Record<StepPartState, MessageKey>>;

/** How the segments are drawn. */
export const StepProgressTone = {
  /** The filled segments in Delft blue: a journey the person moves through, such as a form. */
  delft: 'delft',
  /**
   * The done segments in ink, the current one in vermilion, the next ones in the line color: a
   * page that follows where something stands for the person, such as a request.
   */
  ink: 'ink',
  /**
   * The done segments in Delft blue, the current one in pale Delft, 4 px high: a journey in
   * sections, such as a questionnaire, one segment per section.
   */
  sections: 'sections',
} as const;
export type StepProgressTone = (typeof StepProgressTone)[keyof typeof StepProgressTone];

/**
 * A segment's state: done before the step the person is on, current on it, upcoming after it, every
 * one upcoming before any is filled.
 */
export function segmentStateOf(step: number, filledCount: number): StepPartState {
  if (step < filledCount) {
    return StepPartState.done;
  }
  return step === filledCount ? StepPartState.current : StepPartState.upcoming;
}

/** A named part of a journey, which holds a few of its steps in a row. */
export interface StepProgressPart {
  /** Its name under its group of segments, on a computer: "Your business". */
  readonly label: string;
  /** Its name on a phone, where the names share one line: "Business". */
  readonly shortLabel: string;
  /** How many steps it holds, at least one. */
  readonly steps: number;
}

export interface PlacedStepPart {
  readonly part: StepProgressPart;
  readonly state: StepPartState;
  /** Its steps, numbered from 1 across the journey. */
  readonly steps: readonly number[];
}

interface PlaceStepPartsOptions {
  readonly parts: readonly StepProgressPart[];
  readonly max: number;
  readonly filledCount: number;
}

// The filled segments run up to the step the person is on: the first one before any is filled.
function stateOf(steps: readonly number[], filledCount: number): StepPartState {
  const currentStep = Math.max(filledCount, 1);
  const [first = currentStep] = steps;
  const last = first + steps.length - 1;
  if (last < currentStep) {
    return StepPartState.done;
  }
  return first <= currentStep ? StepPartState.current : StepPartState.upcoming;
}

function stepCountOf(parts: readonly StepProgressPart[]): number {
  return parts.reduce((count, part) => count + part.steps, 0);
}

/**
 * The parts with their steps and their state: current for the one that holds the step the person is
 * on, the last one started; done before it, upcoming after it. Parts that do not hold the journey's
 * steps exactly are a mistake of the app, refused as soon as it renders them.
 */
export function placeStepParts({
  parts,
  max,
  filledCount,
}: PlaceStepPartsOptions): readonly PlacedStepPart[] {
  if (parts.some((part) => !Number.isInteger(part.steps) || part.steps < 1)) {
    throw new Error('Each part of a StepProgress holds a whole number of steps, one at least.');
  }
  if (stepCountOf(parts) !== max) {
    throw new Error(
      `The parts of a StepProgress hold ${stepCountOf(parts)} steps, not its ${max}.`,
    );
  }
  let firstStep = 1;
  return parts.map((part) => {
    const steps = Array.from({ length: part.steps }, (_, index) => firstStep + index);
    firstStep += part.steps;
    return { part, steps, state: stateOf(steps, filledCount) };
  });
}

/** The columns of the parts, each one as wide as its steps, so that a name sits under its group. */
export function partColumnsOf(parts: readonly StepProgressPart[]): string {
  return parts.map((part) => `minmax(0, ${part.steps}fr)`).join(' ');
}

/**
 * A question's state in a split segment: answered and passed behind the person, the one they are on,
 * those to come.
 */
export const StepSplitState = {
  answered: 'answered',
  passed: 'passed',
  current: 'current',
  upcoming: 'upcoming',
} as const;
export type StepSplitState = (typeof StepSplitState)[keyof typeof StepSplitState];

/**
 * A current segment split into its questions holds one at least, and one current at most: a split
 * that does not is a mistake of the app, refused as soon as it renders it.
 */
export function checkSplitSteps(states: readonly StepSplitState[]): void {
  if (states.length === 0) {
    throw new Error('A StepProgress splits its current segment into one question at least.');
  }
  if (states.filter((state) => state === StepSplitState.current).length > 1) {
    throw new Error('A StepProgress splits its current segment with one current question at most.');
  }
}
