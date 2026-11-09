import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';

export interface SourcedFactListProps {
  /** Its SourcedFact rows. */
  readonly children: ReactNode;
  readonly className?: string;
}

/** What was understood of the reader's words, an answer a row, closed by a hair rule. */
export function SourcedFactList({ children, className }: SourcedFactListProps) {
  return (
    <dl className={classNames('m-0 flex flex-col border-line border-b-hair', className)}>
      {children}
    </dl>
  );
}
