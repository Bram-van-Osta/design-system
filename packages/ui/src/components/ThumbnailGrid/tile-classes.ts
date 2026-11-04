import { THUMBNAIL_BOX_CLASSES } from '../Thumbnail/thumbnail-classes.ts';

// A tile's box is the grid's column wide, 4:3.
export const TILE_ASPECT_CLASSES = 'aspect-4/3';

export const TILE_BOX_CLASSES = `${THUMBNAIL_BOX_CLASSES} ${TILE_ASPECT_CLASSES}`;

// A file without an image: its format's short name, on the surface within a solid hairline.
export const FILE_BOX_CLASSES =
  'flex items-center justify-center border-line bg-surface p-space-2 text-center font-mono text-body text-ink-muted wrap-anywhere';
