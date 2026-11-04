import type { ReactNode } from 'react';
import { ThumbnailAwaitedBox } from '../Thumbnail/ThumbnailAwaitedBox.tsx';
import { ThumbnailTileFrame } from './ThumbnailTileFrame.tsx';
import { TILE_ASPECT_CLASSES } from './tile-classes.ts';

export interface ThumbnailTileAwaitedProps {
  readonly fileName: string;
  /** A line under the name, in Delft blue: "being sorted". */
  readonly note?: ReactNode;
  readonly className?: string;
}

/** A file of a ThumbnailGrid on its way, read as "Loading…" by screen readers: nothing to open. */
export function ThumbnailTileAwaited({ fileName, note, className }: ThumbnailTileAwaitedProps) {
  return (
    <ThumbnailTileFrame fileName={fileName} note={note} className={className}>
      <ThumbnailAwaitedBox className={TILE_ASPECT_CLASSES} />
    </ThumbnailTileFrame>
  );
}
