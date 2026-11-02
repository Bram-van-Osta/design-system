import { type KeyboardEvent, type RefObject, useEffect, useId, useRef, useState } from 'react';
import { useControllableValue } from '../../utils/use-controllable-value.ts';
import type { ChoiceDetail } from './choice-card.ts';

const NO_VALUES: readonly string[] = [];

/** What the detail field needs from its grid: its id, its focus and its text. */
export interface ChoiceDetailInput {
  readonly inputId: string;
  readonly inputRef: RefObject<HTMLInputElement | null>;
  readonly text: string;
  readonly onTextChange: (text: string) => void;
}

interface UseChoiceDetailOptions {
  readonly detail: ChoiceDetail | undefined;
  /** The answers chosen now: the field shows while one of them is a detailed one. */
  readonly chosenValues: readonly string[];
}

// The field renders after the choice that shows it, so the focus moves once it is there.
function useFocusRequest(inputRef: RefObject<HTMLInputElement | null>) {
  const [requestCount, setRequestCount] = useState(0);
  useEffect(() => {
    if (requestCount > 0) {
      inputRef.current?.focus();
    }
  }, [requestCount, inputRef]);
  return () => setRequestCount((count) => count + 1);
}

/**
 * Wires a grid of cards to its detail field: the field shows while a detailed answer is chosen,
 * those answers control it, and choosing one moves the focus into it, except while the arrow keys
 * walk through the radios. Its text stays while it is hidden.
 */
export function useChoiceDetail({ detail, chosenValues }: UseChoiceDetailOptions) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const isWalkingWithArrows = useRef(false);
  const requestFocus = useFocusRequest(inputRef);
  const [text, setText] = useControllableValue(detail?.value, detail?.defaultValue ?? '');
  const detailedValues = detail?.forValues ?? NO_VALUES;
  const isShown = detailedValues.some((value) => chosenValues.includes(value));
  const input: ChoiceDetailInput = {
    inputId,
    inputRef,
    text,
    onTextChange: (nextText: string) => {
      setText(nextText);
      detail?.onValueChange?.(nextText);
    },
  };
  return {
    isShown,
    input,
    groupProps: {
      onKeyDownCapture: (event: KeyboardEvent) => {
        isWalkingWithArrows.current = event.key.startsWith('Arrow');
      },
      onPointerDownCapture: () => {
        isWalkingWithArrows.current = false;
      },
    },
    controlsFor: (value: string) =>
      isShown && detailedValues.includes(value) ? inputId : undefined,
    onChoose: (value: string) => {
      if (detailedValues.includes(value) && !isWalkingWithArrows.current) {
        requestFocus();
      }
    },
  };
}
