import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { FIRST_LINE_SLOT_CLASSES } from '../../utils/first-line.ts';

/** A moment on a timeline: its name, then what happens at it. */
export interface TimelineItem {
  /** Stable across renders: the moment's code. */
  readonly id: string;
  /** Its name, in mono above what it holds: "before the start". */
  readonly label: ReactNode;
  readonly children: ReactNode;
}

export interface TimelineProps {
  /** The moments, in order. */
  readonly items: readonly TimelineItem[];
  readonly className?: string;
}

const LABEL_TEXT_CLASSES = 'font-mono text-meta';

/**
 * Moments in order down a rule: each a square in ink on the rule, centered on its name's line, its
 * name in mono, then what it holds.
 */
export function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={classNames('flex flex-col', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <li key={item.id} className="flex gap-x-space-3">
            <Marker isFirst={index === 0} isLast={isLast} />
            <div
              className={classNames(
                'flex min-w-0 flex-1 flex-col gap-space-2',
                !isLast && 'pb-space-4',
              )}
            >
              <span className={classNames(LABEL_TEXT_CLASSES, 'text-ink-muted')}>{item.label}</span>
              {item.children}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

interface MarkerProps {
  readonly isFirst: boolean;
  readonly isLast: boolean;
}

// The square in a slot one line of the name high, the rule running through the slot from the
// previous square and on to the next one.
function Marker({ isFirst, isLast }: MarkerProps) {
  return (
    <span aria-hidden className="flex w-3.5 shrink-0 flex-col items-center">
      <span className={classNames(FIRST_LINE_SLOT_CLASSES, LABEL_TEXT_CLASSES, 'flex-col')}>
        <Rule isShown={!isFirst} />
        <span data-marker className="size-2.5 shrink-0 bg-ink" />
        <Rule isShown={!isLast} />
      </span>
      <Rule isShown={!isLast} />
    </span>
  );
}

// A stretch of the rule, or an empty one that keeps the square centered in its slot.
function Rule({ isShown }: { readonly isShown: boolean }) {
  return isShown ? (
    <span data-rule className="w-0 flex-1 border-field border-s-hair" />
  ) : (
    <span className="flex-1" />
  );
}
