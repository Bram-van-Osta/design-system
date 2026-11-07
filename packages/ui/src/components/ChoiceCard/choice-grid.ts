import { classNames } from '../../utils/class-names.ts';

/** How a group of choice cards lays them out. */
export const ChoiceColumns = {
  /** One column, then two once the group is wide enough for two short labels (28 rem). */
  auto: 'auto',
  /** One column on every width: a list, one answer per row. */
  one: 'one',
  /**
   * Two columns on every width, then three once the group is wide enough (36 rem): a word or two
   * an answer, in compact cards.
   */
  three: 'three',
} as const;
export type ChoiceColumns = (typeof ChoiceColumns)[keyof typeof ChoiceColumns];

/** How large a group's cards are drawn. */
export const ChoiceSize = {
  /** A primary button high, the label at the label size or in body text: a question's answers. */
  regular: 'regular',
  /** 48 px high, the label in small body text, semibold, 8 px apart: short answers, such as reasons. */
  compact: 'compact',
} as const;
export type ChoiceSize = (typeof ChoiceSize)[keyof typeof ChoiceSize];

const COLUMNS_CLASSES: Readonly<Record<ChoiceColumns, string>> = {
  auto: 'grid-cols-1 @md:grid-cols-2',
  one: 'grid-cols-1',
  three: 'grid-cols-2 @xl:grid-cols-3',
};

const GAP_CLASSES: Readonly<Record<ChoiceSize, string>> = {
  regular: 'gap-space-3',
  compact: 'gap-space-2',
};

/** The grid of a group of choice cards, in its columns, its gaps by the size of its cards. */
export function choiceGridClassesOf(columns: ChoiceColumns, size: ChoiceSize): string {
  return classNames('mt-space-2 grid', COLUMNS_CLASSES[columns], GAP_CLASSES[size]);
}
