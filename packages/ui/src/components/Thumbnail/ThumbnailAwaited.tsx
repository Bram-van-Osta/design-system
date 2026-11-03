import type { ReactNode } from 'react';
import { useMessages } from '../../i18n/use-messages.ts';
import { classNames } from '../../utils/class-names.ts';
import { SKELETON_BAR_CLASSES } from '../Skeleton/skeleton-classes.ts';
import { ThumbnailFrame } from './ThumbnailFrame.tsx';
import { THUMBNAIL_BOX_CLASSES } from './thumbnail-classes.ts';

// Three lines of uneven length, as the top of a page before it is there.
const BAR_WIDTH_CLASSES = ['w-7/10', 'w-9/10', 'w-11/20'] as const;

export interface ThumbnailAwaitedProps {
  /** In CSS pixels, as the Thumbnail that will take its place. */
  readonly width: number;
  readonly height: number;
  readonly caption?: ReactNode;
  readonly className?: string;
}

/** The place of an image that is not there yet, read as "Loading…" by screen readers: nothing to open. */
export function ThumbnailAwaited({ width, height, caption, className }: ThumbnailAwaitedProps) {
  const messages = useMessages();
  return (
    <ThumbnailFrame width={width} caption={caption} className={className}>
      <span
        role="status"
        className={classNames(
          THUMBNAIL_BOX_CLASSES,
          'flex flex-col gap-space-2 border-line bg-surface p-space-2',
        )}
        style={{ height }}
      >
        <span className="sr-only">{messages['skeleton.loading']}</span>
        {BAR_WIDTH_CLASSES.map((widthClass) => (
          <span
            key={widthClass}
            aria-hidden
            className={classNames(SKELETON_BAR_CLASSES, 'h-space-2', widthClass)}
          />
        ))}
      </span>
    </ThumbnailFrame>
  );
}
