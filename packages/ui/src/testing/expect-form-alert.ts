import { expect, within } from 'storybook/test';
import { Locale, MESSAGES, type MessageKey } from '../i18n/messages.ts';

/** The block's alert is announced, alone, with its text in the story's language. */
export async function expectFormAlert(
  canvasElement: HTMLElement,
  { locale, key }: { readonly locale: unknown; readonly key: MessageKey },
): Promise<void> {
  const text = MESSAGES[locale === Locale.fr ? Locale.fr : Locale.en][key];
  const alert = within(canvasElement).getByRole('alert');
  await expect(alert).toBeVisible();
  // Compared as is: the matchers turn the French typography's non-breaking spaces into spaces.
  await expect(alert.textContent).toBe(text);
}
