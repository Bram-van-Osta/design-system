import { expect, within } from 'storybook/test';
import { Locale, MESSAGES, type MessageKey } from '../i18n/messages.ts';
import { expectErrorColors } from './expect-error-colors.ts';
import { expectOnFirstLine } from './expect-first-line.ts';
import { tokenColor } from './token-color.ts';
import { tokenPixels } from './token-pixels.ts';

/** The block's alert is announced, alone, with its text in the story's language, in its box. */
export async function expectFormAlert(
  canvasElement: HTMLElement,
  { locale, key }: { readonly locale: unknown; readonly key: MessageKey },
): Promise<void> {
  const text = MESSAGES[locale === Locale.fr ? Locale.fr : Locale.en][key];
  const alert = within(canvasElement).getByRole('alert');
  // Compared as is: the matchers turn the French typography's non-breaking spaces into spaces.
  await expect(alert.textContent).toBe(text);
  await expectFormAlertBox(alert);
}

/** An alert in its box: on surface, under a vermillion rule, its icon on its first line. */
export async function expectFormAlertBox(alert: HTMLElement): Promise<void> {
  await expect(alert).toBeVisible();
  const style = getComputedStyle(alert);
  await expect(style.backgroundColor).toBe(tokenColor('surface', alert));
  await expect(style.borderTopColor).toBe(tokenColor('vermillion', alert));
  await expect(Number.parseFloat(style.borderTopWidth)).toBe(tokenPixels('border-attention'));
  await expectErrorColors(alert);
  await expectOnFirstLine(alert, alert.querySelector('svg'));
}
