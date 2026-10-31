import { GoogleLogoIcon, KeyIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Link } from '../../components/Link/Link.tsx';
import { Locale, type Messages } from '../../i18n/messages.ts';
import { UiProvider } from '../../i18n/UiProvider.tsx';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
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

const LEGAL_LINK_NAMES = ['Legal notice', 'Terms', 'Privacy'] as const;

const legalLinks = (
  <nav aria-label="Legal texts" className="flex flex-wrap gap-x-space-5">
    <Link href="#legal-notice">Legal notice</Link>
    <Link href="#terms">Terms</Link>
    <Link href="#privacy">Privacy</Link>
  </nav>
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
    footer: legalLinks,
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

const BRAND_NAME = 'Bram van Osta';
const ROW_ALIGNMENT_TOLERANCE = 1;

function verticalCenter(element: Element): number {
  const { top, height } = element.getBoundingClientRect();
  return top + height / 2;
}

// The panel shows on a computer only: the switch sits in it there, on the logo's row, and in the
// top bar on a phone.
async function expectLanguageSwitchPlaced(canvasElement: HTMLElement): Promise<HTMLElement> {
  const canvas = within(canvasElement);
  const languageLink = canvas.getByRole('link', { name: 'English' });
  const panel = canvas.queryByRole('complementary');
  if (panel === null) {
    await expect(canvas.getByRole('banner')).toContainElement(languageLink);
    return languageLink;
  }
  await expect(panel).toContainElement(languageLink);
  const lockup = canvas.getAllByText(BRAND_NAME).find((name) => name.checkVisibility());
  const logoCenter = verticalCenter(lockup?.parentElement ?? panel);
  await expect(Math.abs(verticalCenter(languageLink) - logoCenter)).toBeLessThanOrEqual(
    ROW_ALIGNMENT_TOLERANCE,
  );
  return languageLink;
}

export const ClientSignIn: Story = {
  play: async ({ canvas, canvasElement }) => {
    const languageLink = await expectLanguageSwitchPlaced(canvasElement);
    await expect(visibleCount(canvas.getAllByText(CLIENT_STATEMENT))).toBe(1);
    await expect(canvas.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    await expectWidthAtMost(canvas.getByRole('main'), 'form-width');
    await userEvent.tab();
    await expectFocusRing(languageLink);
    await userEvent.tab();
    await expect(canvas.getByRole('textbox')).toHaveFocus();
  },
};

export const OperatorSignIn: Story = {
  args: {
    statement: OPERATOR_STATEMENT,
    statementKicker: 'Operator',
    role: 'operator',
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
  play: async ({ canvas, canvasElement }) => {
    const languageLink = await expectLanguageSwitchPlaced(canvasElement);
    await expect(canvas.getByText('operator')).toBeVisible();
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent('Sign in.');
    await expect(visibleCount(canvas.getAllByText(OPERATOR_STATEMENT))).toBe(1);
    await expect(canvas.getByText("Only the operator's account has access here.")).toBeVisible();
    await userEvent.tab();
    await expectFocusRing(languageLink);
    await userEvent.tab();
    await expectFocusRing(canvas.getByRole('button', { name: 'Continue with Pocket ID' }));
  },
};

// REF-T8-01: the legal links end the form's column on a computer, and follow the form on a phone.
export const LegalLinks: Story = {
  play: async ({ canvas }) => {
    const main = canvas.getByRole('main');
    const footer = canvas.getByRole('contentinfo');
    await expect(footer.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      main.getBoundingClientRect().bottom,
    );
    await expect(footer.getBoundingClientRect().left).toBe(main.getBoundingClientRect().left);
    const links = within(footer).getAllByRole('link');
    await expect(links.map((link) => link.textContent)).toEqual([...LEGAL_LINK_NAMES]);
    for (const link of links) {
      await expectHeightAtLeast(link, 'target-min');
    }
    await userEvent.tab({ shift: true });
    await expectFocusRing(canvas.getByRole('link', { name: 'Privacy' }));
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
