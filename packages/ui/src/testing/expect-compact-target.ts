import { expect } from 'storybook/test';
import { tokenPixels } from './token-pixels.ts';

// A pixel inside the hit area's edge, away from what rounding leaves.
const EDGE_INSET = 1;

/** A compact control: drawn in its small square, its target of 44 px reached around it. */
export async function expectCompactTarget(control: Element): Promise<void> {
  const drawn = control.getBoundingClientRect();
  await expect(drawn.width).toBe(tokenPixels('icon-button-compact'));
  await expect(drawn.height).toBe(tokenPixels('icon-button-compact'));
  const hitArea = getComputedStyle(control, '::before');
  await expect(Number.parseFloat(hitArea.width)).toBeGreaterThanOrEqual(tokenPixels('target-min'));
  await expect(Number.parseFloat(hitArea.height)).toBeGreaterThanOrEqual(tokenPixels('target-min'));

  // Each side, past the drawing and inside the target, still reaches the control.
  const reach = (tokenPixels('target-min') - drawn.width) / 2 - EDGE_INSET;
  const centerX = drawn.left + drawn.width / 2;
  const centerY = drawn.top + drawn.height / 2;
  const points = [
    [drawn.left - reach, centerY],
    [drawn.right + reach, centerY],
    [centerX, drawn.top - reach],
    [centerX, drawn.bottom + reach],
  ] as const;
  for (const [x, y] of points) {
    await expect(document.elementFromPoint(x, y)).toBe(control);
  }
}
