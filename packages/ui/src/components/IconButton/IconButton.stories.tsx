import { CopyIcon, TrashIcon, XIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { expectCompactTarget } from '../../testing/expect-compact-target.ts';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { ICON_SIZE } from '../../utils/icon.ts';
import { IconButton, IconButtonSize, IconButtonVariant } from './IconButton.tsx';

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
    size: { control: 'inline-radio', options: Object.values(IconButtonSize) },
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

// C-12-CopierCompact, direction 1: in a line of text, a 16 px icon in a 28 px square.
export const Compact: Story = {
  args: { size: IconButtonSize.compact, icon: CopyIcon, label: 'Copy the email address' },
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: 'Copy the email address' });
    await expectCompactTarget(button);
    await expect(getComputedStyle(button).color).toBe(tokenColor('ink-muted', button));
    await expect(button.querySelector('svg')?.getAttribute('width')).toBe(String(ICON_SIZE.inline));
    await userEvent.tab();
    await expectFocusRing(button);
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
