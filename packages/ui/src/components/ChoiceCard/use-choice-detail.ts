import { type KeyboardEvent, useId, useRef } from 'react';
import type { ChoiceDetail } from './choice-card.ts';

const NO_VALUES: readonly string[] = [];

/**
 * Wires a grid of cards to its detail field: the detailed answers control the field, and choosing
 * one moves the focus into it, except while the arrow keys walk through the radios.
 */
export function useChoiceDetail(detail: ChoiceDetail | undefined) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const isWalkingWithArrows = useRef(false);
  const detailedValues = detail?.forValues ?? NO_VALUES;
  return {
    inputId,
    inputRef,
    groupProps: {
      onKeyDownCapture: (event: KeyboardEvent) => {
        isWalkingWithArrows.current = event.key.startsWith('Arrow');
      },
      onPointerDownCapture: () => {
        isWalkingWithArrows.current = false;
      },
    },
    controlsFor: (value: string) => (detailedValues.includes(value) ? inputId : undefined),
    onChoose: (value: string) => {
      if (detailedValues.includes(value) && !isWalkingWithArrows.current) {
        inputRef.current?.focus();
      }
    },
  };
}
