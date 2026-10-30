import { ArrowLeftIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { expect, userEvent } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { Link } from './Link.tsx';

const meta = {
  title: 'Actions/Link',
  component: Link,
  args: {
    href: '#answers',
    children: 'Review my answers',
  },
  argTypes: {
    icon: { control: false },
    render: { control: false },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Review my answers' });
    await expectHeightAtLeast(link, 'target-min');
    await userEvent.tab();
    await expectFocusRing(link);
  },
};

export const Back: Story = {
  args: { href: '#previous', icon: ArrowLeftIcon, children: 'Previous question' },
};

export const Current: Story = {
  args: { href: '#space', isCurrent: true, children: 'My space' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'My space' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  },
};

export const Navigation: Story = {
  render: () => (
    <nav aria-label="Main" className="flex flex-wrap gap-x-space-6">
      <Link href="#space" isCurrent>
        My space
      </Link>
      <Link href="#files">My files</Link>
      <Link href="#site">My site</Link>
    </nav>
  ),
};

// What an app's router gives: an anchor that navigates without reloading the page.
function RouterLink(props: ComponentProps<'a'>) {
  return <a {...props} data-router-link="" />;
}

export const RenderedByARouter: Story = {
  args: {
    render: <RouterLink href="#router" />,
    children: 'A link of the app router',
  },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'A link of the app router' });
    await expect(link).toHaveAttribute('data-router-link');
    await expect(link).toHaveAttribute('href', '#router');
  },
};
