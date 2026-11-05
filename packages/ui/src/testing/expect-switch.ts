import { expect } from 'storybook/test';
import { expectContrastAtLeast } from './expect-contrast.ts';
import { expectTransitionOnlyWhenMotionAllowed } from './expect-motion.ts';
import { type ColorToken, tokenColor } from './token-color.ts';
import { tokenPixels } from './token-pixels.ts';

// WCAG's non-text contrast: the knob that shows the state, against its track.
const NON_TEXT_CONTRAST = 3;

export interface SwitchLook {
  readonly track: ColorToken;
  readonly knob: ColorToken;
  /** The outline's color, or null when the track has none. */
  readonly outline: ColorToken | null;
}

export const SWITCH_ON: SwitchLook = { track: 'delft', knob: 'bg', outline: null };
export const SWITCH_OFF: SwitchLook = { track: 'bg', knob: 'ink-muted', outline: 'ink' };
export const SWITCH_DISABLED_ON: SwitchLook = { track: 'field', knob: 'bg', outline: null };
export const SWITCH_DISABLED_OFF: SwitchLook = { track: 'surface', knob: 'field', outline: 'line' };

/** The switch's knob, inside its track. */
export function knobOf(control: Element): HTMLElement {
  const knob = control.firstElementChild;
  if (!(knob instanceof HTMLElement)) {
    throw new Error('A switch holds its knob.');
  }
  return knob;
}

/** The track by its tokens, square and flat, the knob space-1 from its top and its near side. */
export async function expectSwitchShape(control: Element, isChecked: boolean): Promise<void> {
  const track = control.getBoundingClientRect();
  const knob = knobOf(control).getBoundingClientRect();
  await expect([track.width, track.height]).toEqual([
    tokenPixels('switch-width'),
    tokenPixels('switch-height'),
  ]);
  await expect([knob.width, knob.height]).toEqual([
    tokenPixels('switch-knob'),
    tokenPixels('switch-knob'),
  ]);
  await expect(knob.top - track.top).toBe(tokenPixels('space-1'));
  const nearSide = isChecked ? track.right - knob.right : knob.left - track.left;
  await expect(nearSide).toBe(tokenPixels('space-1'));
  const { borderRadius, boxShadow } = getComputedStyle(control);
  await expect({ borderRadius, boxShadow }).toEqual({ borderRadius: '0px', boxShadow: 'none' });
}

/** The track, its outline and its knob in their tokens; an enabled knob at 3:1 on its track. */
export async function expectSwitchLook(control: Element, look: SwitchLook): Promise<void> {
  const trackColor = getComputedStyle(control).backgroundColor;
  const knobColor = getComputedStyle(knobOf(control)).backgroundColor;
  await expect(trackColor).toBe(tokenColor(look.track, control));
  await expect(knobColor).toBe(tokenColor(look.knob, control));
  const outline = getComputedStyle(control, '::before');
  if (look.outline === null) {
    await expect(outline.display).toBe('none');
  } else {
    await expect(outline.borderTopWidth).toBe(`${tokenPixels('border-hair')}px`);
    await expect(outline.borderTopColor).toBe(tokenColor(look.outline, control));
  }
  if (control.getAttribute('aria-disabled') !== 'true') {
    await expectContrastAtLeast(knobColor, trackColor, NON_TEXT_CONTRAST);
  }
}

/** The knob's transition is declared only for a system that does not ask for less motion. */
export async function expectKnobMotionOnlyWhenAllowed(control: Element): Promise<void> {
  await expectTransitionOnlyWhenMotionAllowed(knobOf(control));
  await expect(getComputedStyle(control).transitionProperty).toBe('all');
  await expect(getComputedStyle(control).transitionDuration).toBe('0s');
}
