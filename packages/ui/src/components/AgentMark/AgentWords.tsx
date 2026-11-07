import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';
import { AgentMark } from './AgentMark.tsx';

export interface AgentWordsProps {
  /** The agent's mark above its words: "what the agent says". */
  readonly mark?: ReactNode;
  /** What the agent read or wrote, its text as the app sets it. */
  readonly children: ReactNode;
  readonly className?: string;
}

/** What the agent says, behind its 3 px purple rule, its mark above it: for the operator alone. */
export function AgentWords({ mark, children, className }: AgentWordsProps) {
  return (
    <div
      className={classNames(
        'flex min-w-0 flex-col gap-space-1 wrap-break-word border-agent border-l-3 pl-space-4',
        className,
      )}
    >
      {hasContent(mark) && <AgentMark>{mark}</AgentMark>}
      {children}
    </div>
  );
}
