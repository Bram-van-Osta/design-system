import type { ReactNode } from 'react';
import { Text, TextTone } from '../../components/Text/Text.tsx';
import { useMessages } from '../../i18n/use-messages.ts';
import { AuthBlock } from './AuthBlock.tsx';

interface CheckMailboxProps {
  /** Where the reader is: their password, their address. */
  readonly kicker: string;
  /** What was sent, and where. */
  readonly lead: string;
  readonly className: string | undefined;
  /** What the reader can do from here. */
  readonly children?: ReactNode;
}

/** "Check your mailbox": a link was sent, and where to look when it does not arrive. */
export function CheckMailbox({ kicker, lead, className, children }: CheckMailboxProps) {
  const messages = useMessages();
  return (
    <AuthBlock
      kicker={kicker}
      heading={messages['mailbox.heading']}
      lead={lead}
      className={className}
    >
      {children}
      <Text tone={TextTone.muted}>{messages['mailbox.help']}</Text>
    </AuthBlock>
  );
}
