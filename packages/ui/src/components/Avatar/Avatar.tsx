import { classNames } from '../../utils/class-names.ts';
import { initialsOf } from './initials.ts';

export interface AvatarProps {
  /** The person's name, which screen readers read: the initials are drawn from it. */
  readonly name: string;
  readonly className?: string;
}

/** A person by the initials of their name, in a circle: the operator in the header. */
export function Avatar({ name, className }: AvatarProps) {
  return (
    <span
      role="img"
      aria-label={name}
      className={classNames(
        'inline-flex size-space-6 shrink-0 items-center justify-center rounded-round bg-surface font-sans text-meta font-semibold text-ink',
        className,
      )}
    >
      <span aria-hidden>{initialsOf(name)}</span>
    </span>
  );
}
