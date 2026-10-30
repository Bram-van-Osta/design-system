import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { classNames } from '../../utils/class-names.ts';

export interface ContainerProps extends Omit<useRender.ComponentProps<'div'>, 'className'> {
  readonly className?: string;
}

/** The reading column: 720 px of content at most, centered, with the side margins of a phone or a computer. */
export function Container({ render, className, ...props }: ContainerProps) {
  return useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>(
      {
        className: classNames(
          'mx-auto box-content max-w-reading-width px-space-4 md:px-space-6',
          className,
        ),
      },
      props,
    ),
  });
}
