import { useId } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { MeterLegend } from '../Meter/MeterLegend.tsx';
import {
  type MeterMeasure,
  type MeterPart,
  MeterPartFill,
  partFillOf,
  partFillStyleOf,
  partsOf,
  totalOf,
} from '../Meter/meter-part.ts';
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

interface SegmentMeterScaleProps {
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

/**
 * The segments, their limit and their words, then the measure: one `value`, the segments filled
 * from the first, or its `parts`, each filling its count of segments after the ones before it.
 */
export type SegmentMeterProps = SegmentMeterScaleProps & MeterMeasure;

// A small segment lies on the meter's track, empty or hatched over it (`null`: the track's color);
// a large one, a block, is a hairline frame when empty, hatched in a frame of its stripes' color.
const SEGMENT_CLASSES: Readonly<
  Record<
    SegmentMeterSize,
    { readonly shape: string; readonly empty: string | null; readonly hatched: string | null }
  >
> = {
  small: { shape: 'h-1.5 w-3.5', empty: null, hatched: null },
  large: {
    shape: 'h-5 w-8',
    empty: 'border-hair border-field',
    hatched: 'border-current border-hair',
  },
};
const GAP_CLASSES: Readonly<Record<SegmentMeterSize, string>> = {
  small: 'gap-0.5',
  large: 'gap-1',
};

interface SegmentProps {
  /** The part that fills it, by its place among them; none when it is empty. */
  readonly part: number | null;
  readonly size: SegmentMeterSize;
  readonly tone: MeterTone;
}

function groundOf(classes: string | null, tone: MeterTone): string {
  return classes ?? METER_TONE_CLASSES[tone].track;
}

function Segment({ part, size, tone }: SegmentProps) {
  const { shape, empty, hatched } = SEGMENT_CLASSES[size];
  if (part === null) {
    return (
      <span data-filled={false} className={classNames('shrink-0', shape, groundOf(empty, tone))} />
    );
  }
  const fill = partFillOf(part);
  const { className, style } = partFillStyleOf({ fill, tone });
  const ground = fill === MeterPartFill.hatched ? groundOf(hatched, tone) : '';
  return (
    <span
      data-filled
      data-part={part}
      className={classNames('shrink-0', shape, ground, className)}
      style={style}
    />
  );
}

// The part a segment belongs to, from 1: the first whose end reaches it.
function partOfStep(step: number, parts: readonly MeterPart[]): number | null {
  let end = 0;
  for (const [index, part] of parts.entries()) {
    end += Math.max(part.value, 0);
    if (step <= end) {
      return index;
    }
  }
  return null;
}

function segmentsFrom(first: number, last: number): readonly number[] {
  return last < first ? [] : Array.from({ length: last - first + 1 }, (_, index) => first + index);
}

/**
 * A count in segments, the first ones filled: a weight on three steps beside its word, or points
 * in blocks against a limit, a dashed tick after the limit's segment and its name after them. Its
 * count may come in parts, filled one after the other, the first solid and the next hatched, each
 * named in a legend under the segments.
 */
export function SegmentMeter(props: SegmentMeterProps) {
  const {
    max,
    limit,
    label,
    valueText,
    size = SegmentMeterSize.small,
    tone = MeterTone.delft,
    className,
  } = props;
  const legendId = useId();
  const parts = partsOf(props);
  const hasLegend = props.parts !== undefined;
  const limitAt = limit === undefined ? max : Math.min(Math.max(limit.at, 0), max);
  const segment = (step: number) => (
    <Segment key={step} part={partOfStep(step, parts)} size={size} tone={tone} />
  );
  const role = meterRoleOf({
    label,
    valueText,
    value: totalOf(parts),
    max,
    describedBy: hasLegend ? legendId : undefined,
  });
  const meter = (
    <span
      {...role}
      className={classNames(
        'inline-flex flex-wrap items-center',
        GAP_CLASSES[size],
        !hasLegend && className,
      )}
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
  if (!hasLegend) {
    return meter;
  }
  return (
    <span className={classNames('inline-flex flex-col gap-space-2', className)}>
      {meter}
      <MeterLegend id={legendId} parts={parts} tone={tone} />
    </span>
  );
}
