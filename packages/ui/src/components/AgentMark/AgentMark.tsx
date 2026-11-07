import { CircleNotchIcon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';

export interface AgentMarkProps {
  /** What the agent did, in its words: "the agent", "drafted by the agent, to edit". */
  readonly children: ReactNode;
  /** The agent is at work: a small ring turns in place of the square, still for less motion. */
  readonly isRunning?: boolean;
  readonly className?: string;
}

/**
 * Before what the agent read, advised or drafted, for the operator alone: its purple square and its
 * words in mono; while it works, a turning ring in place of the square. Never on the client's side.
 */
export function AgentMark({ children, isRunning = false, className }: AgentMarkProps) {
  return (
    <span
      data-agent-mark
      className={classNames(
        'inline-flex items-center gap-1.5 font-mono text-agent text-meta tabular-nums',
        className,
      )}
    >
      {isRunning ? (
        <CircleNotchIcon
          size={ICON_SIZE.inline}
          weight={ICON_WEIGHT}
          aria-hidden
          data-agent-ring
          className="shrink-0 motion-safe:animate-spin"
        />
      ) : (
        <span aria-hidden data-agent-square className="size-2 shrink-0 bg-agent" />
      )}
      {children}
    </span>
  );
}
