import { interpolate } from '../../i18n/interpolate.ts';
import { useMessages } from '../../i18n/use-messages.ts';
import { CheckMailbox } from '../shared/CheckMailbox.tsx';
import { ResendAction } from './ResendAction.tsx';
import { ResendStatus } from './resend-status.ts';

export interface VerifyEmailProps {
  /** The address the link was sent to. */
  readonly email: string;
  /** Asks the app to send the link again; without it, the block offers no resending. */
  readonly onResend?: () => void;
  readonly resendStatus?: ResendStatus;
  readonly className?: string;
}

/** "Check your mailbox": the address to confirm, and the link sent again on request. */
export function VerifyEmail({
  email,
  onResend,
  resendStatus = ResendStatus.idle,
  className,
}: VerifyEmailProps) {
  const messages = useMessages();
  return (
    <CheckMailbox
      kicker={messages['verifyEmail.kicker']}
      lead={interpolate(messages['verifyEmail.lead'], { email })}
      className={className}
    >
      {onResend && <ResendAction onResend={onResend} status={resendStatus} />}
    </CheckMailbox>
  );
}
