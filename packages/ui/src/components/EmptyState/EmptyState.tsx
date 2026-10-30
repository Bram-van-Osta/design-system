import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../Field/has-content.ts';
import { Heading, type HeadingLevel, HeadingSize } from '../Heading/Heading.tsx';
import { Text, TextTone } from '../Text/Text.tsx';

export interface EmptyStateProps {
  /** What is empty, said plainly: "No file yet". */
  readonly title: ReactNode;
  /** What will fill it, or what to do. */
  readonly description?: ReactNode;
  /** The action that fills it, such as a Button. */
  readonly action?: ReactNode;
  /** The level of the title in the page's outline. */
  readonly headingLevel?: HeadingLevel;
  readonly className?: string;
}

/** An empty list or space: what is missing, and what to do about it. In words, without an illustration. */
export function EmptyState({
  title,
  description,
  action,
  headingLevel = 2,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={classNames(
        'flex flex-col items-start gap-space-4 bg-surface p-space-6',
        className,
      )}
    >
      <div className="flex flex-col gap-space-2">
        <Heading level={headingLevel} size={HeadingSize.xs}>
          {title}
        </Heading>
        {hasContent(description) && <Text tone={TextTone.muted}>{description}</Text>}
      </div>
      {action}
    </div>
  );
}
