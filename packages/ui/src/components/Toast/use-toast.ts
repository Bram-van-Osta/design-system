import { Toast } from '@base-ui/react/toast';
import { useCallback } from 'react';
import { ToastTone } from './toast-tone.ts';

export interface ToastContent {
  /** A short label without a final period: "Saved". */
  readonly title: string;
  readonly description?: string;
  /** `done` for an action done, with a check; `failed` for one that failed, with a warning. */
  readonly tone?: ToastTone;
}

/** Shows a short message that goes away by itself, from inside a ToastProvider. */
export function useToast(): (content: ToastContent) => void {
  const { add } = Toast.useToastManager();
  return useCallback(
    ({ title, description, tone = ToastTone.done }: ToastContent) => {
      add({ title, description, type: tone });
    },
    [add],
  );
}
