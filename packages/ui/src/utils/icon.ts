import type { IconWeight } from '@phosphor-icons/react';

// The identity's line icons: 16 px beside a text, 20 px alone in a control, with a stroke of about
// 1.5 to 2 px, which is Phosphor's bold weight at these sizes.
export const ICON_SIZE = {
  inline: 16,
  control: 20,
} as const;

export const ICON_WEIGHT: IconWeight = 'bold';
