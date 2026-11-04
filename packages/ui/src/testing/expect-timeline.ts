import { expect } from 'storybook/test';
import { expectOnFirstLine } from './expect-first-line.ts';

// What rounding the layout to device pixels may leave.
const LAYOUT_TOLERANCE = 0.5;

/** Each moment's square is centered on its name's line. */
export async function expectMarkersOnNames(timeline: HTMLElement, names: readonly HTMLElement[]) {
  const markers = [...timeline.querySelectorAll('[data-marker]')];
  await expect(markers).toHaveLength(names.length);
  for (const [index, name] of names.entries()) {
    await expectOnFirstLine(name, markers[index] ?? null);
  }
}

/** The rule runs unbroken from the first square to the last, through every square between. */
export async function expectUnbrokenRule(timeline: HTMLElement) {
  const stretches = [...timeline.querySelectorAll('[data-marker], [data-rule]')]
    .map((element) => element.getBoundingClientRect())
    .sort((first, second) => first.top - second.top);
  await expect(stretches.length).toBeGreaterThan(1);
  for (const [index, stretch] of stretches.entries()) {
    const previous = stretches[index - 1];
    if (previous !== undefined) {
      await expect(Math.abs(stretch.top - previous.bottom)).toBeLessThanOrEqual(LAYOUT_TOLERANCE);
    }
  }
}
