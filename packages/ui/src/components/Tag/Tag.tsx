import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { StatusMark, type StatusMarkLevel } from '../StatusMark/StatusMark.tsx';

export interface TagProps {
  readonly children: ReactNode;
  /** A mark before its text, decorative: the text says what it is. */
  readonly level?: StatusMarkLevel;
  readonly className?: string;
}

/** A short fact in a frame, one among others in a row: "2 images without alt text". */
export function Tag({ children, level, className }: TagProps) {
  return (
    <span
      className={classNames(
        'inline-flex max-w-full items-center gap-1.5 border-hair border-field px-space-2 py-0.5 text-small text-ink',
        className,
      )}
    >
      {level !== undefined && <StatusMark level={level} />}
      <span className="min-w-0 wrap-break-word">{children}</span>
    </span>
  );
}
