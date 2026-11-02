import { Toast } from '@base-ui/react/toast';
import { CheckIcon, type Icon, WarningIcon } from '@phosphor-icons/react';
import { type ReactNode, useEffect } from 'react';
import { useMessages } from '../../i18n/use-messages.ts';
import { FIRST_LINE_SLOT_CLASSES } from '../../utils/first-line.ts';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';
import { useReducedMotion } from '../../utils/use-reduced-motion.ts';
import {
  TOAST_LIMIT,
  TOAST_SWIPE_DIRECTIONS,
  toastContentStyle,
  toastRootStyle,
} from './toast-motion.ts';
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

/**
 * Around the app, inside the UiProvider: the toasts that `useToast` shows stack at the bottom of
 * the screen, three at most, and unfold on hover or when the keyboard reaches them (F6).
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const messages = useMessages();
  return (
    <Toast.Provider limit={TOAST_LIMIT}>
      {children}
      <Toast.Portal>
        <Toast.Viewport
          aria-label={messages['toast.region']}
          className="fixed inset-x-space-4 bottom-space-4 z-50 md:inset-x-auto md:right-space-6 md:bottom-space-6 md:w-toast-width"
        >
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}

const SWIPE_DIRECTIONS = [...TOAST_SWIPE_DIRECTIONS];

/** Base UI keeps the toasts past the limit, hidden, to show them again: here they leave for good. */
function useOldestSentAway(): readonly Toast.Root.ToastObject[] {
  const { toasts, close } = Toast.useToastManager();
  useEffect(() => {
    for (const toast of toasts) {
      if (toast.limited && toast.transitionStatus !== 'ending') {
        close(toast.id);
      }
    }
  }, [toasts, close]);
  return toasts;
}

// No close button: the toast leaves by itself and waits while hovered; F6 reaches it, Escape
// dismisses it, and so does a swipe. The hit area under each toast spans the gap to the next one,
// so that the unfolded stack stays hovered between two toasts.
function ToastList() {
  const toasts = useOldestSentAway();
  const isReducedMotion = useReducedMotion();
  return toasts.map((toast) => {
    const { icon: ToneIcon, iconClassName } = TONE_LOOKS[toastToneOf(toast.type)];
    return (
      <Toast.Root
        key={toast.id}
        toast={toast}
        swipeDirection={SWIPE_DIRECTIONS}
        style={(state) => toastRootStyle({ state, isReducedMotion })}
        className="absolute inset-x-0 bottom-0 origin-bottom select-none bg-ink px-space-4 py-space-3 text-body-s text-bg after:absolute after:inset-x-0 after:top-full after:h-space-3"
      >
        <Toast.Content style={toastContentStyle} className="flex items-start gap-space-3">
          <span className={FIRST_LINE_SLOT_CLASSES}>
            <ToneIcon
              size={ICON_SIZE.inline}
              weight={ICON_WEIGHT}
              className={iconClassName}
              aria-hidden
            />
          </span>
          <div className="flex min-w-0 flex-col">
            <Toast.Title render={<p />} />
            <Toast.Description className="text-small text-bg/75" />
          </div>
        </Toast.Content>
      </Toast.Root>
    );
  });
}
