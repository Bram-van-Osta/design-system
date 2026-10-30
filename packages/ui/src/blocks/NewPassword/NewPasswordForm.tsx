import { Button } from '../../components/Button/Button.tsx';
import { Field } from '../../components/Field/Field.tsx';
import { PasswordInput } from '../../components/PasswordInput/PasswordInput.tsx';
import { Text, TextTone, TextVariant } from '../../components/Text/Text.tsx';
import { interpolate } from '../../i18n/interpolate.ts';
import { useMessages } from '../../i18n/use-messages.ts';
import { classNames } from '../../utils/class-names.ts';
import { FormField } from '../shared/form-fields.ts';
import { SUBMIT_CLASSES } from '../shared/submit-classes.ts';
import type { NewPasswordTexts, NewPasswordValues, PasswordRule } from './new-password.ts';
import { PasswordRules } from './PasswordRules.tsx';
import { useNewPasswordForm } from './use-new-password-form.ts';

interface NewPasswordFormProps {
  readonly texts: NewPasswordTexts;
  readonly onSubmit: (values: NewPasswordValues) => void;
  readonly minLength: number;
  readonly maxLength: number | undefined;
  readonly extraRules: readonly PasswordRule[];
  readonly email: string | undefined;
  readonly isPending: boolean;
}

export function NewPasswordForm({
  texts,
  onSubmit,
  minLength,
  maxLength,
  extraRules,
  email,
  isPending,
}: NewPasswordFormProps) {
  const messages = useMessages();
  const form = useNewPasswordForm({ minLength, extraRules, onSubmit });
  return (
    <form noValidate onSubmit={form.handleSubmit} className="flex flex-col gap-space-5">
      {email !== undefined && <AccountEmail email={email} />}
      <Field
        label={messages[texts.label]}
        error={form.error && messages[form.error]}
        description={<PasswordRules rules={form.checkedRules} />}
      >
        <PasswordInput
          name={FormField.password}
          autoComplete="new-password"
          maxLength={maxLength}
          value={form.password}
          onValueChange={form.handleChange}
        />
      </Field>
      <Button
        type="submit"
        isPending={isPending}
        className={classNames(SUBMIT_CLASSES, 'md:self-start')}
      >
        {messages[texts.submit]}
      </Button>
    </form>
  );
}

interface AccountEmailProps {
  readonly email: string;
}

// Shown to the reader, and given to password managers, which save the new password under it.
function AccountEmail({ email }: AccountEmailProps) {
  const messages = useMessages();
  return (
    <>
      <input hidden readOnly type="email" autoComplete="username" value={email} />
      <Text variant={TextVariant.bodySmall} tone={TextTone.muted}>
        {interpolate(messages['newPassword.account'], { email })}
      </Text>
    </>
  );
}
