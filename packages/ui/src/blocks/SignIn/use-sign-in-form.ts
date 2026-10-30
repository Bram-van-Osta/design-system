import { type FormEvent, useState } from 'react';
import {
  emailError,
  type FieldErrors,
  FormField,
  focusFirstInvalid,
  readText,
} from '../shared/form-fields.ts';

export interface SignInCredentials {
  readonly email: string;
  readonly password: string;
}

/** Checks that both fields are filled in before handing the credentials to the app. */
export function useSignInForm(onSubmit: (credentials: SignInCredentials) => void) {
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const password = readText(form, FormField.password);
    const nextErrors: FieldErrors = {
      email: emailError(form),
      password: password === '' ? 'form.passwordMissing' : undefined,
    };
    setErrors(nextErrors);
    if (!focusFirstInvalid(form, nextErrors)) {
      onSubmit({ email: readText(form, FormField.email).trim(), password });
    }
  }

  function clearError(field: FormField) {
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  return { errors, handleSubmit, clearError };
}
