export const ToastTone = {
  done: 'done',
  failed: 'failed',
} as const;
export type ToastTone = (typeof ToastTone)[keyof typeof ToastTone];

/** The tone a toast was added with, which Base UI keeps as its `type`. */
export function toastToneOf(type: string | undefined): ToastTone {
  return type === ToastTone.failed ? ToastTone.failed : ToastTone.done;
}
