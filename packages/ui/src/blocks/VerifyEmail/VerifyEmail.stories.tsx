import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectFormAlert } from '../../testing/expect-form-alert.ts';
import { PageFrame } from '../../testing/PageFrame.tsx';
import { ResendStatus } from './resend-status.ts';
import { VerifyEmail } from './VerifyEmail.tsx';

const meta = {
  title: 'Blocks/VerifyEmail',
  component: VerifyEmail,
  args: {
    email: 'jeanne.martin@example.com',
    onResend: fn(),
  },
  argTypes: {
    resendStatus: { control: 'inline-radio', options: Object.values(ResendStatus) },
  },
} satisfies Meta<typeof VerifyEmail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Waiting: Story = {
  play: async ({ canvas, args }) => {
    await expect(canvas.getByText(/jeanne\.martin@example\.com/)).toBeVisible();
    await userEvent.tab();
    const resend = canvas.getByRole('button');
    await expectFocusRing(resend);
    await userEvent.keyboard('{Enter}');
    await expect(args.onResend).toHaveBeenCalledOnce();
    await expect(canvas.getByRole('status')).toBeEmptyDOMElement();
  },
};

export const Resending: Story = {
  args: { resendStatus: ResendStatus.pending },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  },
};

export const Resent: Story = {
  args: { resendStatus: ResendStatus.sent },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent(/link sent again|lien renvoy/i);
  },
};

export const TooManyRequests: Story = {
  args: { resendStatus: ResendStatus.tooManyRequests },
  play: async ({ canvas, canvasElement, args, globals }) => {
    await expectFormAlert(canvasElement, {
      locale: globals.locale,
      key: 'sendLink.tooManyRequests',
    });
    await userEvent.click(canvas.getByRole('button'));
    await expect(args.onResend).toHaveBeenCalledOnce();
  },
};

export const ResendFailed: Story = {
  args: { resendStatus: ResendStatus.failed },
  play: async ({ canvas, canvasElement, args, globals }) => {
    await expectFormAlert(canvasElement, { locale: globals.locale, key: 'sendLink.failed' });
    await userEvent.click(canvas.getByRole('button'));
    await expect(args.onResend).toHaveBeenCalledOnce();
  },
};

export const WithoutResending: Story = {
  args: { onResend: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
};

export const InAPage: Story = {
  render: (args) => (
    <PageFrame>
      <VerifyEmail {...args} />
    </PageFrame>
  ),
};
