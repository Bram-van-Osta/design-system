import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { Link } from '../Link/Link.tsx';
import { Text, TextVariant } from '../Text/Text.tsx';
import { Thread } from './Thread.tsx';
import { ThreadDay } from './ThreadDay.tsx';
import { ThreadLine } from './ThreadLine.tsx';

const LABEL = "The case's thread";
const EARLIER = '6 earlier events';
const HANDED_IN = '9:14 the agent handed in the pre-analysis · size M, 3 points of attention';
const READ_SITE = '9:11 the agent read the current site · 16 pages read, 4 captured';
const AGENT_SAYS = 'A site rebuilt for the phone: the opening hours in view, the call in one tap.';

// T13-B1-Fil-D and T13-C3-Fil-M: a case's thread, by day, a line unfolded in place.
const meta = {
  title: 'Layout/Thread',
  component: Thread,
  args: {
    label: LABEL,
    earlierLabel: EARLIER,
    onShowEarlier: fn(),
    children: (
      <>
        <ThreadDay>Saturday 7 November</ThreadDay>
        <ThreadLine
          time="9:02"
          content={
            <Text variant={TextVariant.bodySmall}>11 answers, the current site to read.</Text>
          }
        >
          <strong>Jeanne</strong> sent her request · "I have a site to modernize", 11 answers
        </ThreadLine>
        <ThreadLine time="9:03">Address confirmed · pre-analysis requested</ThreadLine>
        <ThreadLine time="9:11" content={<Text variant={TextVariant.bodySmall}>4 captures.</Text>}>
          the agent read the current site · 16 pages read, 4 captured
        </ThreadLine>
        <ThreadLine
          time="9:14"
          content={
            <>
              <Text variant={TextVariant.bodySmall}>{AGENT_SAYS}</Text>
              <Link href="#pre-analysis">Open the pre-analysis</Link>
            </>
          }
        >
          the agent handed in the pre-analysis · size M, 3 points of attention
        </ThreadLine>
        <ThreadDay>today, Monday 9 November</ThreadDay>
        <ThreadLine time="10:02">Request accepted · offer being drafted</ThreadLine>
      </>
    ),
  },
  argTypes: {
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="max-w-reading-width">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Thread>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ByDay: Story = {
  play: async ({ canvas, args }) => {
    const list = canvas.getByRole('list', { name: LABEL });
    await expect(within(list).getAllByRole('listitem')).toHaveLength(7);
    const day = canvas.getByText('Saturday 7 November');
    await expect(getComputedStyle(day).color).toBe(tokenColor('ink-muted', day));
    await expect(getComputedStyle(day).fontFamily).toContain('IBM Plex Mono');

    const lines = within(list).getAllByRole('button');
    await expect(lines).toHaveLength(3);
    for (const line of lines) {
      await expect(line).toHaveAttribute('aria-expanded', 'false');
      await expectHeightAtLeast(line, 'target-min');
    }
    const still = canvas.getByText('Address confirmed · pre-analysis requested');
    await expect(still.closest('button')).toBeNull();

    const earlier = canvas.getByRole('button', { name: EARLIER });
    await userEvent.click(earlier);
    await expect(args.onShowEarlier).toHaveBeenCalledOnce();
  },
};

// A press unfolds the line in place, indented under its text; another folds it.
export const Unfolds: Story = {
  play: async ({ canvas }) => {
    const line = canvas.getByRole('button', { name: HANDED_IN });
    await userEvent.click(line);
    await expect(line).toHaveAttribute('aria-expanded', 'true');
    const words = canvas.getByText(AGENT_SAYS);
    await expect(words).toBeVisible();
    const text = canvas.getByText(
      'the agent handed in the pre-analysis · size M, 3 points of attention',
    );
    await expect(words.getBoundingClientRect().left).toBe(text.getBoundingClientRect().left);
    await expect(canvas.getByRole('link', { name: 'Open the pre-analysis' })).toBeVisible();
    await userEvent.click(line);
    await expect(line).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByText(AGENT_SAYS)).toBeNull();
  },
};

// With the keyboard: the earlier events' button, then each line that unfolds, Enter and Space.
export const Keyboard: Story = {
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expectFocusRing(canvas.getByRole('button', { name: EARLIER }));
    await userEvent.tab();
    await userEvent.tab();
    const readSite = canvas.getByRole('button', { name: READ_SITE });
    await expectFocusRing(readSite);
    await userEvent.keyboard('{Enter}');
    await expect(readSite).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('4 captures.')).toBeVisible();
    await userEvent.keyboard(' ');
    await expect(readSite).toHaveAttribute('aria-expanded', 'false');
  },
};

// The case's home shows the thread's end, the line it points at unfolded, nothing earlier shown.
export const UnfoldedAtFirst: Story = {
  args: {
    earlierLabel: undefined,
    onShowEarlier: undefined,
    children: (
      <>
        <ThreadDay>today</ThreadDay>
        <ThreadLine
          time="9:14"
          isDefaultOpen
          content={<Text variant={TextVariant.bodySmall}>{AGENT_SAYS}</Text>}
        >
          the agent handed in the pre-analysis · size M, 3 points of attention
        </ThreadLine>
      </>
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button', { name: EARLIER })).toBeNull();
    await expect(canvas.getByRole('button', { name: HANDED_IN })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await expect(canvas.getByText(AGENT_SAYS)).toBeVisible();
  },
};
