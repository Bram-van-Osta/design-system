import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { ThumbnailFrame } from './ThumbnailFrame.tsx';
import { THUMBNAIL_BOX_CLASSES } from './thumbnail-classes.ts';

export interface ThumbnailLeftOutProps {
  /** In CSS pixels, as a Thumbnail beside it. */
  readonly width: number;
  readonly height: number;
  /** Why there is no image, in a few words: a narrow box holds a short one. */
  readonly reason: ReactNode;
  readonly caption?: ReactNode;
  readonly className?: string;
}

/** The place of an image there will not be, on a dashed border, with its reason: nothing to open. */
export function ThumbnailLeftOut({
  width,
  height,
  reason,
  caption,
  className,
}: ThumbnailLeftOutProps) {
  return (
    <ThumbnailFrame width={width} caption={caption} className={className}>
      <span
        className={classNames(
          THUMBNAIL_BOX_CLASSES,
          'flex items-center justify-center border-dashed border-field p-space-2 text-center font-mono text-meta text-ink-muted wrap-break-word',
        )}
        style={{ height }}
      >
        {reason}
      </span>
    </ThumbnailFrame>
  );
}
