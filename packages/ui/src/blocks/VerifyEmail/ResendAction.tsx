import { CheckIcon } from '@phosphor-icons/react';
import { Button, ButtonVariant } from '../../components/Button/Button.tsx';
import { useMessages } from '../../i18n/use-messages.ts';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';
import { ResendStatus } from './resend-status.ts';

interface ResendActionProps {
  readonly onResend: () => void;
  readonly status: ResendStatus;
}

export function ResendAction({ onResend, status }: ResendActionProps) {
  const messages = useMessages();
  return (
    <div className="flex flex-col items-start gap-space-3">
      <Button
        variant={ButtonVariant.secondary}
        isPending={status === ResendStatus.pending}
        onClick={onResend}
      >
        {messages['verifyEmail.resend']}
      </Button>
      {/* Rendered empty beforehand, so that screen readers announce the confirmation. */}
      <p role="status" className="flex items-center gap-space-2 text-small text-ink-muted">
        {status === ResendStatus.sent && (
          <>
            <CheckIcon size={ICON_SIZE.inline} weight={ICON_WEIGHT} aria-hidden />
            {messages['verifyEmail.resent']}
          </>
        )}
      </p>
    </div>
  );
}
