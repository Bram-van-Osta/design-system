import { expect } from 'storybook/test';

// What rounding the fractions of the grid to device pixels may leave.
const LAYOUT_TOLERANCE = 0.5;

function zonesOf(meter: HTMLElement): readonly HTMLElement[] {
  return [...meter.querySelectorAll<HTMLElement>('[data-zone]')];
}

/** Each zone's name starts on its zone's dashed tick, the first one on the bar's start. */
export async function expectNamesOnTicks(meter: HTMLElement, names: readonly HTMLElement[]) {
  const zones = zonesOf(meter);
  await expect(names).toHaveLength(zones.length);
  for (const [index, name] of names.entries()) {
    const tickLeft = zones[index]?.getBoundingClientRect().left ?? Number.NaN;
    const offset = name.getBoundingClientRect().left - tickLeft;
    await expect(Math.abs(offset)).toBeLessThanOrEqual(LAYOUT_TOLERANCE);
  }
}

function barOf(zone: Element | undefined): DOMRect {
  return zone?.firstElementChild?.getBoundingClientRect() ?? new DOMRect(Number.NaN);
}

/** The bars on both sides of each dashed tick stop the same distance short of it. */
export async function expectEvenGapsAroundTicks(meter: HTMLElement) {
  const zones = zonesOf(meter);
  await expect(zones.length).toBeGreaterThan(1);
  for (const [index, zone] of zones.entries()) {
    const previous = zones[index - 1];
    if (previous !== undefined) {
      const tick = zone.getBoundingClientRect().left;
      const tickWidth = Number.parseFloat(getComputedStyle(zone).borderInlineStartWidth);
      const gapBefore = tick - barOf(previous).right;
      const gapAfter = barOf(zone).left - (tick + tickWidth);
      await expect(gapBefore).toBeGreaterThan(0);
      await expect(Math.abs(gapBefore - gapAfter)).toBeLessThanOrEqual(LAYOUT_TOLERANCE);
    }
  }
}
