import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { type ReactNode, useId } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { OPENING_HAIRLINE_CLASSES } from '../Thumbnail/thumbnail-classes.ts';
import { ThumbnailTileFrame } from './ThumbnailTileFrame.tsx';
import { FILE_BOX_CLASSES, TILE_BOX_CLASSES } from './tile-classes.ts';

export interface ThumbnailFileTileLinkProps
  extends Omit<
    useRender.ComponentProps<'a'>,
    'className' | 'style' | 'children' | 'aria-label' | 'aria-labelledby'
  > {
  /** The file's format, in short, in place of an image: "PDF", "Word". */
  readonly format: ReactNode;
  /** The file's name, which names the link with its format: "PDF holiday-menu.pdf". */
  readonly fileName: string;
  /** A line under the name, in Delft blue. */
  readonly note?: ReactNode;
  readonly className?: string;
}

/**
 * A file of a ThumbnailGrid without an image, as a link: `download` to download it, or the
 * router's link in `render`.
 */
export function ThumbnailFileTileLink({
  format,
  fileName,
  note,
  className,
  render,
  ...props
}: ThumbnailFileTileLinkProps) {
  const id = useId();
  const ids = { format: `${id}-format`, fileName: `${id}-file-name` };
  const link = useRender({
    defaultTagName: 'a',
    render,
    props: mergeProps<'a'>(
      {
        'aria-labelledby': `${ids.format} ${ids.fileName}`,
        className: classNames(TILE_BOX_CLASSES, FILE_BOX_CLASSES, OPENING_HAIRLINE_CLASSES),
        children: <span id={ids.format}>{format}</span>,
      },
      props,
    ),
  });
  return (
    <ThumbnailTileFrame
      fileName={fileName}
      fileNameId={ids.fileName}
      note={note}
      className={className}
    >
      {link}
    </ThumbnailTileFrame>
  );
}
