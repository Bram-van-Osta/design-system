import { expect } from 'storybook/test';
import { expectFocusRing } from './expect-focus-ring.ts';
import { expectHeightAtLeast } from './expect-height.ts';
import { isOnAComputer } from './is-on-a-computer.ts';
import { tokenColor } from './token-color.ts';
import { tokenPixels } from './token-pixels.ts';

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
    await expect(segment).toHaveClass('hover:not-data-pressed:not-data-disabled:bg-delft-deep');
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
    await expect(other).toHaveClass('hover:not-data-pressed:not-data-disabled:bg-surface');
    await expect(getComputedStyle(other).backgroundColor).toBe(tokenColor('bg', other));
    await expect(getComputedStyle(other).color).toBe(tokenColor('ink', other));
  }
}

// The answers share the row's width in fractions of a pixel.
const SUBPIXEL_TOLERANCE = 0.5;

function checkOf(answer: HTMLElement): Element {
  const check = answer.querySelector('svg');
  if (check === null) {
    throw new Error('Each answer holds its check.');
  }
  return check;
}

function expectNear(actual: number, expected: number): Promise<void> {
  return expect(Math.abs(actual - expected)).toBeLessThan(SUBPIXEL_TOLERANCE);
}

// On a computer, each its own equal column on one row, the gap between two; on a phone, stacked at
// the group's width, the smaller gap between two.
async function expectPlacedAfter(answer: HTMLElement, previous: HTMLElement): Promise<void> {
  const box = answer.getBoundingClientRect();
  const previousBox = previous.getBoundingClientRect();
  if (isOnAComputer()) {
    await expect(box.top).toBe(previousBox.top);
    await expectNear(box.left - previousBox.right, tokenPixels('space-3'));
    return;
  }
  await expect(box.left).toBe(previousBox.left);
  await expectNear(box.top - previousBox.bottom, tokenPixels('space-2'));
}

/**
 * A question's answers: each its own equal column on one row on a computer, stacked at the whole
 * width on a phone, apart by the gap, a primary button high, square, no shadow, in an ink hair. The
 * pointer's hover cannot be simulated, so its surface is pinned by its class.
 */
export async function expectAnswers(answers: readonly HTMLElement[]): Promise<void> {
  const [first] = answers;
  for (const [index, answer] of answers.entries()) {
    const box = answer.getBoundingClientRect();
    await expectNear(box.width, first?.getBoundingClientRect().width ?? 0);
    await expectHeightAtLeast(answer, 'button-height');
    const style = getComputedStyle(answer);
    await expect({
      borderTopWidth: style.borderTopWidth,
      borderTopColor: style.borderTopColor,
      borderRadius: style.borderRadius,
      boxShadow: style.boxShadow,
    }).toEqual({
      borderTopWidth: '1px',
      borderTopColor: tokenColor('ink', answer),
      borderRadius: '0px',
      boxShadow: 'none',
    });
    await expect(answer).toHaveClass('hover:not-data-pressed:not-data-disabled:bg-surface');
    const previous = answers[index - 1];
    if (previous !== undefined) {
      await expectPlacedAfter(answer, previous);
    }
  }
}

/**
 * The pressed answer in Delft blue with white text and its check; the others in white with ink
 * text, without a check. No pressed one when it is null.
 */
export async function expectAnswerPressed(
  pressed: HTMLElement | null,
  others: readonly HTMLElement[],
): Promise<void> {
  if (pressed !== null) {
    await expect(pressed).toHaveAttribute('aria-pressed', 'true');
    const { backgroundColor, color } = getComputedStyle(pressed);
    await expect({ backgroundColor, color }).toEqual({
      backgroundColor: tokenColor('delft', pressed),
      color: tokenColor('on-delft', pressed),
    });
    await expect(getComputedStyle(checkOf(pressed)).display).toBe('block');
  }
  for (const other of others) {
    await expect(other).toHaveAttribute('aria-pressed', 'false');
    const { backgroundColor, color } = getComputedStyle(other);
    await expect({ backgroundColor, color }).toEqual({
      backgroundColor: tokenColor('bg', other),
      color: tokenColor('ink', other),
    });
    await expect(getComputedStyle(checkOf(other)).display).toBe('none');
  }
}

/** Unavailable: in the line's hair, the pressed one filled in the line color, all in muted ink. */
export async function expectDisabledOptions(
  pressed: HTMLElement,
  others: readonly HTMLElement[],
): Promise<void> {
  await expect(pressed).toHaveAttribute('data-disabled');
  await expect(getComputedStyle(pressed).backgroundColor).toBe(tokenColor('line', pressed));
  await expect(getComputedStyle(pressed).color).toBe(tokenColor('ink-muted', pressed));
  for (const other of others) {
    await expect(other).toHaveAttribute('data-disabled');
    const { backgroundColor, color, cursor } = getComputedStyle(other);
    await expect({ backgroundColor, color, cursor }).toEqual({
      backgroundColor: tokenColor('surface', other),
      color: tokenColor('ink-muted', other),
      cursor: 'not-allowed',
    });
  }
}
