import type { ReactNode } from 'react';
import { FormAlert } from '../../components/FormAlert/FormAlert.tsx';
import type { LinkProps } from '../../components/Link/Link.tsx';
import { Text, TextTone, TextVariant } from '../../components/Text/Text.tsx';
import { useMessages } from '../../i18n/use-messages.ts';
import { hasContent } from '../../utils/has-content.ts';
import { AuthBlock } from '../AuthBlock/AuthBlock.tsx';
import { OrSeparator } from './OrSeparator.tsx';
import { ProviderButtons, type SignInProvider } from './ProviderButtons.tsx';
import { SignInForm } from './SignInForm.tsx';
import { SIGN_IN_ALERTS, SignInStatus } from './sign-in-status.ts';
import type { SignInCredentials } from './use-sign-in-form.ts';

const NO_PROVIDERS: readonly SignInProvider[] = [];

export interface SignInProps {
  /** Signs in with an email and a password; without it, the block offers the providers only. */
  readonly onSubmit?: (credentials: SignInCredentials) => void;
  /** The external providers, with their labels from the app. */
  readonly providers?: readonly SignInProvider[];
  /** Where the app stands: signing in, or why it refused. */
  readonly status?: SignInStatus;
  readonly defaultEmail?: string;
  /** The app's link to the forgotten password: `{ href }`, or `{ render: <RouterLink to="…" /> }`. */
  readonly forgotPasswordLink?: Omit<LinkProps, 'children'>;
  /** The sentence under the heading, from the app: how this app signs in. */
  readonly lead?: ReactNode;
  /** A sentence under the buttons, from the app: who has access here. */
  readonly note?: ReactNode;
  readonly className?: string;
}

/** Signing in, with an email and a password, an external provider, or both. */
export function SignIn({
  onSubmit,
  providers = NO_PROVIDERS,
  status = SignInStatus.idle,
  defaultEmail,
  forgotPasswordLink,
  lead,
  note,
  className,
}: SignInProps) {
  const messages = useMessages();
  const alert = SIGN_IN_ALERTS[status];
  const isProviderPending = providers.some((provider) => provider.isPending === true);
  return (
    <AuthBlock
      kicker={messages['signIn.kicker']}
      heading={messages['signIn.heading']}
      lead={lead}
      className={className}
    >
      {alert && <FormAlert>{messages[alert]}</FormAlert>}
      {onSubmit && (
        <SignInForm
          onSubmit={onSubmit}
          isPending={status === SignInStatus.pending}
          isDisabled={isProviderPending}
          defaultEmail={defaultEmail}
          forgotPasswordLink={forgotPasswordLink}
        />
      )}
      {onSubmit && providers.length > 0 && <OrSeparator />}
      {providers.length > 0 && (
        <ProviderButtons
          providers={providers}
          isDisabled={status === SignInStatus.pending || isProviderPending}
          isFirstPrimary={onSubmit === undefined}
        />
      )}
      {hasContent(note) && (
        <Text variant={TextVariant.bodySmall} tone={TextTone.muted}>
          {note}
        </Text>
      )}
    </AuthBlock>
  );
}
