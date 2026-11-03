import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { ThumbnailFrame } from './ThumbnailFrame.tsx';
import { ThumbnailImage } from './ThumbnailImage.tsx';
import { OPENING_BOX_CLASSES, THUMBNAIL_BOX_CLASSES } from './thumbnail-classes.ts';

export interface ThumbnailLinkProps
  extends Omit<useRender.ComponentProps<'a'>, 'className' | 'style' | 'children' | 'aria-label'> {
  /** The image, often a full page much taller than wide: its top shows, at the thumbnail's width. */
  readonly src: string;
  /** Where the link leads, which screen readers read: "Open the file". */
  readonly label: string;
  /** Under the box, in IBM Plex Mono. */
  readonly caption?: ReactNode;
  /** In CSS pixels: the box's width, which the caption wraps within. */
  readonly width: number;
  /** In CSS pixels: the box's height, the same for thumbnails side by side. */
  readonly height: number;
  /** On the thumbnail and its caption. */
  readonly className?: string;
}

/**
 * A Thumbnail as a link, for an image that opens on a page of its own. `render` takes the
 * router's link: `render={<RouterLink to="/files/1" />}`.
 */
export function ThumbnailLink({
  src,
  label,
  caption,
  width,
  height,
  className,
  ...props
}: ThumbnailLinkProps) {
  return (
    <ThumbnailFrame width={width} caption={caption} className={className}>
      <ThumbnailAnchor {...props} label={label} height={height}>
        <ThumbnailImage src={src} />
      </ThumbnailAnchor>
    </ThumbnailFrame>
  );
}

interface ThumbnailAnchorProps extends Omit<useRender.ComponentProps<'a'>, 'className' | 'style'> {
  readonly label: string;
  readonly height: number;
}

function ThumbnailAnchor({ render, label, height, children, ...props }: ThumbnailAnchorProps) {
  return useRender({
    defaultTagName: 'a',
    render,
    props: mergeProps<'a'>(
      {
        'aria-label': label,
        className: classNames(THUMBNAIL_BOX_CLASSES, OPENING_BOX_CLASSES),
        style: { height },
        children,
      },
      props,
    ),
  });
}
