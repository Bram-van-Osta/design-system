import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { Link } from '../Link/Link.tsx';
import { Disclosure } from './Disclosure.tsx';

const PARTS = [
  'Who is responsible',
  'What we collect',
  'Why, and on what basis',
  'The AI tools',
  'Who else processes it',
  'How long',
  'Your rights',
] as const;

const SUMMARY = `Contents · ${PARTS.length} parts`;

// REF-T10-02-Sommaire-M: the privacy policy's contents, folded at the top of the page on a phone.
const contents = (
  <nav aria-label="Contents">
    <ul>
      {PARTS.map((part, index) => (
        <li key={part}>
          <Link href={`#part-${index + 1}`} className="px-space-3">
            {part}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

const meta = {
  title: 'Layout/Disclosure',
  component: Disclosure,
  args: {
    summary: SUMMARY,
    children: contents,
  },
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof Disclosure>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Folded: Story = {
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: SUMMARY });
    await expectHeightAtLeast(trigger, 'button-height');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('link', { name: 'Your rights' })).not.toBeInTheDocument();
    await userEvent.tab();
    await expectFocusRing(trigger);
    await userEvent.keyboard('{Enter}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const firstPart = canvas.getByRole('link', { name: 'Who is responsible' });
    await expect(firstPart).toBeVisible();
    await expectHeightAtLeast(firstPart, 'target-min');
    await userEvent.tab();
    await expectFocusRing(firstPart);
    await userEvent.tab({ shift: true });
    await userEvent.keyboard(' ');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() =>
      expect(canvas.queryByRole('link', { name: 'Who is responsible' })).not.toBeInTheDocument(),
    );
  },
};

export const Unfolded: Story = {
  args: { isDefaultOpen: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: SUMMARY })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await expect(canvas.getAllByRole('link')).toHaveLength(PARTS.length);
  },
};

// The app keeps the state, and folds the contents once the reader follows a part's link.
export const FoldedOnceFollowed: Story = {
  render: function FoldedOnceFollowedStory(args) {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <Disclosure {...args} isOpen={isOpen} onOpenChange={setIsOpen}>
        <nav aria-label="Contents">
          <Link
            href="#part-7"
            onClick={(event) => {
              // The test page must not move: an app's router follows the link instead.
              event.preventDefault();
              setIsOpen(false);
            }}
          >
            Your rights
          </Link>
        </nav>
      </Disclosure>
    );
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('link', { name: 'Your rights' }));
    await expect(canvas.getByRole('button', { name: SUMMARY })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  },
};
