export const StackDirection = {
  column: 'column',
  row: 'row',
} as const;
export type StackDirection = (typeof StackDirection)[keyof typeof StackDirection];

export const StackAlign = {
  start: 'start',
  center: 'center',
  end: 'end',
  baseline: 'baseline',
  stretch: 'stretch',
} as const;
export type StackAlign = (typeof StackAlign)[keyof typeof StackAlign];

export const StackJustify = {
  start: 'start',
  center: 'center',
  end: 'end',
  between: 'between',
} as const;
export type StackJustify = (typeof StackJustify)[keyof typeof StackJustify];

/** The spacing tokens. */
export type Space =
  | 'space-1'
  | 'space-2'
  | 'space-3'
  | 'space-4'
  | 'space-5'
  | 'space-6'
  | 'space-7'
  | 'space-8'
  | 'space-9';

// Whole class names, for Tailwind to find them in the sources.
export const GAP_CLASSES: Readonly<Record<Space, string>> = {
  'space-1': 'gap-space-1',
  'space-2': 'gap-space-2',
  'space-3': 'gap-space-3',
  'space-4': 'gap-space-4',
  'space-5': 'gap-space-5',
  'space-6': 'gap-space-6',
  'space-7': 'gap-space-7',
  'space-8': 'gap-space-8',
  'space-9': 'gap-space-9',
};

export const DIRECTION_CLASSES: Readonly<Record<StackDirection, string>> = {
  column: 'flex-col',
  row: 'flex-row',
};

export const ALIGN_CLASSES: Readonly<Record<StackAlign, string>> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
};

export const JUSTIFY_CLASSES: Readonly<Record<StackJustify, string>> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
};
