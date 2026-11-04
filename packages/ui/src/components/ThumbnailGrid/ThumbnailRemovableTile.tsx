import { XIcon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';
import { IconButton } from '../IconButton/IconButton.tsx';
import { ThumbnailRemovableTileBox } from './ThumbnailRemovableTileBox.tsx';

export interface ThumbnailRemovableTileProps {
  /**
   * The image, cropped to its middle; `null` while it is not served yet: the box on surface, read
   * as "Loading…" by screen readers.
   */
  readonly src: string | null;
  /** What the remove button does, with the image's name, which screen readers read: "Remove the image: a painted shop sign". */
  readonly removeLabel: string;
  readonly onRemove: () => void;
  /** A line under the box, above the children, in Delft blue: "being sorted". */
  readonly note?: ReactNode;
  /** An image there will not be, whatever `src`: a dashed box in its place, the note in vermilion saying why. */
  readonly isRefused?: boolean;
  /** The remove button unavailable; the field under the image is the app's to disable. */
  readonly disabled?: boolean;
  /** What goes under the image in place of a name, such as a field: "Why this image?". */
  readonly children?: ReactNode;
  readonly className?: string;
}

/**
 * An image of a ThumbnailGrid the reader added and may take back, served, awaited or refused: a
 * remove button over its corner in every state, and room under it for the field the app renders.
 */
export function ThumbnailRemovableTile({
  src,
  removeLabel,
  onRemove,
  note,
  isRefused = false,
  disabled,
  children,
  className,
}: ThumbnailRemovableTileProps) {
  return (
    <li className={classNames('flex min-w-0 flex-col gap-space-4', className)}>
      <div className="flex flex-col gap-space-2">
        <div className="relative">
          <ThumbnailRemovableTileBox src={src} isRefused={isRefused} />
          <IconButton
            icon={XIcon}
            label={removeLabel}
            onClick={onRemove}
            disabled={disabled}
            className="absolute end-space-2 top-space-2 bg-bg"
          />
        </div>
        {hasContent(note) && (
          <span
            className={classNames(
              'font-mono text-meta',
              isRefused ? 'text-vermillion' : 'text-delft',
            )}
          >
            {note}
          </span>
        )}
      </div>
      {children}
    </li>
  );
}
