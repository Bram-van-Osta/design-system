import { type ChangeEvent, useRef } from 'react';
import { useFileDrop } from '../FileInput/use-file-drop.ts';

interface FileDropZoneOptions {
  readonly onFilesChoose: (files: readonly File[]) => void;
  readonly isMultiple: boolean;
  readonly isDisabled: boolean;
}

/**
 * The hidden input behind the zone, and the files dropped on it: all of them, or the first alone
 * for a zone that takes one.
 */
export function useFileDropZone({ onFilesChoose, isMultiple, isDisabled }: FileDropZoneOptions) {
  const inputRef = useRef<HTMLInputElement>(null);
  const drop = useFileDrop(
    (files) => onFilesChoose(isMultiple ? files : files.slice(0, 1)),
    isDisabled,
  );
  return {
    inputRef,
    drop,
    openPicker: () => inputRef.current?.click(),
    onInputChange: (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.currentTarget.files ?? []);
      // Emptied, so that the same files chosen again after a refusal are a change too.
      event.currentTarget.value = '';
      if (files.length > 0) {
        onFilesChoose(files);
      }
    },
  };
}
