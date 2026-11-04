import { Button as BaseButton } from '@base-ui/react/button';
import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { ThumbnailCrop, ThumbnailImage } from '../Thumbnail/ThumbnailImage.tsx';
import { OPENING_BOX_CLASSES } from '../Thumbnail/thumbnail-classes.ts';
import { ThumbnailTileFrame } from './ThumbnailTileFrame.tsx';
import { TILE_BOX_CLASSES } from './tile-classes.ts';

export interface ThumbnailTileProps
  extends Omit<
    BaseButton.Props,
    | 'className'
    | 'style'
    | 'render'
    | 'nativeButton'
    | 'focusableWhenDisabled'
    | 'disabled'
    | 'children'
    | 'aria-label'
  > {
  /** The image, cropped to its middle. */
  readonly src: string;
  /** What the button does, which screen readers read: "Open shop-front.jpg". */
  readonly label: string;
  readonly fileName: string;
  /** A line under the name, in Delft blue: "kept for the site". */
  readonly note?: ReactNode;
  readonly className?: string;
}

/**
 * An image of a ThumbnailGrid, as a button that opens it whole: in an `ImageViewer`, through
 * `onClick`.
 */
export function ThumbnailTile({
  src,
  label,
  fileName,
  note,
  className,
  ...props
}: ThumbnailTileProps) {
  return (
    <ThumbnailTileFrame fileName={fileName} note={note} className={className}>
      <BaseButton
        {...props}
        aria-label={label}
        className={classNames(TILE_BOX_CLASSES, OPENING_BOX_CLASSES)}
      >
        <ThumbnailImage src={src} crop={ThumbnailCrop.center} />
      </BaseButton>
    </ThumbnailTileFrame>
  );
}
