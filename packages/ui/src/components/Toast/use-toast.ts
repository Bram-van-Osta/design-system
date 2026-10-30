import { Toast } from '@base-ui/react/toast';
import { useCallback } from 'react';

export interface ToastContent {
  /** A short label without a final period: "Saved". */
  readonly title: string;
  readonly description?: string;
}

/** Shows a short message that goes away by itself, from inside a ToastProvider. */
export function useToast(): (content: ToastContent) => void {
  const { add } = Toast.useToastManager();
  return useCallback(
    (content: ToastContent) => {
      add(content);
    },
    [add],
  );
}
