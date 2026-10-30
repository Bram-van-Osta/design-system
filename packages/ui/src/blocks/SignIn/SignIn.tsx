import type { LinkProps } from '../../components/Link/Link.tsx';
import { useMessages } from '../../i18n/use-messages.ts';
import { AuthBlock } from '../shared/AuthBlock.tsx';
import { FormAlert } from '../shared/FormAlert.tsx';
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
  readonly className?: string;
}

/** Signing in, with an email and a password, an external provider, or both. */
export function SignIn({
  onSubmit,
  providers = NO_PROVIDERS,
  status = SignInStatus.idle,
  defaultEmail,
  forgotPasswordLink,
  className,
}: SignInProps) {
  const messages = useMessages();
  const alert = SIGN_IN_ALERTS[status];
  const isProviderPending = providers.some((provider) => provider.isPending === true);
  return (
    <AuthBlock heading={messages['signIn.heading']} className={className}>
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
        />
      )}
    </AuthBlock>
  );
}
