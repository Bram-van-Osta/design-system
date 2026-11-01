import { type RefObject, useEffect, useState } from 'react';

const COPIED_DURATION_MS = 2000;

interface UseCopyOptions {
  readonly text: string;
  /** The value on screen: selected for the reader to copy it when the browser refuses. */
  readonly valueRef: RefObject<HTMLElement | null>;
}

export function useCopy({ text, valueRef }: UseCopyOptions) {
  const [copiedAt, setCopiedAt] = useState<number | null>(null);

  useEffect(() => {
    if (copiedAt === null) {
      return;
    }
    const timeout = setTimeout(() => setCopiedAt(null), COPIED_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [copiedAt]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAt(Date.now());
    } catch {
      if (valueRef.current !== null) {
        window.getSelection()?.selectAllChildren(valueRef.current);
      }
    }
  }

  return { isCopied: copiedAt !== null, copy };
}
