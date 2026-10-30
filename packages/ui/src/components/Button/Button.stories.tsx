import { HouseIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { Button, ButtonVariant } from './Button.tsx';

const meta = {
  title: 'Actions/Button',
  component: Button,
  args: {
    children: 'See my proposal',
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: Object.values(ButtonVariant) },
    icon: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: ButtonVariant.primary },
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: 'See my proposal' });
    await expectHeightAtLeast(button, 'button-height');
    await userEvent.tab();
    await expectFocusRing(button);
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

export const Forward: Story = {
  args: { variant: ButtonVariant.primary, children: 'Continue', hasArrow: true },
};

export const Secondary: Story = {
  args: { variant: ButtonVariant.secondary, children: 'My space', icon: HouseIcon },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'My space' });
    await expectHeightAtLeast(button, 'target-min');
    await userEvent.tab();
    await expectFocusRing(button);
  },
};

export const Quiet: Story = {
  args: { variant: ButtonVariant.quiet, children: 'Skip this question' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Skip this question' });
    await expectHeightAtLeast(button, 'target-min');
    await userEvent.tab();
    await expectFocusRing(button);
  },
};

export const Pending: Story = {
  args: { variant: ButtonVariant.primary, children: 'Send my request', isPending: true },
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: 'Send my request' });
    await expect(button).toHaveAttribute('aria-disabled', 'true');
    await userEvent.tab();
    await expectFocusRing(button);
    await userEvent.keyboard('{Enter}');
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Disabled: Story = {
  args: { variant: ButtonVariant.primary, children: 'Save', disabled: true },
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: 'Save' });
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Together: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-space-5">
      <Button hasArrow>See my proposal</Button>
      <Button variant={ButtonVariant.secondary}>My space</Button>
      <Button variant={ButtonVariant.quiet}>How does it work?</Button>
    </div>
  ),
};
