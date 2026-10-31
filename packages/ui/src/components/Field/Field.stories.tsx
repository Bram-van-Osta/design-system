import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { expectErrorColors } from '../../testing/expect-error-colors.ts';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { TextInput } from '../TextInput/TextInput.tsx';
import { Field } from './Field.tsx';
import { FieldMarker } from './field-marker.ts';

const meta = {
  title: 'Forms/Field',
  component: Field,
  args: {
    label: 'Your email',
    children: <TextInput type="email" autoComplete="email" />,
  },
  argTypes: {
    marker: { control: 'inline-radio', options: [undefined, ...Object.values(FieldMarker)] },
    children: { control: false },
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Your email' });
    await expectHeightAtLeast(input, 'button-height');
    await userEvent.click(canvas.getByText('Your email'));
    await expect(input).toHaveFocus();
    await userEvent.tab({ shift: true });
    await userEvent.tab();
    await expectFocusRing(input);
  },
};

export const WithHelp: Story = {
  args: {
    description: 'We will send you a link to confirm this address.',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: 'Your email' })).toHaveAccessibleDescription(
      'We will send you a link to confirm this address.',
    );
  },
};

export const Required: Story = {
  args: { marker: FieldMarker.required },
};

export const Optional: Story = {
  args: {
    label: 'Phone',
    marker: FieldMarker.optional,
    children: <TextInput type="tel" autoComplete="tel" />,
  },
};

export const WithError: Story = {
  args: {
    description: 'We will send you a link to confirm this address.',
    error: 'Enter an email address, such as jeanne.martin@example.com.',
    children: <TextInput type="email" defaultValue="jeanne.martin@" />,
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Your email' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription(
      expect.stringContaining('Enter an email address'),
    );
    await expectErrorColors(canvas.getByText(/^Enter an email address/));
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: <TextInput type="email" defaultValue="jeanne.martin@example.com" />,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: 'Your email' })).toBeDisabled();
  },
};
