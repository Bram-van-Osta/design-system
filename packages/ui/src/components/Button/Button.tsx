import { Button as BaseButton } from '@base-ui/react/button';
import { ArrowRightIcon, CircleNotchIcon, type Icon } from '@phosphor-icons/react';
import { classNames } from '../../utils/class-names.ts';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';
import { BUTTON_CLASSES, BUTTON_VARIANT_CLASSES, ButtonVariant } from './button-classes.ts';

export { ButtonVariant } from './button-classes.ts';

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
      className={classNames(BUTTON_CLASSES, 'relative', BUTTON_VARIANT_CLASSES[variant], className)}
    >
      {/* Without an arrow to take its place, the spinner covers the label, which keeps its room:
          the button does not grow and push its neighbors to another line. */}
      <span
        className={classNames(
          'inline-flex items-center gap-space-3',
          isPending && !hasArrow && 'opacity-0',
        )}
      >
        {LeadingIcon && <LeadingIcon size={ICON_SIZE.inline} weight={ICON_WEIGHT} aria-hidden />}
        {children}
      </span>
      {isPending && !hasArrow ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </span>
      ) : (
        <TrailingIcon isPending={isPending} hasArrow={hasArrow} />
      )}
    </BaseButton>
  );
}

interface TrailingIconProps {
  readonly isPending: boolean;
  readonly hasArrow: boolean;
}

function Spinner() {
  return (
    <CircleNotchIcon
      size={ICON_SIZE.inline}
      weight={ICON_WEIGHT}
      className="motion-safe:animate-spin"
      aria-hidden
    />
  );
}

function TrailingIcon({ isPending, hasArrow }: TrailingIconProps) {
  if (isPending) {
    return <Spinner />;
  }
  if (hasArrow) {
    return <ArrowRightIcon size={ICON_SIZE.inline} weight={ICON_WEIGHT} aria-hidden />;
  }
  return null;
}
