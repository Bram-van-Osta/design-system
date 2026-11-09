import { AlertDialog } from '@base-ui/react/alert-dialog';
import type { ReactNode } from 'react';
import { useMessages } from '../../i18n/use-messages.ts';
import { hasContent } from '../../utils/has-content.ts';
import { Button, ButtonVariant } from '../Button/Button.tsx';
import { DialogPlacement } from './dialog-placement.ts';

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
  /** Where it stands on a phone: in the middle, the default, or rising from the bottom. */
  readonly placement?: DialogPlacement;
}

// On a computer, a box in the middle of the screen at the reading width; on a phone, the same box,
// or a sheet from the bottom at the whole width, scrolled when it is taller than the screen.
const COMPUTER_CLASSES =
  'md:inset-x-space-4 md:top-1/2 md:bottom-auto md:mx-auto md:max-h-none md:max-w-reading-width md:-translate-y-1/2 md:border-hair md:p-space-6';
const POPUP_CLASSES: Readonly<Record<DialogPlacement, string>> = {
  center: 'inset-x-space-4 top-1/2 mx-auto max-w-reading-width -translate-y-1/2 border-hair',
  sheet: 'inset-x-0 bottom-0 max-h-full overflow-y-auto border-t-hair',
};

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
  placement = DialogPlacement.center,
}: DialogProps) {
  const messages = useMessages();
  return (
    <AlertDialog.Root open={open} onOpenChange={(nextOpen: boolean) => onOpenChange(nextOpen)}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 bg-bg/80" />
        <AlertDialog.Popup
          className={`fixed flex flex-col gap-space-5 border-ink bg-bg p-space-5 text-ink ${POPUP_CLASSES[placement]} ${COMPUTER_CLASSES}`}
        >
          <div className="flex flex-col gap-space-2">
            <AlertDialog.Title className="font-display text-heading-xs">{title}</AlertDialog.Title>
            {hasContent(description) && (
              <AlertDialog.Description className="text-body text-ink-muted">
                {description}
              </AlertDialog.Description>
            )}
          </div>
          {children}
          {/* On a phone, stacked at the whole width, the action above its cancel. */}
          <div className="flex flex-col-reverse gap-space-2 *:w-full md:flex-row md:flex-wrap md:items-center md:justify-end md:gap-space-3 md:*:w-auto">
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
