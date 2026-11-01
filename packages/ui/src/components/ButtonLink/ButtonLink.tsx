import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { ArrowRightIcon, type Icon } from '@phosphor-icons/react';
import { classNames } from '../../utils/class-names.ts';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';
import { BUTTON_CLASSES, BUTTON_VARIANT_CLASSES, ButtonVariant } from '../Button/button-classes.ts';

export interface ButtonLinkProps extends Omit<useRender.ComponentProps<'a'>, 'className'> {
  /** As for a Button: `primary` once per view, `secondary` beside it, `quiet` to skip or go back. */
  readonly variant?: ButtonVariant;
  /** A Phosphor icon before the label. */
  readonly icon?: Icon;
  /** The forward arrow after the label, only to move forward in a flow. */
  readonly hasArrow?: boolean;
  readonly className?: string;
}

/**
 * A link that looks like a Button, for an action that opens another page: "Ask for an adjustment".
 * `render` takes the router's link: `render={<RouterLink to="/offer/adjust" />}`. It is never
 * disabled: an action the reader cannot take is hidden.
 */
export function ButtonLink({
  render,
  variant = ButtonVariant.primary,
  icon: LeadingIcon,
  hasArrow = false,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return useRender({
    defaultTagName: 'a',
    render,
    props: mergeProps<'a'>(
      {
        className: classNames(BUTTON_CLASSES, BUTTON_VARIANT_CLASSES[variant], className),
        children: (
          <>
            {LeadingIcon && (
              <LeadingIcon size={ICON_SIZE.inline} weight={ICON_WEIGHT} aria-hidden />
            )}
            {children}
            {hasArrow && (
              <ArrowRightIcon size={ICON_SIZE.inline} weight={ICON_WEIGHT} aria-hidden />
            )}
          </>
        ),
      },
      props,
    ),
  });
}
