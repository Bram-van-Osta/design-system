import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';
import { FILE_DROP_ZONE_CLASSES, FileDropZoneSize } from './file-drop-zone-size.ts';
import { useFileDropZone } from './use-file-drop-zone.ts';

export { FileDropZoneSize } from './file-drop-zone-size.ts';

export interface FileDropZoneProps {
  /** What to drop, which names the zone: "Drop files". */
  readonly label: ReactNode;
  /** Under the label, the types it takes among them: "or drag them here · .svg, .pdf or .png". */
  readonly description?: ReactNode;
  /** The files chosen or dropped, which the app checks and sends: never sent by the zone. */
  readonly onFilesChoose: (files: readonly File[]) => void;
  /** Several files at once, the default; `false` for a question that takes one: a drop of several hands the first. */
  readonly isMultiple?: boolean;
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
 * Files dropped on the zone or chosen from the picker it opens, several at once or one: a button,
 * reached with the keyboard, in front of a hidden file input.
 */
export function FileDropZone({
  label,
  description,
  onFilesChoose,
  isMultiple = true,
  accept,
  size = FileDropZoneSize.large,
  name,
  disabled = false,
  className,
}: FileDropZoneProps) {
  const zone = useFileDropZone({ onFilesChoose, isMultiple, isDisabled: disabled });
  const classes = FILE_DROP_ZONE_CLASSES[size];
  return (
    <>
      <input
        ref={zone.inputRef}
        type="file"
        multiple={isMultiple}
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
