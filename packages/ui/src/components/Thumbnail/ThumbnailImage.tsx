export interface ThumbnailImageProps {
  readonly src: string;
}

/**
 * The top of the image, at the box's width: a full page, much taller than wide, shows its first
 * screen. The image is decorative: the control around it is named by its label.
 */
export function ThumbnailImage({ src }: ThumbnailImageProps) {
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      className="block size-full object-cover object-top"
    />
  );
}
