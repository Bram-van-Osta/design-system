import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { classNames } from '../../utils/class-names.ts';

export interface ContainerProps extends Omit<useRender.ComponentProps<'div'>, 'className'> {
  /** The classes of the column itself, such as its gaps. */
  readonly className?: string;
}

/**
 * The reading column: 720 px of content at most, centered, with the side margins of a phone or a
 * computer. `render` changes the outer element, which spans its parent: `render={<main />}`.
 */
export function Container({ render, className, children, ...props }: ContainerProps) {
  return useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>(
      {
        className: 'w-full px-space-4 md:px-space-6',
        children: (
          <div className={classNames('mx-auto max-w-reading-width', className)}>{children}</div>
        ),
      },
      props,
    ),
  });
}
