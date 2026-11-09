import { expect, waitFor } from 'storybook/test';
import { type ColorToken, tokenColor } from './token-color.ts';

/**
 * The element's background reaches the token's color, once its transition or animation ends. The
 * color is read before the wait: reading it adds a probe to the page, which a wait would see as a
 * change and read again, without end.
 */
export async function expectBackgroundToBecome(element: Element, token: ColorToken): Promise<void> {
  const color = tokenColor(token, element);
  await waitFor(() => expect(getComputedStyle(element).backgroundColor).toBe(color));
}
