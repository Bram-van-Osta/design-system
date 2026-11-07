import type { ReactNode } from 'react';
import { interpolate } from '../../i18n/interpolate.ts';
import { useMessages } from '../../i18n/use-messages.ts';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';
import { StepPartState } from '../StepProgress/step-parts.ts';
import { CurrentStepDiamond } from './CurrentStepDiamond.tsx';
import { stepPositionOf, stepStateAt } from './step-band.ts';
import { stepBarClassesOf } from './step-bar-classes.ts';

/** A step of the band: its name under its bar. */
export interface StepBandStep {
  /** Stable across renders: the step's code. */
  readonly id: string;
  /** Its name: "The request". */
  readonly label: ReactNode;
}

export interface StepBandProps {
  /** The list's name, read by screen readers: "The case's steps". */
  readonly label: string;
  /** The steps, in order. */
  readonly steps: readonly StepBandStep[];
  /** The current step's index, from 0; the steps before it are done, every one past the last. */
  readonly currentIndex: number;
  /** Where the current step stands, in mono under its name: "pre-analysis ready · yours". */
  readonly subState?: ReactNode;
  readonly className?: string;
}

const STEP_NAME_CLASSES: Readonly<Record<StepPartState, string>> = {
  done: 'text-ink-muted',
  current: 'font-semibold text-ink',
  upcoming: 'text-ink-muted',
};

/**
 * Where a journey stands, its steps in a row: each a bar and its name, a done step's bar in Delft,
 * the current one's in pale Delft with the vermilion diamond before its name and its sub-state under
 * it. On a phone, the bars alone, then the current step's name, its sub-state and its position.
 */
export function StepBand({ label, steps, currentIndex, subState, className }: StepBandProps) {
  const messages = useMessages();
  const currentStep = steps[currentIndex];
  const position = interpolate(messages['stepBand.position'], {
    position: stepPositionOf(currentIndex, steps.length),
    count: steps.length,
  });
  return (
    <div className={classNames('flex flex-col gap-space-2', className)}>
      <ol aria-label={label} className="grid auto-cols-fr grid-flow-col gap-space-1 text-small">
        {steps.map((step, index) => (
          <Step
            key={step.id}
            step={step}
            state={stepStateAt(index, currentIndex)}
            subState={subState}
            doneText={messages['stepProgress.done']}
          />
        ))}
      </ol>
      <div aria-hidden className="flex flex-col gap-space-1 md:hidden">
        {currentStep !== undefined && (
          <span className="flex flex-wrap items-center gap-x-space-2 text-body-s font-semibold text-ink">
            <CurrentStepDiamond />
            {currentStep.label}
            {hasContent(subState) && (
              <span className="font-mono font-normal text-ink-muted text-meta">{subState}</span>
            )}
          </span>
        )}
        <span className="font-mono text-ink-muted text-meta">{position}</span>
      </div>
    </div>
  );
}

interface StepProps {
  readonly step: StepBandStep;
  readonly state: StepPartState;
  readonly subState: ReactNode;
  readonly doneText: string;
}

// From md up, each step's name and the current one's sub-state under its bar; on a phone, the
// names are read but not drawn, the line under the bars saying where the journey stands.
function Step({ step, state, subState, doneText }: StepProps) {
  const isCurrent = state === StepPartState.current;
  return (
    <li
      data-state={state}
      aria-current={isCurrent ? 'step' : undefined}
      className="flex min-w-0 flex-col gap-space-2"
    >
      <span aria-hidden className={stepBarClassesOf(state)} />
      <span
        className={classNames(
          'sr-only md:not-sr-only md:flex md:flex-col md:gap-space-1',
          STEP_NAME_CLASSES[state],
        )}
      >
        <span className="inline-flex items-center gap-space-2">
          {isCurrent && <CurrentStepDiamond />}
          {step.label}
          {state === StepPartState.done && <span className="sr-only"> {doneText}</span>}
        </span>
        {isCurrent && hasContent(subState) && (
          <span className="font-mono font-normal text-ink-muted text-meta">{subState}</span>
        )}
      </span>
    </li>
  );
}
