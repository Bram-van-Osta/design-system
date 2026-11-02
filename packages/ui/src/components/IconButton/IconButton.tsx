import { Button as BaseButton } from '@base-ui/react/button';
import type { Icon } from '@phosphor-icons/react';
import { classNames } from '../../utils/class-names.ts';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';

export const IconButtonVariant = {
  quiet: 'quiet',
  secondary: 'secondary',
} as const;
export type IconButtonVariant = (typeof IconButtonVariant)[keyof typeof IconButtonVariant];

export const IconButtonSize = {
  default: 'default',
  compact: 'compact',
} as const;
export type IconButtonSize = (typeof IconButtonSize)[keyof typeof IconButtonSize];

const BASE_CLASSES =
  'inline-flex shrink-0 items-center justify-center cursor-pointer hover:not-data-disabled:bg-surface data-disabled:cursor-not-allowed data-disabled:text-ink-muted';

const VARIANT_CLASSES: Readonly<Record<IconButtonVariant, string>> = {
  quiet: '',
  secondary: 'border-hair border-ink data-disabled:border-line',
};

interface SizeLook {
  readonly classes: string;
  readonly iconSize: number;
}

// The compact square sits in a line of text: its target of 44 px is a hit area centered on it,
// drawn by nothing, that overflows the square without growing the line.
const SIZE_LOOKS: Readonly<Record<IconButtonSize, SizeLook>> = {
  default: { classes: 'size-target-min text-ink', iconSize: ICON_SIZE.control },
  compact: {
    classes:
      'relative size-icon-button-compact align-middle text-ink-muted hover:not-data-disabled:text-ink before:absolute before:top-1/2 before:left-1/2 before:size-target-min before:-translate-1/2',
    iconSize: ICON_SIZE.inline,
  },
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
  /** `compact`, a 16 px icon in a 28 px square for a line of text, keeps its target of 44 px. */
  readonly size?: IconButtonSize;
  readonly className?: string;
}

/** A square target of 44 px around one icon, named by its `label`. */
export function IconButton({
  icon: ButtonIcon,
  label,
  variant = IconButtonVariant.quiet,
  size = IconButtonSize.default,
  className,
  ...props
}: IconButtonProps) {
  const { classes, iconSize } = SIZE_LOOKS[size];
  return (
    <BaseButton
      {...props}
      aria-label={label}
      className={classNames(BASE_CLASSES, VARIANT_CLASSES[variant], classes, className)}
    >
      <ButtonIcon size={iconSize} weight={ICON_WEIGHT} aria-hidden />
    </BaseButton>
  );
}
