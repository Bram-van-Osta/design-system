import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { Field } from '../Field/Field.tsx';
import { TextInput } from './TextInput.tsx';

const meta = {
  title: 'Forms/TextInput',
  component: TextInput,
  args: {
    autoComplete: 'organization',
  },
  decorators: [
    (Story) => (
      <Field label="Your business">
        <Story />
      </Field>
    ),
  ],
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { placeholder: 'E.g. the Boulangerie du Port' },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Your business' });
    await userEvent.tab();
    await expectFocusRing(input);
    await userEvent.keyboard('Boulangerie du Port');
    await expect(input).toHaveValue('Boulangerie du Port');
  },
};

export const Filled: Story = {
  args: { defaultValue: 'Boulangerie du Port' },
};

export const Disabled: Story = {
  args: { defaultValue: 'Boulangerie du Port', disabled: true },
};
