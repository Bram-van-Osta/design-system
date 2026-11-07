import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';

export interface MessageBubbleProps {
  /** Who wrote it, in bold: "Jeanne Martin, a question". */
  readonly author: ReactNode;
  /** When, in words: "2 hours ago", or a `<time>`. */
  readonly sentAt: ReactNode;
  /** The message, its line breaks kept. */
  readonly children: ReactNode;
  /** The reader's own message: in Delft blue, at the right; the other side's stays on surface. */
  readonly isOwn?: boolean;
  readonly className?: string;
}

const SIDE_CLASSES = {
  own: { figure: 'ms-auto items-end text-right', quote: 'bg-delft text-left text-on-delft' },
  other: { figure: '', quote: 'bg-surface text-ink' },
} as const;

/**
 * A message quoted in a bubble, under its caption: who wrote it and when. The other side's on
 * surface at the left; the reader's own in Delft blue at the right.
 */
export function MessageBubble({
  author,
  sentAt,
  children,
  isOwn = false,
  className,
}: MessageBubbleProps) {
  const side = isOwn ? SIDE_CLASSES.own : SIDE_CLASSES.other;
  return (
    <figure
      data-own={isOwn || undefined}
      className={classNames(
        'flex max-w-reading-width flex-col gap-space-2',
        side.figure,
        className,
      )}
    >
      <figcaption className="text-small text-ink-muted">
        <strong className="font-semibold text-ink">{author}</strong> · {sentAt}
      </figcaption>
      <blockquote
        className={classNames(
          'whitespace-pre-line wrap-break-word px-space-4 py-space-3 text-body',
          side.quote,
        )}
      >
        {children}
      </blockquote>
    </figure>
  );
}
