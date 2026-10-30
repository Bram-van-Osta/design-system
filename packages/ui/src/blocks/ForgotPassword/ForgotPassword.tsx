import { Link, type LinkProps } from '../../components/Link/Link.tsx';
import { interpolate } from '../../i18n/interpolate.ts';
import { useMessages } from '../../i18n/use-messages.ts';
import { AuthBlock } from '../shared/AuthBlock.tsx';
import { CheckMailbox } from '../shared/CheckMailbox.tsx';
import { ForgotPasswordForm } from './ForgotPasswordForm.tsx';
import { ForgotPasswordStatus } from './forgot-password-status.ts';
import { type ForgotPasswordValues, useForgotPasswordForm } from './use-forgot-password-form.ts';

export interface ForgotPasswordProps {
  /** Asks the app to send a link to choose a new password. */
  readonly onSubmit: (values: ForgotPasswordValues) => void;
  readonly status?: ForgotPasswordStatus;
  readonly defaultEmail?: string;
  /** The app's link back to signing in. */
  readonly signInLink?: Omit<LinkProps, 'children'>;
  readonly className?: string;
}

/** The forgotten password: the address of the account, then "check your mailbox". */
export function ForgotPassword({
  onSubmit,
  status = ForgotPasswordStatus.idle,
  defaultEmail,
  signInLink,
  className,
}: ForgotPasswordProps) {
  const messages = useMessages();
  const form = useForgotPasswordForm(onSubmit);
  const backToSignIn = signInLink && (
    <Link {...signInLink} className="self-start">
      {messages['forgotPassword.backToSignIn']}
    </Link>
  );
  if (status === ForgotPasswordStatus.sent) {
    const email = form.submittedEmail ?? defaultEmail ?? '';
    return (
      <CheckMailbox
        lead={interpolate(messages['forgotPassword.sentLead'], { email })}
        className={className}
      >
        {backToSignIn}
      </CheckMailbox>
    );
  }
  return (
    <AuthBlock
      heading={messages['forgotPassword.heading']}
      lead={messages['forgotPassword.lead']}
      className={className}
    >
      <ForgotPasswordForm
        form={form}
        defaultEmail={defaultEmail}
        isPending={status === ForgotPasswordStatus.pending}
      />
      {backToSignIn}
    </AuthBlock>
  );
}
