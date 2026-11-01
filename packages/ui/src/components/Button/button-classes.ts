import { LINK_CLASSES } from '../Link/link-classes.ts';

export const ButtonVariant = {
  primary: 'primary',
  secondary: 'secondary',
  quiet: 'quiet',
} as const;
export type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant];

// Shared by Button and ButtonLink, so that a link to a page looks as the action beside it.
export const BUTTON_CLASSES =
  'inline-flex items-center justify-center gap-space-3 cursor-pointer select-none data-disabled:cursor-not-allowed data-pending:cursor-wait';

// A pending button is disabled too, but keeps its colors: it is working, not unavailable.
export const BUTTON_VARIANT_CLASSES: Readonly<Record<ButtonVariant, string>> = {
  primary:
    'min-h-button-height px-space-6 bg-delft text-label text-on-delft hover:not-data-disabled:bg-delft-deep active:not-data-disabled:bg-delft-deep data-disabled:not-data-pending:bg-line data-disabled:not-data-pending:text-ink-muted',
  secondary:
    'min-h-target-min px-space-4 border-hair border-ink text-body-s font-semibold text-ink hover:not-data-disabled:bg-surface data-disabled:not-data-pending:border-line data-disabled:not-data-pending:text-ink-muted',
  quiet: `${LINK_CLASSES} data-disabled:not-data-pending:text-ink-muted`,
};
