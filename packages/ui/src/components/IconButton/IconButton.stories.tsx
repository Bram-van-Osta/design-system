import { TrashIcon, XIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { IconButton, IconButtonVariant } from './IconButton.tsx';

const meta = {
  title: 'Actions/IconButton',
  component: IconButton,
  args: {
    icon: XIcon,
    label: 'Close',
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: Object.values(IconButtonVariant) },
    icon: { control: false },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Quiet: Story = {
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: 'Close' });
    await expectHeightAtLeast(button, 'target-min');
    await expect(button.getBoundingClientRect().width).toBe(button.getBoundingClientRect().height);
    await userEvent.tab();
    await expectFocusRing(button);
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Secondary: Story = {
  args: { variant: IconButtonVariant.secondary, icon: TrashIcon, label: 'Remove this file' },
};

export const Disabled: Story = {
  args: {
    variant: IconButtonVariant.secondary,
    icon: TrashIcon,
    label: 'Remove this file',
    disabled: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Remove this file' })).toBeDisabled();
  },
};
