import { type ClipboardEvent, type SyntheticEvent, useState } from 'react';
import { CODE_LENGTH, digitsOf } from './code-digits.ts';

interface UseCodeInputOptions {
  readonly value: string | undefined;
  readonly defaultValue: string | undefined;
  readonly onValueChange: ((code: string) => void) | undefined;
}

export function useCodeInput({ value, defaultValue, onValueChange }: UseCodeInputOptions) {
  const [ownCode, setOwnCode] = useState(() => digitsOf(defaultValue ?? ''));
  const [caret, setCaret] = useState(0);
  const code = value === undefined ? ownCode : digitsOf(value);

  function changeCode(text: string) {
    const nextCode = digitsOf(text);
    setOwnCode(nextCode);
    if (nextCode !== code) {
      onValueChange?.(nextCode);
    }
  }

  // A cell shows where the next digit goes, so a selection, such as the whole code selected on
  // tabbing in, becomes a caret at its end.
  function followCaret(event: SyntheticEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const end = input.selectionEnd ?? input.value.length;
    if (input.selectionStart !== end) {
      input.setSelectionRange(end, end);
    }
    setCaret(end);
  }

  // Wherever the reader clicks in, the next digit goes after the last one.
  function moveCaretToEnd(event: SyntheticEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    input.setSelectionRange(input.value.length, input.value.length);
    setCaret(input.value.length);
  }

  // A whole code pasted replaces the one already there, rather than being cut off after it.
  function pasteCode(event: ClipboardEvent<HTMLInputElement>) {
    const pastedCode = digitsOf(event.clipboardData.getData('text'));
    if (pastedCode.length < CODE_LENGTH) {
      return;
    }
    event.preventDefault();
    changeCode(pastedCode);
    setCaret(CODE_LENGTH);
  }

  return {
    code,
    activePosition: Math.min(caret, CODE_LENGTH - 1),
    inputProps: {
      value: code,
      onValueChange: changeCode,
      onSelect: followCaret,
      onFocus: moveCaretToEnd,
      onClick: moveCaretToEnd,
      onPaste: pasteCode,
    },
  };
}
