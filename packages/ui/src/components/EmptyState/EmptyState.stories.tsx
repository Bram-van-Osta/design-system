import { UploadSimpleIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Button, ButtonVariant } from '../Button/Button.tsx';
import { EmptyState } from './EmptyState.tsx';

const meta = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  args: {
    title: 'No file yet',
    description: 'Drop your logo, your photos and your texts here. Bram sorts them for you.',
  },
  argTypes: {
    action: { control: false },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithAnAction: Story = {
  args: {
    action: (
      <Button variant={ButtonVariant.secondary} icon={UploadSimpleIcon}>
        Add files
      </Button>
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'No file yet' })).toBeVisible();
  },
};

export const WithoutAnAction: Story = {
  args: {
    title: 'Nothing to review',
    description: 'What the engines return appears here.',
  },
};
