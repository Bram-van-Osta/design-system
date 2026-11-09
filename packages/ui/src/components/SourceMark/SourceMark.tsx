import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { SOURCE_MARK_CLASSES } from './source-mark.ts';

export interface SourceMarkProps {
  /** Where the answer comes from, in the app's words: "from your text". */
  readonly children: ReactNode;
  readonly id?: string;
  readonly className?: string;
}

/**
 * Where an answer comes from, in small delft mono: under a choice card's label (its option's
 * `source`), or under a field (the Field's `source`), which it describes.
 */
export function SourceMark({ children, id, className }: SourceMarkProps) {
  return (
    <span id={id} data-source-mark className={classNames(SOURCE_MARK_CLASSES, className)}>
      {children}
    </span>
  );
}
