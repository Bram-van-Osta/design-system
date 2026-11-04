import { classNames } from '../../utils/class-names.ts';

/** Which part of the image its box keeps. */
export const ThumbnailCrop = {
  /** Its top, at the box's width: a full page, much taller than wide, shows its first screen. */
  top: 'top',
  /** Its middle: a photo. */
  center: 'center',
} as const;
export type ThumbnailCrop = (typeof ThumbnailCrop)[keyof typeof ThumbnailCrop];

const CROP_CLASSES: Readonly<Record<ThumbnailCrop, string>> = {
  top: 'object-top',
  center: 'object-center',
};

export interface ThumbnailImageProps {
  readonly src: string;
  /** `top` by default, for a page's capture. */
  readonly crop?: ThumbnailCrop;
}

/**
 * The image, cropped to fill its box. The image is decorative: the control around it is named by
 * its label.
 */
export function ThumbnailImage({ src, crop = ThumbnailCrop.top }: ThumbnailImageProps) {
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      className={classNames('block size-full object-cover', CROP_CLASSES[crop])}
    />
  );
}
