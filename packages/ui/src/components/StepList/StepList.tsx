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
  /** Its usual lead time or its aim, never a date: "around mid-January". Only while it is to come. */
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
   * The current step is not the reader's to do: what says where it stands, in the app's words and
   * muted, in place of "your turn": "we're preparing it", "paused, at your request".
   */
  readonly currentNote?: ReactNode;
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
 * A journey's steps as its client follows them, for a page's column: one a line at every width,
 * their boxes joined, each name at its box's height and what is worth saying of it under it, small
 * and in the mono face. A
 * done step's box in Delft with its check; the current one's in a Delft border, with the vermilion
 * diamond in place of its number and "your turn" under its name when it is the reader's to do, or
 * what says where it stands when it is not; the steps to come muted, with their lead time.
 */
export function StepList({ label, steps, currentIndex, currentNote, className }: StepListProps) {
  return (
    <ol aria-label={label} className={classNames('flex flex-col', className)}>
      {steps.map((step, index) => (
        <Step
          key={step.id}
          step={step}
          number={index + 1}
          state={stepStateAt(index, currentIndex)}
          currentNote={currentNote}
          isLast={index === steps.length - 1}
        />
      ))}
    </ol>
  );
}

interface StepProps {
  readonly step: StepListStep;
  readonly number: number;
  readonly state: StepPartState;
  readonly currentNote: ReactNode;
  readonly isLast: boolean;
}

function Step({ step, number, state, currentNote, isLast }: StepProps) {
  const isCurrent = state === StepPartState.current;
  const isReaders = isCurrent && !hasContent(currentNote);
  return (
    <li
      data-state={state}
      aria-current={isCurrent ? 'step' : undefined}
      className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-space-3 text-small"
    >
      <span
        aria-hidden
        data-step-box
        className={classNames(
          'flex size-9 shrink-0 items-center justify-center font-mono text-kicker',
          BOX_CLASSES[state],
        )}
      >
        <StepBoxMark state={state} number={number} isReaders={isReaders} />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className={NAME_CLASSES[state]}>{step.label}</span>{' '}
        <StepNote state={state} isReaders={isReaders} currentNote={currentNote} lead={step.lead} />
      </span>
      {!isLast && (
        <span
          aria-hidden
          data-step-link
          className={classNames(
            'col-start-1 h-space-3 justify-self-center border-l-select',
            state === StepPartState.done ? 'border-delft' : 'border-line',
          )}
        />
      )}
    </li>
  );
}

interface StepBoxMarkProps {
  readonly state: StepPartState;
  readonly number: number;
  readonly isReaders: boolean;
}

function StepBoxMark({ state, number, isReaders }: StepBoxMarkProps) {
  if (state === StepPartState.done) {
    return <CheckIcon size={ICON_SIZE.inline} weight={ICON_WEIGHT} />;
  }
  return isReaders ? <CurrentStepDiamond className="size-2.25" /> : number;
}

interface StepNoteProps {
  readonly state: StepPartState;
  readonly isReaders: boolean;
  readonly currentNote: ReactNode;
  readonly lead: ReactNode;
}

// A done step's check says it to the eye: its word is for a screen reader.
function StepNote({ state, isReaders, currentNote, lead }: StepNoteProps) {
  const messages = useMessages();
  if (state === StepPartState.done) {
    return <span className="sr-only">{messages['stepProgress.done']}</span>;
  }
  if (isReaders) {
    return (
      <span className="font-mono text-meta text-vermillion">{messages['stepList.yourTurn']}</span>
    );
  }
  const note = state === StepPartState.current ? currentNote : lead;
  return hasContent(note) ? (
    <span className="font-mono text-meta text-ink-muted">{note}</span>
  ) : null;
}
