import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';

export interface PointBandProps {
  /** How many places the column has. */
  readonly max: number;
  /** How many hold a noted value: the first segments turn delft. */
  readonly value: number;
  /** The count in the app's words: "3 noted out of 7". */
  readonly label: ReactNode;
  readonly className?: string;
}

function segmentsOf(max: number): readonly number[] {
  return Array.from({ length: Math.max(max, 0) }, (_, index) => index);
}

/**
 * On a phone, the column's count, stuck to the bottom of the HighlightedTextArea as its `footer`:
 * in view while the keyboard is open, its segments turning delft as readings note points.
 */
export function PointBand({ max, value, label, className }: PointBandProps) {
  return (
    <div
      className={classNames(
        'flex items-center gap-space-3 border-highlight-strong border-t-hair bg-band px-space-4 py-space-2',
        className,
      )}
    >
      <span aria-hidden className="flex flex-1 gap-0.75">
        {segmentsOf(max).map((index) => (
          <span
            key={index}
            data-segment
            data-filled={index < value || undefined}
            className="h-progress-height flex-1 bg-field data-filled:bg-delft motion-safe:transition-colors motion-safe:duration-400"
          />
        ))}
      </span>
      <span className="whitespace-nowrap font-mono text-ink-muted text-kicker">{label}</span>
    </div>
  );
}
