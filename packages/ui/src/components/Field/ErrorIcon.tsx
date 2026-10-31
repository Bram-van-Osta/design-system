import { WarningCircleIcon } from '@phosphor-icons/react';
import { FIRST_LINE_SLOT_CLASSES } from '../../utils/first-line.ts';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';

// An error is written in words, in ink, after this icon in vermillion: never in blue, which acts.
export const ERROR_MESSAGE_CLASSES = 'flex items-start gap-space-2 font-semibold text-ink';

export function ErrorIcon() {
  return (
    <span className={FIRST_LINE_SLOT_CLASSES}>
      <WarningCircleIcon
        size={ICON_SIZE.inline}
        weight={ICON_WEIGHT}
        className="text-vermillion"
        aria-hidden
      />
    </span>
  );
}
