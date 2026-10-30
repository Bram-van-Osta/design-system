import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { classNames } from '../../utils/class-names.ts';

export const TextVariant = {
  lead: 'lead',
  body: 'body',
  bodySmall: 'body-s',
  small: 'small',
  meta: 'meta',
} as const;
export type TextVariant = (typeof TextVariant)[keyof typeof TextVariant];

export const TextTone = {
  ink: 'ink',
  muted: 'muted',
} as const;
export type TextTone = (typeof TextTone)[keyof typeof TextTone];

const VARIANT_CLASSES: Readonly<Record<TextVariant, string>> = {
  lead: 'text-lead',
  body: 'text-body',
  'body-s': 'text-body-s',
  small: 'text-small',
  meta: 'font-mono text-meta tabular-nums',
};

// The sentence under a heading is in ink-muted.
const DEFAULT_TONES: Readonly<Record<TextVariant, TextTone>> = {
  lead: TextTone.muted,
  body: TextTone.ink,
  'body-s': TextTone.ink,
  small: TextTone.ink,
  meta: TextTone.ink,
};

const TONE_CLASSES: Readonly<Record<TextTone, string>> = {
  ink: 'text-ink',
  muted: 'text-ink-muted',
};

export interface TextProps extends Omit<useRender.ComponentProps<'p'>, 'className'> {
  readonly variant?: TextVariant;
  readonly tone?: TextTone;
  readonly className?: string;
}

/** Running text in Inter, or `meta` in IBM Plex Mono for dates and figures. A paragraph by default. */
export function Text({
  variant = TextVariant.body,
  tone = DEFAULT_TONES[variant],
  render,
  className,
  ...props
}: TextProps) {
  return useRender({
    defaultTagName: 'p',
    render,
    props: mergeProps<'p'>(
      { className: classNames(VARIANT_CLASSES[variant], TONE_CLASSES[tone], className) },
      props,
    ),
  });
}
