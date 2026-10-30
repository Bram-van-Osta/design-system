import { type ReactNode, useMemo } from 'react';
import { type Locale, MESSAGES, type Messages } from './messages.ts';
import { MessagesContext } from './messages-context.ts';

export interface UiProviderProps {
  /** The language of the texts the components show: the reader's, from their account. */
  readonly locale: Locale;
  /** The app's own texts, in that language, in place of the package's. */
  readonly messages?: Partial<Messages>;
  readonly children: ReactNode;
}

/** Around the app: the components read their texts from it. */
export function UiProvider({ locale, messages, children }: UiProviderProps) {
  const value = useMemo(() => ({ ...MESSAGES[locale], ...messages }), [locale, messages]);
  return <MessagesContext value={value}>{children}</MessagesContext>;
}
