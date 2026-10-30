import { WarningCircleIcon } from '@phosphor-icons/react';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';

// An error is written in words, in ink, with this icon: never in blue, which acts.
export const ERROR_MESSAGE_CLASSES = 'flex items-start gap-space-2 font-semibold text-ink';

export function ErrorIcon() {
  return (
    <WarningCircleIcon
      size={ICON_SIZE.inline}
      weight={ICON_WEIGHT}
      className="mt-0.5 shrink-0"
      aria-hidden
    />
  );
}
