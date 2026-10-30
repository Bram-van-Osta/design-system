import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { Field } from '../Field/Field.tsx';
import { Select } from './Select.tsx';

const meta = {
  title: 'Forms/Select',
  component: Select,
  args: {
    options: [
      { value: 'bakery', label: 'Bakery' },
      { value: 'florist', label: 'Florist' },
      { value: 'garage', label: 'Garage' },
      { value: 'physiotherapist', label: 'Physiotherapist' },
    ],
    onValueChange: fn(),
  },
  decorators: [
    (Story) => (
      <Field label="Your trade">
        <Story />
      </Field>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  play: async ({ canvas, args }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Your trade' });
    await expectHeightAtLeast(trigger, 'button-height');
    await userEvent.tab();
    await expectFocusRing(trigger);
    await userEvent.keyboard('{ArrowDown}');
    const florist = await screen.findByRole('option', { name: 'Florist' });
    await userEvent.hover(florist);
    await userEvent.keyboard('{Enter}');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('florist');
    await expect(trigger).toHaveTextContent('Florist');
  },
};

export const Chosen: Story = {
  args: { defaultValue: 'bakery' },
};

export const Disabled: Story = {
  args: { defaultValue: 'bakery', disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('combobox', { name: 'Your trade' })).toHaveAttribute(
      'data-disabled',
    );
  },
};
