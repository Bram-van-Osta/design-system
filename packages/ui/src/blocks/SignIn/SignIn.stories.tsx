import { GoogleLogoIcon, KeyIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { PageFrame } from '../../testing/PageFrame.tsx';
import { SignIn } from './SignIn.tsx';
import { SignInStatus } from './sign-in-status.ts';

const google = { id: 'google', label: 'Continue with Google', icon: GoogleLogoIcon };

const meta = {
  title: 'Blocks/SignIn',
  component: SignIn,
  args: {
    onSubmit: fn(),
    providers: [{ ...google, onSelect: fn() }],
    forgotPasswordLink: { href: '#forgot-password' },
  },
  argTypes: {
    status: { control: 'inline-radio', options: Object.values(SignInStatus) },
  },
} satisfies Meta<typeof SignIn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Client: Story = {
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole('heading', { level: 1 })).toBeVisible();
    await userEvent.tab();
    const email = canvas.getByRole('textbox');
    await expectFocusRing(email);
    await userEvent.keyboard('jeanne.martin@example.com');
    await userEvent.tab();
    await userEvent.keyboard('tulips-in-may');
    await userEvent.keyboard('{Enter}');
    await expect(args.onSubmit).toHaveBeenCalledWith({
      email: 'jeanne.martin@example.com',
      password: 'tulips-in-may',
    });
  },
};

export const EmptyFields: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /sign in|se connecter/i }));
    const email = canvas.getByRole('textbox');
    await expect(email).toHaveFocus();
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(canvas.getAllByText(/enter your|saisissez votre/i)).toHaveLength(2);
    await expect(args.onSubmit).not.toHaveBeenCalled();
    await userEvent.keyboard('jeanne.martin@');
    await expect(email).not.toHaveAttribute('aria-invalid');
  },
};

export const IncompleteEmail: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.type(canvas.getByRole('textbox'), 'jeanne.martin@');
    await userEvent.type(canvas.getByLabelText(/^your password|^votre mot de passe/i), 'tulips');
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByText(/incomplete|incompl/i)).toBeVisible();
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

export const Pending: Story = {
  args: { status: SignInStatus.pending, defaultEmail: 'jeanne.martin@example.com' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /sign in|se connecter/i })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    await expect(canvas.getByRole('button', { name: 'Continue with Google' })).toBeDisabled();
  },
};

export const InvalidCredentials: Story = {
  args: { status: SignInStatus.invalidCredentials, defaultEmail: 'jeanne.martin@example.com' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toBeVisible();
  },
};

export const Locked: Story = {
  args: { status: SignInStatus.locked, defaultEmail: 'jeanne.martin@example.com' },
};

export const NoAccount: Story = {
  args: { status: SignInStatus.noAccount },
};

export const Operator: Story = {
  args: {
    onSubmit: undefined,
    forgotPasswordLink: undefined,
    providers: [
      { id: 'pocket-id', label: 'Continue with Pocket ID', icon: KeyIcon, onSelect: fn() },
      { ...google, onSelect: fn() },
    ],
  },
  play: async ({ canvas, args }) => {
    await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
    await userEvent.tab();
    const pocketId = canvas.getByRole('button', { name: 'Continue with Pocket ID' });
    await expectFocusRing(pocketId);
    await userEvent.keyboard('{Enter}');
    await expect(args.providers?.[0]?.onSelect).toHaveBeenCalledOnce();
  },
};

export const ProviderPending: Story = {
  args: { providers: [{ ...google, onSelect: fn(), isPending: true }] },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /sign in|se connecter/i })).toBeDisabled();
  },
};

export const InAPage: Story = {
  render: (args) => (
    <PageFrame>
      <SignIn {...args} />
    </PageFrame>
  ),
};
