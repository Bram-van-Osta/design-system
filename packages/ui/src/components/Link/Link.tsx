import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import type { Icon } from '@phosphor-icons/react';
import { classNames } from '../../utils/class-names.ts';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';
import { LINK_CLASSES } from './link-classes.ts';

const CURRENT_CLASSES = 'font-semibold decoration-delft decoration-2 underline-offset-8';

export interface LinkProps extends Omit<useRender.ComponentProps<'a'>, 'className'> {
  /** The link of the page being read: underlined in Delft blue, and `aria-current="page"`. */
  readonly isCurrent?: boolean;
  /** A Phosphor icon before the text, such as the arrow of "Previous question". */
  readonly icon?: Icon;
  readonly className?: string;
}

/** To move to another page, or back. `render` takes the router's link: `render={<RouterLink to="/" />}`. */
export function Link({
  render,
  isCurrent = false,
  icon: LeadingIcon,
  className,
  children,
  ...props
}: LinkProps) {
  return useRender({
    defaultTagName: 'a',
    render,
    props: mergeProps<'a'>(
      {
        className: classNames(LINK_CLASSES, isCurrent && CURRENT_CLASSES, className),
        'aria-current': isCurrent ? 'page' : undefined,
        children: (
          <>
            {LeadingIcon && (
              <LeadingIcon size={ICON_SIZE.inline} weight={ICON_WEIGHT} aria-hidden />
            )}
            {children}
          </>
        ),
      },
      props,
    ),
  });
}
