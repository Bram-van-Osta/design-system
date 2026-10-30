import { Button as BaseButton } from '@base-ui/react/button';
import type { Icon } from '@phosphor-icons/react';
import { classNames } from '../../utils/class-names.ts';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';

export const IconButtonVariant = {
  quiet: 'quiet',
  secondary: 'secondary',
} as const;
export type IconButtonVariant = (typeof IconButtonVariant)[keyof typeof IconButtonVariant];

const BASE_CLASSES =
  'inline-flex size-target-min shrink-0 items-center justify-center text-ink cursor-pointer hover:not-data-disabled:bg-surface data-disabled:cursor-not-allowed data-disabled:text-ink-muted';

const VARIANT_CLASSES: Record<IconButtonVariant, string> = {
  quiet: '',
  secondary: 'border-hair border-ink data-disabled:border-line',
};

export interface IconButtonProps
  extends Omit<
    BaseButton.Props,
    'className' | 'render' | 'nativeButton' | 'children' | 'aria-label' | 'aria-labelledby'
  > {
  /** The Phosphor icon drawn in the button. */
  readonly icon: Icon;
  /** What the button does, read by screen readers: the button has no visible text. */
  readonly label: string;
  readonly variant?: IconButtonVariant;
  readonly className?: string;
}

/** A square target of 44 px around one icon, named by its `label`. */
export function IconButton({
  icon: ButtonIcon,
  label,
  variant = IconButtonVariant.quiet,
  className,
  ...props
}: IconButtonProps) {
  return (
    <BaseButton
      {...props}
      aria-label={label}
      className={classNames(BASE_CLASSES, VARIANT_CLASSES[variant], className)}
    >
      <ButtonIcon size={ICON_SIZE.control} weight={ICON_WEIGHT} aria-hidden />
    </BaseButton>
  );
}
