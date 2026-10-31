import { expect } from 'storybook/test';
import { type SizeToken, tokenPixels } from './token-pixels.ts';

export async function expectHeightAtLeast(element: Element, token: SizeToken): Promise<void> {
  await expect(element.getBoundingClientRect().height).toBeGreaterThanOrEqual(tokenPixels(token));
}
