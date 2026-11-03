import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { tokenColor } from '../../testing/token-color.ts';
import { StatusMark, StatusMarkLevel } from './StatusMark.tsx';

const meta = {
  title: 'Feedback/StatusMark',
  component: StatusMark,
  args: { level: StatusMarkLevel.good, label: 'good' },
  argTypes: {
    level: { control: 'inline-radio', options: Object.values(StatusMarkLevel) },
  },
} satisfies Meta<typeof StatusMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Good: Story = {
  play: async ({ canvas }) => {
    const mark = canvas.getByRole('img', { name: 'good' });
    const check = mark.querySelector('svg');
    await expect(check).not.toBeNull();
    if (check !== null) {
      await expect(getComputedStyle(check).color).toBe(tokenColor('ink-muted', mark));
    }
  },
};

export const Fair: Story = {
  args: { level: StatusMarkLevel.fair, label: 'to improve' },
  play: async ({ canvas }) => {
    const square = canvas.getByRole('img', { name: 'to improve' }).firstElementChild;
    await expect(square).not.toBeNull();
    if (square !== null) {
      await expect(getComputedStyle(square).borderTopColor).toBe(tokenColor('ink', square));
    }
  },
};

export const Poor: Story = {
  args: { level: StatusMarkLevel.poor, label: 'to fix' },
  play: async ({ canvas }) => {
    const square = canvas.getByRole('img', { name: 'to fix' }).firstElementChild;
    await expect(square).not.toBeNull();
    if (square !== null) {
      await expect(getComputedStyle(square).backgroundColor).toBe(tokenColor('vermillion', square));
    }
  },
};

// Without its label, the mark is decorative: the text beside it says the level.
export const Decorative: Story = {
  args: { label: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('img')).toBeNull();
  },
};

// The legend of a list of measures, once above it (C-28).
export const Legend: Story = {
  render: () => (
    <div className="flex flex-wrap gap-x-space-4 gap-y-space-1 font-mono text-ink-muted text-meta">
      <span className="inline-flex items-center gap-1.5">
        <StatusMark level={StatusMarkLevel.good} />
        good
      </span>
      <span className="inline-flex items-center gap-1.5">
        <StatusMark level={StatusMarkLevel.fair} />
        to improve
      </span>
      <span className="inline-flex items-center gap-1.5">
        <StatusMark level={StatusMarkLevel.poor} />
        to fix
      </span>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('to fix')).toBeVisible();
  },
};
