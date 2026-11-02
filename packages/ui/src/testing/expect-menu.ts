import { expect, waitFor } from 'storybook/test';
import { tokenColor } from './token-color.ts';
import { tokenPixels } from './token-pixels.ts';

const TRANSPARENT = 'rgba(0, 0, 0, 0)';
// Base UI places the popup at fractions of a pixel.
const PIXEL_PRECISION = 0;

function avatarIn(trigger: HTMLElement): Element | null {
  return trigger.querySelector('[role="img"]');
}

/**
 * A menu's button at rest: no border, no background, an avatar in it on the surface. The pointer's
 * hover cannot be simulated, so its surface is pinned by its class.
 */
export async function expectMenuTriggerAtRest(trigger: HTMLElement): Promise<void> {
  const style = getComputedStyle(trigger);
  await expect(style.borderTopWidth).toBe('0px');
  await expect(style.backgroundColor).toBe(TRANSPARENT);
  await expect(trigger).toHaveClass('hover:bg-surface');
  const avatar = avatarIn(trigger);
  if (avatar !== null) {
    await expect(getComputedStyle(avatar).backgroundColor).toBe(tokenColor('surface', avatar));
  }
}

/** A menu's button while open: on the surface, an avatar in it on the page's background. */
export async function expectMenuTriggerOpen(trigger: HTMLElement): Promise<void> {
  await expect(getComputedStyle(trigger).backgroundColor).toBe(tokenColor('surface', trigger));
  const avatar = avatarIn(trigger);
  if (avatar !== null) {
    await expect(getComputedStyle(avatar).backgroundColor).toBe(tokenColor('bg', avatar));
  }
}

/** The popup 4 px under its button, its end on the button's, in a hair line, square, no shadow. */
export async function expectDetachedPopup(trigger: HTMLElement, popup: HTMLElement): Promise<void> {
  // Base UI moves the popup into place over a few frames once it opens.
  await waitFor(async () => {
    const popupBox = popup.getBoundingClientRect();
    const triggerBox = trigger.getBoundingClientRect();
    await expect(popupBox.top - triggerBox.bottom).toBeCloseTo(
      tokenPixels('space-1'),
      PIXEL_PRECISION,
    );
    await expect(popupBox.right).toBeCloseTo(triggerBox.right, PIXEL_PRECISION);
  });
  const style = getComputedStyle(popup);
  await expect(style.borderTopColor).toBe(tokenColor('line', popup));
  await expect(style.borderTopWidth).toBe('1px');
  await expect(style.borderRadius).toBe('0px');
  await expect(style.boxShadow).toBe('none');
}
