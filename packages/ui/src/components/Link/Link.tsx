import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import type { Icon } from '@phosphor-icons/react';
import { classNames } from '../../utils/class-names.ts';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';
import { LINK_CLASSES } from './link-classes.ts';

const CURRENT_CLASSES = 'font-semibold decoration-delft decoration-2 underline-offset-8';
// In a sentence, a link keeps the text's size and line, as WCAG 2.5.8 allows for inline links.
const INLINE_CLASSES = 'text-ink underline underline-offset-4 hover:text-ink-muted';

export interface LinkProps extends Omit<useRender.ComponentProps<'a'>, 'className'> {
  /** The link of the page being read: underlined in Delft blue, and `aria-current="page"`. */
  readonly isCurrent?: boolean;
  /** In running text: the size of the sentence around it, with no minimum height. */
  readonly isInline?: boolean;
  /** A Phosphor icon before the text, such as the arrow of "Previous question". */
  readonly icon?: Icon;
  readonly className?: string;
}

/** To move to another page, or back. `render` takes the router's link: `render={<RouterLink to="/" />}`. */
export function Link({
  render,
  isCurrent = false,
  isInline = false,
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
        className: classNames(
          isInline ? INLINE_CLASSES : LINK_CLASSES,
          isCurrent && CURRENT_CLASSES,
          className,
        ),
        'aria-current': isCurrent ? 'page' : undefined,
        children: (
          <>
            {LeadingIcon && (
              <LeadingIcon
                size={ICON_SIZE.inline}
                weight={ICON_WEIGHT}
                aria-hidden
                className={isInline ? 'mr-space-1 inline' : undefined}
              />
            )}
            {children}
          </>
        ),
      },
      props,
    ),
  });
}
