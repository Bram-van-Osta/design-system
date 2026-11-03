import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';

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

/**
 * Moments in order down a rule: each a square in ink on the rule, its name in mono, then what it
 * holds.
 */
export function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={classNames('flex flex-col', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <li key={item.id} className="flex gap-x-space-3">
            <span aria-hidden className="flex w-3.5 shrink-0 flex-col items-center">
              <span data-marker className="mt-1.5 size-2.5 shrink-0 bg-ink" />
              {!isLast && <span className="w-0 flex-1 border-field border-s-hair" />}
            </span>
            <div
              className={classNames(
                'flex min-w-0 flex-1 flex-col gap-space-2',
                !isLast && 'pb-space-4',
              )}
            >
              <span className="font-mono text-ink-muted text-meta">{item.label}</span>
              {item.children}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
