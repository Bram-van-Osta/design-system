import type { ReactNode } from 'react';
import { hasContent } from '../../utils/has-content.ts';

export interface SourcedFactProps {
  /** What the answer is about, in mono: "Your activity". */
  readonly label: ReactNode;
  readonly value: ReactNode;
  /** Where it comes from, in grey under it: "from "We run a bakery"". */
  readonly source?: ReactNode;
  /** A link or a button across the lines, at the right: "Correct". */
  readonly action?: ReactNode;
}

// The action is read last, after what it acts on, and drawn across the label, the value and the
// source.
const ACTION_ROWS = { withSource: 'row-span-3', withoutSource: 'row-span-2' } as const;

/**
 * One answer of a SourcedFactList, under a delft rule: its label, its value and where it comes
 * from, with the action that corrects it beside them.
 */
export function SourcedFact({ label, value, source, action }: SourcedFactProps) {
  const hasSource = hasContent(source);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-space-4 gap-y-space-1 border-delft border-t-3 py-space-4">
      <dt className="col-start-1 font-mono text-ink-muted text-kicker">{label}</dt>
      <dd className="col-start-1 text-label text-ink">{value}</dd>
      {hasSource && <dd className="col-start-1 text-ink-muted text-small">{source}</dd>}
      {hasContent(action) && (
        <dd
          className={`col-start-2 row-start-1 flex items-center ${hasSource ? ACTION_ROWS.withSource : ACTION_ROWS.withoutSource}`}
        >
          {action}
        </dd>
      )}
    </div>
  );
}
