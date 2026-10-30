import type { ComponentProps } from 'react';
import { classNames } from '../../utils/class-names.ts';

export const HeadingSize = {
  xl: 'xl',
  l: 'l',
  m: 'm',
  s: 's',
  xs: 'xs',
} as const;
export type HeadingSize = (typeof HeadingSize)[keyof typeof HeadingSize];

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const TAGS = { 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' } as const;

// On a phone, the three largest sizes come down to heading-s.
const SIZE_CLASSES: Readonly<Record<HeadingSize, string>> = {
  xl: 'text-heading-s md:text-heading-xl',
  l: 'text-heading-s md:text-heading-l',
  m: 'text-heading-s md:text-heading-m',
  s: 'text-heading-s',
  xs: 'text-heading-xs',
};

const DEFAULT_SIZES: Readonly<Record<HeadingLevel, HeadingSize>> = {
  1: HeadingSize.l,
  2: HeadingSize.s,
  3: HeadingSize.xs,
  4: HeadingSize.xs,
  5: HeadingSize.xs,
  6: HeadingSize.xs,
};

export interface HeadingProps extends Omit<ComponentProps<'h1'>, 'className'> {
  /** The level in the page's outline: `h1` to `h6`. */
  readonly level: HeadingLevel;
  /** The look, independent of the level; by default, `l` for a page's heading, `s` then `xs` below. */
  readonly size?: HeadingSize;
  readonly className?: string;
}

/** A heading in Inter Tight: a sentence that says what is happening. */
export function Heading({ level, size = DEFAULT_SIZES[level], className, ...props }: HeadingProps) {
  const Tag = TAGS[level];
  return (
    <Tag
      {...props}
      className={classNames('font-display text-ink', SIZE_CLASSES[size], className)}
    />
  );
}
