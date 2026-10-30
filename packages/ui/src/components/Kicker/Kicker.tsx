import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { classNames } from '../../utils/class-names.ts';

export const KickerTone = {
  attention: 'attention',
  muted: 'muted',
} as const;
export type KickerTone = (typeof KickerTone)[keyof typeof KickerTone];

// Vermilion text reaches 4.5:1 on bg only: on surface, the kicker is muted.
const TONE_CLASSES: Readonly<Record<KickerTone, string>> = {
  attention: 'text-vermillion',
  muted: 'text-ink-muted',
};

export interface KickerProps extends Omit<useRender.ComponentProps<'p'>, 'className'> {
  /** `attention`, in vermilion, on bg only; `muted` on a surface. */
  readonly tone?: KickerTone;
  readonly className?: string;
}

/** The line in IBM Plex Mono above a heading, which situates it: the project, the step. */
export function Kicker({ tone = KickerTone.attention, render, className, ...props }: KickerProps) {
  return useRender({
    defaultTagName: 'p',
    render,
    props: mergeProps<'p'>(
      { className: classNames('font-mono text-kicker', TONE_CLASSES[tone], className) },
      props,
    ),
  });
}
