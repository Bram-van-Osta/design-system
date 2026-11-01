import type { BaseUIEvent } from '@base-ui/react/types';
import { type ChangeEvent, type ClipboardEvent, useState } from 'react';
import { CODE_LENGTH, wholeCodeIn } from './code-digits.ts';

interface UseCodeInputOptions {
  readonly value: string | undefined;
  readonly defaultValue: string | undefined;
  readonly onValueChange: ((code: string) => void) | undefined;
  readonly onComplete: ((code: string) => void) | undefined;
}

// Base UI writes what a slot receives from that slot on: a whole new code arriving in the last
// slot would keep the five digits before it. A whole code replaces the one there instead.
export function useCodeInput({
  value,
  defaultValue,
  onValueChange,
  onComplete,
}: UseCodeInputOptions) {
  const [ownCode, setOwnCode] = useState(defaultValue ?? '');
  const code = value ?? ownCode;

  function changeCode(nextCode: string) {
    setOwnCode(nextCode);
    onValueChange?.(nextCode);
    if (nextCode.length === CODE_LENGTH) {
      onComplete?.(nextCode);
    }
  }

  function replaceCode(wholeCode: string, event: BaseUIEvent<ChangeEvent | ClipboardEvent>) {
    event.preventBaseUIHandler();
    changeCode(wholeCode);
  }

  return {
    rootProps: { value: code, onValueChange: changeCode },
    slotProps: {
      onChange(event: BaseUIEvent<ChangeEvent<HTMLInputElement>>) {
        const input = event.currentTarget;
        const wholeCode = wholeCodeIn(input.value, input.selectionStart ?? input.value.length);
        if (wholeCode !== null) {
          replaceCode(wholeCode, event);
        }
      },
      onPaste(event: BaseUIEvent<ClipboardEvent<HTMLInputElement>>) {
        const wholeCode = wholeCodeIn(event.clipboardData.getData('text/plain'));
        if (wholeCode !== null) {
          event.preventDefault();
          replaceCode(wholeCode, event);
        }
      },
    },
  };
}
