import { useMessages } from '../../i18n/use-messages.ts';

/** "or", between two ways of signing in, on a hair rule. */
export function OrSeparator() {
  const messages = useMessages();
  return (
    <p className="flex items-center gap-space-3 text-small text-ink-muted before:flex-1 before:border-t-hair before:border-line after:flex-1 after:border-t-hair after:border-line">
      {messages['signIn.or']}
    </p>
  );
}
