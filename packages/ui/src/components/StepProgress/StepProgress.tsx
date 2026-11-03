import { CheckIcon } from '@phosphor-icons/react';
import type { CSSProperties, ReactNode } from 'react';
import { useMessages } from '../../i18n/use-messages.ts';
import { classNames } from '../../utils/class-names.ts';
import { FIRST_LINE_SLOT_CLASSES } from '../../utils/first-line.ts';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';
import {
  type PlacedStepPart,
  partColumnsOf,
  placeStepParts,
  STEP_PART_STATE_MESSAGES,
  StepPartState,
  type StepProgressPart,
  StepProgressTone,
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
   * current one, the last filled, in vermilion.
   */
  readonly tone?: StepProgressTone;
  readonly className?: string;
}

const SEGMENT_CLASSES: Readonly<Record<StepProgressTone, Readonly<Record<StepPartState, string>>>> =
  {
    delft: { done: 'bg-delft', current: 'bg-delft', upcoming: 'bg-line' },
    ink: { done: 'bg-ink', current: 'bg-vermillion', upcoming: 'bg-line' },
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
  className,
}: StepProgressProps) {
  const filledCount = Math.min(Math.max(value, 0), max);
  const bar = { max, filledCount, label, valueText };
  if (parts === undefined) {
    return (
      <ProgressBar {...bar} className={classNames('flex gap-space-1', className)}>
        <Segments steps={stepsUpTo(max)} filledCount={filledCount} tone={tone} />
      </ProgressBar>
    );
  }
  const placedParts = placeStepParts({ parts, max, filledCount });
  const columns = { gridTemplateColumns: partColumnsOf(parts) };
  return (
    <div className={classNames('flex w-full flex-col gap-space-2', className)}>
      <ProgressBar {...bar} className="grid gap-space-3" style={columns}>
        {placedParts.map(({ part, steps }) => (
          <span key={part.label} className="flex gap-space-1">
            <Segments steps={steps} filledCount={filledCount} tone={tone} />
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
}

function Segments({ steps, filledCount, tone }: SegmentsProps) {
  return steps.map((step) => {
    const state = segmentStateOf(step, filledCount);
    return (
      <span
        key={step}
        data-state={state}
        className={classNames('h-progress-height flex-1', SEGMENT_CLASSES[tone][state])}
      />
    );
  });
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
