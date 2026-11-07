import { ArrowLeftIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { RouterLink } from '../../testing/RouterLink.tsx';
import { tokenColor } from '../../testing/token-color.ts';
import { Text, TextTone, TextVariant } from '../Text/Text.tsx';
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

// T14-S7-Echanges-D: the client's navigation, plain words, the current page's underlined in Delft.
export const NavigationPlain: Story = {
  render: () => (
    <nav aria-label="Your space" className="flex flex-wrap gap-x-space-6">
      <Link href="#project" isNavigation>
        Your project
      </Link>
      <Link href="#exchanges" isNavigation isCurrent>
        Exchanges
      </Link>
      <Link href="#files" isNavigation>
        Files
      </Link>
    </nav>
  ),
  play: async ({ canvas }) => {
    const current = canvas.getByRole('link', { name: 'Exchanges' });
    const other = canvas.getByRole('link', { name: 'Files' });
    await expect(current).toHaveAttribute('aria-current', 'page');
    await expect(other).not.toHaveAttribute('aria-current');
    const currentStyle = getComputedStyle(current);
    await expect({
      textDecorationLine: currentStyle.textDecorationLine,
      textDecorationColor: currentStyle.textDecorationColor,
      textDecorationThickness: currentStyle.textDecorationThickness,
      fontWeight: currentStyle.fontWeight,
    }).toEqual({
      textDecorationLine: 'underline',
      textDecorationColor: tokenColor('delft', current),
      textDecorationThickness: '2px',
      fontWeight: '600',
    });
    await expect(getComputedStyle(other).textDecorationLine).toBe('none');
    await expectHeightAtLeast(other, 'target-min');
  },
};

// A link inside a sentence takes the sentence's size and line, at any type style.
export const InRunningText: Story = {
  render: () => (
    <div className="flex max-w-reading-width flex-col gap-space-4">
      <Text>
        To exercise your rights, write to{' '}
        <Link isInline href="mailto:jeanne.martin@example.com">
          jeanne.martin@example.com
        </Link>
        . The{' '}
        <Link isInline href="#privacy">
          privacy policy
        </Link>{' '}
        says what we do with your data.
      </Text>
      <Text variant={TextVariant.small} tone={TextTone.muted}>
        You may also complain to the{' '}
        <Link isInline href="https://www.example.com">
          data protection authority
        </Link>
        .
      </Text>
    </div>
  ),
  play: async ({ canvas }) => {
    for (const name of [
      'jeanne.martin@example.com',
      'privacy policy',
      'data protection authority',
    ]) {
      const link = canvas.getByRole('link', { name });
      const sentence = link.closest('p');
      if (sentence === null) {
        throw new Error(`The link "${name}" is outside a sentence.`);
      }
      await expect(getComputedStyle(link).display).toBe('inline');
      await expect(getComputedStyle(link).fontSize).toBe(getComputedStyle(sentence).fontSize);
      await expect(getComputedStyle(link).lineHeight).toBe(getComputedStyle(sentence).lineHeight);
      await expect(getComputedStyle(link).textDecorationLine).toBe('underline');
    }
    await userEvent.tab();
    await expectFocusRing(canvas.getByRole('link', { name: 'jeanne.martin@example.com' }));
  },
};

export const RenderedByARouter: Story = {
  args: {
    render: <RouterLink to="#router" />,
    children: 'A link of the app router',
  },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'A link of the app router' });
    await expect(link).toHaveAttribute('data-router-link');
    await expect(link).toHaveAttribute('href', '#router');
  },
};
