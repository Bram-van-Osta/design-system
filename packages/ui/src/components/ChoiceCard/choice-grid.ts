import { classNames } from '../../utils/class-names.ts';

/** How a group of choice cards lays them out. */
export const ChoiceColumns = {
  /** One column, then two once the group is wide enough for two short labels (28 rem). */
  auto: 'auto',
  /** One column on every width: a list, one answer per row. */
  one: 'one',
} as const;
export type ChoiceColumns = (typeof ChoiceColumns)[keyof typeof ChoiceColumns];

const COLUMNS_CLASSES: Readonly<Record<ChoiceColumns, string>> = {
  auto: '@md:grid-cols-2',
  one: '',
};

/** The grid of a group of choice cards, in its columns. */
export function choiceGridClassesOf(columns: ChoiceColumns): string {
  return classNames('mt-space-2 grid grid-cols-1 gap-space-3', COLUMNS_CLASSES[columns]);
}
