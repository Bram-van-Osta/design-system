import type { LinkProps } from '../../components/Link/Link.tsx';
import { useMessages } from '../../i18n/use-messages.ts';
import { AuthBlock } from '../shared/AuthBlock.tsx';
import { ExpiredLink } from './ExpiredLink.tsx';
import { NewPasswordForm } from './NewPasswordForm.tsx';
import {
  NewPasswordStatus,
  type NewPasswordTexts,
  type NewPasswordValues,
  type PasswordRule,
} from './new-password.ts';

const NO_RULES: readonly PasswordRule[] = [];

export interface NewPasswordProps {
  readonly onSubmit: (values: NewPasswordValues) => void;
  /** The minimum length of the app's password policy. */
  readonly minLength: number;
  readonly maxLength?: number;
  /** The app's other rules, with their sentences. */
  readonly extraRules?: readonly PasswordRule[];
  /** The account's address, shown and given to password managers. */
  readonly email?: string;
  readonly status?: NewPasswordStatus;
  /** The app's link to the forgotten password, offered when the link no longer works. */
  readonly forgotPasswordLink?: Omit<LinkProps, 'children'>;
  readonly className?: string;
}

interface NewPasswordBlockProps extends NewPasswordProps {
  readonly texts: NewPasswordTexts;
}

export function NewPasswordBlock({
  texts,
  onSubmit,
  minLength,
  maxLength,
  extraRules = NO_RULES,
  email,
  status = NewPasswordStatus.idle,
  forgotPasswordLink,
  className,
}: NewPasswordBlockProps) {
  const messages = useMessages();
  if (status === NewPasswordStatus.invalidLink) {
    return <ExpiredLink forgotPasswordLink={forgotPasswordLink} className={className} />;
  }
  return (
    <AuthBlock
      kicker={messages[texts.kicker]}
      heading={messages[texts.heading]}
      lead={messages[texts.lead]}
      className={className}
    >
      <NewPasswordForm
        texts={texts}
        onSubmit={onSubmit}
        minLength={minLength}
        maxLength={maxLength}
        extraRules={extraRules}
        email={email}
        isPending={status === NewPasswordStatus.pending}
      />
    </AuthBlock>
  );
}
