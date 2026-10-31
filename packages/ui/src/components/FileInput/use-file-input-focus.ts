import { useEffect, useRef } from 'react';

/**
 * The zone and the chosen file replace each other: once the person chooses or removes a file, the
 * focus moves to the one that appears, instead of falling back to the page.
 */
export function useFileInputFocus(hasFile: boolean) {
  const chooseRef = useRef<HTMLButtonElement>(null);
  const removeRef = useRef<HTMLButtonElement>(null);
  const shouldMoveFocus = useRef(false);
  useEffect(() => {
    if (shouldMoveFocus.current) {
      shouldMoveFocus.current = false;
      (hasFile ? removeRef : chooseRef).current?.focus();
    }
  }, [hasFile]);
  return {
    chooseRef,
    removeRef,
    moveFocusOnChange: () => {
      shouldMoveFocus.current = true;
    },
  };
}
