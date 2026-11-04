import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { StatParts, StatSemantics } from './StatParts.tsx';
import { STAT_TILE_CLASSES, STAT_TONE_CLASSES } from './stat-classes.ts';
import { StatTone } from './stat-tone.ts';

export interface StatProps {
  /** What is counted: "Proposal". */
  readonly label: ReactNode;
  /** The figure, in tabular figures: "2", "3 h 40". */
  readonly value: ReactNode;
  /** A line under the figure that situates it: "the oldest: 3 h". */
  readonly note?: ReactNode;
  /** `plain` by default; `attention` for the figure that awaits the reader, rarely. */
  readonly tone?: StatTone;
  readonly className?: string;
}

/**
 * A figure and its label in a hairline tile, as a pipeline counts its states. Its label is a
 * term and its figure a description: the tiles go in a `<dl>`, which the app names and lays out.
 */
export function Stat({ label, value, note, tone = StatTone.plain, className }: StatProps) {
  return (
    <div
      data-tone={tone}
      className={classNames(STAT_TILE_CLASSES, STAT_TONE_CLASSES[tone], className)}
    >
      <StatParts
        label={label}
        value={value}
        note={note}
        tone={tone}
        semantics={StatSemantics.description}
      />
    </div>
  );
}
