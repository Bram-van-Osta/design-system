import { Toast } from '@base-ui/react/toast';
import { CheckIcon, type Icon, WarningIcon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { useMessages } from '../../i18n/use-messages.ts';
import { FIRST_LINE_SLOT_CLASSES } from '../../utils/first-line.ts';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';
import { ToastTone, toastToneOf } from './toast-tone.ts';

export interface ToastProviderProps {
  readonly children: ReactNode;
}

interface ToneLook {
  readonly icon: Icon;
  readonly iconClassName?: string;
}

// The vermilion reaches 4.1:1 on the ink band in light and 3.1:1 in dark: an icon needs 3:1.
const TONE_LOOKS: Readonly<Record<ToastTone, ToneLook>> = {
  [ToastTone.done]: { icon: CheckIcon },
  [ToastTone.failed]: { icon: WarningIcon, iconClassName: 'text-vermillion' },
};

/** Around the app, inside the UiProvider: the toasts that `useToast` shows appear at the bottom of the screen. */
export function ToastProvider({ children }: ToastProviderProps) {
  const messages = useMessages();
  return (
    <Toast.Provider>
      {children}
      <Toast.Portal>
        <Toast.Viewport
          aria-label={messages['toast.region']}
          className="fixed inset-x-space-4 bottom-space-4 z-50 flex flex-col items-stretch gap-space-3 md:inset-x-auto md:right-space-6 md:bottom-space-6 md:items-end"
        >
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}

// No close button: the toast leaves by itself and waits while hovered; F6 reaches it, Escape dismisses it.
function ToastList() {
  const { toasts } = Toast.useToastManager();
  return toasts.map((toast) => {
    const { icon: ToneIcon, iconClassName } = TONE_LOOKS[toastToneOf(toast.type)];
    return (
      <Toast.Root
        key={toast.id}
        toast={toast}
        className="flex max-w-reading-width items-start gap-space-3 bg-ink px-space-4 py-space-3 text-body-s text-bg"
      >
        <span className={FIRST_LINE_SLOT_CLASSES}>
          <ToneIcon
            size={ICON_SIZE.inline}
            weight={ICON_WEIGHT}
            className={iconClassName}
            aria-hidden
          />
        </span>
        <Toast.Content className="flex min-w-0 flex-col">
          <Toast.Title render={<p />} />
          <Toast.Description className="text-small text-bg/75" />
        </Toast.Content>
      </Toast.Root>
    );
  });
}
