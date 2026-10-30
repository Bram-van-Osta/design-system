import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { NewPasswordStatus } from './new-password.ts';
import { ResetPassword } from './ResetPassword.tsx';

// What the reader types, long enough for the policy of the stories.
const SAMPLE_PHRASE = 'tulips-in-may-2027';

const meta = {
  title: 'Blocks/ResetPassword',
  component: ResetPassword,
  args: {
    onSubmit: fn(),
    minLength: 12,
    forgotPasswordLink: { href: '#forgot-password' },
  },
  argTypes: {
    status: { control: 'inline-radio', options: Object.values(NewPasswordStatus) },
  },
} satisfies Meta<typeof ResetPassword>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.type(
      canvas.getByLabelText(/^your new password|^votre nouveau mot de passe/i),
      `${SAMPLE_PHRASE}{Enter}`,
    );
    await expect(args.onSubmit).toHaveBeenCalledWith({ password: SAMPLE_PHRASE });
  },
};

export const ForAnAccount: Story = {
  args: { email: 'jeanne.martin@example.com' },
};

export const Pending: Story = {
  args: { status: NewPasswordStatus.pending },
};

export const InvalidLink: Story = {
  args: { status: NewPasswordStatus.invalidLink },
};
