import { CheckIcon } from '@phosphor-icons/react';
import type { CSSProperties, ReactNode } from 'react';
import { useMessages } from '../../i18n/use-messages.ts';
import { classNames } from '../../utils/class-names.ts';
import { FIRST_LINE_SLOT_CLASSES } from '../../utils/first-line.ts';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';
import {
  checkSplitSteps,
  type PlacedStepPart,
  partColumnsOf,
  placeStepParts,
  STEP_PART_STATE_MESSAGES,
  StepPartState,
  type StepProgressPart,
  StepProgressTone,
  type StepSplitState,
  segmentStateOf,
} from './step-parts.ts';

export type { StepProgressPart } from './step-parts.ts';

export interface StepProgressProps {
  /** How many steps the journey has: one segment each. */
  readonly max: number;
  /**
   * How many segments are filled, up to the step the person is on. With parts, the part of that
   * step is the current one, and the parts before it are done.
   */
  readonly value: number;
  /** What the bar follows, for screen readers: "Your request's progress". */
  readonly label: string;
  /** Where the person stands, in words: "Question 2 of 8". */
  readonly valueText: string;
  /**
   * The named parts the steps belong to, in order: their segments grouped, their names under the
   * bar. Their steps add up to `max`, or the component throws.
   */
  readonly parts?: readonly StepProgressPart[];
  /**
   * `delft` by default, the filled segments in Delft blue; `ink` for the done ones in ink and the
   * current one, the last filled, in vermilion; `sections` for the done ones in Delft blue and the
   * current one in pale Delft.
   */
  readonly tone?: StepProgressTone;
  /**
   * The current segment split into its questions, in order, as a part of the journey that asks a
   * few: each answered, passed, the current one or to come. The bar still counts the segment once.
   */
  readonly currentSplit?: readonly StepSplitState[];
  readonly className?: string;
}

const SEGMENT_CLASSES: Readonly<Record<StepProgressTone, Readonly<Record<StepPartState, string>>>> =
  {
    delft: { done: 'bg-delft', current: 'bg-delft', upcoming: 'bg-line' },
    ink: { done: 'bg-ink', current: 'bg-vermillion', upcoming: 'bg-line' },
    sections: { done: 'bg-delft', current: 'bg-delft-pale', upcoming: 'bg-line' },
  };

// A journey in sections draws its segments as thick as a step band's bars.
const SEGMENT_HEIGHT_CLASSES: Readonly<Record<StepProgressTone, string>> = {
  delft: 'h-progress-height',
  ink: 'h-progress-height',
  sections: 'h-progress-bar-height',
};

// The answered questions in Delft blue, the passed ones in pale Delft, the current one thicker.
const SPLIT_CLASSES: Readonly<Record<StepSplitState, string>> = {
  answered: 'h-progress-height bg-delft',
  passed: 'h-progress-height bg-delft-pale',
  current: 'h-progress-current-height bg-delft',
  upcoming: 'h-progress-height bg-line',
};

const PART_STATE_CLASSES: Readonly<Record<StepPartState, string>> = {
  done: 'text-ink',
  current: 'font-medium text-vermillion',
  upcoming: 'text-ink-muted',
};

/**
 * The progress of a journey in segments, the filled ones in Delft blue, or in ink up to the current
 * one in vermilion, across the page under its header; with parts, the segments grouped by part and
 * each part's name under its group.
 */
export function StepProgress({
  max,
  value,
  label,
  valueText,
  parts,
  tone = StepProgressTone.delft,
  currentSplit,
  className,
}: StepProgressProps) {
  const filledCount = Math.min(Math.max(value, 0), max);
  const bar = { max, filledCount, label, valueText };
  const filling = { filledCount, tone, currentSplit };
  if (currentSplit !== undefined) {
    checkSplitSteps(currentSplit);
  }
  if (parts === undefined) {
    return (
      <ProgressBar {...bar} className={classNames('flex items-start gap-space-1', className)}>
        <Segments steps={stepsUpTo(max)} {...filling} />
      </ProgressBar>
    );
  }
  const placedParts = placeStepParts({ parts, max, filledCount });
  const columns = { gridTemplateColumns: partColumnsOf(parts) };
  return (
    <div className={classNames('flex w-full flex-col gap-space-2', className)}>
      <ProgressBar {...bar} className="grid gap-space-3" style={columns}>
        {placedParts.map(({ part, steps }) => (
          <span key={part.label} className="flex items-start gap-space-1">
            <Segments steps={steps} {...filling} />
          </span>
        ))}
      </ProgressBar>
      <ol
        className="flex flex-wrap gap-x-space-2 gap-y-space-1 md:grid md:gap-x-space-3"
        style={columns}
      >
        {placedParts.map((placedPart, index) => (
          <PartName key={placedPart.part.label} placedPart={placedPart} isFirst={index === 0} />
        ))}
      </ol>
    </div>
  );
}

function stepsUpTo(max: number): readonly number[] {
  return Array.from({ length: max }, (_, index) => index + 1);
}

interface ProgressBarProps {
  readonly max: number;
  readonly filledCount: number;
  readonly label: string;
  readonly valueText: string;
  readonly className: string;
  readonly style?: CSSProperties;
  readonly children: ReactNode;
}

function ProgressBar({
  max,
  filledCount,
  label,
  valueText,
  className,
  style,
  children,
}: ProgressBarProps) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={filledCount}
      aria-valuetext={valueText}
      className={classNames('w-full', className)}
      style={style}
    >
      {children}
    </div>
  );
}

interface SegmentsProps {
  readonly steps: readonly number[];
  readonly filledCount: number;
  readonly tone: StepProgressTone;
  readonly currentSplit: readonly StepSplitState[] | undefined;
}

function Segments({ steps, filledCount, tone, currentSplit }: SegmentsProps) {
  return steps.map((step) => {
    const state = segmentStateOf(step, filledCount);
    if (state === StepPartState.current && currentSplit !== undefined) {
      return <SplitSegment key={step} states={currentSplit} />;
    }
    return (
      <span
        key={step}
        data-state={state}
        className={classNames('flex-1', SEGMENT_HEIGHT_CLASSES[tone], SEGMENT_CLASSES[tone][state])}
      />
    );
  });
}

// The current segment as its questions, each known by its place in it.
function SplitSegment({ states }: { readonly states: readonly StepSplitState[] }) {
  const questions = states.map((state, index) => ({ state, place: index + 1 }));
  return (
    <span
      data-state={StepPartState.current}
      className="flex flex-1 items-start gap-progress-split-gap"
    >
      {questions.map(({ state, place }) => (
        <span
          key={place}
          data-state={state}
          className={classNames('flex-1', SPLIT_CLASSES[state])}
        />
      ))}
    </span>
  );
}

interface PartNameProps {
  readonly placedPart: PlacedStepPart;
  readonly isFirst: boolean;
}

// On a phone, the short names on one line, a dot between two; from md up, each name in its column.
function PartName({ placedPart: { part, state }, isFirst }: PartNameProps) {
  const messages = useMessages();
  return (
    <li
      data-state={state}
      className={classNames(
        'flex min-w-0 items-start gap-space-1 font-mono text-meta',
        PART_STATE_CLASSES[state],
      )}
    >
      {!isFirst && (
        <span aria-hidden className="me-space-1 font-normal text-ink-muted md:hidden">
          ·
        </span>
      )}
      {state === StepPartState.done && (
        <span className={FIRST_LINE_SLOT_CLASSES}>
          <CheckIcon size={ICON_SIZE.inline} weight={ICON_WEIGHT} aria-hidden />
        </span>
      )}
      <span className="hidden md:inline">{part.label}</span>
      <span className="md:hidden">{part.shortLabel}</span>
      <span className="sr-only"> {messages[STEP_PART_STATE_MESSAGES[state]]}</span>
    </li>
  );
}
