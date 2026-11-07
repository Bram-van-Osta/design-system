import { type ReactNode, useId } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';
import { HEADING_TAGS, Heading, type HeadingLevel, HeadingSize } from '../Heading/Heading.tsx';
import { Kicker, KickerTone } from '../Kicker/Kicker.tsx';
import { CalmCardSize } from './calm-card-size.ts';

export interface CalmCardProps {
  /** That nothing waits, as a sentence: "Nothing for now.". The card is named by it. */
  readonly heading: ReactNode;
  /** Its level, `h3` by default: the card sits under its part's label. */
  readonly headingLevel?: HeadingLevel;
  /** The muted mono line above the heading, which says what the card is about: "What depends on you". */
  readonly kicker?: ReactNode;
  /** `regular` by default; `compact` for its heading at the label size, beside a page's heading. */
  readonly size?: CalmCardSize;
  /** The sentence that says who has the ball, and when it comes back. */
  readonly children?: ReactNode;
  /** Its quiet links: to what was sent, to write. */
  readonly actions?: ReactNode;
  readonly className?: string;
}

const CARD_CLASSES: Readonly<Record<CalmCardSize, string>> = {
  regular: 'px-space-5 py-space-5 md:px-space-6 md:py-space-6',
  compact: 'p-space-5',
};

/**
 * The waiting card's calm form, when nothing waits for the reader: on the surface without the
 * vermilion rule, its kicker, its heading, the sentence that says who has the ball and its links.
 */
export function CalmCard({
  heading,
  headingLevel = 3,
  kicker,
  size = CalmCardSize.regular,
  children,
  actions,
  className,
}: CalmCardProps) {
  const headingId = useId();
  return (
    <section
      aria-labelledby={headingId}
      className={classNames('flex flex-col gap-space-2 bg-surface', CARD_CLASSES[size], className)}
    >
      {hasContent(kicker) && <Kicker tone={KickerTone.muted}>{kicker}</Kicker>}
      <CalmHeading id={headingId} level={headingLevel} size={size}>
        {heading}
      </CalmHeading>
      {children}
      {hasContent(actions) && (
        <div className="flex flex-wrap items-center gap-x-space-5 gap-y-space-1 pt-space-2">
          {actions}
        </div>
      )}
    </section>
  );
}

interface CalmHeadingProps {
  readonly id: string;
  readonly level: HeadingLevel;
  readonly size: CalmCardSize;
  readonly children: ReactNode;
}

// The compact heading is in Inter at the label size, which no Heading size draws.
function CalmHeading({ id, level, size, children }: CalmHeadingProps) {
  if (size === CalmCardSize.compact) {
    const Tag = HEADING_TAGS[level];
    return (
      <Tag id={id} className="text-label text-ink">
        {children}
      </Tag>
    );
  }
  return (
    <Heading id={id} level={level} size={HeadingSize.xs}>
      {children}
    </Heading>
  );
}
