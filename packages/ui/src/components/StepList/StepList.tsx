import { CheckIcon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { useMessages } from '../../i18n/use-messages.ts';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';
import { CurrentStepDiamond } from '../StepBand/CurrentStepDiamond.tsx';
import { stepStateAt } from '../StepBand/step-band.ts';
import { StepPartState } from '../StepProgress/step-parts.ts';

/** A step of the list: its name, and how long it usually takes. */
export interface StepListStep {
  /** Stable across renders: the step's code. */
  readonly id: string;
  /** Its name: "The questionnaire". */
  readonly label: ReactNode;
  /** Its usual lead time, never a date: "about 20 minutes, at your pace". Not shown once done. */
  readonly lead?: ReactNode;
}

export interface StepListProps {
  /** The list's name, read by screen readers: "Your project's steps". */
  readonly label: string;
  /** The steps, in order. */
  readonly steps: readonly StepListStep[];
  /** The current step's index, from 0; the steps before it are done, every one past the last. */
  readonly currentIndex: number;
  /**
   * The journey is paused: the line under the current step that says so, in the app's words, in
   * place of "right now" and of its lead time: "paused, at your request".
   */
  readonly pausedNote?: ReactNode;
  readonly className?: string;
}

const BOX_CLASSES: Readonly<Record<StepPartState, string>> = {
  done: 'bg-delft text-on-delft',
  current: 'border-select border-delft text-ink',
  upcoming: 'border-hair border-field text-ink-muted',
};

const NAME_CLASSES: Readonly<Record<StepPartState, string>> = {
  done: 'text-ink',
  current: 'font-semibold text-ink',
  upcoming: 'text-ink-muted',
};

/**
 * A journey's steps as its client follows them: each a numbered box, its name and its usual lead
 * time, in a row on a computer and a column on a phone. A done step's box in Delft with its check,
 * "done" under its name; the current one's in a Delft border, the vermilion diamond before its name
 * and "right now" in vermilion under it, on the page's own background, or the line that says the
 * journey is paused; the steps to come muted.
 */
export function StepList({ label, steps, currentIndex, pausedNote, className }: StepListProps) {
  return (
    <ol
      aria-label={label}
      className={classNames(
        'flex flex-col md:grid md:auto-cols-fr md:grid-flow-col md:gap-space-3',
        className,
      )}
    >
      {steps.map((step, index) => (
        <Step
          key={step.id}
          step={step}
          number={index + 1}
          state={stepStateAt(index, currentIndex)}
          pausedNote={pausedNote}
        />
      ))}
    </ol>
  );
}

interface StepProps {
  readonly step: StepListStep;
  readonly number: number;
  readonly state: StepPartState;
  readonly pausedNote: ReactNode;
}

function Step({ step, number, state, pausedNote }: StepProps) {
  const messages = useMessages();
  const isCurrent = state === StepPartState.current;
  const isPaused = isCurrent && hasContent(pausedNote);
  return (
    <li
      data-state={state}
      aria-current={isCurrent ? 'step' : undefined}
      className="flex items-center gap-space-3 py-space-2 text-small md:flex-col md:items-start md:gap-space-2 md:py-0"
    >
      <span
        aria-hidden
        data-step-box
        className={classNames(
          'flex size-9 shrink-0 items-center justify-center font-mono text-kicker',
          BOX_CLASSES[state],
        )}
      >
        {state === StepPartState.done ? (
          <CheckIcon size={ICON_SIZE.inline} weight={ICON_WEIGHT} />
        ) : (
          number
        )}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className={classNames('inline-flex items-center gap-space-2', NAME_CLASSES[state])}>
          {isCurrent && <CurrentStepDiamond />}
          {step.label}
        </span>{' '}
        {isCurrent && !isPaused && (
          <>
            <span className="font-mono text-meta text-vermillion">
              {messages['stepList.now']}
            </span>{' '}
          </>
        )}
        <StepLine
          state={state}
          lead={isPaused ? pausedNote : step.lead}
          doneText={messages['stepProgress.done']}
        />
      </span>
    </li>
  );
}

interface StepLineProps {
  readonly state: StepPartState;
  readonly lead: ReactNode;
  readonly doneText: string;
}

function StepLine({ state, lead, doneText }: StepLineProps) {
  if (state === StepPartState.done) {
    return <span className="text-ink-muted">{doneText}</span>;
  }
  return hasContent(lead) ? <span className="text-ink-muted">{lead}</span> : null;
}
