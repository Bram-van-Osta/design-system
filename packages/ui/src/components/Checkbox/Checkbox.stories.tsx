import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { expectOnFirstLine } from '../../testing/expect-first-line.ts';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { Checkbox } from './Checkbox.tsx';

const CONSENT =
  'I agree that my answers are used to study my request and to answer me. They are neither sold nor used for anything else.';

const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  args: {
    label: CONSENT,
    onCheckedChange: fn(),
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  play: async ({ canvas, args }) => {
    const checkbox = canvas.getByRole('checkbox', { name: CONSENT });
    await expectHeightAtLeast(checkbox.closest('label') ?? checkbox, 'target-min');
    await expectOnFirstLine(checkbox.closest('label') ?? checkbox, checkbox);
    await userEvent.tab();
    await expectFocusRing(checkbox);
    await userEvent.keyboard(' ');
    await expect(checkbox).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenCalledOnce();
  },
};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const WithError: Story = {
  args: { error: 'Check this box to send your request.' },
  play: async ({ canvas }) => {
    const checkbox = canvas.getByRole('checkbox', { name: CONSENT });
    await expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    await expect(checkbox).toHaveAccessibleDescription('Check this box to send your request.');
  },
};

export const Disabled: Story = {
  args: { defaultChecked: true, disabled: true },
};
