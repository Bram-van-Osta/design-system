import { expect } from 'storybook/test';
import { type SizeToken, tokenPixels } from './token-pixels.ts';

export async function expectWidthAtMost(element: Element, token: SizeToken): Promise<void> {
  await expect(element.getBoundingClientRect().width).toBeLessThanOrEqual(tokenPixels(token));
}
