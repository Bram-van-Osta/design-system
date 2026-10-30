import type { MessageKey } from '../../i18n/messages.ts';

export const FormField = {
  email: 'email',
  password: 'password',
} as const;
export type FormField = (typeof FormField)[keyof typeof FormField];

/** The message of each invalid field, by its name. */
export type FieldErrors = Partial<Record<FormField, MessageKey>>;

export function readText(form: HTMLFormElement, field: FormField): string {
  const value = new FormData(form).get(field);
  return typeof value === 'string' ? value : '';
}

export function emailError(form: HTMLFormElement): MessageKey | undefined {
  const input = form.elements.namedItem(FormField.email);
  if (!(input instanceof HTMLInputElement) || input.value.trim() === '') {
    return 'form.emailMissing';
  }
  return input.validity.typeMismatch ? 'form.emailInvalid' : undefined;
}

/** Moves the focus to the first invalid field, in the form's order; returns whether there was one. */
export function focusFirstInvalid(form: HTMLFormElement, errors: FieldErrors): boolean {
  const firstInvalid = Object.values(FormField).find((field) => errors[field] !== undefined);
  if (firstInvalid === undefined) {
    return false;
  }
  const input = form.elements.namedItem(firstInvalid);
  if (input instanceof HTMLElement) {
    input.focus();
  }
  return true;
}
