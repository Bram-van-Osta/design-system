import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { tokenColor } from '../../testing/token-color.ts';
import { ScoreRing, ScoreRingTone } from './ScoreRing.tsx';

const PERFORMANCE = 'Performance: 87 out of 100';

const meta = {
  title: 'Feedback/ScoreRing',
  component: ScoreRing,
  args: {
    value: 87,
    label: 'Perf.',
    accessibleLabel: PERFORMANCE,
  },
  argTypes: {
    tone: { control: 'inline-radio', options: Object.values(ScoreRingTone) },
  },
} satisfies Meta<typeof ScoreRing>;

export default meta;
type Story = StoryObj<typeof meta>;

function arcOf(ring: HTMLElement): SVGCircleElement | null {
  return ring.querySelector('circle[data-arc]');
}

export const Neutral: Story = {
  play: async ({ canvas }) => {
    const ring = canvas.getByRole('img', { name: PERFORMANCE });
    await expect(ring).toHaveTextContent('87');
    await expect(canvas.getByText('Perf.')).toBeVisible();
    const arc = arcOf(ring);
    await expect(arc).not.toBeNull();
    if (arc !== null) {
      await expect(getComputedStyle(arc).stroke).toBe(tokenColor('ink', ring));
    }
  },
};

// A score to fix: its arc in vermilion, its figure in ink.
export const Attention: Story = {
  args: { value: 31, tone: ScoreRingTone.attention, accessibleLabel: 'Performance: 31 out of 100' },
  play: async ({ canvas }) => {
    const ring = canvas.getByRole('img', { name: 'Performance: 31 out of 100' });
    const arc = arcOf(ring);
    if (arc !== null) {
      await expect(getComputedStyle(arc).stroke).toBe(tokenColor('vermillion', ring));
    }
    await expect(getComputedStyle(canvas.getByText('31')).color).toBe(tokenColor('ink', ring));
  },
};

export const NotMeasured: Story = {
  args: { value: null, accessibleLabel: 'Accessibility: not scored', label: 'Access.' },
  play: async ({ canvas }) => {
    const ring = canvas.getByRole('img', { name: 'Accessibility: not scored' });
    await expect(arcOf(ring)).toBeNull();
    await expect(ring).toHaveTextContent('–');
  },
};

// A page's four scores side by side, as a captured page's row shows them (C-28).
export const FourScores: Story = {
  render: () => (
    <div className="flex flex-wrap gap-space-4">
      <ScoreRing
        value={46}
        label="Perf."
        accessibleLabel="Performance: 46 out of 100"
        tone={ScoreRingTone.attention}
      />
      <ScoreRing value={82} label="Access." accessibleLabel="Accessibility: 82 out of 100" />
      <ScoreRing value={96} label="Pract." accessibleLabel="Best practices: 96 out of 100" />
      <ScoreRing value={100} label="SEO" accessibleLabel="SEO: 100 out of 100" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('img')).toHaveLength(4);
  },
};
