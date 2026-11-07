import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { classNames } from '../../utils/class-names.ts';
import { StatGridColumns } from './stat-grid-columns.ts';
import { StatLayout } from './stat-layout.ts';

const COLUMNS_CLASSES: Readonly<Record<StatGridColumns, string>> = {
  two: 'md:grid-cols-2',
  three: 'md:grid-cols-3',
  four: 'md:grid-cols-4',
  five: 'md:grid-cols-5',
  six: 'md:grid-cols-6',
};

// Framed tiles sit close; titled ones, without a frame, take more air: 20 px between two rows (the
// numeric scale: no spacing token holds it) and 16 px between two columns.
const GAP_CLASSES: Readonly<Record<StatLayout, string>> = {
  labelFirst: 'gap-space-2 md:gap-space-3',
  figureFirst: 'gap-space-2 md:gap-space-3',
  titled: 'gap-x-space-4 gap-y-5',
};

export interface StatGridProps extends Omit<useRender.ComponentProps<'dl'>, 'className'> {
  /** How many tiles a row holds on a computer, `two` by default; two on a phone. */
  readonly columns?: StatGridColumns;
  /** The layout of its tiles, which sets the gaps between them: `labelFirst` by default. */
  readonly tileLayout?: StatLayout;
  readonly className?: string;
}

/**
 * Figures side by side, two to six a row on a computer and two on a phone: a `<dl>` of `Stat`s,
 * named by `aria-label`. For `StatLink`s, which are not terms, `render={<nav />}` or a `<div />`.
 */
export function StatGrid({
  columns = StatGridColumns.two,
  tileLayout = StatLayout.labelFirst,
  render,
  className,
  ...props
}: StatGridProps) {
  return useRender({
    defaultTagName: 'dl',
    render,
    props: mergeProps<'dl'>(
      {
        className: classNames(
          'grid grid-cols-2',
          GAP_CLASSES[tileLayout],
          COLUMNS_CLASSES[columns],
          className,
        ),
      },
      props,
    ),
  });
}
