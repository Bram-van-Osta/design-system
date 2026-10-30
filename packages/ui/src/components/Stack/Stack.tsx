import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { classNames } from '../../utils/class-names.ts';
import {
  ALIGN_CLASSES,
  DIRECTION_CLASSES,
  GAP_CLASSES,
  JUSTIFY_CLASSES,
  type Space,
  type StackAlign,
  StackDirection,
  type StackJustify,
} from './stack-classes.ts';

export interface StackProps extends Omit<useRender.ComponentProps<'div'>, 'className'> {
  /** The space between the children, a spacing token. */
  readonly gap: Space;
  readonly direction?: StackDirection;
  readonly align?: StackAlign;
  readonly justify?: StackJustify;
  /** Whether a row goes to the next line when it runs out of room. */
  readonly isWrapping?: boolean;
  readonly className?: string;
}

/** Children in a column or a row, a spacing token apart. `render` changes the element: `render={<ul />}`. */
export function Stack({
  gap,
  direction = StackDirection.column,
  align,
  justify,
  isWrapping = false,
  render,
  className,
  ...props
}: StackProps) {
  return useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>(
      {
        className: classNames(
          'flex',
          DIRECTION_CLASSES[direction],
          GAP_CLASSES[gap],
          align && ALIGN_CLASSES[align],
          justify && JUSTIFY_CLASSES[justify],
          isWrapping && 'flex-wrap',
          className,
        ),
      },
      props,
    ),
  });
}
