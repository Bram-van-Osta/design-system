import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { CheckIcon } from '@phosphor-icons/react';
import { type ReactNode, useId } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';
import { ThumbnailCrop, ThumbnailImage } from '../Thumbnail/ThumbnailImage.tsx';
import { ThumbnailTileFrame } from './ThumbnailTileFrame.tsx';
import { TILE_BOX_CLASSES } from './tile-classes.ts';

// The image is the target; once ticked, a Delft frame inside its hairline, which moves nothing.
const ROOT_CLASSES = classNames(
  TILE_BOX_CLASSES,
  'relative block cursor-pointer border-line hover:not-data-disabled:border-ink data-disabled:cursor-not-allowed',
  'after:pointer-events-none after:absolute after:inset-0 data-checked:after:border-select data-checked:after:border-delft',
);

// The box in the image's corner: empty at rest, filled in Delft blue with its check once ticked.
const CORNER_CLASSES = classNames(
  'absolute end-space-2 top-space-2 flex size-5 items-center justify-center border-hair border-ink-muted bg-bg text-on-delft data-unchecked:text-transparent',
  'data-checked:border-delft data-checked:bg-delft',
  'data-disabled:border-line data-disabled:bg-surface data-disabled:data-checked:border-line data-disabled:data-checked:bg-surface data-disabled:data-checked:text-ink-muted',
);

export interface ThumbnailCheckboxTileProps
  extends Omit<
    BaseCheckbox.Root.Props,
    'className' | 'render' | 'nativeButton' | 'children' | 'aria-label' | 'aria-labelledby'
  > {
  /** The image, cropped to its middle. */
  readonly src: string;
  /** The file's name, which names the checkbox. */
  readonly fileName: string;
  /** A line under the name, in Delft blue: "kept for the site". */
  readonly note?: ReactNode;
  readonly className?: string;
}

/**
 * An image of a ThumbnailGrid to tick, among those of a selection: the whole image is the
 * checkbox, named by the file's name, toggled by a click or the space bar.
 */
export function ThumbnailCheckboxTile({
  src,
  fileName,
  note,
  className,
  ...props
}: ThumbnailCheckboxTileProps) {
  const fileNameId = useId();
  return (
    <ThumbnailTileFrame
      fileName={fileName}
      fileNameId={fileNameId}
      note={note}
      className={className}
    >
      <BaseCheckbox.Root {...props} aria-labelledby={fileNameId} className={ROOT_CLASSES}>
        <ThumbnailImage src={src} crop={ThumbnailCrop.center} />
        <BaseCheckbox.Indicator keepMounted className={CORNER_CLASSES}>
          <CheckIcon size={ICON_SIZE.inline} weight={ICON_WEIGHT} aria-hidden />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
    </ThumbnailTileFrame>
  );
}
