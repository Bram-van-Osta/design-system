import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
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

// A project's size against its limits: the first zone filled to three quarters, its names under it.
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
