import { classNames } from '../../utils/class-names.ts';
import { METER_TONE_CLASSES, MeterTone, meterRoleOf } from '../Meter/meter-tone.ts';

export const SegmentMeterSize = {
  /** Small dashes in a row, beside a word: a weight on three steps. */
  small: 'small',
  /** Blocks, one a unit, under large figures: points against a limit. */
  large: 'large',
} as const;
export type SegmentMeterSize = (typeof SegmentMeterSize)[keyof typeof SegmentMeterSize];

/** A limit among the segments: a dashed tick after its segment, its name at the row's end. */
export interface SegmentMeterLimit {
  /** The segment it follows, from 1. */
  readonly at: number;
  /** Its name, after the segments: "S limit". */
  readonly label: string;
}

export interface SegmentMeterProps {
  /** How many segments are filled, from the first. */
  readonly value: number;
  /** How many segments there are. */
  readonly max: number;
  /** A limit among the segments, which the value may pass. */
  readonly limit?: SegmentMeterLimit;
  /** What it measures, for a screen reader: "Weight". Without it, decorative. */
  readonly label?: string;
  /** Its value in words, for a screen reader: "medium". */
  readonly valueText?: string;
  readonly size?: SegmentMeterSize;
  /** `delft` by default, a data bar; `ink` beside measures drawn in ink. */
  readonly tone?: MeterTone;
  readonly className?: string;
}

// A small segment empty in the track's color; a large one, a block, empty as a hairline frame.
const SEGMENT_CLASSES: Readonly<
  Record<SegmentMeterSize, { readonly shape: string; readonly empty: string }>
> = {
  small: { shape: 'h-1.5 w-3.5', empty: '' },
  large: { shape: 'h-5 w-8', empty: 'border-hair border-field' },
};
const GAP_CLASSES: Readonly<Record<SegmentMeterSize, string>> = {
  small: 'gap-0.5',
  large: 'gap-1',
};

interface SegmentProps {
  readonly isFilled: boolean;
  readonly size: SegmentMeterSize;
  readonly tone: MeterTone;
}

function Segment({ isFilled, size, tone }: SegmentProps) {
  const { shape, empty } = SEGMENT_CLASSES[size];
  const emptyClasses = size === SegmentMeterSize.small ? METER_TONE_CLASSES[tone].track : empty;
  return (
    <span
      data-filled={isFilled}
      className={classNames(
        'shrink-0',
        shape,
        isFilled ? METER_TONE_CLASSES[tone].fill : emptyClasses,
      )}
    />
  );
}

function segmentsFrom(first: number, last: number): readonly number[] {
  return last < first ? [] : Array.from({ length: last - first + 1 }, (_, index) => first + index);
}

/**
 * A count in segments, the first ones filled: a weight on three steps beside its word, or points
 * in blocks against a limit, a dashed tick after the limit's segment and its name after them.
 */
export function SegmentMeter({
  value,
  max,
  limit,
  label,
  valueText,
  size = SegmentMeterSize.small,
  tone = MeterTone.delft,
  className,
}: SegmentMeterProps) {
  const limitAt = limit === undefined ? max : Math.min(Math.max(limit.at, 0), max);
  const segment = (step: number) => (
    <Segment key={step} isFilled={step <= value} size={size} tone={tone} />
  );
  return (
    <span
      {...meterRoleOf({ label, valueText, value, max })}
      className={classNames('inline-flex flex-wrap items-center', GAP_CLASSES[size], className)}
    >
      {segmentsFrom(1, limitAt).map(segment)}
      {limit !== undefined && (
        <span data-limit className="mx-1 h-8 shrink-0 border-ink-muted border-s-2 border-dashed" />
      )}
      {segmentsFrom(limitAt + 1, max).map(segment)}
      {limit !== undefined && (
        <span className="ms-1 font-mono text-ink-muted text-meta">{limit.label}</span>
      )}
    </span>
  );
}
