import { expect } from 'storybook/test';
import { tokenPixels } from './token-pixels.ts';

/** A control's typed text and its placeholder, at the body size. */
export async function expectBodyText(control: Element): Promise<void> {
  const bodyPixels = tokenPixels('text-body');
  await expect(Number.parseFloat(getComputedStyle(control).fontSize)).toBe(bodyPixels);
  await expect(Number.parseFloat(getComputedStyle(control, '::placeholder').fontSize)).toBe(
    bodyPixels,
  );
}
