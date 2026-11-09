import { type ReactNode, useId } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';
import { Heading, type HeadingLevel, HeadingSize } from '../Heading/Heading.tsx';
import type { NotedPoint } from './noted-point.ts';
import { PointSlot } from './PointSlot.tsx';
import { ReadingIndicator } from './ReadingIndicator.tsx';
import { useArrivalDelays } from './use-arrival-delays.ts';

export interface PointColumnProps {
  /** "What we note", or "What to tell us about" when nothing is read. */
  readonly title: ReactNode;
  readonly headingLevel?: HeadingLevel;
  /** The line under the title. */
  readonly description?: ReactNode;
  /** Its fixed places, in their order: a point never moves. */
  readonly points: readonly NotedPoint[];
  /** A reading runs: its squares and its word beside the title. */
  readonly isReading?: boolean;
  /** The reading's word, the package's by default: "updating". */
  readonly readingLabel?: string;
  /** What will be asked next, in the grey box under the points, once the text stopped. */
  readonly missing?: ReactNode;
  /**
   * What a reading noted, for a screen reader, politely: the app gives it once a reading comes
   * back, never while the reader types.
   */
  readonly announcement?: string;
  /** The cross of a noted point was pressed. */
  readonly onRemove?: (id: string) => void;
  /** A point is hovered or its cross focused, `null` once it no longer is: its passage darkens. */
  readonly onEmphasize?: (id: string | null) => void;
  readonly className?: string;
}

/**
 * The column beside the reader's text: fixed places, each filled as a reading notes what the text
 * says of it, and emptied by its cross. Under the field on a phone, a PointBand stuck to it.
 */
export function PointColumn({
  title,
  headingLevel = 2,
  description,
  points,
  isReading = false,
  readingLabel,
  missing,
  announcement,
  onRemove,
  onEmphasize,
  className,
}: PointColumnProps) {
  const headingId = useId();
  const arrivalDelayOf = useArrivalDelays(points);
  return (
    <section
      aria-labelledby={headingId}
      className={classNames('flex flex-col gap-space-5', className)}
    >
      <div className="flex flex-col gap-space-2">
        <div className="flex min-h-7 flex-wrap items-center justify-between gap-space-3">
          <Heading id={headingId} level={headingLevel} size={HeadingSize.xs}>
            {title}
          </Heading>
          {isReading && <ReadingIndicator label={readingLabel} />}
        </div>
        {hasContent(description) && <p className="text-body-s text-ink-muted">{description}</p>}
      </div>
      <ol className="flex flex-col gap-space-4">
        {points.map((point) => (
          <PointSlot
            key={point.id}
            point={point}
            arrivalDelay={arrivalDelayOf(point.id)}
            onRemove={onRemove}
            onEmphasize={onEmphasize}
          />
        ))}
      </ol>
      {hasContent(missing) && (
        <p
          data-missing
          className="bg-surface p-space-4 text-body-s text-ink motion-safe:animate-rise"
        >
          {missing}
        </p>
      )}
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </section>
  );
}
