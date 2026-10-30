import { Button } from '../../components/Button/Button.tsx';
import { Field } from '../../components/Field/Field.tsx';
import { TextInput } from '../../components/TextInput/TextInput.tsx';
import { useMessages } from '../../i18n/use-messages.ts';
import { FormField } from '../shared/form-fields.ts';
import type { useForgotPasswordForm } from './use-forgot-password-form.ts';

interface ForgotPasswordFormProps {
  readonly form: ReturnType<typeof useForgotPasswordForm>;
  readonly defaultEmail: string | undefined;
  readonly isPending: boolean;
}

export function ForgotPasswordForm({ form, defaultEmail, isPending }: ForgotPasswordFormProps) {
  const messages = useMessages();
  return (
    <form noValidate onSubmit={form.handleSubmit} className="flex flex-col gap-space-5">
      <Field
        label={messages['form.email']}
        error={form.errors.email && messages[form.errors.email]}
      >
        <TextInput
          name={FormField.email}
          type="email"
          autoComplete="email"
          defaultValue={defaultEmail}
          onChange={form.clearError}
        />
      </Field>
      <Button type="submit" isPending={isPending} className="w-full md:w-auto md:self-start">
        {messages['forgotPassword.submit']}
      </Button>
    </form>
  );
}
