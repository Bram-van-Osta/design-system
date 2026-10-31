import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Link } from '../../components/Link/Link.tsx';
import { Locale, MESSAGES } from '../../i18n/messages.ts';
import { PageFrame } from '../../testing/PageFrame.tsx';
import { CheckMailbox } from './CheckMailbox.tsx';

// REF-T7-A4: a link to resume the request later was sent.
const meta = {
  title: 'Blocks/CheckMailbox',
  component: CheckMailbox,
  args: {
    kicker: 'Your request',
    lead: 'We sent a link to jeanne.martin@example.com: it resumes your request later, from any device.',
    children: <Link href="#request">Back to my request</Link>,
  },
  render: (args) => (
    <PageFrame>
      <CheckMailbox {...args} />
    </PageFrame>
  ),
} satisfies Meta<typeof CheckMailbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ResumeLater: Story = {
  play: async ({ canvas, globals }) => {
    const messages = MESSAGES[globals.locale === Locale.fr ? Locale.fr : Locale.en];
    const heading = canvas.getByRole('heading', { level: 1 });
    // Compared as is: the matchers turn the French typography's non-breaking spaces into spaces.
    await expect(heading.textContent).toBe(messages['mailbox.heading']);
    await expect(canvas.getByText(/jeanne\.martin@example\.com/)).toBeVisible();
    await expect(
      canvas.getByText((_, element) => element?.textContent === messages['mailbox.help']),
    ).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Back to my request' })).toBeVisible();
  },
};
