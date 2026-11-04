import type { CSSProperties } from 'react';
import { useMessages } from '../../i18n/use-messages.ts';
import { classNames } from '../../utils/class-names.ts';
import { SKELETON_BAR_CLASSES } from '../Skeleton/skeleton-classes.ts';
import { THUMBNAIL_BOX_CLASSES } from './thumbnail-classes.ts';

// Three lines of uneven length, as the top of a page before it is there.
const BAR_WIDTH_CLASSES = ['w-7/10', 'w-9/10', 'w-11/20'] as const;

export interface ThumbnailAwaitedBoxProps {
  /** Its size: a height, or an aspect ratio. */
  readonly className?: string;
  readonly style?: CSSProperties;
}

/** The box of an image that is not there yet, on surface, read as "Loading…" by screen readers. */
export function ThumbnailAwaitedBox({ className, style }: ThumbnailAwaitedBoxProps) {
  const messages = useMessages();
  return (
    <span
      role="status"
      className={classNames(
        THUMBNAIL_BOX_CLASSES,
        'flex flex-col gap-space-2 border-line bg-surface p-space-2',
        className,
      )}
      style={style}
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
  );
}
