import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { ThumbnailGridColumns } from './thumbnail-grid-columns.ts';

const COLUMNS_CLASSES: Readonly<Record<ThumbnailGridColumns, string>> = {
  four: 'grid-cols-2 gap-x-space-4 gap-y-space-5 md:grid-cols-4',
  two: 'grid-cols-1 gap-x-space-5 gap-y-space-6 md:grid-cols-2',
};

export interface ThumbnailGridProps {
  /** What the list holds, for screen readers: "Photos". */
  readonly label?: string;
  /** `four` by default; `two` for tiles with a field under each, such as `ThumbnailRemovableTile`. */
  readonly columns?: ThumbnailGridColumns;
  /** Its tiles: `ThumbnailTile`, `ThumbnailCheckboxTile`, `ThumbnailRemovableTile`, `ThumbnailFileTile`, `ThumbnailFileTileLink`, `ThumbnailTileAwaited`. */
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * A category's files as a list of tiles: four columns on a computer, two on a phone; or two and
 * one, for tiles with a field under each.
 */
export function ThumbnailGrid({
  label,
  columns = ThumbnailGridColumns.four,
  children,
  className,
}: ThumbnailGridProps) {
  return (
    <ul aria-label={label} className={classNames('grid', COLUMNS_CLASSES[columns], className)}>
      {children}
    </ul>
  );
}
