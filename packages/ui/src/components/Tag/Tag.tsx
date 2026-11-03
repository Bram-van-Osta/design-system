import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { StatusMark, type StatusMarkLevel } from '../StatusMark/StatusMark.tsx';

export const TagTone = {
  /** A hairline frame in the field color, the text in ink: a fact among others. */
  plain: 'plain',
  /** A hairline frame in ink: a value that stands out of its row. */
  ink: 'ink',
  /** Filled in ink, the text in the page's background: the strongest of a set, "measured". */
  solid: 'solid',
  /** In Delft blue, frame and text: what a person said, beside what was measured. */
  delft: 'delft',
  /** In the agent's violet, frame and text, for the operator only: what the agent inferred. */
  agent: 'agent',
} as const;
export type TagTone = (typeof TagTone)[keyof typeof TagTone];

const TONE_CLASSES: Readonly<Record<TagTone, string>> = {
  plain: 'border-field text-ink',
  ink: 'border-ink text-ink',
  solid: 'border-ink bg-ink text-bg',
  delft: 'border-delft text-delft',
  agent: 'border-agent text-agent',
};

export interface TagProps {
  readonly children: ReactNode;
  /** A mark before its text, decorative: the text says what it is. */
  readonly level?: StatusMarkLevel;
  /** `plain` by default; the others tell a set of tags apart, such as a fact's sources. */
  readonly tone?: TagTone;
  readonly className?: string;
}

/** A short fact in a frame, one among others in a row: "2 images without alt text". */
export function Tag({ children, level, tone = TagTone.plain, className }: TagProps) {
  return (
    <span
      data-tone={tone}
      className={classNames(
        'inline-flex max-w-full items-center gap-1.5 border-hair px-space-2 py-0.5 text-small',
        TONE_CLASSES[tone],
        className,
      )}
    >
      {level !== undefined && <StatusMark level={level} />}
      <span className="min-w-0 wrap-break-word">{children}</span>
    </span>
  );
}
