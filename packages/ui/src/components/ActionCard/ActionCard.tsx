import { type ReactNode, useId } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';
import { Heading, type HeadingLevel, HeadingSize } from '../Heading/Heading.tsx';
import { Kicker, KickerTone } from '../Kicker/Kicker.tsx';

export interface ActionCardProps {
  /** The band at the top, in IBM Plex Mono: what it is about and its state, "The deposit · expected". */
  readonly kicker: ReactNode;
  /** What the reader has to do, as a sentence; the card is named by it, or by its band without it. */
  readonly heading?: ReactNode;
  readonly headingLevel?: HeadingLevel;
  /** The buttons, and the line that says what follows them. */
  readonly actions?: ReactNode;
  readonly className?: string;
  /** The facts the action needs: a text, details, a list to copy. */
  readonly children?: ReactNode;
}

/** What depends on the reader, on surface under a vermillion rule: its band, its content, its actions. */
export function ActionCard({
  kicker,
  heading,
  headingLevel = 2,
  actions,
  className,
  children,
}: ActionCardProps) {
  const kickerId = useId();
  const headingId = useId();
  const hasHeading = hasContent(heading);
  return (
    <section
      aria-labelledby={hasHeading ? headingId : kickerId}
      className={classNames(
        'flex flex-col gap-space-5 border-t-attention border-vermillion bg-surface p-space-5 md:p-space-6',
        className,
      )}
    >
      <Kicker id={kickerId} tone={KickerTone.muted}>
        {kicker}
      </Kicker>
      {hasHeading && (
        <Heading id={headingId} level={headingLevel} size={HeadingSize.s}>
          {heading}
        </Heading>
      )}
      {children}
      {hasContent(actions) && (
        <div className="flex flex-wrap items-center gap-x-space-5 gap-y-space-3">{actions}</div>
      )}
    </section>
  );
}
