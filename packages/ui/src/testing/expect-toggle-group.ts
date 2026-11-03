import { expect } from 'storybook/test';
import { expectFocusRing } from './expect-focus-ring.ts';
import { expectHeightAtLeast } from './expect-height.ts';
import { tokenColor } from './token-color.ts';

/**
 * The group on its Delft band: square, no shadow, in a white hair, its segments touching, each one
 * 44 px high at least. The pointer's hover cannot be simulated, so its deep Delft is pinned by its
 * class.
 */
export async function expectSegmentedGroup(
  group: HTMLElement,
  segments: readonly HTMLElement[],
): Promise<void> {
  const style = getComputedStyle(group);
  await expect(style.borderTopWidth).toBe('1px');
  await expect(style.borderTopColor).toBe(tokenColor('on-delft', group));
  await expect(style.borderRadius).toBe('0px');
  await expect(style.boxShadow).toBe('none');
  for (const [index, segment] of segments.entries()) {
    await expectHeightAtLeast(segment, 'target-min');
    await expect(getComputedStyle(segment).borderRadius).toBe('0px');
    await expect(segment).toHaveClass('hover:not-data-pressed:bg-delft-deep');
    const previous = segments[index - 1];
    if (previous !== undefined) {
      await expect(segment.getBoundingClientRect().left).toBe(
        previous.getBoundingClientRect().right,
      );
      await expect(getComputedStyle(segment).borderLeftWidth).toBe('1px');
      await expect(getComputedStyle(segment).borderLeftColor).toBe(tokenColor('on-delft', group));
    }
  }
}

/** The pressed segment in white with ink text, the others in Delft with white text. */
export async function expectPressed(
  pressed: HTMLElement,
  others: readonly HTMLElement[],
): Promise<void> {
  await expect(pressed).toHaveAttribute('aria-pressed', 'true');
  const pressedStyle = getComputedStyle(pressed);
  await expect(pressedStyle.backgroundColor).toBe(tokenColor('on-delft', pressed));
  await expect(pressedStyle.color).toBe(tokenColor('ink', pressed));
  for (const other of others) {
    await expect(other).toHaveAttribute('aria-pressed', 'false');
    const otherStyle = getComputedStyle(other);
    await expect(otherStyle.backgroundColor).toBe(tokenColor('delft', other));
    await expect(otherStyle.color).toBe(tokenColor('on-delft', other));
  }
}

/** The identity's focus ring, in white so that it reads on Delft. */
export async function expectFocusOnDelft(segment: HTMLElement): Promise<void> {
  await expectFocusRing(segment);
  await expect(getComputedStyle(segment).outlineColor).toBe(tokenColor('on-delft', segment));
}

/**
 * The group in ink on the page's background: an ink hair, the pressed segment in ink with white
 * text, the others in white with ink text, each 44 px high at least. The pointer's hover cannot be
 * simulated, so its surface is pinned by its class.
 */
export async function expectInkGroup(
  group: HTMLElement,
  pressed: HTMLElement,
  others: readonly HTMLElement[],
): Promise<void> {
  const style = getComputedStyle(group);
  await expect(style.borderTopWidth).toBe('1px');
  await expect(style.borderTopColor).toBe(tokenColor('ink', group));
  await expect(style.borderRadius).toBe('0px');
  await expect(pressed).toHaveAttribute('aria-pressed', 'true');
  await expectHeightAtLeast(pressed, 'target-min');
  await expect(getComputedStyle(pressed).backgroundColor).toBe(tokenColor('ink', pressed));
  await expect(getComputedStyle(pressed).color).toBe(tokenColor('bg', pressed));
  for (const other of others) {
    await expect(other).toHaveAttribute('aria-pressed', 'false');
    await expect(other).toHaveClass('hover:not-data-pressed:bg-surface');
    await expect(getComputedStyle(other).backgroundColor).toBe(tokenColor('bg', other));
    await expect(getComputedStyle(other).color).toBe(tokenColor('ink', other));
  }
}
