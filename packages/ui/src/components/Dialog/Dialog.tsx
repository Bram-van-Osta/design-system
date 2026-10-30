import { AlertDialog } from '@base-ui/react/alert-dialog';
import type { ReactNode } from 'react';
import { useMessages } from '../../i18n/use-messages.ts';
import { hasContent } from '../../utils/has-content.ts';
import { Button, ButtonVariant } from '../Button/Button.tsx';

export interface DialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  /** A question: "Remove this file?". */
  readonly title: ReactNode;
  /** What the action will do, and what it will not. */
  readonly description?: ReactNode;
  /** The action's verb, never "Confirm": "Remove". */
  readonly actionLabel: ReactNode;
  readonly onAction: () => void;
  /** The action is running: its button keeps the focus and shows a spinner. */
  readonly isPending?: boolean;
  /** In place of the package's "Cancel". */
  readonly cancelLabel?: ReactNode;
  /** What the decision needs besides the description, such as a field. */
  readonly children?: ReactNode;
}

/** A decision the reader must take before going on: a question, and the action that answers it. The app closes it once the action is done. */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  actionLabel,
  onAction,
  isPending = false,
  cancelLabel,
  children,
}: DialogProps) {
  const messages = useMessages();
  return (
    <AlertDialog.Root open={open} onOpenChange={(nextOpen: boolean) => onOpenChange(nextOpen)}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 bg-bg/80" />
        <AlertDialog.Popup className="fixed inset-x-space-4 top-1/2 mx-auto flex max-w-reading-width -translate-y-1/2 flex-col gap-space-5 border-hair border-ink bg-bg p-space-5 text-ink md:p-space-6">
          <div className="flex flex-col gap-space-2">
            <AlertDialog.Title className="font-display text-heading-xs">{title}</AlertDialog.Title>
            {hasContent(description) && (
              <AlertDialog.Description className="text-body text-ink-muted">
                {description}
              </AlertDialog.Description>
            )}
          </div>
          {children}
          <div className="flex flex-wrap items-center justify-end gap-space-3">
            <AlertDialog.Close render={<Button variant={ButtonVariant.secondary} />}>
              {cancelLabel ?? messages['dialog.cancel']}
            </AlertDialog.Close>
            <Button onClick={onAction} isPending={isPending}>
              {actionLabel}
            </Button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
