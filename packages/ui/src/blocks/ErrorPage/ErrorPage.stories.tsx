import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Button } from '../../components/Button/Button.tsx';
import { Link } from '../../components/Link/Link.tsx';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { ErrorPage } from './ErrorPage.tsx';

const languageSwitch = (
  <Link href="#en" lang="en">
    English
  </Link>
);

const backHome = <Button onClick={fn()}>Back to home</Button>;

const meta = {
  title: 'Blocks/ErrorPage',
  component: ErrorPage,
  // The page's own edges: the page fills the screen, outside the app's frame.
  decorators: [
    (Story) => (
      <div className="-m-space-5">
        <Story />
      </div>
    ),
  ],
  args: {
    kicker: 'Error 404',
    title: 'This page does not exist.',
    lead: 'The address may be incomplete, or the page has moved. Your space has not.',
    actions: backHome,
    headerEnd: languageSwitch,
  },
} satisfies Meta<typeof ErrorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotFound: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent(
      'This page does not exist.',
    );
    await expect(canvas.queryByRole('navigation')).not.toBeInTheDocument();
    await userEvent.tab();
    await expectFocusRing(canvas.getByRole('link', { name: 'English' }));
  },
};

export const WithPlaces: Story = {
  args: {
    places: [
      { label: 'Your project', link: { href: '#project' } },
      { label: 'Your files', link: { href: '#files' } },
      { label: 'Messages', link: { href: '#messages' } },
    ],
  },
  play: async ({ canvas }) => {
    const places = canvas.getByRole('navigation', { name: /straight to|directement/i });
    await expect(places.querySelectorAll('a')).toHaveLength(3);
  },
};

export const FailedLoad: Story = {
  args: {
    kicker: 'Error',
    title: 'Failed to load the page.',
    lead: 'What you saved is still there. Try again in a moment.',
    actions: (
      <>
        <Button onClick={fn()}>Try again</Button>
        <Link href="#home">Back to home</Link>
      </>
    ),
  },
};

export const OperatorNotFound: Story = {
  args: {
    role: 'operator',
    headerEnd: undefined,
    lead: 'The link may come from an archived project, or the item was deleted.',
    details: [{ label: 'Address', value: '/projects/boulangerie-du-port/files/4821' }],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('operator')).toBeVisible();
    await expect(canvas.getByRole('term')).toHaveTextContent('Address');
    await expect(canvas.getByRole('definition')).toHaveTextContent(
      '/projects/boulangerie-du-port/files/4821',
    );
  },
};

export const OperatorFailedLoad: Story = {
  args: {
    role: 'operator',
    headerEnd: undefined,
    kicker: 'Error',
    title: 'Failed to load the page.',
    lead: 'Try again in a moment.',
    details: [
      { label: 'Request', value: 'GET /api/operator/projects' },
      { label: 'Response', value: '500 · Oct 31, 2:02 PM' },
    ],
    actions: <Button onClick={fn()}>Try again</Button>,
  },
};
