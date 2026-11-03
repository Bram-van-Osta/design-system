import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';

export const ScoreRingTone = {
  neutral: 'neutral',
  attention: 'attention',
} as const;
export type ScoreRingTone = (typeof ScoreRingTone)[keyof typeof ScoreRingTone];

// A ring of 46 px and its stroke of 4, its arc drawn clockwise from the top (C-28).
const DIAMETER = 46;
const STROKE = 4;
const CENTER = DIAMETER / 2;
const RADIUS = (DIAMETER - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const DEFAULT_MAX = 100;
// The ring of a value that could not be measured: empty, a dash in it.
const NOT_MEASURED = '–';

// A data ring, as the identity draws its data bars: Delft blue on its pale track, vermilion for a
// score to fix.
const TONE_CLASSES: Readonly<Record<ScoreRingTone, string>> = {
  neutral: 'stroke-delft',
  attention: 'stroke-vermillion',
};

export interface ScoreRingProps {
  /** Out of `max`, null when it could not be measured: an empty ring, a dash in it. */
  readonly value: number | null;
  /** 100 by default. */
  readonly max?: number;
  /** Its short name under the ring: "Perf.". */
  readonly label: ReactNode;
  /** Its name and its value for a screen reader: "Performance: 87 out of 100". */
  readonly accessibleLabel: string;
  /** `attention`, its arc in vermilion, for a score to fix; `neutral`, in Delft blue, otherwise. */
  readonly tone?: ScoreRingTone;
  readonly className?: string;
}

function shareOf(value: number | null, max: number): number {
  return value === null || max <= 0 ? 0 : Math.min(Math.max(value / max, 0), 1);
}

/** A score in a ring as full as it is, its figure inside and its short name under it. */
export function ScoreRing({
  value,
  max = DEFAULT_MAX,
  label,
  accessibleLabel,
  tone = ScoreRingTone.neutral,
  className,
}: ScoreRingProps) {
  const share = shareOf(value, max);
  return (
    <span
      role="img"
      aria-label={accessibleLabel}
      className={classNames('inline-flex flex-col items-center gap-space-1', className)}
    >
      <span
        className="relative inline-flex items-center justify-center"
        style={{ width: DIAMETER, height: DIAMETER }}
      >
        <svg
          aria-hidden="true"
          width={DIAMETER}
          height={DIAMETER}
          viewBox={`0 0 ${DIAMETER} ${DIAMETER}`}
          fill="none"
          className="absolute inset-0 -rotate-90"
        >
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            strokeWidth={STROKE}
            className="stroke-delft-pale"
          />
          {share > 0 && (
            <circle
              data-arc
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              strokeWidth={STROKE}
              strokeDasharray={`${CIRCUMFERENCE * share} ${CIRCUMFERENCE}`}
              className={TONE_CLASSES[tone]}
            />
          )}
        </svg>
        <span className="relative font-bold font-display text-body-s text-ink tabular-nums leading-none">
          {value ?? NOT_MEASURED}
        </span>
      </span>
      <span className="text-ink-muted text-meta">{label}</span>
    </span>
  );
}
