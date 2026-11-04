import { use } from 'react';
import { LocaleContext } from './locale-context.ts';
import type { Locale } from './messages.ts';

/** The reader's language, for what a component formats itself: a number, a percentage. */
export function useLocale(): Locale {
  const locale = use(LocaleContext);
  if (locale === null) {
    throw new Error('A component that formats a value must be rendered inside a UiProvider.');
  }
  return locale;
}
