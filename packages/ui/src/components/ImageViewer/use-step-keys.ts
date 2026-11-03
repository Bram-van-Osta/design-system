import type { KeyboardEvent } from 'react';

const STEP_KEYS = {
  previous: 'ArrowLeft',
  next: 'ArrowRight',
} as const;

export interface ImageSteps {
  /** The previous image; without it, there is no Previous command. */
  readonly onPrevious?: () => void;
  /** The next image; without it, there is no Next command. */
  readonly onNext?: () => void;
  /** `false` on the first image: Previous stays displayed, disabled. */
  readonly hasPrevious: boolean;
  /** `false` on the last image: Next stays displayed, disabled. */
  readonly hasNext: boolean;
}

/**
 * The arrow keys walk the images from anywhere in the dialog, except where they already mean
 * something: a control that handled them (a toggle group), a field, or with a modifier.
 */
export function useStepKeys(steps: ImageSteps): (event: KeyboardEvent<HTMLElement>) => void {
  return (event) => {
    if (event.defaultPrevented || hasModifier(event) || isEditable(event.target)) {
      return;
    }
    const step = stepOf(event.key, steps);
    if (step === undefined) {
      return;
    }
    event.preventDefault();
    step();
  };
}

function stepOf(key: string, steps: ImageSteps): (() => void) | undefined {
  if (key === STEP_KEYS.previous && steps.hasPrevious) {
    return steps.onPrevious;
  }
  if (key === STEP_KEYS.next && steps.hasNext) {
    return steps.onNext;
  }
  return undefined;
}

function hasModifier(event: KeyboardEvent<HTMLElement>): boolean {
  return event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
}

function isEditable(target: EventTarget): boolean {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}
