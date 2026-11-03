import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { StatusMarkLevel } from '../StatusMark/StatusMark.tsx';
import { Tag } from './Tag.tsx';

const LONG = 'header-photo-of-the-bakery-at-dawn-before-opening.jpg: 2400 px for 390';

const meta = {
  title: 'Feedback/Tag',
  component: Tag,
  args: { children: '2 images without alt text' },
  argTypes: {
    level: { control: 'inline-radio', options: Object.values(StatusMarkLevel) },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('2 images without alt text')).toBeVisible();
  },
};

export const WithAMark: Story = {
  args: { level: StatusMarkLevel.fair },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[data-level="fair"]')).not.toBeNull();
  },
};

// A page's defects in a row, which wraps, a long file name within its frame.
export const InARow: Story = {
  render: () => (
    <div className="flex max-w-reading-width flex-wrap gap-1.5">
      <Tag level={StatusMarkLevel.fair}>logo.png: 500 px for 210</Tag>
      <Tag level={StatusMarkLevel.fair}>no main heading</Tag>
      <Tag level={StatusMarkLevel.poor}>{LONG}</Tag>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const long = canvas.getByText(LONG);
    await expect(long.getBoundingClientRect().right).toBeLessThanOrEqual(
      canvasElement.getBoundingClientRect().right,
    );
  },
};
