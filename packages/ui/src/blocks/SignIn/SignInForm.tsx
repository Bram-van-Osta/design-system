import { Button } from '../../components/Button/Button.tsx';
import { Field } from '../../components/Field/Field.tsx';
import { Link, type LinkProps } from '../../components/Link/Link.tsx';
import { PasswordInput } from '../../components/PasswordInput/PasswordInput.tsx';
import { TextInput } from '../../components/TextInput/TextInput.tsx';
import { useMessages } from '../../i18n/use-messages.ts';
import { FormField } from '../shared/form-fields.ts';
import { SUBMIT_CLASSES } from '../shared/submit-classes.ts';
import { type SignInCredentials, useSignInForm } from './use-sign-in-form.ts';

interface SignInFormProps {
  readonly onSubmit: (credentials: SignInCredentials) => void;
  readonly isPending: boolean;
  readonly isDisabled: boolean;
  readonly defaultEmail: string | undefined;
  readonly forgotPasswordLink: Omit<LinkProps, 'children'> | undefined;
}

export function SignInForm({
  onSubmit,
  isPending,
  isDisabled,
  defaultEmail,
  forgotPasswordLink,
}: SignInFormProps) {
  const messages = useMessages();
  const { errors, handleSubmit, clearError } = useSignInForm(onSubmit);
  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-space-5">
      <Field label={messages['form.email']} error={errors.email && messages[errors.email]}>
        <TextInput
          name={FormField.email}
          type="email"
          autoComplete="username"
          defaultValue={defaultEmail}
          onChange={() => clearError(FormField.email)}
        />
      </Field>
      <Field
        label={messages['signIn.password']}
        error={errors.password && messages[errors.password]}
      >
        <PasswordInput
          name={FormField.password}
          autoComplete="current-password"
          onChange={() => clearError(FormField.password)}
        />
      </Field>
      <div className="flex flex-col gap-space-3">
        <Button
          type="submit"
          isPending={isPending}
          disabled={isDisabled}
          className={SUBMIT_CLASSES}
        >
          {messages['signIn.submit']}
        </Button>
        {forgotPasswordLink && (
          <Link {...forgotPasswordLink} className="self-start">
            {messages['signIn.forgotPassword']}
          </Link>
        )}
      </div>
    </form>
  );
}
