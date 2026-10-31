import { GoogleLogoIcon, KeyIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Link } from '../../components/Link/Link.tsx';
import { Locale, type Messages } from '../../i18n/messages.ts';
import { UiProvider } from '../../i18n/UiProvider.tsx';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectWidthAtMost } from '../../testing/expect-width.ts';
import { ForgotPassword } from '../ForgotPassword/ForgotPassword.tsx';
import { NewPasswordStatus } from '../NewPassword/new-password.ts';
import { SetPassword } from '../NewPassword/SetPassword.tsx';
import { SignIn } from '../SignIn/SignIn.tsx';
import { VerifyEmail } from '../VerifyEmail/VerifyEmail.tsx';
import { AuthLayout } from './AuthLayout.tsx';

const CLIENT_STATEMENT = 'Your exchanges, your documents, then your site, in one place.';
const OPERATOR_STATEMENT = 'The requests, the reviews and the projects, in one place.';

const OPERATOR_TEXTS: Partial<Messages> = {
  'signIn.kicker': 'Operator',
  'signIn.heading': 'Sign in.',
};

const languageSwitch = (
  <Link href="#en" lang="en">
    English
  </Link>
);

const google = {
  id: 'google',
  label: 'Continue with Google',
  icon: GoogleLogoIcon,
  onSelect: fn(),
};

const meta = {
  title: 'Blocks/AuthLayout',
  component: AuthLayout,
  // The page's own edges: the layout fills the screen, as an app shows it.
  decorators: [
    (Story) => (
      <div className="-m-space-5">
        <Story />
      </div>
    ),
  ],
  args: {
    statement: CLIENT_STATEMENT,
    statementKicker: 'Sites for small businesses and freelancers',
    headerEnd: languageSwitch,
    children: (
      <SignIn
        onSubmit={fn()}
        providers={[google]}
        forgotPasswordLink={{ href: '#forgot-password' }}
      />
    ),
  },
} satisfies Meta<typeof AuthLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

// The statement shows once: in the panel on a computer, in the band above the form on a phone.
function visibleCount(elements: readonly HTMLElement[]): number {
  return elements.filter((element) => element.checkVisibility()).length;
}

export const ClientSignIn: Story = {
  play: async ({ canvas }) => {
    await expect(visibleCount(canvas.getAllByText(CLIENT_STATEMENT))).toBe(1);
    await expect(canvas.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    await expectWidthAtMost(canvas.getByRole('main'), 'form-width');
    await userEvent.tab();
    await expectFocusRing(canvas.getByRole('link', { name: 'English' }));
    await userEvent.tab();
    await expect(canvas.getByRole('textbox')).toHaveFocus();
  },
};

export const OperatorSignIn: Story = {
  args: {
    statement: OPERATOR_STATEMENT,
    statementKicker: 'Operator',
    role: 'operator',
    headerEnd: undefined,
    children: (
      <SignIn
        providers={[
          { id: 'pocket-id', label: 'Continue with Pocket ID', icon: KeyIcon, onSelect: fn() },
          google,
        ]}
        lead="With the passkey saved on this device, or on your phone."
        note="Only the operator's account has access here."
      />
    ),
  },
  // The operator app's own kicker and heading, in place of the package's.
  render: (args, { globals }) => (
    <UiProvider
      locale={globals.locale === Locale.fr ? Locale.fr : Locale.en}
      messages={OPERATOR_TEXTS}
    >
      <AuthLayout {...args} />
    </UiProvider>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('operator')).toBeVisible();
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent('Sign in.');
    await expect(visibleCount(canvas.getAllByText(OPERATOR_STATEMENT))).toBe(1);
    await expect(canvas.getByText("Only the operator's account has access here.")).toBeVisible();
    await userEvent.tab();
    await expectFocusRing(canvas.getByRole('button', { name: 'Continue with Pocket ID' }));
  },
};

export const FirstPassword: Story = {
  args: {
    children: (
      <SetPassword
        onSubmit={fn()}
        minLength={12}
        email="jeanne.martin@example.com"
        forgotPasswordLink={{ href: '#forgot-password' }}
      />
    ),
  },
};

export const DeadLink: Story = {
  args: {
    children: (
      <SetPassword
        onSubmit={fn()}
        minLength={12}
        status={NewPasswordStatus.invalidLink}
        forgotPasswordLink={{ href: '#forgot-password' }}
      />
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByLabelText(/password|mot de passe/i)).not.toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: /new link|nouveau lien/i })).toBeVisible();
  },
};

export const ForgottenPassword: Story = {
  args: {
    children: <ForgotPassword onSubmit={fn()} signInLink={{ href: '#sign-in' }} />,
  },
};

export const AddressCheck: Story = {
  args: {
    children: <VerifyEmail email="jeanne.martin@example.com" onResend={fn()} />,
  },
};
