import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { Field } from '../Field/Field.tsx';
import { PasswordInput } from './PasswordInput.tsx';

const meta = {
  title: 'Forms/PasswordInput',
  component: PasswordInput,
  args: {
    autoComplete: 'current-password',
    defaultValue: 'tulips-in-may',
  },
  decorators: [
    (Story) => (
      <Field label="Password">
        <Story />
      </Field>
    ),
  ],
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hidden: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText('Password');
    await expect(input).toHaveAttribute('type', 'password');
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await userEvent.tab();
    const toggle = canvas.getByRole('button', {
      name: /show the password|afficher le mot de passe/i,
    });
    await expectFocusRing(toggle);
    if (input) {
      const textEnd =
        input.getBoundingClientRect().right -
        Number.parseFloat(getComputedStyle(input).paddingRight);
      await expect(textEnd).toBeLessThanOrEqual(toggle.getBoundingClientRect().left);
    }
    await userEvent.keyboard('{Enter}');
    await expect(input).toHaveAttribute('type', 'text');
    await expect(toggle).toHaveAccessibleName(/hide the password|masquer le mot de passe/i);
  },
};

export const Shown: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button'));
    await expect(canvas.getByLabelText('Password')).toHaveAttribute('type', 'text');
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button')).toBeDisabled();
  },
};
