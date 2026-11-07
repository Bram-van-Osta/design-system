import { Locale, MESSAGES, type Messages } from '../i18n/messages.ts';

/** The components' texts in the run's language, from the story's `locale` global. */
export function messagesOf(locale: unknown): Messages {
  return MESSAGES[locale === Locale.fr ? Locale.fr : Locale.en];
}
