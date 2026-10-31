import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectFormAlert } from '../../testing/expect-form-alert.ts';
import { PageFrame } from '../../testing/PageFrame.tsx';
import { ForgotPassword, type ForgotPasswordProps } from './ForgotPassword.tsx';
import { ForgotPasswordStatus } from './forgot-password-status.ts';

const meta = {
  title: 'Blocks/ForgotPassword',
  component: ForgotPassword,
  args: {
    onSubmit: fn(),
    signInLink: { href: '#sign-in' },
  },
  argTypes: {
    status: { control: 'inline-radio', options: Object.values(ForgotPasswordStatus) },
  },
} satisfies Meta<typeof ForgotPassword>;

export default meta;
type Story = StoryObj<typeof meta>;

// The app's side: the link is asked for, then the block says where to look.
function ForgotPasswordFlow(args: ForgotPasswordProps) {
  const [status, setStatus] = useState<ForgotPasswordProps['status']>(ForgotPasswordStatus.idle);
  return (
    <ForgotPassword
      {...args}
      status={status}
      onSubmit={(values) => {
        args.onSubmit(values);
        setStatus(ForgotPasswordStatus.sent);
      }}
    />
  );
}

export const Default: Story = {
  render: (args) => <ForgotPasswordFlow {...args} />,
  play: async ({ canvas, args }) => {
    await userEvent.tab();
    await expectFocusRing(canvas.getByRole('textbox'));
    await userEvent.keyboard('jeanne.martin@example.com{Enter}');
    await expect(args.onSubmit).toHaveBeenCalledWith({ email: 'jeanne.martin@example.com' });
    await expect(canvas.getByText(/jeanne\.martin@example\.com/)).toBeVisible();
  },
};

export const IncompleteEmail: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.type(canvas.getByRole('textbox'), 'jeanne.martin@{Enter}');
    await expect(canvas.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

export const Pending: Story = {
  args: { status: ForgotPasswordStatus.pending, defaultEmail: 'jeanne.martin@example.com' },
};

export const TooManyRequests: Story = {
  args: { status: ForgotPasswordStatus.tooManyRequests, defaultEmail: 'jeanne.martin@example.com' },
  play: async ({ canvas, canvasElement, args, globals }) => {
    await expectFormAlert(canvasElement, {
      locale: globals.locale,
      key: 'sendLink.tooManyRequests',
    });
    await userEvent.click(canvas.getByRole('button', { name: /send the link|envoyer le lien/i }));
    await expect(args.onSubmit).toHaveBeenCalledWith({ email: 'jeanne.martin@example.com' });
  },
};

export const Failed: Story = {
  args: { status: ForgotPasswordStatus.failed, defaultEmail: 'jeanne.martin@example.com' },
  play: async ({ canvas, canvasElement, args, globals }) => {
    await expectFormAlert(canvasElement, { locale: globals.locale, key: 'sendLink.failed' });
    await userEvent.click(canvas.getByRole('button', { name: /send the link|envoyer le lien/i }));
    await expect(args.onSubmit).toHaveBeenCalledWith({ email: 'jeanne.martin@example.com' });
  },
};

export const Sent: Story = {
  args: { status: ForgotPasswordStatus.sent, defaultEmail: 'jeanne.martin@example.com' },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
    await expect(canvas.getByRole('link')).toBeVisible();
  },
};

export const InAPage: Story = {
  render: (args) => (
    <PageFrame>
      <ForgotPassword {...args} />
    </PageFrame>
  ),
};
