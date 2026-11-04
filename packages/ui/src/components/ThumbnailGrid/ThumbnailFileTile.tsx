import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { ThumbnailTileFrame } from './ThumbnailTileFrame.tsx';
import { FILE_BOX_CLASSES, TILE_BOX_CLASSES } from './tile-classes.ts';

export interface ThumbnailFileTileProps {
  /** The file's format, in short, in place of an image: "PDF", "Word". */
  readonly format: ReactNode;
  readonly fileName: string;
  /** A line under the name, in Delft blue. */
  readonly note?: ReactNode;
  readonly className?: string;
}

/** A file of a ThumbnailGrid without an image, by its format: nothing to open. */
export function ThumbnailFileTile({ format, fileName, note, className }: ThumbnailFileTileProps) {
  return (
    <ThumbnailTileFrame fileName={fileName} note={note} className={className}>
      <span className={classNames(TILE_BOX_CLASSES, FILE_BOX_CLASSES)}>{format}</span>
    </ThumbnailTileFrame>
  );
}
