import { type ReactNode, useId } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';
import { Heading, type HeadingLevel, HeadingSize } from '../Heading/Heading.tsx';

export interface CalmCardProps {
  /** That nothing waits, as a sentence: "Nothing for now.". The card is named by it. */
  readonly heading: ReactNode;
  /** Its level, `h3` by default: the card sits under its part's label. */
  readonly headingLevel?: HeadingLevel;
  /** The sentence that says who has the ball, and when it comes back. */
  readonly children?: ReactNode;
  /** Its quiet links: to what was sent, to write. */
  readonly actions?: ReactNode;
  readonly className?: string;
}

/**
 * The waiting card's calm form, when nothing waits for the reader: on the surface without the
 * vermilion rule, its heading, the sentence that says who has the ball and its links.
 */
export function CalmCard({
  heading,
  headingLevel = 3,
  children,
  actions,
  className,
}: CalmCardProps) {
  const headingId = useId();
  return (
    <section
      aria-labelledby={headingId}
      className={classNames(
        'flex flex-col gap-space-2 bg-surface px-space-5 py-space-5 md:px-space-6 md:py-space-6',
        className,
      )}
    >
      <Heading id={headingId} level={headingLevel} size={HeadingSize.xs}>
        {heading}
      </Heading>
      {children}
      {hasContent(actions) && (
        <div className="flex flex-wrap items-center gap-x-space-5 gap-y-space-1 pt-space-2">
          {actions}
        </div>
      )}
    </section>
  );
}
