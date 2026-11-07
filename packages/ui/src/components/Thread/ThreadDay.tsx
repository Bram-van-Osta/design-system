import type { ReactNode } from 'react';

export interface ThreadDayProps {
  /** The day, in words: "today, Saturday 7 November". */
  readonly children: ReactNode;
}

/** A day in a thread, in mono over its lines: the separator between two days' events. */
export function ThreadDay({ children }: ThreadDayProps) {
  return (
    <li data-thread-day className="pt-space-5 pb-space-1 font-mono text-meta text-ink-muted">
      {children}
    </li>
  );
}
