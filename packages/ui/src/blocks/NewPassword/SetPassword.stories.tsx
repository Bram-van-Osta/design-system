import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { expectOnFirstLine } from '../../testing/expect-first-line.ts';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectFormAlert } from '../../testing/expect-form-alert.ts';
import { expectWidthAtMost } from '../../testing/expect-width.ts';
import { PageFrame } from '../../testing/PageFrame.tsx';
import { NewPasswordStatus } from './new-password.ts';
import { SetPassword } from './SetPassword.tsx';

// The rule's state, read by screen readers after its sentence.
const RULE_UNMET = /(not met yet|pas encore respect)/;

// What the reader types, long enough for the policy of the stories.
const SAMPLE_PHRASE = 'tulips-in-may-2027';

const meta = {
  title: 'Blocks/SetPassword',
  component: SetPassword,
  args: {
    onSubmit: fn(),
    minLength: 12,
    email: 'jeanne.martin@example.com',
    forgotPasswordLink: { href: '#forgot-password' },
  },
  argTypes: {
    status: { control: 'inline-radio', options: Object.values(NewPasswordStatus) },
  },
} satisfies Meta<typeof SetPassword>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Typing: Story = {
  play: async ({ canvas, args }) => {
    await expect(canvas.getByText(/jeanne\.martin@example\.com/)).toBeVisible();
    await userEvent.tab();
    const password = canvas.getByLabelText(/^your password|^votre mot de passe/i);
    await expectFocusRing(password);
    await userEvent.keyboard('tulips');
    const rule = canvas.getByRole('listitem');
    await expect(rule).toHaveTextContent(RULE_UNMET);
    await expectOnFirstLine(rule, rule.querySelector('svg'));
    await userEvent.keyboard('{Enter}');
    await expect(password).toHaveAttribute('aria-invalid', 'true');
    await expect(args.onSubmit).not.toHaveBeenCalled();
    await userEvent.keyboard(SAMPLE_PHRASE.slice('tulips'.length));
    await expect(rule).not.toHaveTextContent(RULE_UNMET);
    await userEvent.keyboard('{Enter}');
    await expect(args.onSubmit).toHaveBeenCalledWith({ password: SAMPLE_PHRASE });
  },
};

export const Empty: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /save my password|enregistrer/i }));
    await expect(canvas.getByLabelText(/^your password|^votre mot de passe/i)).toHaveFocus();
    await expect(canvas.getByText(/choose a password|choisissez un mot de passe/i)).toBeVisible();
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

export const WithTheAppsRules: Story = {
  args: {
    extraRules: [{ label: 'At least one digit', isMet: (password) => /\d/.test(password) }],
  },
  play: async ({ canvas }) => {
    await userEvent.type(
      canvas.getByLabelText(/^your password|^votre mot de passe/i),
      'tulips-in-may',
    );
    const [length, digit] = canvas.getAllByRole('listitem');
    await expect(length).not.toHaveTextContent(RULE_UNMET);
    await expect(digit).toHaveTextContent(RULE_UNMET);
  },
};

export const Pending: Story = {
  args: { status: NewPasswordStatus.pending },
};

export const TooManyAttempts: Story = {
  args: { status: NewPasswordStatus.tooManyAttempts },
  play: async ({ canvas, canvasElement, args, globals }) => {
    await expectFormAlert(canvasElement, {
      locale: globals.locale,
      key: 'newPassword.tooManyAttempts',
    });
    await userEvent.type(
      canvas.getByLabelText(/^your password|^votre mot de passe/i),
      `${SAMPLE_PHRASE}{Enter}`,
    );
    await expect(args.onSubmit).toHaveBeenCalledWith({ password: SAMPLE_PHRASE });
  },
};

export const Failed: Story = {
  args: { status: NewPasswordStatus.failed },
  play: async ({ canvas, canvasElement, args, globals }) => {
    await expectFormAlert(canvasElement, { locale: globals.locale, key: 'newPassword.failed' });
    await userEvent.type(
      canvas.getByLabelText(/^your password|^votre mot de passe/i),
      `${SAMPLE_PHRASE}{Enter}`,
    );
    await expect(args.onSubmit).toHaveBeenCalledWith({ password: SAMPLE_PHRASE });
  },
};

export const InvalidLink: Story = {
  args: { status: NewPasswordStatus.invalidLink },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
    await userEvent.tab();
    await expectFocusRing(canvas.getByRole('link'));
  },
};

// In the reading column, the form keeps a short form's width; the heading may go wider.
export const InAPage: Story = {
  render: (args) => (
    <PageFrame>
      <SetPassword {...args} />
    </PageFrame>
  ),
  play: async ({ canvasElement }) => {
    const form = canvasElement.querySelector('form');
    await expect(form).not.toBeNull();
    if (form !== null) {
      await expectWidthAtMost(form, 'form-width');
    }
  },
};
