import { type FormEvent, useState } from 'react';
import { interpolate } from '../../i18n/interpolate.ts';
import type { MessageKey } from '../../i18n/messages.ts';
import { useMessages } from '../../i18n/use-messages.ts';
import { focusFirstInvalid } from '../shared/form-fields.ts';
import type { CheckedPasswordRule, NewPasswordValues, PasswordRule } from './new-password.ts';

interface NewPasswordFormOptions {
  readonly minLength: number;
  readonly extraRules: readonly PasswordRule[];
  readonly onSubmit: (values: NewPasswordValues) => void;
}

/** Checks the password against the rules as the reader types, and hands it over once it follows them all. */
export function useNewPasswordForm({ minLength, extraRules, onSubmit }: NewPasswordFormOptions) {
  const messages = useMessages();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<MessageKey | undefined>(undefined);
  const rules: readonly PasswordRule[] = [
    {
      label: interpolate(messages['newPassword.minLength'], { count: minLength }),
      isMet: (candidate) => candidate.length >= minLength,
    },
    ...extraRules,
  ];
  const checkedRules: readonly CheckedPasswordRule[] = rules.map((rule) => ({
    label: rule.label,
    isMet: rule.isMet(password),
  }));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextError = passwordError(password, checkedRules);
    setError(nextError);
    if (!focusFirstInvalid(event.currentTarget, { password: nextError })) {
      onSubmit({ password });
    }
  }

  function handleChange(value: string) {
    setPassword(value);
    setError(undefined);
  }

  return { password, checkedRules, error, handleSubmit, handleChange };
}

function passwordError(
  password: string,
  rules: readonly CheckedPasswordRule[],
): MessageKey | undefined {
  if (password === '') {
    return 'newPassword.missing';
  }
  return rules.every((rule) => rule.isMet) ? undefined : 'newPassword.rulesUnmet';
}
