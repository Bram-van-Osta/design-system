import type { ReactNode } from 'react';
import { CARD_ACTIONS_CLASSES } from '../../utils/card-actions.ts';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';
import { Heading, type HeadingLevel, HeadingSize } from '../Heading/Heading.tsx';

/** One thing that waits for the reader: what to do, its lines, its actions. */
export interface WaitingCardRow {
  /** Stable across renders: what waits, by its code. */
  readonly id: string;
  /** What the reader has to do, as a sentence: "Read the pre-analysis, then decide". */
  readonly heading: ReactNode;
  /** Its lines under the heading: what it holds, what the agent advises. */
  readonly children?: ReactNode;
  /** Its buttons and links; the first is its main action, the whole width on a phone. */
  readonly actions?: ReactNode;
}

export interface WaitingCardProps {
  /** What waits, in order, each a row; a line between two. */
  readonly rows: readonly WaitingCardRow[];
  /** The rows' headings' level, `h3` by default: the card sits under its part's label. */
  readonly headingLevel?: HeadingLevel;
  /** The list's name for screen readers, when the part's label above does not name it. */
  readonly label?: string;
  readonly className?: string;
}

/**
 * What waits for the reader, on the surface under the vermilion rule: each thing a row with its
 * heading, its lines and its actions beside them, a line between two rows. With nothing waiting,
 * the page shows a `CalmCard` instead.
 */
export function WaitingCard({ rows, headingLevel = 3, label, className }: WaitingCardProps) {
  return (
    <ul
      aria-label={label}
      className={classNames(
        'border-t-attention border-vermillion bg-surface px-space-5 py-space-1 md:px-space-6',
        className,
      )}
    >
      {rows.map((row) => (
        <Row key={row.id} row={row} headingLevel={headingLevel} />
      ))}
    </ul>
  );
}

interface RowProps {
  readonly row: WaitingCardRow;
  readonly headingLevel: HeadingLevel;
}

function Row({ row: { heading, children, actions }, headingLevel }: RowProps) {
  return (
    <li className="flex flex-col gap-space-4 border-line py-space-5 not-first:border-t-hair md:flex-row md:items-center md:justify-between md:gap-space-6">
      <div className="flex min-w-0 flex-1 flex-col gap-space-1">
        <Heading level={headingLevel} size={HeadingSize.xs}>
          {heading}
        </Heading>
        {children}
      </div>
      {hasContent(actions) && <div className={CARD_ACTIONS_CLASSES}>{actions}</div>}
    </li>
  );
}
