import { XIcon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { IconButton } from '../IconButton/IconButton.tsx';
import { ThumbnailCrop, ThumbnailImage } from '../Thumbnail/ThumbnailImage.tsx';
import { TILE_BOX_CLASSES } from './tile-classes.ts';

export interface ThumbnailRemovableTileProps {
  /** The image, cropped to its middle. */
  readonly src: string;
  /** What the remove button does, with the image's name, which screen readers read: "Remove the image: a painted shop sign". */
  readonly removeLabel: string;
  readonly onRemove: () => void;
  /** The remove button unavailable; the field under the image is the app's to disable. */
  readonly disabled?: boolean;
  /** What goes under the image in place of a name, such as a field: "Why this image?". */
  readonly children?: ReactNode;
  readonly className?: string;
}

/**
 * An image of a ThumbnailGrid the reader added and may take back: a remove button over its
 * corner, and room under it for the field the app renders.
 */
export function ThumbnailRemovableTile({
  src,
  removeLabel,
  onRemove,
  disabled,
  children,
  className,
}: ThumbnailRemovableTileProps) {
  return (
    <li className={classNames('flex min-w-0 flex-col gap-space-4', className)}>
      <div className={classNames(TILE_BOX_CLASSES, 'relative border-line')}>
        <ThumbnailImage src={src} crop={ThumbnailCrop.center} />
        <IconButton
          icon={XIcon}
          label={removeLabel}
          onClick={onRemove}
          disabled={disabled}
          className="absolute end-space-2 top-space-2 bg-bg"
        />
      </div>
      {children}
    </li>
  );
}
