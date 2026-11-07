import { describe, expect, it } from 'vitest';
import { StepPartState } from '../StepProgress/step-parts.ts';
import { stepPositionOf, stepStateAt } from './step-band.ts';

describe('stepStateAt', () => {
  it('should hold the steps before the current one done, the current one, then the rest', () => {
    expect([0, 1, 2, 3].map((index) => stepStateAt(index, 2))).toEqual([
      StepPartState.done,
      StepPartState.done,
      StepPartState.current,
      StepPartState.upcoming,
    ]);
  });

  it('should hold every step done once the current index is past the last one', () => {
    expect([0, 1, 2].map((index) => stepStateAt(index, 3))).toEqual([
      StepPartState.done,
      StepPartState.done,
      StepPartState.done,
    ]);
  });
});

describe('stepPositionOf', () => {
  it('should count the current step from 1', () => {
    expect(stepPositionOf(0, 6)).toBe(1);
    expect(stepPositionOf(3, 6)).toBe(4);
  });

  it('should stand on the last step once every step is done', () => {
    expect(stepPositionOf(6, 6)).toBe(6);
  });

  it('should stand on the first step for an index before it', () => {
    expect(stepPositionOf(-1, 6)).toBe(1);
  });
});
