import type { ReactNode } from 'react';
import { ThumbnailAwaitedBox } from './ThumbnailAwaitedBox.tsx';
import { ThumbnailFrame } from './ThumbnailFrame.tsx';

export interface ThumbnailAwaitedProps {
  /** In CSS pixels, as the Thumbnail that will take its place. */
  readonly width: number;
  readonly height: number;
  readonly caption?: ReactNode;
  readonly className?: string;
}

/** The place of an image that is not there yet, read as "Loading…" by screen readers: nothing to open. */
export function ThumbnailAwaited({ width, height, caption, className }: ThumbnailAwaitedProps) {
  return (
    <ThumbnailFrame width={width} caption={caption} className={className}>
      <ThumbnailAwaitedBox style={{ height }} />
    </ThumbnailFrame>
  );
}
