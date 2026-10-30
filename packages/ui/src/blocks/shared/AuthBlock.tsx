import { type ReactNode, useId } from 'react';
import { Heading, HeadingSize } from '../../components/Heading/Heading.tsx';
import { Text, TextVariant } from '../../components/Text/Text.tsx';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';

interface AuthBlockProps {
  readonly heading: ReactNode;
  readonly lead?: ReactNode;
  readonly className?: string | undefined;
  readonly children?: ReactNode;
}

/** An authentication screen: its heading, the sentence under it, then its form. */
export function AuthBlock({ heading, lead, className, children }: AuthBlockProps) {
  const headingId = useId();
  return (
    <section
      aria-labelledby={headingId}
      className={classNames('flex flex-col gap-space-6', className)}
    >
      <div className="flex flex-col gap-space-3">
        <Heading level={1} size={HeadingSize.m} id={headingId}>
          {heading}
        </Heading>
        {hasContent(lead) && <Text variant={TextVariant.lead}>{lead}</Text>}
      </div>
      {children}
    </section>
  );
}
