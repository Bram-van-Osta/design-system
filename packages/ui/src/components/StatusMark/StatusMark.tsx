import { CheckIcon } from '@phosphor-icons/react';
import { classNames } from '../../utils/class-names.ts';
import { ICON_WEIGHT } from '../../utils/icon.ts';

export const StatusMarkLevel = {
  good: 'good',
  fair: 'fair',
  poor: 'poor',
} as const;
export type StatusMarkLevel = (typeof StatusMarkLevel)[keyof typeof StatusMarkLevel];

// A check in ink-muted for what needs nothing, a hollow square in ink for what to improve, a
// square in vermilion for what to fix: vermilion stays rare, as the identity wants it.
const CHECK_SIZE = 14;
const SQUARE_CLASSES: Readonly<Record<Exclude<StatusMarkLevel, 'good'>, string>> = {
  fair: 'size-2 border-hair border-ink',
  poor: 'size-2.5 bg-vermillion',
};

export interface StatusMarkProps {
  readonly level: StatusMarkLevel;
  /** What the mark says, for a screen reader: "to improve". Without it, the mark is decorative. */
  readonly label?: string;
  readonly className?: string;
}

/** A measure's mark beside its value: good, to improve or to fix. */
export function StatusMark({ level, label, className }: StatusMarkProps) {
  const named =
    label === undefined ? { 'aria-hidden': true } : { role: 'img', 'aria-label': label };
  return (
    <span
      {...named}
      data-level={level}
      className={classNames('inline-flex shrink-0 items-center justify-center', className)}
    >
      {level === StatusMarkLevel.good ? (
        <CheckIcon size={CHECK_SIZE} weight={ICON_WEIGHT} className="text-ink-muted" />
      ) : (
        <span className={SQUARE_CLASSES[level]} />
      )}
    </span>
  );
}
