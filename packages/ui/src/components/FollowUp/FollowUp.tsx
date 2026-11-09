import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';

export interface FollowUpProps {
  /**
   * The follow-up question, with its own legend and its why as its description: a RadioCards or a
   * CheckboxCards in `compact` size, or a Field.
   */
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * A short question that follows from an answer, nested under the question's choices on the
 * surface: it rises 8 px as it fades in when it appears.
 */
export function FollowUp({ children, className }: FollowUpProps) {
  return (
    <div
      data-follow-up
      className={classNames('bg-surface p-space-5 motion-safe:animate-rise', className)}
    >
      {children}
    </div>
  );
}
