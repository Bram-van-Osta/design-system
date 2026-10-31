import { type ChangeEvent, useId, useRef } from 'react';
import { useFileDrop } from './use-file-drop.ts';
import { useFileInputFocus } from './use-file-input-focus.ts';

interface FileInputOptions {
  readonly hasFile: boolean;
  readonly onFileChange: (file: File | null) => void;
  readonly isDisabled: boolean;
}

/** The hidden file input behind the zone, the drop, and the focus between the zone and the file. */
export function useFileInput({ hasFile, onFileChange, isDisabled }: FileInputOptions) {
  const ids = useFileInputIds();
  const inputRef = useRef<HTMLInputElement>(null);
  const focus = useFileInputFocus(hasFile);
  const choose = (file: File) => {
    focus.moveFocusOnChange();
    onFileChange(file);
  };
  const drop = useFileDrop(choose, isDisabled);
  return {
    ids,
    inputRef,
    isDisabled,
    focus,
    drop,
    openPicker: () => inputRef.current?.click(),
    onInputChange: (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files?.[0];
      // Emptied, so that the same file chosen again after a refusal is a change too.
      event.currentTarget.value = '';
      if (file) {
        choose(file);
      }
    },
    remove: () => {
      focus.moveFocusOnChange();
      onFileChange(null);
    },
  };
}

function useFileInputIds() {
  const id = useId();
  return {
    label: `${id}-label`,
    choose: `${id}-choose`,
    fileName: `${id}-file-name`,
    remove: `${id}-remove`,
    description: `${id}-description`,
    error: `${id}-error`,
  };
}
