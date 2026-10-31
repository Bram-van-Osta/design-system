import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { tokenColor } from '../../testing/token-color.ts';
import { tokenPixels } from '../../testing/token-pixels.ts';
import { StepProgress } from './StepProgress.tsx';

const LABEL = "Your request's progress";

// REF-T6-B01-Accueil-D to REF-T6-B08-Delai-D: across the page, under the header.
const meta = {
  title: 'Layout/StepProgress',
  component: StepProgress,
  args: {
    label: LABEL,
    max: 7,
    value: 2,
    valueText: 'Question 2 of 7',
  },
  decorators: [
    (Story) => (
      <div className="-mx-space-5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StepProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnTheWay: Story = {
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar', { name: LABEL });
    await expect(bar).toHaveAttribute('aria-valuemin', '0');
    await expect(bar).toHaveAttribute('aria-valuemax', '7');
    await expect(bar).toHaveAttribute('aria-valuenow', '2');
    await expect(bar).toHaveAttribute('aria-valuetext', 'Question 2 of 7');
    const segments = [...bar.children];
    await expect(segments).toHaveLength(7);
    const [done, notYet] = [segments[1], segments[2]];
    await expect(done && getComputedStyle(done).backgroundColor).toBe(tokenColor('delft', bar));
    await expect(notYet && getComputedStyle(notYet).backgroundColor).toBe(tokenColor('line', bar));
    await expect(done?.getBoundingClientRect().height).toBe(tokenPixels('progress-height'));
  },
};

export const NotStarted: Story = {
  args: { value: 0, valueText: 'Request not started yet' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  },
};

export const Done: Story = {
  args: { value: 7, valueText: 'Every question answered' },
};
