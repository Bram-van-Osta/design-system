import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Avatar } from './Avatar.tsx';

const meta = {
  title: 'Identity/Avatar',
  component: Avatar,
  args: { name: 'Jeanne Martin' },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const avatar = canvas.getByRole('img', { name: 'Jeanne Martin' });
    await expect(avatar).toHaveTextContent('JM');
    await expect(getComputedStyle(avatar).borderRadius).toBe('50%');
  },
};

export const OneWord: Story = {
  args: { name: 'Jeanne' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: 'Jeanne' })).toHaveTextContent('J');
  },
};
