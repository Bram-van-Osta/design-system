import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { expectFormAlertBox } from '../../testing/expect-form-alert.ts';
import { FormAlert } from './FormAlert.tsx';

const SEND_FAILED = 'Failed to send your request. Your answers are kept: try again in a moment.';

// The failure of a whole form, such as the request's sending, under its fields.
const meta = {
  title: 'Forms/FormAlert',
  component: FormAlert,
  args: { children: SEND_FAILED },
} satisfies Meta<typeof FormAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SendFailed: Story = {
  play: async ({ canvas }) => {
    const alert = canvas.getByRole('alert');
    await expect(alert).toHaveTextContent(SEND_FAILED);
    await expectFormAlertBox(alert);
  },
};

export const TooManyAttempts: Story = {
  args: {
    children:
      'Too many attempts from this connection. Wait an hour, then send your request again: nothing is lost.',
  },
  play: async ({ canvas }) => {
    await expectFormAlertBox(canvas.getByRole('alert'));
  },
};
