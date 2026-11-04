import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';
import { FILE_DROP_ZONE_CLASSES, FileDropZoneSize } from './file-drop-zone-size.ts';
import { useFileDropZone } from './use-file-drop-zone.ts';

export { FileDropZoneSize } from './file-drop-zone-size.ts';

export interface FileDropZoneProps {
  /** What to drop, which names the zone: "Drop files". */
  readonly label: ReactNode;
  /** Under the label on a computer, beside it in a compact zone: "or drag them here, as they come". Not on a phone, where nothing is dragged. */
  readonly description?: ReactNode;
  /** The files chosen or dropped, one or several at once, which the app checks and sends. */
  readonly onFilesChoose: (files: readonly File[]) => void;
  /** The types the picker offers, as for an input: `.zip,.sql,.gz`. A drop is not filtered. */
  readonly accept?: string;
  /** `large` by default, the page's own zone; `compact` inside a card. */
  readonly size?: FileDropZoneSize;
  readonly name?: string;
  readonly disabled?: boolean;
  /** On the zone. */
  readonly className?: string;
}

/**
 * Several files at once, dropped on the zone or chosen from the picker it opens: a button, reached
 * with the keyboard, in front of a hidden file input.
 */
export function FileDropZone({
  label,
  description,
  onFilesChoose,
  accept,
  size = FileDropZoneSize.large,
  name,
  disabled = false,
  className,
}: FileDropZoneProps) {
  const zone = useFileDropZone({ onFilesChoose, isDisabled: disabled });
  const classes = FILE_DROP_ZONE_CLASSES[size];
  return (
    <>
      <input
        ref={zone.inputRef}
        type="file"
        multiple
        accept={accept}
        name={name}
        disabled={disabled}
        hidden
        tabIndex={-1}
        onChange={zone.onInputChange}
      />
      <button
        {...zone.drop.dropProps}
        type="button"
        disabled={disabled}
        data-dragging={zone.drop.isDragging || undefined}
        onClick={zone.openPicker}
        className={classNames(classes.zone, className)}
      >
        <span className={classes.label}>{label}</span>
        {hasContent(description) && <span className={classes.description}>{description}</span>}
      </button>
    </>
  );
}
