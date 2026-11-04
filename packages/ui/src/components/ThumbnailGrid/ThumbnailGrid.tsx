import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';

export interface ThumbnailGridProps {
  /** What the list holds, for screen readers: "Photos". */
  readonly label?: string;
  /** Its tiles: `ThumbnailTile`, `ThumbnailCheckboxTile`, `ThumbnailFileTile`, `ThumbnailFileTileLink`, `ThumbnailTileAwaited`. */
  readonly children: ReactNode;
  readonly className?: string;
}

/** A category's files as a list of tiles: four columns on a computer, two on a phone. */
export function ThumbnailGrid({ label, children, className }: ThumbnailGridProps) {
  return (
    <ul
      aria-label={label}
      className={classNames(
        'grid grid-cols-2 gap-x-space-4 gap-y-space-5 md:grid-cols-4',
        className,
      )}
    >
      {children}
    </ul>
  );
}
