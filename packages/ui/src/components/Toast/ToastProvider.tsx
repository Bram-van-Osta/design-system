import { Toast } from '@base-ui/react/toast';
import { XIcon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { useMessages } from '../../i18n/use-messages.ts';
import { IconButton } from '../IconButton/IconButton.tsx';

export interface ToastProviderProps {
  readonly children: ReactNode;
}

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

function ToastList() {
  const { toasts } = Toast.useToastManager();
  const messages = useMessages();
  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      className="flex max-w-reading-width items-start gap-space-2 border-hair border-ink bg-bg py-space-2 pr-space-1 pl-space-4 text-ink"
    >
      <Toast.Content className="flex min-w-0 flex-1 flex-col gap-space-1 py-space-2">
        <Toast.Title render={<p />} className="text-label" />
        <Toast.Description className="text-body-s text-ink-muted" />
      </Toast.Content>
      {/* Base UI hides it from screen readers, which reach the toast by F6 and dismiss it with Escape. */}
      <Toast.Close render={<IconButton icon={XIcon} label={messages['toast.close']} />} />
    </Toast.Root>
  ));
}
