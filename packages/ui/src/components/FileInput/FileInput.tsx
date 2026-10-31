import { Field as BaseField } from '@base-ui/react/field';
import { FileIcon, UploadSimpleIcon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { useMessages } from '../../i18n/use-messages.ts';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';
import { Button, ButtonVariant } from '../Button/Button.tsx';
import { FieldError } from '../Field/FieldError.tsx';
import { FieldMarkerText } from '../Field/FieldMarkerText.tsx';
import type { FieldMarker } from '../Field/field-marker.ts';
import { useFileInput } from './use-file-input.ts';

const ZONE_CLASSES =
  'flex w-full min-h-button-height cursor-pointer items-center justify-center gap-space-2 border-hair border-dashed border-ink py-space-5 text-label text-ink hover:bg-surface data-dragging:border-delft data-dragging:bg-surface disabled:cursor-not-allowed disabled:border-line disabled:text-ink-muted';

const CHOSEN_CLASSES =
  'flex min-h-button-height items-center justify-between gap-space-3 border-hair border-field pl-space-4 pr-space-2';

export interface FileInputProps {
  readonly label: ReactNode;
  /** The types and the size the app accepts, in words. */
  readonly description?: ReactNode;
  /** What is wrong with the file, in words: a type or a size the app refused. */
  readonly error?: ReactNode;
  readonly marker?: FieldMarker;
  /** The chosen file's name; without one, the zone to drop or choose a file. */
  readonly fileName?: string | null;
  /** A file chosen or dropped, which the app checks, or `null` once removed. */
  readonly onFileChange: (file: File | null) => void;
  /** The types the picker offers, as for an input: `.pdf,image/jpeg`. */
  readonly accept?: string;
  readonly name?: string;
  readonly disabled?: boolean;
  readonly className?: string;
}

/** One file, dropped or chosen, then shown by its name with a way to remove it. */
export function FileInput({
  label,
  description,
  error,
  marker,
  fileName,
  onFileChange,
  accept,
  name,
  disabled = false,
  className,
}: FileInputProps) {
  const isInvalid = hasContent(error);
  const fileInput = useFileInput({
    hasFile: Boolean(fileName),
    onFileChange,
    isDisabled: disabled,
  });
  const { ids } = fileInput;
  const describedBy = joinIds([hasContent(description) && ids.description, isInvalid && ids.error]);
  return (
    <BaseField.Root
      invalid={isInvalid}
      disabled={disabled}
      className={classNames('flex flex-col gap-space-2', className)}
    >
      <div id={ids.label} className="text-label text-ink">
        {label}
        {marker && <FieldMarkerText marker={marker} />}
      </div>
      <input
        ref={fileInput.inputRef}
        type="file"
        accept={accept}
        name={name}
        disabled={disabled}
        hidden
        tabIndex={-1}
        onChange={fileInput.onInputChange}
      />
      {fileName ? (
        <ChosenFile fileName={fileName} fileInput={fileInput} describedBy={describedBy} />
      ) : (
        <DropZone fileInput={fileInput} describedBy={describedBy} isInvalid={isInvalid} />
      )}
      {isInvalid && <FieldError id={ids.error}>{error}</FieldError>}
      {hasContent(description) && (
        <BaseField.Description id={ids.description} className="text-body-s text-ink-muted">
          {description}
        </BaseField.Description>
      )}
    </BaseField.Root>
  );
}

type FileInputState = ReturnType<typeof useFileInput>;

interface DropZoneProps {
  readonly fileInput: FileInputState;
  readonly describedBy: string | undefined;
  readonly isInvalid: boolean;
}

function DropZone({ fileInput, describedBy, isInvalid }: DropZoneProps) {
  const messages = useMessages();
  const { ids, drop } = fileInput;
  return (
    <button
      {...drop.dropProps}
      ref={fileInput.focus.chooseRef}
      type="button"
      disabled={fileInput.isDisabled}
      data-dragging={drop.isDragging || undefined}
      aria-labelledby={`${ids.label} ${ids.choose}`}
      aria-describedby={describedBy}
      aria-invalid={isInvalid || undefined}
      onClick={fileInput.openPicker}
      className={ZONE_CLASSES}
    >
      <UploadSimpleIcon size={ICON_SIZE.inline} weight={ICON_WEIGHT} aria-hidden />
      <span id={ids.choose}>{messages['fileInput.choose']}</span>
    </button>
  );
}

interface ChosenFileProps {
  readonly fileName: string;
  readonly fileInput: FileInputState;
  readonly describedBy: string | undefined;
}

function ChosenFile({ fileName, fileInput, describedBy }: ChosenFileProps) {
  const messages = useMessages();
  const { ids } = fileInput;
  return (
    <div className={CHOSEN_CLASSES}>
      <span id={ids.fileName} className="flex min-w-0 items-center gap-space-2 text-body text-ink">
        <FileIcon size={ICON_SIZE.inline} weight={ICON_WEIGHT} aria-hidden className="shrink-0" />
        <span className="truncate">{fileName}</span>
      </span>
      <Button
        ref={fileInput.focus.removeRef}
        variant={ButtonVariant.quiet}
        disabled={fileInput.isDisabled}
        aria-labelledby={`${ids.remove} ${ids.fileName}`}
        aria-describedby={describedBy}
        onClick={fileInput.remove}
      >
        <span id={ids.remove}>{messages['fileInput.remove']}</span>
      </Button>
    </div>
  );
}

function joinIds(ids: readonly (string | false)[]): string | undefined {
  const present = ids.filter((id) => id !== false);
  return present.length > 0 ? present.join(' ') : undefined;
}
