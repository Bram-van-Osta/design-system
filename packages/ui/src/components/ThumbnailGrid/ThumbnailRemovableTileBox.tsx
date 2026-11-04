import { classNames } from '../../utils/class-names.ts';
import { ThumbnailAwaitedBox } from '../Thumbnail/ThumbnailAwaitedBox.tsx';
import { ThumbnailCrop, ThumbnailImage } from '../Thumbnail/ThumbnailImage.tsx';
import { TILE_ASPECT_CLASSES, TILE_BOX_CLASSES } from './tile-classes.ts';

export interface ThumbnailRemovableTileBoxProps {
  readonly src: string | null;
  readonly isRefused: boolean;
}

/**
 * The 4:3 box of a removable tile: the image once served, the awaited box until then, or the
 * dashed box of an image there will not be.
 */
export function ThumbnailRemovableTileBox({ src, isRefused }: ThumbnailRemovableTileBoxProps) {
  if (isRefused) {
    return <div className={classNames(TILE_BOX_CLASSES, 'border-dashed border-field')} />;
  }
  if (src === null) {
    return <ThumbnailAwaitedBox className={TILE_ASPECT_CLASSES} />;
  }
  return (
    <div className={classNames(TILE_BOX_CLASSES, 'border-line')}>
      <ThumbnailImage src={src} crop={ThumbnailCrop.center} />
    </div>
  );
}
