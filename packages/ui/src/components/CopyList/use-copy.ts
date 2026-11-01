import { type RefObject, useEffect, useState } from 'react';

const RESULT_DURATION_MS = 2000;

export const CopyOutcome = {
  copied: 'copied',
  failed: 'failed',
} as const;
export type CopyOutcome = (typeof CopyOutcome)[keyof typeof CopyOutcome];

interface CopyResult {
  readonly outcome: CopyOutcome;
  /** Counts the copies, so that the same result copied again is announced again. */
  readonly count: number;
}

interface UseCopyOptions {
  readonly text: string;
  /** The value shown: selected, for the reader to copy it, when the browser refuses. */
  readonly valueRef: RefObject<HTMLElement | null>;
}

export function useCopy({ text, valueRef }: UseCopyOptions) {
  const [result, setResult] = useState<CopyResult | null>(null);

  useEffect(() => {
    if (result === null) {
      return;
    }
    const timeout = setTimeout(() => setResult(null), RESULT_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [result]);

  function settle(outcome: CopyOutcome) {
    setResult((previous) => ({ outcome, count: (previous?.count ?? 0) + 1 }));
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      settle(CopyOutcome.copied);
    } catch {
      if (valueRef.current !== null) {
        window.getSelection()?.selectAllChildren(valueRef.current);
      }
      settle(CopyOutcome.failed);
    }
  }

  return { result, copy };
}
