import { ArrowSquareOutIcon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { useMessages } from '../../i18n/use-messages.ts';
import { hasContent } from '../../utils/has-content.ts';
import { Link } from '../Link/Link.tsx';

export interface ImageViewerFooterProps {
  readonly originalHref?: string;
  readonly hint?: ReactNode;
}

/** On a computer: the image alone in a new tab, and the keys' hint on the right. */
export function ImageViewerFooter({ originalHref, hint }: ImageViewerFooterProps) {
  const messages = useMessages();
  if (originalHref === undefined && !hasContent(hint)) {
    return null;
  }
  return (
    <div className="hidden flex-wrap items-center gap-x-space-3 md:flex">
      {originalHref !== undefined && (
        <Link href={originalHref} target="_blank" rel="noreferrer" icon={ArrowSquareOutIcon}>
          {messages['imageViewer.openAlone']}
        </Link>
      )}
      {hasContent(hint) && (
        <span className="ml-auto font-mono text-meta text-ink-muted">{hint}</span>
      )}
    </div>
  );
}
