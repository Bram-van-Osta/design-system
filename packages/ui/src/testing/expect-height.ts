import { expect } from 'storybook/test';

type SizeToken = 'target-min' | 'button-height';

function tokenPixels(token: SizeToken): number {
  return Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(`--${token}`),
  );
}

export async function expectHeightAtLeast(element: Element, token: SizeToken): Promise<void> {
  await expect(element.getBoundingClientRect().height).toBeGreaterThanOrEqual(tokenPixels(token));
}
