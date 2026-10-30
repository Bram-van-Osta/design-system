import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';

export const BadgeTone = {
  neutral: 'neutral',
  attention: 'attention',
} as const;
export type BadgeTone = (typeof BadgeTone)[keyof typeof BadgeTone];

// Vermilion text at this size reaches 4.5:1 on bg only.
const TONE_CLASSES: Readonly<Record<BadgeTone, string>> = {
  neutral: 'text-ink-muted',
  attention: 'text-vermillion',
};

export interface BadgeProps {
  /** `attention`, in vermilion and on bg only, for what awaits an action; `neutral` otherwise. */
  readonly tone?: BadgeTone;
  readonly children: ReactNode;
  readonly className?: string;
}

/** A state or a count in IBM Plex Mono: "ready to review", "3". */
export function Badge({ tone = BadgeTone.neutral, children, className }: BadgeProps) {
  return (
    <span
      className={classNames(
        'inline-flex items-center font-mono text-meta tabular-nums',
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
