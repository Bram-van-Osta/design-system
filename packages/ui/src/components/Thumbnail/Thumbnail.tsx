import { Button as BaseButton } from '@base-ui/react/button';
import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { ThumbnailFrame } from './ThumbnailFrame.tsx';
import { ThumbnailImage } from './ThumbnailImage.tsx';
import { OPENING_BOX_CLASSES, THUMBNAIL_BOX_CLASSES } from './thumbnail-classes.ts';

export interface ThumbnailProps
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
  /** The image, often a full page much taller than wide: its top shows, at the thumbnail's width. */
  readonly src: string;
  /** What the button does, which screen readers read: "Open the capture of the home page on a computer". */
  readonly label: string;
  /** Under the box, in IBM Plex Mono: "computer", "phone". */
  readonly caption?: ReactNode;
  /** In CSS pixels: the box's width, which the caption wraps within. */
  readonly width: number;
  /** In CSS pixels: the box's height, the same for thumbnails side by side. */
  readonly height: number;
  /** On the thumbnail and its caption. */
  readonly className?: string;
}

/**
 * The top of an image, cropped to its box, as a button that opens the whole image: in a dialog,
 * through `onClick`, or as a dialog's trigger, `<Dialog.Trigger render={<Thumbnail … />} />`.
 */
export function Thumbnail({
  src,
  label,
  caption,
  width,
  height,
  className,
  ...props
}: ThumbnailProps) {
  return (
    <ThumbnailFrame width={width} caption={caption} className={className}>
      <BaseButton
        {...props}
        aria-label={label}
        className={classNames(THUMBNAIL_BOX_CLASSES, OPENING_BOX_CLASSES)}
        style={{ height }}
      >
        <ThumbnailImage src={src} />
      </BaseButton>
    </ThumbnailFrame>
  );
}
