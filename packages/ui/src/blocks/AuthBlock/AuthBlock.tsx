import { type ReactNode, useId } from 'react';
import { Heading, HeadingSize } from '../../components/Heading/Heading.tsx';
import { Kicker } from '../../components/Kicker/Kicker.tsx';
import { Text, TextVariant } from '../../components/Text/Text.tsx';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';

export interface AuthBlockProps {
  /** The line above the heading, which says where the reader is: their space, their invitation. */
  readonly kicker: ReactNode;
  readonly heading: ReactNode;
  readonly lead?: ReactNode;
  readonly className?: string | undefined;
  readonly children?: ReactNode;
}

/** An authentication screen: its kicker, heading and sentence, then its form, as wide as a short form. */
export function AuthBlock({ kicker, heading, lead, className, children }: AuthBlockProps) {
  const headingId = useId();
  return (
    <section
      aria-labelledby={headingId}
      className={classNames('flex flex-col gap-space-6', className)}
    >
      <div className="flex flex-col gap-space-4">
        <Kicker>{kicker}</Kicker>
        <Heading level={1} size={HeadingSize.m} id={headingId}>
          {heading}
        </Heading>
        {hasContent(lead) && <Text variant={TextVariant.lead}>{lead}</Text>}
      </div>
      <div className="flex max-w-form-width flex-col gap-space-6">{children}</div>
    </section>
  );
}
