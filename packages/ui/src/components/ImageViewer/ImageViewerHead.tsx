import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { XIcon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { useMessages } from '../../i18n/use-messages.ts';
import { hasContent } from '../../utils/has-content.ts';
import { IconButton } from '../IconButton/IconButton.tsx';

export interface ImageViewerHeadProps {
  readonly title: ReactNode;
  readonly description?: ReactNode;
}

/** The image's title and its line of facts, the close button on their right. */
export function ImageViewerHead({ title, description }: ImageViewerHeadProps) {
  const messages = useMessages();
  return (
    <div className="flex items-center justify-between gap-space-3 md:items-start md:gap-space-4">
      <div className="flex min-w-0 flex-col gap-space-1">
        <BaseDialog.Title className="font-display text-heading-xs">{title}</BaseDialog.Title>
        {hasContent(description) && (
          <BaseDialog.Description className="font-mono text-meta break-words text-ink-muted">
            {description}
          </BaseDialog.Description>
        )}
      </div>
      <BaseDialog.Close
        render={<IconButton icon={XIcon} label={messages['imageViewer.close']} />}
      />
    </div>
  );
}
