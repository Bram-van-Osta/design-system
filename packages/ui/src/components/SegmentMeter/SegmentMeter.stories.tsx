import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { expectHatched } from '../../testing/expect-meter.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { MeterTone } from '../Meter/meter-tone.ts';
import { SegmentMeter, SegmentMeterSize } from './SegmentMeter.tsx';

const meta = {
  title: 'Feedback/SegmentMeter',
  component: SegmentMeter,
  args: { value: 2, max: 3, label: 'Weight', valueText: 'medium' },
  argTypes: {
    size: { control: 'inline-radio', options: Object.values(SegmentMeterSize) },
    tone: { control: 'inline-radio', options: Object.values(MeterTone) },
  },
} satisfies Meta<typeof SegmentMeter>;

export default meta;
type Story = StoryObj<typeof meta>;

function segmentsOf(meter: HTMLElement): readonly HTMLElement[] {
  return [...meter.querySelectorAll<HTMLElement>('[data-filled]')];
}

// A weight on three steps.
export const Weight: Story = {
  play: async ({ canvas }) => {
    const meter = canvas.getByRole('meter', { name: 'Weight' });
    await expect(meter).toHaveAttribute('aria-valuetext', 'medium');
    const filled = segmentsOf(meter).map((segment) => segment.dataset.filled);
    await expect(filled).toEqual(['true', 'true', 'false']);
    const [first] = segmentsOf(meter);
    if (first !== undefined) {
      await expect(getComputedStyle(first).backgroundColor).toBe(tokenColor('delft', meter));
    }
  },
};

// Points in blocks against a limit: the tick after its block, its name at the end.
export const Points: Story = {
  args: {
    value: 3,
    max: 4,
    size: SegmentMeterSize.large,
    limit: { at: 4, label: 'S limit' },
    label: 'Module points',
    valueText: '3 points, up to 4 in S',
  },
  play: async ({ canvas }) => {
    const meter = canvas.getByRole('meter', { name: 'Module points' });
    await expect(segmentsOf(meter)).toHaveLength(4);
    await expect(canvas.getByText('S limit')).toBeVisible();
    const tick = meter.querySelector('[data-limit]');
    await expect(tick?.previousElementSibling?.getAttribute('data-filled')).toBe('false');
  },
};

// Past the limit, the blocks go on after its tick.
export const PastTheLimit: Story = {
  args: {
    value: 6,
    max: 6,
    size: SegmentMeterSize.large,
    limit: { at: 4, label: 'S limit' },
    label: 'Module points',
    valueText: '6 points, past the 4 of S',
  },
  play: async ({ canvas }) => {
    const meter = canvas.getByRole('meter', { name: 'Module points' });
    const tick = meter.querySelector('[data-limit]');
    await expect(tick?.nextElementSibling?.getAttribute('data-filled')).toBe('true');
  },
};

// A budget's points in two parts against S's limit: the modules' blocks solid, then the pages'
// hatched in a frame of their stripes, each named in the legend that describes the meter.
export const PointsInParts: Story = {
  args: {
    value: undefined,
    parts: [
      { value: 4, label: 'Modules · 4 points' },
      { value: 1, label: 'Pages · 1 point' },
    ],
    max: 6,
    size: SegmentMeterSize.large,
    limit: { at: 6, label: 'S limit' },
    label: 'Budget points',
    valueText: '5 points, up to 6 in S',
  },
  play: async ({ canvas }) => {
    const meter = canvas.getByRole('meter', { name: 'Budget points' });
    await expect(meter).toHaveAttribute('aria-valuenow', '5');
    await expect(meter).toHaveAccessibleDescription('Modules · 4 points Pages · 1 point');
    const segments = segmentsOf(meter);
    await expect(segments.map((segment) => segment.dataset.part ?? null)).toEqual([
      '0',
      '0',
      '0',
      '0',
      '1',
      null,
    ]);
    const [solid] = segments;
    const hatched = segments[4];
    if (solid !== undefined && hatched !== undefined) {
      await expect(getComputedStyle(solid).backgroundColor).toBe(tokenColor('delft', meter));
      await expectHatched(hatched, tokenColor('delft', meter));
      await expect(getComputedStyle(hatched).borderTopColor).toBe(tokenColor('delft', meter));
    }
  },
};

// Small segments in parts, the hatched one over the track.
export const SmallInParts: Story = {
  args: {
    value: undefined,
    parts: [
      { value: 1, label: 'Built' },
      { value: 1, label: 'Planned' },
    ],
    max: 3,
  },
  play: async ({ canvas }) => {
    const meter = canvas.getByRole('meter', { name: 'Weight' });
    const [, hatched] = segmentsOf(meter);
    if (hatched !== undefined) {
      await expectHatched(hatched, tokenColor('delft', meter));
      await expect(getComputedStyle(hatched).backgroundColor).toBe(tokenColor('delft-pale', meter));
    }
  },
};

export const Ink: Story = {
  args: { tone: MeterTone.ink },
  play: async ({ canvas }) => {
    const [first] = segmentsOf(canvas.getByRole('meter', { name: 'Weight' }));
    if (first !== undefined) {
      await expect(getComputedStyle(first).backgroundColor).toBe(tokenColor('ink', first));
    }
  },
};

// Beside its word, the meter is decorative.
export const BesideItsWord: Story = {
  args: { label: undefined, valueText: undefined },
  render: (args) => (
    <span className="inline-flex items-center gap-1.5">
      <SegmentMeter {...args} />
      <span className="font-mono text-ink-muted text-meta">medium</span>
    </span>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('meter')).toBeNull();
    await expect(canvas.getByText('medium')).toBeVisible();
  },
};
