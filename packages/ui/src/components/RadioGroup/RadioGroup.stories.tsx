import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { FieldMarker } from '../Field/field-marker.ts';
import { RadioGroup } from './RadioGroup.tsx';

const meta = {
  title: 'Forms/RadioGroup',
  component: RadioGroup,
  args: {
    legend: 'To come back to your space',
    options: [
      { value: 'passkey', label: 'With Face ID or your fingerprint' },
      { value: 'link', label: 'With a link received by email' },
      { value: 'password', label: 'With a password' },
    ],
    onValueChange: fn(),
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, args }) => {
    await expect(
      canvas.getByRole('radiogroup', { name: 'To come back to your space' }),
    ).toBeVisible();
    const first = canvas.getByRole('radio', { name: 'With Face ID or your fingerprint' });
    await userEvent.tab();
    await expectFocusRing(first);
    await userEvent.keyboard('{ArrowDown}');
    const second = canvas.getByRole('radio', { name: 'With a link received by email' });
    await expect(second).toBeChecked();
    await expect(args.onValueChange).toHaveBeenLastCalledWith('link');
  },
};

export const WithDescriptions: Story = {
  args: {
    defaultValue: 'passkey',
    marker: FieldMarker.required,
    options: [
      {
        value: 'passkey',
        label: 'With Face ID or your fingerprint',
        description: 'A passkey on this phone, without a password',
      },
      {
        value: 'link',
        label: 'With a link received by email',
        description: 'At each sign-in, valid for ten minutes',
      },
    ],
  },
};

export const WithError: Story = {
  args: { error: 'Choose how you will come back.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Choose how you will come back.')).toBeVisible();
  },
};

export const DisabledOption: Story = {
  args: {
    defaultValue: 'link',
    options: [
      { value: 'passkey', label: 'With Face ID or your fingerprint', disabled: true },
      { value: 'link', label: 'With a link received by email' },
    ],
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('radio', { name: 'With Face ID or your fingerprint' }),
    ).toHaveAttribute('aria-disabled', 'true');
  },
};
