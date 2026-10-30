import { type FormEvent, useState } from 'react';
import {
  emailError,
  type FieldErrors,
  FormField,
  focusFirstInvalid,
  readText,
} from '../shared/form-fields.ts';

export interface ForgotPasswordValues {
  readonly email: string;
}

/** Checks the address before handing it to the app, and keeps it for the confirmation. */
export function useForgotPasswordForm(onSubmit: (values: ForgotPasswordValues) => void) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submittedEmail, setSubmittedEmail] = useState<string | undefined>(undefined);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const nextErrors: FieldErrors = { email: emailError(form) };
    setErrors(nextErrors);
    if (!focusFirstInvalid(form, nextErrors)) {
      const email = readText(form, FormField.email).trim();
      setSubmittedEmail(email);
      onSubmit({ email });
    }
  }

  function clearError() {
    setErrors({});
  }

  return { errors, submittedEmail, handleSubmit, clearError };
}
