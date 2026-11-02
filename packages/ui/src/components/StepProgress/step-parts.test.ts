import { describe, expect, it } from 'vitest';
import {
  partColumnsOf,
  placeStepParts,
  StepPartState,
  type StepProgressPart,
} from './step-parts.ts';

const BRIEF_PARTS: readonly StepProgressPart[] = [
  { label: 'Your situation', shortLabel: 'Situation', steps: 3 },
  { label: 'Your business', shortLabel: 'Business', steps: 2 },
  { label: 'Your project', shortLabel: 'Project', steps: 2 },
  { label: 'Reaching you', shortLabel: 'Contact', steps: 1 },
];
const BRIEF_STEPS = 8;

function statesAt(filledCount: number): readonly StepPartState[] {
  return placeStepParts({ parts: BRIEF_PARTS, max: BRIEF_STEPS, filledCount }).map(
    (part) => part.state,
  );
}

const { done, current, upcoming } = StepPartState;

describe('placeStepParts', () => {
  it('should number each part steps across the journey', () => {
    const placed = placeStepParts({ parts: BRIEF_PARTS, max: BRIEF_STEPS, filledCount: 0 });
    expect(placed.map((part) => part.steps)).toEqual([[1, 2, 3], [4, 5], [6, 7], [8]]);
  });

  it('should make the first part current before any step is filled', () => {
    expect(statesAt(0)).toEqual([current, upcoming, upcoming, upcoming]);
  });

  it('should keep a part current up to its last step', () => {
    expect(statesAt(1)).toEqual([current, upcoming, upcoming, upcoming]);
    expect(statesAt(3)).toEqual([current, upcoming, upcoming, upcoming]);
  });

  it('should mark a part done once the person is on the next part', () => {
    expect(statesAt(4)).toEqual([done, current, upcoming, upcoming]);
    expect(statesAt(5)).toEqual([done, current, upcoming, upcoming]);
    expect(statesAt(6)).toEqual([done, done, current, upcoming]);
  });

  it('should make the last part current on the last step', () => {
    expect(statesAt(BRIEF_STEPS)).toEqual([done, done, done, current]);
  });

  it('should refuse parts that hold fewer or more steps than the journey', () => {
    expect(() => placeStepParts({ parts: BRIEF_PARTS, max: 7, filledCount: 0 })).toThrow(
      'The parts of a StepProgress hold 8 steps, not its 7.',
    );
    expect(() => placeStepParts({ parts: BRIEF_PARTS, max: 9, filledCount: 0 })).toThrow(
      'The parts of a StepProgress hold 8 steps, not its 9.',
    );
  });

  it('should refuse a part without a whole number of steps', () => {
    const parts = [
      { label: 'Your situation', shortLabel: 'Situation', steps: 0 },
      { label: 'Your business', shortLabel: 'Business', steps: 1.5 },
    ];
    expect(() => placeStepParts({ parts, max: 1.5, filledCount: 0 })).toThrow(
      'Each part of a StepProgress holds a whole number of steps, one at least.',
    );
  });
});

describe('partColumnsOf', () => {
  it('should give each part a column as wide as its steps', () => {
    expect(partColumnsOf(BRIEF_PARTS)).toBe(
      'minmax(0, 3fr) minmax(0, 2fr) minmax(0, 2fr) minmax(0, 1fr)',
    );
  });
});
