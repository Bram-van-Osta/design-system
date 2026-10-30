import { Button as BaseButton } from '@base-ui/react/button';
import { ArrowRightIcon, CircleNotchIcon, type Icon } from '@phosphor-icons/react';
import { classNames } from '../../utils/class-names.ts';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';
import { LINK_CLASSES } from '../Link/link-classes.ts';

export const ButtonVariant = {
  primary: 'primary',
  secondary: 'secondary',
  quiet: 'quiet',
} as const;
export type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant];

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-space-3 cursor-pointer select-none data-disabled:cursor-not-allowed data-pending:cursor-wait';

// A pending button is disabled too, but keeps its colors: it is working, not unavailable.
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'min-h-button-height px-space-6 bg-delft text-label text-on-delft hover:not-data-disabled:bg-delft-deep active:not-data-disabled:bg-delft-deep data-disabled:not-data-pending:bg-line data-disabled:not-data-pending:text-ink-muted',
  secondary:
    'min-h-target-min px-space-4 border-hair border-ink text-body-s font-semibold text-ink hover:not-data-disabled:bg-surface data-disabled:not-data-pending:border-line data-disabled:not-data-pending:text-ink-muted',
  quiet: `${LINK_CLASSES} data-disabled:not-data-pending:text-ink-muted`,
};

export interface ButtonProps
  extends Omit<
    BaseButton.Props,
    'className' | 'render' | 'nativeButton' | 'focusableWhenDisabled'
  > {
  /** `primary`, in Delft blue, once per view, for what the page expects; `secondary` for an action beside it; `quiet` to skip or go back. */
  readonly variant?: ButtonVariant;
  /** A Phosphor icon before the label. */
  readonly icon?: Icon;
  /** The forward arrow after the label, only to move forward in a flow. */
  readonly hasArrow?: boolean;
  /** The action is running: the button stays focusable, ignores clicks and shows a spinner. */
  readonly isPending?: boolean;
  readonly className?: string;
}

export function Button({
  variant = ButtonVariant.primary,
  icon: LeadingIcon,
  hasArrow = false,
  isPending = false,
  disabled = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      {...props}
      disabled={disabled || isPending}
      focusableWhenDisabled={isPending}
      data-pending={isPending || undefined}
      className={classNames(BASE_CLASSES, VARIANT_CLASSES[variant], className)}
    >
      {LeadingIcon && <LeadingIcon size={ICON_SIZE.inline} weight={ICON_WEIGHT} aria-hidden />}
      {children}
      <TrailingIcon isPending={isPending} hasArrow={hasArrow} />
    </BaseButton>
  );
}

interface TrailingIconProps {
  readonly isPending: boolean;
  readonly hasArrow: boolean;
}

function TrailingIcon({ isPending, hasArrow }: TrailingIconProps) {
  if (isPending) {
    return (
      <CircleNotchIcon
        size={ICON_SIZE.inline}
        weight={ICON_WEIGHT}
        className="motion-safe:animate-spin"
        aria-hidden
      />
    );
  }
  if (hasArrow) {
    return <ArrowRightIcon size={ICON_SIZE.inline} weight={ICON_WEIGHT} aria-hidden />;
  }
  return null;
}
