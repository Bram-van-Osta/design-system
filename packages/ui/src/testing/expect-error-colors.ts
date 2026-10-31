import { expect } from 'storybook/test';
import { tokenColor } from './token-color.ts';

/** An error's words in ink, after its icon in vermillion. */
export async function expectErrorColors(message: Element): Promise<void> {
  await expect(getComputedStyle(message).color).toBe(tokenColor('ink', message));
  const icon = message.querySelector('svg');
  await expect(icon).not.toBeNull();
  if (icon !== null) {
    await expect(getComputedStyle(icon).color).toBe(tokenColor('vermillion', message));
  }
}
