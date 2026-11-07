import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';
import { AgentMark } from './AgentMark.tsx';

export interface AgentAdviceProps {
  /** The agent's mark above its advice: "the agent advises". */
  readonly mark?: ReactNode;
  /** The advice, its text as the app sets it, in ink. */
  readonly children: ReactNode;
  readonly className?: string;
}

/** What the agent advises, on its pale purple, its mark above it: for the operator alone. */
export function AgentAdvice({ mark, children, className }: AgentAdviceProps) {
  return (
    <div
      className={classNames(
        'flex min-w-0 flex-col gap-space-1 bg-agent-pale px-space-4 py-space-4 text-ink',
        className,
      )}
    >
      {hasContent(mark) && <AgentMark>{mark}</AgentMark>}
      {children}
    </div>
  );
}
