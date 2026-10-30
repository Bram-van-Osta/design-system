import en from './messages.en.json' with { type: 'json' };
import fr from './messages.fr.json' with { type: 'json' };

export const Locale = {
  fr: 'fr',
  en: 'en',
} as const;
export type Locale = (typeof Locale)[keyof typeof Locale];

// Listed here rather than read from a messages file, so that the published types do not depend on
// the app's TypeScript reading JSON.
export const MESSAGE_KEYS = [
  'field.required',
  'field.optional',
  'passwordInput.show',
  'passwordInput.hide',
  'select.placeholder',
] as const;
export type MessageKey = (typeof MESSAGE_KEYS)[number];

/** The texts the components show themselves, by key. */
export type Messages = Readonly<Record<MessageKey, string>>;

export const MESSAGES: Readonly<Record<Locale, Messages>> = { fr, en };
