import { type ChangeEvent, useRef } from 'react';
import { useFileDrop } from '../FileInput/use-file-drop.ts';

interface FileDropZoneOptions {
  readonly onFilesChoose: (files: readonly File[]) => void;
  readonly isDisabled: boolean;
}

/** The hidden input behind the zone, which takes several files, and the files dropped on it. */
export function useFileDropZone({ onFilesChoose, isDisabled }: FileDropZoneOptions) {
  const inputRef = useRef<HTMLInputElement>(null);
  const drop = useFileDrop(onFilesChoose, isDisabled);
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
