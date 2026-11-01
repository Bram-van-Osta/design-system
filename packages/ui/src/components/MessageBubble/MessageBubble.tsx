import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';

export interface MessageBubbleProps {
  /** Who wrote it, in bold: "Jeanne Martin, a question". */
  readonly author: ReactNode;
  /** When, in words: "2 hours ago", or a `<time>`. */
  readonly sentAt: ReactNode;
  /** The message, its line breaks kept. */
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * A message quoted in a bubble on surface, under its caption: who wrote it and when. The client's
 * messages and the studio's look the same; the caption tells them apart.
 */
export function MessageBubble({ author, sentAt, children, className }: MessageBubbleProps) {
  return (
    <figure className={classNames('flex max-w-reading-width flex-col gap-space-2', className)}>
      <figcaption className="text-small text-ink-muted">
        <strong className="font-semibold text-ink">{author}</strong> · {sentAt}
      </figcaption>
      <blockquote className="whitespace-pre-line wrap-break-word bg-surface px-space-4 py-space-3 text-body text-ink">
        {children}
      </blockquote>
    </figure>
  );
}
