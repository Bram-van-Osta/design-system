import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import {
  expectEvenGapsAroundTicks,
  expectHatched,
  expectNamesApart,
  expectNamesOnTicks,
} from '../../testing/expect-meter.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { Meter } from './Meter.tsx';
import { MeterTone } from './meter-tone.ts';

const SIZES = [
  { label: 'S · up to 4', upTo: 4 },
  { label: 'M · up to 10', upTo: 10 },
  { label: 'L' },
] as const;
const POINTS = 'Module points';

const meta = {
  title: 'Feedback/Meter',
  component: Meter,
  args: {
    value: 3,
    max: 14,
    zones: SIZES,
    label: POINTS,
    valueText: '3 points, up to 4 in S',
  },
  argTypes: {
    tone: { control: 'inline-radio', options: Object.values(MeterTone) },
  },
  decorators: [
    (Story) => (
      <div className="max-w-reading-width">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

function fillsOf(meter: HTMLElement): readonly HTMLElement[] {
  return [...meter.querySelectorAll<HTMLElement>('[data-fill]')];
}

// A project's size against its limits: the first zone filled to three quarters, its names under it,
// each starting on its zone's tick, and the bars stopping as far short of a tick on both sides.
export const Sizes: Story = {
  play: async ({ canvas }) => {
    const meter = canvas.getByRole('meter', { name: POINTS });
    await expect(meter).toHaveAttribute('aria-valuenow', '3');
    await expect(meter).toHaveAttribute('aria-valuetext', '3 points, up to 4 in S');
    await expect(canvas.getByText('M · up to 10')).toBeVisible();
    const [first, second] = fillsOf(meter);
    await expect(first?.style.width).toBe('75%');
    await expect(second?.style.width).toBe('0%');
    if (first !== undefined) {
      await expect(getComputedStyle(first).backgroundColor).toBe(tokenColor('delft', meter));
    }
    const names = SIZES.map((size) => canvas.getByText(size.label));
    await expectNamesOnTicks(meter, names);
    await expectNamesApart(meter, names);
    await expectEvenGapsAroundTicks(meter);
  },
};

// Past the scale's end, every zone is full and the value read stops at the end.
export const PastTheScale: Story = {
  args: { value: 22, valueText: '22 points, past the 10 of M' },
  play: async ({ canvas }) => {
    const meter = canvas.getByRole('meter', { name: POINTS });
    await expect(meter).toHaveAttribute('aria-valuenow', '14');
    for (const fill of fillsOf(meter)) {
      await expect(fill.style.width).toBe('100%');
    }
  },
};

export const Ink: Story = {
  args: { tone: MeterTone.ink },
  play: async ({ canvas }) => {
    const meter = canvas.getByRole('meter', { name: POINTS });
    const [first] = fillsOf(meter);
    if (first !== undefined) {
      await expect(getComputedStyle(first).backgroundColor).toBe(tokenColor('ink', meter));
    }
  },
};

// Without its label, the meter is decorative: the words beside it say its value.
export const Decorative: Story = {
  args: { label: undefined, valueText: undefined, zones: undefined, value: 5, max: 10 },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('meter')).toBeNull();
  },
};

// A budget's two parts on the sizes' scale, L drawn as wide as S: the modules' points solid, then the
// pages' hatched, cut from them by a hairline, each named in the legend that describes the meter.
const BUDGET_SIZES = [
  { label: 'S · up to 6 points', upTo: 6 },
  { label: 'M · up to 16 points', upTo: 16 },
  { label: 'L' },
] as const;
const BUDGET_MAX = 22;
const BUDGET = 'Budget points';
const MODULES = 'Modules · 4 points';
const PAGES = 'Pages · 1 point';
const TWO_PARTS = {
  value: undefined,
  max: BUDGET_MAX,
  zones: BUDGET_SIZES,
  parts: [
    { value: 4, label: MODULES },
    { value: 1, label: PAGES },
  ],
  label: BUDGET,
  valueText: '5 points, up to 6 in S',
};
// The browser keeps a width's percent to four decimals.
const PERCENT_DIGITS = 3;

function partsOfZone(meter: HTMLElement, zone: number): readonly HTMLElement[] {
  const zones = [...meter.querySelectorAll<HTMLElement>('[data-zone]')];
  return [...(zones[zone]?.querySelectorAll<HTMLElement>('[data-fill]') ?? [])];
}

export const Parts: Story = {
  args: TWO_PARTS,
  play: async ({ canvas }) => {
    const meter = canvas.getByRole('meter', { name: BUDGET });
    await expect(meter).toHaveAttribute('aria-valuenow', '5');
    await expect(meter).toHaveAccessibleDescription(`${MODULES} ${PAGES}`);
    const [modules, pages] = partsOfZone(meter, 0);
    await expect(Number.parseFloat(modules?.style.width ?? '')).toBeCloseTo(
      (4 / 6) * 100,
      PERCENT_DIGITS,
    );
    await expect(Number.parseFloat(pages?.style.width ?? '')).toBeCloseTo(
      (1 / 6) * 100,
      PERCENT_DIGITS,
    );
    if (modules !== undefined && pages !== undefined) {
      await expect(getComputedStyle(modules).backgroundColor).toBe(tokenColor('delft', meter));
      await expectHatched(pages, tokenColor('delft', meter));
      await expect(getComputedStyle(pages).borderInlineStartColor).toBe(tokenColor('bg', meter));
    }
    const legend = document.getElementById(meter.getAttribute('aria-describedby') ?? '');
    const swatches = [...(legend?.querySelectorAll<HTMLElement>('[data-swatch]') ?? [])];
    const [solidSwatch, hatchedSwatch] = swatches;
    if (solidSwatch !== undefined && hatchedSwatch !== undefined) {
      await expect(getComputedStyle(solidSwatch).backgroundColor).toBe(tokenColor('delft', meter));
      await expectHatched(hatchedSwatch, tokenColor('delft', meter));
    }
    await expect(swatches).toHaveLength(2);
  },
};

// A part carried across a tick: the pages' points past S's end go on in M, still hatched.
export const PartsAcrossATick: Story = {
  args: {
    ...TWO_PARTS,
    parts: [
      { value: 5, label: 'Modules · 5 points' },
      { value: 3, label: 'Pages · 3 points' },
    ],
    valueText: '8 points, up to 16 in M',
  },
  play: async ({ canvas }) => {
    const meter = canvas.getByRole('meter', { name: BUDGET });
    await expect(meter).toHaveAttribute('aria-valuenow', '8');
    const [, smallPages] = partsOfZone(meter, 0);
    const [mediumModules, mediumPages] = partsOfZone(meter, 1);
    await expect(Number.parseFloat(smallPages?.style.width ?? '')).toBeCloseTo(
      (1 / 6) * 100,
      PERCENT_DIGITS,
    );
    await expect(mediumModules?.style.width).toBe('0%');
    await expect(Number.parseFloat(mediumPages?.style.width ?? '')).toBeCloseTo(
      (2 / 10) * 100,
      PERCENT_DIGITS,
    );
  },
};

export const PartsInInk: Story = {
  args: { ...TWO_PARTS, tone: MeterTone.ink },
  play: async ({ canvas }) => {
    const meter = canvas.getByRole('meter', { name: BUDGET });
    const [modules, pages] = partsOfZone(meter, 0);
    if (modules !== undefined && pages !== undefined) {
      await expect(getComputedStyle(modules).backgroundColor).toBe(tokenColor('ink', meter));
      await expectHatched(pages, tokenColor('ink', meter));
    }
  },
};

// A common phone's width, wider than the smallest one the runs pin.
const PHONE = 'phone390';
const PHONE_WIDTH = 390;
const PHONE_HEIGHT = 844;
const PHONE_SCREEN = {
  viewport: {
    options: {
      [PHONE]: {
        name: `Phone, ${PHONE_WIDTH} px`,
        styles: { width: `${PHONE_WIDTH}px`, height: `${PHONE_HEIGHT}px` },
        type: 'mobile',
      },
    },
  },
};
const SMALLEST_PHONE_WIDTH = 320;

// On a narrow phone, S's name is wider than its zone, 6 of the scale's 22: it wraps at its spaces,
// balanced, and ends short of M's tick, never touching M's name.
async function expectNamesOnAPhone(canvasElement: HTMLElement, width: number) {
  await expect(window.innerWidth).toBe(width);
  const scope = within(canvasElement);
  const meter = scope.getByRole('meter', { name: BUDGET });
  const names = BUDGET_SIZES.map((size) => scope.getByText(size.label));
  await expectNamesOnTicks(meter, names);
  await expectNamesApart(meter, names);
  await expectEvenGapsAroundTicks(meter);
}

export const PartsOnASmallPhone: Story = {
  args: TWO_PARTS,
  globals: { viewport: { value: 'mobile1' } },
  play: async ({ canvasElement }) => {
    await expectNamesOnAPhone(canvasElement, SMALLEST_PHONE_WIDTH);
  },
};

export const PartsOnAPhone: Story = {
  args: TWO_PARTS,
  parameters: PHONE_SCREEN,
  globals: { viewport: { value: PHONE } },
  play: async ({ canvasElement }) => {
    await expectNamesOnAPhone(canvasElement, PHONE_WIDTH);
  },
};
