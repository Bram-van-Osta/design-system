import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { type ColorToken, tokenColor } from '../../testing/token-color.ts';
import { StatusMarkLevel } from '../StatusMark/StatusMark.tsx';
import { Tag, TagTone } from './Tag.tsx';

const LONG = 'header-photo-of-the-bakery-at-dawn-before-opening.jpg: 2400 px for 390';

const meta = {
  title: 'Feedback/Tag',
  component: Tag,
  args: { children: '2 images without alt text' },
  argTypes: {
    level: { control: 'inline-radio', options: Object.values(StatusMarkLevel) },
    tone: { control: 'inline-radio', options: Object.values(TagTone) },
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

// Each tone's frame, as a fact's sources tell themselves apart: measured, read, said, inferred.
const TONE_FRAMES: Readonly<Record<TagTone, ColorToken>> = {
  plain: 'field',
  ink: 'ink',
  solid: 'ink',
  delft: 'delft',
  agent: 'agent',
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-1.5">
      {Object.values(TagTone).map((tone) => (
        <Tag key={tone} tone={tone}>
          {tone}
        </Tag>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const tone of Object.values(TagTone)) {
      const tag = canvasElement.querySelector(`[data-tone="${tone}"]`);
      await expect(tag).not.toBeNull();
      if (tag !== null) {
        await expect(getComputedStyle(tag).borderTopColor).toBe(tokenColor(TONE_FRAMES[tone], tag));
      }
    }
    const solid = canvasElement.querySelector('[data-tone="solid"]');
    if (solid !== null) {
      await expect(getComputedStyle(solid).color).toBe(tokenColor('bg', solid));
    }
  },
};
